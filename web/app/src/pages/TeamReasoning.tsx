import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore, TOTAL_CLUE_COUNT } from '../store/gameStore';
import { REASONING_QUESTION, REASONING_OPTIONS } from '../data/reasoning';
import BrowserFrame from '../components/BrowserFrame';

export default function TeamReasoning() {
  const navigate = useNavigate();
  const { recordPageVisit, finalAnswer, setFinalAnswer, calculateEnding, markedFragments } = useGameStore();

  useEffect(() => { recordPageVisit('team-reasoning'); }, [recordPageVisit]);

  const [selected, setSelected] = useState<string | null>(finalAnswer);
  const [confirmed, setConfirmed] = useState(!!finalAnswer);

  const uniqueValidClueIds = new Set(
    markedFragments.filter((f) => f.isValidClue && f.clueId).map((f) => f.clueId)
  );
  const validCount = uniqueValidClueIds.size;
  const collectionRate = Math.round((validCount / TOTAL_CLUE_COUNT) * 100);

  const handleConfirm = () => {
    if (selected) {
      setFinalAnswer(selected);
      calculateEnding();
      setConfirmed(true);
    }
  };

  return (
    <BrowserFrame currentUrl="team.internal.local/reasoning" title="最终推理">
      <div className="max-w-4xl mx-auto p-3 md:p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg">
          {/* 头部 */}
          <div className="p-4 md:p-5 border-b border-slate-700">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base md:text-lg font-bold text-white">🧩 最终推理</h2>
                <p className="text-slate-400 text-xs md:text-sm mt-0.5 md:mt-1">
                  线索收集率 {collectionRate}% ({validCount}/{TOTAL_CLUE_COUNT})
                </p>
              </div>
              <button
                onClick={() => navigate('/team')}
                className="text-slate-400 active:text-white text-xs md:text-sm shrink-0"
              >
                ← 返回
              </button>
            </div>
          </div>

          {/* 核心设问 */}
          <div className="p-4 md:p-5 border-b border-slate-700">
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-3 md:p-4">
              <h3 className="text-xs md:text-sm font-bold text-red-400 mb-1.5 md:mb-2">⚡ 核心设问</h3>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">{REASONING_QUESTION}</p>
            </div>
          </div>

          {/* 四选一 */}
          <div className="p-3 md:p-5 space-y-2 md:space-y-3">
            {REASONING_OPTIONS.map((opt) => {
              const isSelected = selected === opt.id;
              const showAnalysis = confirmed && isSelected;

              return (
                <div key={opt.id} className="space-y-1.5 md:space-y-2">
                  <div
                    onClick={() => !confirmed && setSelected(opt.id)}
                    className={`p-3 md:p-4 rounded-lg border cursor-pointer transition-all active:opacity-80
                      ${isSelected
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-slate-600 active:border-slate-500'
                      }
                      ${confirmed && isSelected
                        ? opt.isCorrect
                          ? 'border-green-500 bg-green-900/20'
                          : 'border-red-500 bg-red-900/20'
                        : ''
                      }
                      ${confirmed && !isSelected ? 'opacity-40' : ''}
                    `}
                  >
                    <div className="flex items-start gap-2 md:gap-3">
                      <div
                        className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shrink-0
                          ${isSelected
                            ? confirmed
                              ? opt.isCorrect
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                              : 'bg-blue-500 text-white'
                            : 'bg-slate-600 text-slate-300'
                          }`}
                      >
                        {opt.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm text-slate-200 leading-relaxed">{opt.text}</p>
                      </div>
                    </div>
                  </div>

                  {showAnalysis && (
                    <div className="ml-9 md:ml-11 bg-slate-700 border border-slate-600 rounded-lg p-3 md:p-4 space-y-1">
                      <h4 className="text-xs md:text-sm font-bold text-slate-300 mb-1.5 md:mb-2">📊 详细解析：</h4>
                      {opt.analysis.map((line, i) => (
                        <div key={i} className="text-[10px] md:text-xs text-slate-300 leading-relaxed">
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 按钮 */}
          <div className="p-4 md:p-5 border-t border-slate-700 text-center">
            {!confirmed && (
              <div>
                <button
                  onClick={handleConfirm}
                  disabled={!selected}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed
                    text-white px-8 py-3 rounded-lg font-medium text-sm md:text-base transition-colors"
                >
                  📝 确认推理结论
                </button>
                {!selected && <p className="text-[10px] md:text-xs text-slate-500 mt-1.5 md:mt-2">请先选择一个答案</p>}
              </div>
            )}
            {confirmed && (
              <button
                onClick={() => navigate('/ending')}
                className="w-full md:w-auto bg-green-600 hover:bg-green-500 active:bg-green-700 text-white px-8 py-3 rounded-lg font-medium text-sm md:text-base"
              >
                📖 查看结局 →
              </button>
            )}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}