import { useGameStore } from './gameStore.ts';
import { computeCollectionStats, type CollectionStats } from './collectionStats.ts';

/**
 * React 侧读取当前收集进度。
 *
 * 单独一个文件：collectionStats.ts 保持纯函数（只依赖 data/），
 * 依赖方向固定为 useCollectionStats → { gameStore, collectionStats }，
 * 不存在回边，因此没有循环导入。
 */
export function useCollectionStats(): CollectionStats {
  const markedFragments = useGameStore((s) => s.markedFragments);
  return computeCollectionStats(markedFragments);
}
