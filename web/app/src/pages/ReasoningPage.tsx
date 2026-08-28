import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getCaseById } from '../data/cases';
import { CATEGORY_LABELS, type ClueCategory } from '../data/clues';

export default function ReasoningPage() {
  const navigate = useNavigate();
  const { currentCaseId, discoveredClues, finalAnswer, setFinalAnswer, calculateEnding } =
    useGameStore();
  const caseData = currentCaseId ? getCaseById(currentCaseId) : undefined;

  const clues = caseData?.clues ?? [];
  const reasoningQuestion = caseData?.reasoningQuestion ?? '';
  const reasoningOptions = caseData?.reasoningOptions ?? [];
  const totalClues = caseData?.totalClueCount ?? 1;

  const [selected, setSelected] = useState<string | null>(finalAnswer);
  const [confirmed, setConfirmed] = useState(!!finalAnswer);

  const collectionRate = Math.round((discoveredClues.length / totalClues) * 100);

  // 按类别分组已发现的线索
  const discoveredClueData = clues.filter((c) => discoveredClues.includes(c.id));
  const groupedClues = discoveredClueData.reduce(
    (acc, clue) => {
      if (!acc[clue.category]) acc[clue.category] = [];
      acc[clue.category].push(clue);
      return acc;
    },
    {} as Record<ClueCategory, typeof discoveredClueData>
  );

  const handleConfirm = () => {
    if (selected) {
      setFinalAnswer(selected);
      calculateEnding(totalClues);
      setConfirmed(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">🧩 推理室</h2>
          <p className="text-gray-400 text-sm mt-1">
            线索收集率 {collectionRate}% ({discoveredClues.length}/{totalClues})
          </p>
        </div>
        <button
          onClick={() => navigate(`/case/${currentCaseId}`)}
          className="btn-secondary text-sm"
        >
          ← 返回工作台
        </button>
      </div>

      {/* 核心设问 */}
      <div className="bg-dark-700 border border-danger/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-danger mb-2">⚡ 核心设问</h3>
        <p className="text-gray-200 leading-relaxed">{reasoningQuestion}</p>
      </div>

      {/* 四选一 */}
      <div className="space-y-3">
        {reasoningOptions.map((opt) => {
          const isSelected = selected === opt.id;
          const showAnalysis = confirmed && isSelected;

          return (
            <div key={opt.id} className="space-y-2">
              <div
                onClick={() => !confirmed && setSelected(opt.id)}
                className={`card cursor-pointer transition-all
                  ${isSelected ? 'border-accent bg-dark-600' : 'hover:border-accent/40'}
                  ${confirmed && isSelected
                    ? opt.isCorrect
                      ? 'border-green-500 bg-green-500/5'
                      : 'border-danger bg-danger/5'
                    : ''
                  }
                  ${confirmed && !isSelected ? 'opacity-40' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                    ${isSelected
                      ? confirmed
                        ? opt.isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-danger text-white'
                        : 'bg-accent text-white'
                      : 'bg-dark-500 text-gray-300'
                    }`}
                  >
                    {opt.id}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-200 leading-relaxed">{opt.text}</p>
                  </div>
                </div>
              </div>

              {/* 解析展示 */}
              {showAnalysis && (
                <div className="ml-11 bg-dark-800 border border-dark-500 rounded-lg p-4 space-y-1">
                  <h4 className="text-sm font-bold text-gray-300 mb-2">📊 详细解析：</h4>
                  {opt.analysis.map((line, i) => (
                    <div key={i} className="text-xs text-gray-300 leading-relaxed">
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 确认按钮 */}
      {!confirmed && (
        <div className="text-center">
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-30"
          >
            📝 确认推理结论
          </button>
          {!selected && <p className="text-xs text-gray-500 mt-2">请先选择一个答案</p>}
        </div>
      )}

      {confirmed && (
        <div className="text-center">
          <button onClick={() => navigate('/ending')} className="btn-primary px-8 py-3 text-lg">
            📖 查看结局 →
          </button>
        </div>
      )}

      {/* 已收集线索一览 */}
      <div className="bg-dark-800 border border-dark-600 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
          📋 已收集线索一览
        </h3>
        {Object.entries(groupedClues).map(([category, categoryClues]) => (
          <div key={category} className="mb-4">
            <h4 className="text-xs font-bold text-accent mb-2">
              {CATEGORY_LABELS[category as ClueCategory]}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {categoryClues.map((clue) => (
                <div key={clue.id} className="text-xs bg-dark-700 rounded p-2 border border-dark-500">
                  <span className="font-mono text-gray-500">{clue.id}</span>{' '}
                  <span className="text-white font-medium">{clue.name}</span>
                  <span className="text-gray-400 ml-1">— {clue.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
