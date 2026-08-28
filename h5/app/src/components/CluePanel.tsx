import { useGameStore } from '../store/gameStore';
import { getCaseById } from '../data/cases';
import { CATEGORY_LABELS, type ClueCategory } from '../data/clues';

interface CluePanelProps {
  onClose: () => void;
}

export default function CluePanel({ onClose }: CluePanelProps) {
  const { currentCaseId, discoveredClues } = useGameStore();
  const caseData = currentCaseId ? getCaseById(currentCaseId) : undefined;

  const clues = caseData?.clues ?? [];
  const total = caseData?.totalClueCount ?? 0;

  const discoveredClueData = clues.filter((c) => discoveredClues.includes(c.id));
  const collectionRate = total > 0 ? Math.round((discoveredClues.length / total) * 100) : 0;

  // 按类别分组
  const grouped = discoveredClueData.reduce(
    (acc, clue) => {
      if (!acc[clue.category]) acc[clue.category] = [];
      acc[clue.category].push(clue);
      return acc;
    },
    {} as Record<ClueCategory, typeof discoveredClueData>
  );

  const categories: ClueCategory[] = ['evidence', 'forensic', 'surveillance', 'trace', 'psychology'];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* 遮罩层 */}
      <div className="flex-1 bg-black/50" onClick={onClose} />

      {/* 面板 */}
      <div className="w-96 bg-dark-800 border-l border-dark-600 overflow-y-auto">
        <div className="p-5">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">📎 线索板</h2>
              <p className="text-xs text-gray-400 mt-1">
                已收集 {discoveredClues.length}/{total} 条线索 ({collectionRate}%)
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* 进度条 */}
          <div className="h-2 bg-dark-600 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${collectionRate}%` }}
            />
          </div>

          {/* 按类别显示 */}
          {categories.map((cat) => {
            const categoryClues = grouped[cat] || [];
            const totalInCategory = clues.filter((c) => c.category === cat).length;

            return (
              <div key={cat} className="mb-5">
                <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  {CATEGORY_LABELS[cat]} ({categoryClues.length}/{totalInCategory})
                </h3>

                {categoryClues.length === 0 ? (
                  <div className="text-xs text-gray-600 italic pl-2">暂无线索</div>
                ) : (
                  <div className="space-y-2">
                    {categoryClues.map((clue) => (
                      <div
                        key={clue.id}
                        className="bg-dark-700 rounded-lg p-3 border border-dark-500"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white">{clue.name}</span>
                          <span className="text-xs font-mono text-gray-500">{clue.id}</span>
                        </div>
                        <p className="text-xs text-gray-400">{clue.description}</p>
                        <p className="text-xs text-gray-300 mt-1 bg-dark-800 rounded p-1.5">
                          {clue.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
