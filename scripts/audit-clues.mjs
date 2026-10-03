#!/usr/bin/env node
/**
 * 线索可达性自检。
 *
 * 背景：这个游戏的核心判定是「有效线索收集率 ≥ 95%」，也就是 23 条里至少要拿到 22 条。
 * 只要有一条线索在数据层没有任何可标记的载体，它就永远拿不到，阈值随即变成不可能完成。
 * 这类缺陷不会让构建失败、也不会让类型检查报错，只能在数据层做可达性校验。
 *
 * 本脚本直接导入游戏的真实数据（Node 24 原生支持导入 .ts），
 * 按各页面的渲染规则推导「哪些线索可以被玩家标记出来」，然后与 ALL_CLUES 对账。
 *
 * 用法：npm run audit:clues
 */

import { ALL_CLUES } from '../shared/src/data/clues.ts';
import { FORUM_POSTS, COLLECTION_BOX_POST } from '../shared/src/data/forum.ts';
import { NEWS_ARTICLES } from '../shared/src/data/news.ts';
import { PROFILES } from '../shared/src/data/profiles.ts';

const PASS_COLLECTION_RATE = 0.95;
const REQUIRED_FOR_PASS = Math.ceil(ALL_CLUES.length * PASS_COLLECTION_RATE);

const problems = [];
const reachable = new Map(); // clueId -> 来源说明[]

function record(clueId, source) {
  if (!reachable.has(clueId)) reachable.set(clueId, []);
  reachable.get(clueId).push(source);
}

// ---------- 论坛：帖子正文与每条回复各有一个标记按钮 ----------
for (const post of [...FORUM_POSTS, COLLECTION_BOX_POST]) {
  // 页面按 post.id 取到帖子；id 必须唯一
  for (const clueId of post.clueIds) {
    record(clueId, `${post.id} 楼主正文`);
  }
  for (const reply of post.replies) {
    if (reply.clueId) record(reply.clueId, `${post.id}/${reply.id} 回复`);
  }
}

// ---------- 新闻：heading 不渲染标记按钮，其余段落都渲染 ----------
for (const article of NEWS_ARTICLES) {
  const markableClueIds = [];
  for (const block of article.content) {
    if (block.type === 'heading') {
      if (block.clueId) {
        problems.push(
          `${article.id}/${block.id} 是 heading，页面不渲染标记按钮，线索 ${block.clueId} 无法收集`
        );
      }
      continue;
    }
    if (block.clueId) {
      record(block.clueId, `${article.id}/${block.id} 段落`);
      markableClueIds.push(block.clueId);
    }
  }

  // 列表页的「💡 N 条线索」角标来自 article.clueIds，必须与实际可标记数量一致
  const declared = new Set(article.clueIds);
  const actual = new Set(markableClueIds);
  if (declared.size !== actual.size || [...declared].some((id) => !actual.has(id))) {
    problems.push(
      `${article.id} 的 clueIds=[${[...declared].join(',')}] 与可标记段落实际线索 [${[...actual].join(',')}] 不一致`
    );
  }
}

// ---------- 人物资料：职业区块、邻居/同事评价、配偶走访 ----------
for (const profile of PROFILES) {
  for (const clueId of profile.occupationClueIds ?? []) {
    record(clueId, `${profile.id} 职业区块`);
  }
  profile.neighborReviews.forEach((entry, i) => {
    for (const clueId of entry.clueIds ?? []) record(clueId, `${profile.id} 邻居评价#${i}`);
  });
  profile.colleagueReviews.forEach((entry, i) => {
    for (const clueId of entry.clueIds ?? []) record(clueId, `${profile.id} 同事评价#${i}`);
  });
  for (const clueId of profile.spouseReview?.clueIds ?? []) {
    record(clueId, `${profile.id} 配偶走访`);
  }
}

// ---------- 对账 ----------
const allIds = ALL_CLUES.map((c) => c.id);
if (new Set(allIds).size !== allIds.length) {
  problems.push('ALL_CLUES 中存在重复的线索 ID');
}

for (const [clueId, sources] of reachable) {
  if (!allIds.includes(clueId)) {
    problems.push(`数据层引用了未定义的线索 ${clueId}（来源：${sources[0]}）`);
  }
}

const unreachable = allIds.filter((id) => !reachable.has(id));
const maxRate = (allIds.length - unreachable.length) / allIds.length;

console.log(`线索总数            : ${allIds.length}`);
console.log(`可达线索            : ${allIds.length - unreachable.length}`);
console.log(`收集率上限          : ${(maxRate * 100).toFixed(2)}%`);
console.log(`通关所需（≥95%）    : ${REQUIRED_FOR_PASS} 条`);
if (unreachable.length > 0) {
  console.log(`不可达线索          : ${unreachable.join(', ')}`);
  for (const id of unreachable) {
    const clue = ALL_CLUES.find((c) => c.id === id);
    console.log(`  - ${id} ${clue ? clue.name : ''}`);
  }
}
console.log('');

if (unreachable.length > 0 || problems.length > 0) {
  for (const p of problems) console.error(`✗ ${p}`);
  if (unreachable.length > 0) {
    console.error(`✗ 线索不可达，且可达上限 ${(maxRate * 100).toFixed(2)}% 低于或仅勉强等于通过线`);
  }
  console.error('\n线索可达性自检未通过。');
  process.exit(1);
}

// 可达且留有余量才算健康：至少要比通过线多，否则玩家一次都不能错
const margin = allIds.length - unreachable.length - REQUIRED_FOR_PASS;
console.log(`· 通过线 ${REQUIRED_FOR_PASS} 条，可达 ${allIds.length - unreachable.length} 条，容错 ${margin} 条`);
console.log('✓ 线索全部可达，收集箱阈值可达成。');
