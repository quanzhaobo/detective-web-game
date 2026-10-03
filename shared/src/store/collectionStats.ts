import { TOTAL_CLUE_COUNT } from '../data/clues.ts';

/** 收集箱通过阈值 */
export const PASS_COLLECTION_RATE = 0.95;
/** 无效标记占比上限 */
export const MAX_ERROR_RATE = 0.5;
/** 最多提交次数 */
export const MAX_SUBMISSIONS = 3;

/**
 * 本模块是**纯函数**，只依赖 data/clues.ts，不反向依赖 store。
 * React 侧的读取封装在 useCollectionStats.ts —— 分开放是为了不产生
 * gameStore ⇄ collectionStats 的循环导入（运行时无害，但模块初始化顺序一变就会踩 TDZ）。
 */
export interface ClueBearingFragment {
  isValidClue: boolean;
  clueId?: string;
}

export interface CollectionStats {
  /** 已标记碎片总数（含无效标记） */
  markedCount: number;
  /** 去重后的有效线索数 */
  validClueCount: number;
  invalidClueCount: number;
  /** 0~1 */
  collectionRate: number;
  /** 取整百分比，用于展示 */
  collectionPercent: number;
  /** 0~1 */
  errorRate: number;
  errorPercent: number;
  /** 是否同时满足收集率与错误率两个门槛 */
  meetsThresholds: boolean;
}

/**
 * 收集进度判定的唯一实现。
 * 线索板、收集箱、最终推理、结局页都从这里取数，避免五处各算一遍算错。
 */
export function computeCollectionStats(
  fragments: readonly ClueBearingFragment[]
): CollectionStats {
  const markedCount = fragments.length;

  const uniqueValidClueIds = new Set<string>();
  for (const f of fragments) {
    if (f.isValidClue && f.clueId) uniqueValidClueIds.add(f.clueId);
  }
  const validClueCount = uniqueValidClueIds.size;
  const invalidClueCount = fragments.filter((f) => !f.isValidClue).length;

  const collectionRate = markedCount > 0 ? validClueCount / TOTAL_CLUE_COUNT : 0;
  const errorRate = markedCount > 0 ? invalidClueCount / markedCount : 0;

  return {
    markedCount,
    validClueCount,
    invalidClueCount,
    collectionRate,
    collectionPercent: Math.round(collectionRate * 100),
    errorRate,
    errorPercent: Math.round(errorRate * 100),
    meetsThresholds:
      collectionRate >= PASS_COLLECTION_RATE && errorRate <= MAX_ERROR_RATE,
  };
}

