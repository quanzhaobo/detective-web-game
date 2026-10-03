#!/usr/bin/env node
/**
 * 通关仿真：用真实的数据层与真实的 store 跑一遍完整游戏流程。
 *
 * 校验的不是「页面长得对不对」，而是这个游戏的胜负条件本身：
 *   - 把页面上所有可标记块都标记一遍，能不能真的凑齐 23 条线索
 *   - 收集箱在 22 条 / 21 条时会分别通过 / 不通过
 *   - 错误率门槛的边界（注意：它按“碎片数”算，不是按“去重线索数”算）
 *   - 结局判定（答案 + 收集率）是否符合设计
 *   - 取消标记、重复标记不会把进度弄坏
 *
 * 用法：npm run test:playthrough
 */

// store 走 zustand persist，需要一个 localStorage；用内存实现顶掉，避免噪音输出
const memory = new Map();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (k) => (memory.has(k) ? memory.get(k) : null),
    setItem: (k, v) => memory.set(k, String(v)),
    removeItem: (k) => memory.delete(k),
    clear: () => memory.clear(),
    key: (i) => [...memory.keys()][i] ?? null,
    get length() {
      return memory.size;
    },
  },
});

// zustand 的 persist 在 Node 下仍会认为存储不可用（浏览器中正常），
// 这里只过滤这一条已知噪音，其它告警照常输出。
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('[zustand persist middleware]')) return;
  originalWarn(...args);
};

const { useGameStore } = await import('../shared/src/store/gameStore.ts');
const { buildFragments, fragmentIdsFor, blockProgress, buildMissingFragments } = await import('../shared/src/store/fragments.ts');
const { computeCollectionStats } = await import('../shared/src/store/collectionStats.ts');
const { ALL_CLUES, TOTAL_CLUE_COUNT } = await import('../shared/src/data/clues.ts');
const { FORUM_POSTS, COLLECTION_BOX_POST } = await import('../shared/src/data/forum.ts');
const { NEWS_ARTICLES } = await import('../shared/src/data/news.ts');
const { PROFILES } = await import('../shared/src/data/profiles.ts');
const { CORRECT_ANSWER_ID } = await import('../shared/src/data/reasoning.ts');
const { canEnterTeam, canEnterReasoning, canViewEnding } = await import('../shared/src/store/routeGates.ts');
const { CHAPTERS } = await import('../shared/src/data/chapters.ts');
const { SUSPECTS } = await import('../shared/src/data/suspects.ts');

