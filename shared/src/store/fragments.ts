import type { MarkedFragment } from './gameStore.ts';
import { isValidClueId } from '../data/clues.ts';

/**
 * 内容块 → 线索碎片的唯一实现。
 *
 * 说明：store / data 目录下的相对导入带 .ts 后缀，是为了让这些与 JSX 无关的模块
 * 能被 Node 直接导入（scripts/ 下的自检脚本据此对游戏逻辑做端到端校验）。
 * tsconfig 已开启 allowImportingTsExtensions，Vite 同样接受带后缀的导入。
 */

/** 内容摘要长度上限（内部实现细节，不外露） */
const FRAGMENT_CONTENT_LIMIT = 200;

export interface MarkableBlock {
  /** 内容块 ID，同时作为已标记状态的判定键 */
  blockId: string;
  content: string;
  sourcePageId: string;
  sourceTitle: string;
  sourceUrl: string;
  /**
   * 该内容块承载的有效线索。
   * - 有值：每条线索生成一个碎片，全部计入收集率
   * - 空 / 省略：生成一个非线索碎片，计入错误判定率
   */
  clueIds?: readonly string[];
}

/** 历史存档沿用的碎片 id 规则：首条无后缀，其余追加 -1、-2 … */
function fragmentId(blockId: string, index: number): string {
  return index === 0 ? `frag-${blockId}` : `frag-${blockId}-${index}`;
}

/** 该内容块会写入的全部碎片 id（取消标记时按此清理） */
export function fragmentIdsFor(block: MarkableBlock): string[] {
  const count = Math.max(block.clueIds?.length ?? 0, 1);
  return Array.from({ length: count }, (_, i) => fragmentId(block.blockId, i));
}

/** 把内容块转换成待写入 store 的碎片列表 */
export function buildFragments(block: MarkableBlock): MarkedFragment[] {
  const content =
    block.content.length > FRAGMENT_CONTENT_LIMIT
      ? `${block.content.slice(0, FRAGMENT_CONTENT_LIMIT)}…`
      : block.content;

  const base = {
    content,
    sourcePageId: block.sourcePageId,
    sourceBlockId: block.blockId,
    sourceTitle: block.sourceTitle,
    sourceUrl: block.sourceUrl,
  };

  const clueIds = block.clueIds ?? [];
  if (clueIds.length === 0) {
    return [{ ...base, id: fragmentId(block.blockId, 0), isValidClue: false }];
  }

  return clueIds.map((clueId, index) => ({
    ...base,
    id: fragmentId(block.blockId, index),
    isValidClue: isValidClueId(clueId),
    clueId,
  }));
}

// ========== 标记程度 ==========

export type BlockMarkState = 'none' | 'partial' | 'complete';

export interface BlockProgress {
  /** 该内容块正常情况下应产生的全部碎片 id */
  expectedIds: string[];
  /** 当前已存在的 */
  presentIds: string[];
  /** 还缺的 */
  missingIds: string[];
  state: BlockMarkState;
}

/** 数一数 ids 里有几个已经存在于碎片列表中（返回数字，适合直接做 store 选择器） */
export function countPresent(
  fragments: readonly { id: string }[],
  ids: readonly string[]
): number {
  let n = 0;
  for (const id of ids) {
    if (fragments.some((f) => f.id === id)) n += 1;
  }
  return n;
}

/**
 * 计算内容块的标记程度。
 *
 * 为什么需要 partial 这个状态：旧存档（或任何 clueIds 被扩充过的内容块）可能只存在
 * 一部分碎片。此时再点一次按钮应当是「补齐缺的那条」，而不是把已经攒下的全部删掉 ——
 * 早期实现只判断「有没有碎片」，点一下会把整块清空，行为与线索板上逐条删除互相矛盾。
 */
export function blockProgress(
  block: MarkableBlock,
  existingIds: ReadonlySet<string>
): BlockProgress {
  const expectedIds = fragmentIdsFor(block);
  const presentIds = expectedIds.filter((id) => existingIds.has(id));
  const missingIds = expectedIds.filter((id) => !existingIds.has(id));
  return {
    expectedIds,
    presentIds,
    missingIds,
    state: presentIds.length === 0 ? 'none' : missingIds.length === 0 ? 'complete' : 'partial',
  };
}

/** 只生成缺失的那部分碎片（partial 状态补齐用） */
export function buildMissingFragments(
  block: MarkableBlock,
  missingIds: readonly string[]
): MarkedFragment[] {
  const want = new Set(missingIds);
  return buildFragments(block).filter((f) => want.has(f.id));
}
