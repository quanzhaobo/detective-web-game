import { useGameStore } from '../store/gameStore.ts';
import {
  blockProgress,
  buildMissingFragments,
  countPresent,
  fragmentIdsFor,
  type BlockMarkState,
  type MarkableBlock,
} from '../store/fragments.ts';

export interface MarkButtonProps extends Omit<MarkableBlock, 'blockId'> {
  /** 内容块 ID */
  blockId: string;
  markLabel?: string;
  markedLabel?: string;
  compact?: boolean;
  /** 追加到按钮上的布局类，用于个别位置（如移动端整行按钮）微调 */
  className?: string;
}

/**
 * 统一的「标记为线索」按钮。
 *
 * 标记的粒度是**内容块**：一个块可能承载多条线索（如 post-8 正文 = T01/E03/E04），
 * 点一次就会为每条线索各生成一个碎片。三种状态：
 *   - 未标记   → 全部标记
 *   - 已标记   → 整块取消标记（走 unmarkBlock，顺带清掉历史遗留的多余碎片）
 *   - 部分标记 → 只补缺失的那几条
 * 「部分标记」只会出现在旧存档或 clueIds 被扩充过的块上；早期实现把它当成「已标记」，
 * 点一下会把已攒下的碎片全删掉，与线索板上逐条删除的行为互相矛盾。
 */
export default function MarkButton({
  blockId,
  content,
  sourcePageId,
  sourceTitle,
  sourceUrl,
  clueIds,
  markLabel = '标记为线索',
  markedLabel = '已标记为线索',
  compact = false,
  className = '',
}: MarkButtonProps) {
  const block: MarkableBlock = {
    blockId,
    content,
    sourcePageId,
    sourceTitle,
    sourceUrl,
    clueIds,
  };

  const expectedIds = fragmentIdsFor(block);
  // 选择器返回数字（原始值），不会因为「每次都是新对象」而无限重渲染
  const presentCount = useGameStore((s) => countPresent(s.markedFragments, expectedIds));
  const markFragment = useGameStore((s) => s.markFragment);
  const unmarkBlock = useGameStore((s) => s.unmarkBlock);

  const total = expectedIds.length;
  const state: BlockMarkState =
    presentCount === 0 ? 'none' : presentCount === total ? 'complete' : 'partial';

  const toggle = () => {
    if (state === 'complete') {
      unmarkBlock(blockId);
      return;
    }
    // none → 缺全部；partial → 缺一部分。同一个分支即可覆盖
    const existing = new Set(useGameStore.getState().markedFragments.map((f) => f.id));
    const { missingIds } = blockProgress(block, existing);
    for (const fragment of buildMissingFragments(block, missingIds)) {
      markFragment(fragment);
    }
  };

  const label =
    state === 'complete'
      ? markedLabel
      : state === 'partial'
        ? `补全线索 (${presentCount}/${total})`
        : markLabel;

  const tone =
    state === 'complete'
      ? 'bg-green-50 text-green-700 border-green-200'
      : state === 'partial'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600';

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-1 rounded border transition-all active:opacity-80
        ${compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium'}
        ${tone}
        ${className}`}
    >
      <span>{state === 'complete' ? '✅' : state === 'partial' ? '◐' : '📌'}</span>
      {label}
    </button>
  );
}