let failures = 0;
function check(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    failures += 1;
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

// ---------------------------------------------------------------------------
// 按各页面的渲染规则枚举所有「可标记内容块」
// blockId 必须与页面传给 MarkButton 的一致，否则本仿真就是自欺欺人
// ---------------------------------------------------------------------------
function enumerateBlocks() {
  const clueBlocks = [];
  const plainBlocks = [];
  const add = (block) => {
    if ((block.clueIds?.length ?? 0) > 0) clueBlocks.push(block);
    else plainBlocks.push(block);
  };

  for (const post of [...FORUM_POSTS, COLLECTION_BOX_POST]) {
    add({
      blockId: `post-${post.id}-content`,
      content: post.content,
      sourcePageId: `forum-post-${post.id}`,
      sourceTitle: post.title,
      sourceUrl: `/forum/post/${post.id}`,
      clueIds: post.clueIds,
    });
    for (const reply of post.replies) {
      add({
        blockId: `reply-${reply.id}`,
        content: reply.text,
        sourcePageId: `forum-post-${post.id}`,
        sourceTitle: `回复: ${post.title}`,
        sourceUrl: `/forum/post/${post.id}#${reply.id}`,
        clueIds: reply.clueId ? [reply.clueId] : [],
      });
    }
  }

  for (const article of NEWS_ARTICLES) {
    for (const block of article.content) {
      if (block.type === 'heading') continue; // 页面不渲染标记按钮
      add({
        blockId: `news-${article.id}-${block.id}`,
        content: block.text,
        sourcePageId: `news-${article.id}`,
        sourceTitle: article.title,
        sourceUrl: `/news/article/${article.id}`,
        clueIds: block.clueId ? [block.clueId] : [],
      });
    }
  }

  for (const profile of PROFILES) {
    const base = {
      sourcePageId: `profile-${profile.id}`,
      sourceTitle: `${profile.name} - 人物资料`,
      sourceUrl: `/life/profile/${profile.id}`,
    };
    add({
      ...base,
      blockId: `${profile.id}-occupation`,
      content: `${profile.occupation} · ${profile.workplace} · ${profile.personality}`,
      clueIds: profile.occupationClueIds,
    });
    profile.neighborReviews.forEach((entry, i) => {
      add({ ...base, blockId: `${profile.id}-neighbor-${i}`, content: entry.text, clueIds: entry.clueIds });
    });
    profile.colleagueReviews.forEach((entry, i) => {
      add({ ...base, blockId: `${profile.id}-colleague-${i}`, content: entry.text, clueIds: entry.clueIds });
    });
    if (profile.spouseReview) {
      add({
        ...base,
        blockId: `${profile.id}-spouse`,
        content: profile.spouseReview.text,
        clueIds: profile.spouseReview.clueIds,
      });
    }
    profile.timeline.forEach((entry, i) => {
      add({ ...base, blockId: `${profile.id}-timeline-${i}`, content: entry.event, clueIds: [] });
    });
  }

  return { clueBlocks, plainBlocks };
}

const { clueBlocks, plainBlocks } = enumerateBlocks();

// 内容块 ID 必须全局唯一：两个不同的块共用同一个 blockId 会让
// 「已标记」判定互相串台（标了 A 却显示 B 已标记），也会让清除标记清错东西。
{
  const allBlocks = [...clueBlocks, ...plainBlocks];
  const seen = new Map();
  const collisions = [];
  for (const block of allBlocks) {
    if (seen.has(block.blockId)) collisions.push(`${block.blockId}（${seen.get(block.blockId)} 与 ${block.sourcePageId}）`);
    else seen.set(block.blockId, block.sourcePageId);
  }
  check(
    `所有可标记块的 blockId 全局唯一（共 ${allBlocks.length} 个）`,
    collisions.length === 0,
    collisions.slice(0, 5).join('; ')
  );
}

const store = () => useGameStore.getState();
const markAll = (blocks) => {
  for (const block of blocks) {
    for (const fragment of buildFragments(block)) {
      store().markFragment(fragment);
    }
  }
};
const allIds = ALL_CLUES.map((c) => c.id);

/** 只标记指定的线索集合（用于精确构造 22 / 21 条的边界） */
function markExactlyClues(ids) {
  store().resetGame();
  const wanted = new Set(ids);
  for (const block of clueBlocks) {
    const filtered = (block.clueIds ?? []).filter((id) => wanted.has(id));
    for (const fragment of buildFragments({ ...block, clueIds: filtered })) {
      store().markFragment(fragment);
    }
  }
}

// ---------------------------------------------------------------------------
console.log(`\n[1] 数据层可标记块：承载线索的 ${clueBlocks.length} 个，纯标记的 ${plainBlocks.length} 个`);
console.log(`    线索总数 ${TOTAL_CLUE_COUNT}，全部可标记块 ${clueBlocks.length + plainBlocks.length} 个\n`);

console.log('[2] 完美玩家：标记所有承载线索的块');
store().resetGame();
markAll(clueBlocks);
const perfect = computeCollectionStats(store().markedFragments);
check('有效线索达到 23 条', perfect.validClueCount === TOTAL_CLUE_COUNT, `实际 ${perfect.validClueCount}`);
check('收集率 100%', perfect.collectionPercent === 100, `实际 ${perfect.collectionPercent}%`);
check('无无效标记', perfect.invalidClueCount === 0, `实际 ${perfect.invalidClueCount}`);

const missing = ALL_CLUES.filter((c) => !store().markedFragments.some((f) => f.clueId === c.id));
check(
  '23 条线索逐条可获得',
  missing.length === 0,
  missing.length ? `缺失 ${missing.map((c) => c.id).join(', ')}` : ''
);
check(
  '此前不可达的 P02（解剖常识）现已可获得',
  store().markedFragments.some((f) => f.clueId === 'P02')
);

const clueFragmentCount = store().markedFragments.filter((f) => f.isValidClue).length;
console.log(`    （23 条去重线索由 ${clueFragmentCount} 个碎片承载）`);

{
  const submission = store().submitToCollectionBox();
  check('收集箱审核通过', submission.passed === true);
  check('通过后解锁专案组', store().teamUnlocked === true);
  check('进入 Phase 2', store().currentPhase === 2, `实际 Phase ${store().currentPhase}`);
}

console.log('\n[3] 收集率门槛边界');
markExactlyClues(allIds.slice(0, 22));
const at22 = computeCollectionStats(store().markedFragments);
check('22/23 → 95.65%，通过', at22.validClueCount === 22 && at22.meetsThresholds === true, `${at22.validClueCount}/23 ${at22.collectionPercent}%`);
markExactlyClues(allIds.slice(0, 21));
const at21 = computeCollectionStats(store().markedFragments);
check('21/23 → 91.30%，不通过', at21.validClueCount === 21 && at21.meetsThresholds === false, `${at21.validClueCount}/23 ${at21.collectionPercent}%`);

console.log('\n[4] 错误率门槛边界（按碎片数计算：无效碎片数 > 有效碎片数 才超线）');
store().resetGame();
markAll(clueBlocks);
markAll(plainBlocks.slice(0, clueFragmentCount)); // 无效数 == 有效数 → 恰好 50%，仍可通过
const atParity = computeCollectionStats(store().markedFragments);
check('无效碎片数等于有效碎片数 → 错误率恰为 50%，通过', atParity.errorPercent === 50 && atParity.meetsThresholds === true, `错误率 ${atParity.errorPercent}%`);
markAll(plainBlocks.slice(clueFragmentCount, clueFragmentCount + 1)); // 再多 1 条 → 超过 50%
const overLine = computeCollectionStats(store().markedFragments);
check('再多 1 条无效 → 错误率超过 50%，不通过', overLine.errorPercent > 50 && overLine.meetsThresholds === false, `错误率 ${overLine.errorPercent}%`);

console.log('\n[5] 取消标记与重复标记');
store().resetGame();
const first = clueBlocks[0];
const firstFragmentIds = fragmentIdsFor(first);
markAll([first]);
const afterFirstMark = store().markedFragments.length;
check('一个多线索块会展开成多个碎片', afterFirstMark === firstFragmentIds.length, `${afterFirstMark} vs ${firstFragmentIds.length}`);
markAll([first]);
check('重复标记同一块不会产生重复碎片', store().markedFragments.length === afterFirstMark, `${afterFirstMark} → ${store().markedFragments.length}`);
store().unmarkBlock(first.blockId);
check('取消标记后该块碎片清零', store().markedFragments.length === 0, `剩余 ${store().markedFragments.length}`);

console.log('\n[6] 结局判定');
store().resetGame();
markAll(clueBlocks);
store().setFinalAnswer(CORRECT_ANSWER_ID);
store().calculateEnding();
check(`答对（${CORRECT_ANSWER_ID}）+ 全线索 → 好结局`, store().ending === 'good', `实际 ${store().ending}`);

store().resetGame();
markAll(clueBlocks);
store().setFinalAnswer(allIds.includes('A') && CORRECT_ANSWER_ID !== 'A' ? 'A' : 'C');
store().calculateEnding();
check('答错 → 坏结局', store().ending === 'bad', `实际 ${store().ending}`);

store().resetGame();
markExactlyClues(allIds.slice(0, 21));
store().setFinalAnswer(CORRECT_ANSWER_ID);
store().calculateEnding();
check('答对但线索不足 → 坏结局', store().ending === 'bad', `实际 ${store().ending}`);

console.log('\n[7] 连续三次不通过 → 坏结局');
store().resetGame();
store().markFragment(buildFragments(clueBlocks[0])[0]);
store().submitToCollectionBox();
store().submitToCollectionBox();
store().submitToCollectionBox();
check('3 次提交后进入坏结局', store().ending === 'bad', `实际 ${store().ending}`);
check('3 次后不可再提交', store().canSubmit() === false);
check('专案组仍未解锁', store().teamUnlocked === false);
check('坏结局不推进阶段（论坛不应显示「已解锁」）', store().currentPhase === 1, `实际 Phase ${store().currentPhase}`);

// 这一段是补的回归测试：门槛写错不会让构建/类型/lint 报错，
// 只会表现为「页面进不去」，玩家被永久卡死。曾真实发生过一次。
console.log('\n[8] 路由门槛（守住「三次失败也必须能走到结局页」）');
{
  const gate = () => {
    const s = store();
    return {
      teamUnlocked: s.teamUnlocked,
      completedInvestigations: s.completedInvestigations,
      interrogatedSuspects: s.interrogatedSuspects,
      finalAnswer: s.finalAnswer,
      ending: s.ending,
    };
  };

  // 局面：三次提交均未通过（[7] 刚跑完），没有 finalAnswer，也不是专案组成员
  check('三次失败后：不能进专案组', canEnterTeam(gate()) === false);
  check('三次失败后：不能进最终推理', canEnterReasoning(gate()) === false);
  check(
    '三次失败后：必须能进结局页（否则玩家无法重开，永久卡死）',
    canViewEnding(gate()) === true,
    `ending=${store().ending} finalAnswer=${store().finalAnswer}`
  );

  // 未开始的存档不该看到结局页
  store().resetGame();
  check('全新存档：不能直接看结局', canViewEnding(gate()) === false);
  check('全新存档：不能进专案组', canEnterTeam(gate()) === false);

  // 审核通过 → 可进专案组，但推理室要等档案与审讯做完
  store().resetGame();
  markAll(clueBlocks);
  store().submitToCollectionBox();
  check('审核通过后：可进专案组', canEnterTeam(gate()) === true);
  check('审核通过后：尚不可进最终推理', canEnterReasoning(gate()) === false);

  for (const c of CHAPTERS) store().completeInvestigation(String(c.id));
  check('档案读完但审讯未做完：仍不可进最终推理', canEnterReasoning(gate()) === false);
  for (const s of SUSPECTS) store().interrogateSuspect(String(s.id));
  check('档案 + 审讯都完成：可进最终推理', canEnterReasoning(gate()) === true);

  store().setFinalAnswer(CORRECT_ANSWER_ID);
  store().calculateEnding();
  check('作答后：可进结局页', canViewEnding(gate()) === true);
  check('作答后：进入好结局', store().ending === 'good', `实际 ${store().ending}`);
}

console.log('\n[9] 内容块 / 碎片契约（一个块承载多条线索时不能被拆散）');
{
  const multi = clueBlocks.find((b) => (b.clueIds?.length ?? 0) >= 3) ?? clueBlocks.find((b) => (b.clueIds?.length ?? 0) === 2);
  check('存在承载多条线索的内容块', !!multi, '数据层应有多线索块');

  if (multi) {
    store().resetGame();
    const expected = fragmentIdsFor(multi);
    const blockIds = new Set(store().markedFragments.map((f) => f.id));

    // 未标记 → 全量标记
    let progress = blockProgress(multi, blockIds);
    check(`未标记状态：缺 ${expected.length} 条`, progress.state === 'none' && progress.missingIds.length === expected.length);
    for (const f of buildMissingFragments(multi, progress.missingIds)) store().markFragment(f);
    check('标记后产生全部碎片', store().markedFragments.length === expected.length, `${store().markedFragments.length} vs ${expected.length}`);

    // 已标记 → 再标记是幂等的（不能重复写入）
    let ids = new Set(store().markedFragments.map((f) => f.id));
    progress = blockProgress(multi, ids);
    check('已标记状态识别为 complete', progress.state === 'complete');
    for (const f of buildMissingFragments(multi, progress.missingIds)) store().markFragment(f);
    check('已标记后再点不会重复写入', store().markedFragments.length === expected.length);

    // 旧存档：整块只剩一部分碎片（例如 clueIds 被扩充过）。
    // 现在商店不再暴露「逐条删除」，所以部分状态只能由历史数据造成 —— 这里直接构造出来。
    store().resetGame();
    for (const f of buildFragments(multi).slice(0, -1)) store().markFragment(f);
    ids = new Set(store().markedFragments.map((f) => f.id));
    progress = blockProgress(multi, ids);
    check('残缺状态识别为 partial', progress.state === 'partial', `实际 ${progress.state}`);
    check('partial 时只补缺失的那条', progress.missingIds.length === 1, `实际缺 ${progress.missingIds.length}`);

    // 关键回归：partial 时再点按钮必须是「补齐」，而不是把已有的删掉
    for (const f of buildMissingFragments(multi, progress.missingIds)) store().markFragment(f);
    check('partial 补齐后回到完整状态', store().markedFragments.length === expected.length, `${store().markedFragments.length} vs ${expected.length}`);
    check('补齐不会产生重复碎片', new Set(store().markedFragments.map((f) => f.id)).size === expected.length);

    // 线索板移除走 unmarkBlock：整块清除，绝不留下半标记
    store().unmarkBlock(multi.blockId);
    check('整块移除后该块碎片清零', store().markedFragments.length === 0, `剩余 ${store().markedFragments.length}`);
  }
}

console.log('\n[10] 模块依赖方向（防循环导入 / 防数据层反向依赖）');
{
  const { readFileSync } = await import('node:fs');
  const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

  const stats = read('../shared/src/store/collectionStats.ts');
  check(
    'collectionStats 不反向依赖 store（否则 gameStore ⇄ collectionStats 成环）',
    !/from\s+'\.\/gameStore/.test(stats),
    '出现了对 ./gameStore 的导入'
  );

  const fragments = read('../shared/src/store/fragments.ts');
  check(
    'fragments 不依赖 store 的运行时导出（只允许 import type）',
    !/^import\s+\{[^}]*\}\s+from\s+'\.\/gameStore/m.test(fragments),
    '出现了对 ./gameStore 的值导入'
  );

  const dataDir = new URL('../shared/src/data/', import.meta.url);
  const { readdirSync } = await import('node:fs');
  const offenders = [];
  for (const f of readdirSync(dataDir)) {
    if (!f.endsWith('.ts')) continue;
    const src = readFileSync(new URL(f, dataDir), 'utf8');
    if (/from\s+'\.\.?\/(store|components|pages)\//.test(src)) offenders.push(`${f} → store/components/pages`);
  }
  check('data/ 是纯数据层，不依赖 store/components/pages', offenders.length === 0, offenders.join('; '));
}

console.log('');
if (failures > 0) {
  console.error(`✗ 通关仿真失败：${failures} 项断言未通过。`);
  process.exit(1);
}
console.log('✓ 通关仿真全部通过。');
