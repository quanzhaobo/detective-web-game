import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { SUSPECTS } from '../data/suspects';
import { CHAPTERS } from '../data/chapters';
import BrowserFrame from '../components/BrowserFrame';

export default function TeamSuspects() {
  const navigate = useNavigate();
  const { recordPageVisit, interrogatedSuspects, interrogateSuspect, completedInvestigations } = useGameStore();

  useEffect(() => { recordPageVisit('team-suspects'); }, [recordPageVisit]);

  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [showInterrogation, setShowInterrogation] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const suspect = SUSPECTS.find((s) => s.id === selectedSuspect);
  const allDone = interrogatedSuspects.length >= SUSPECTS.length;
  const allChaptersDone = completedInvestigations.length >= CHAPTERS.length;

  const handleStartInterrogation = () => {
    setShowInterrogation(true);
    setDialogueIndex(0);
  };

  const handleNextDialogue = () => {
    if (!suspect) return;
    if (dialogueIndex < suspect.interrogation.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      if (selectedSuspect) {
        interrogateSuspect(selectedSuspect);
      }
      setShowInterrogation(false);
      setDialogueIndex(0);
    }
  };

  return (
    <BrowserFrame currentUrl="team.internal.local/suspects" title="审讯记录">
      <div className="max-w-4xl mx-auto p-3 md:p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg">
          {/* 头部 */}
          <div className="p-4 md:p-5 border-b border-slate-700">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base md:text-lg font-bold text-white">👤 嫌疑人审讯记录</h2>
                <p className="text-slate-400 text-xs md:text-sm mt-0.5 md:mt-1">
                  已审讯 {interrogatedSuspects.length}/{SUSPECTS.length} 名嫌疑人
                </p>
              </div>
              <div className="flex gap-1.5 md:gap-2 shrink-0">
                {allDone && allChaptersDone && (
                  <button
                    onClick={() => navigate('/team/reasoning')}
                    className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-2.5 md:px-4 py-2 rounded text-xs md:text-sm"
                  >
                    🧩 推理
                  </button>
                )}
                <button
                  onClick={() => navigate('/team')}
                  className="text-slate-400 active:text-white text-xs md:text-sm"
                >
                  ← 返回
                </button>
              </div>
            </div>
          </div>

          {showInterrogation && suspect && (
            <div className="p-4 md:p-5 border-b border-slate-700 bg-slate-50">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-sm md:text-base font-bold text-slate-800">
                  审讯中：{suspect.name}
                </h3>
                <button
                  onClick={() => {
                    setShowInterrogation(false);
                    setDialogueIndex(0);
                  }}
                  className="text-slate-400 hover:text-slate-600 active:text-slate-800 text-xs md:text-sm"
                >
                  ✕ 关闭
                </button>
              </div>

              <div className="space-y-2 md:space-y-3 mb-3 md:mb-4 max-h-64 md:max-h-80 overflow-y-auto">
                {suspect.interrogation.slice(0, dialogueIndex + 1).map((line, i) => (
                  <div
                    key={i}
                    className={`p-2.5 md:p-3 rounded-lg text-xs md:text-sm ${
                      line.speaker === 'player'
                        ? 'bg-blue-50 border border-blue-200 ml-4 md:ml-8 text-blue-900'
                        : line.speaker === 'suspect'
                        ? 'bg-amber-50 border border-amber-200 mr-4 md:mr-8 text-amber-900'
                        : 'bg-gray-100 text-gray-500 italic text-center'
                    }`}
                  >
                    {line.speaker !== 'narrator' && (
                      <span className={`text-[10px] md:text-xs font-bold block mb-0.5 md:mb-1 ${
                        line.speaker === 'player' ? 'text-blue-600' : 'text-amber-600'
                      }`}>
                        {line.speaker === 'player' ? '🔹 你' : '🔸 ' + suspect.name}
                      </span>
                    )}
                    {line.text}
                  </div>
                ))}
              </div>

              <button
                onClick={handleNextDialogue}
                className="w-full bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white py-2.5 rounded text-xs md:text-sm"
              >
                {dialogueIndex < suspect.interrogation.length - 1 ? '继续 ▸' : '✓ 结束审讯'}
              </button>
            </div>
          )}

          {/* 嫌疑人列表 */}
          <div className="p-3 md:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {SUSPECTS.map((s) => {
                const done = interrogatedSuspects.includes(s.id);
                const isSelected = selectedSuspect === s.id;

                return (
                  <div key={s.id} className="bg-slate-700 border border-slate-600 rounded-lg">
                    <div
                      className="flex items-center gap-2 md:gap-3 p-3 md:p-4 cursor-pointer active:bg-slate-600/50"
                      onClick={() => setSelectedSuspect(isSelected ? null : s.id)}
                    >
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-600 flex items-center justify-center text-base md:text-lg font-bold text-blue-400 border border-slate-500 shrink-0">
                        {s.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-xs md:text-sm">
                          {s.name}
                          {done && <span className="ml-1.5 text-green-400 text-[10px] md:text-xs">✅</span>}
                        </div>
                        <div className="text-[10px] md:text-xs text-slate-400 truncate">{s.occupation}</div>
                      </div>
                      <span className="text-slate-500 text-xs shrink-0">{isSelected ? '▲' : '▼'}</span>
                    </div>

                    {isSelected && (
                      <div className="border-t border-slate-600 p-3 md:p-4 space-y-2 md:space-y-3">
                        <div className="grid grid-cols-2 gap-1.5 md:gap-2 text-[10px] md:text-xs">
                          <div className="text-slate-400">年龄：<span className="text-white">{s.age}岁</span></div>
                          <div className="text-slate-400">籍贯：<span className="text-white">{s.origin}</span></div>
                          <div className="text-slate-400">居住地：<span className="text-white">{s.residence}</span></div>
                          <div className="text-slate-400">身高：<span className="text-white">{s.height}</span></div>
                          <div className="text-slate-400">惯用手：<span className="text-white">{s.handedness}</span></div>
                          <div className="text-slate-400">车辆：<span className="text-white">{s.vehicle}</span></div>
                        </div>

                        <div className="text-[10px] md:text-xs text-slate-300 bg-slate-800 rounded p-2.5 md:p-3 leading-relaxed">
                          {s.profile}
                        </div>

                        <div>
                          <h4 className="text-[10px] md:text-xs font-bold text-slate-400 mb-1">⚠️ 矛盾点：</h4>
                          <ul className="text-[10px] md:text-xs text-slate-300 space-y-0.5 md:space-y-1">
                            {s.contradictions.map((c, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-red-400 shrink-0">•</span> {c}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {!showInterrogation && (
                          <button
                            onClick={handleStartInterrogation}
                            className={`w-full py-2.5 rounded text-xs md:text-sm ${
                              done
                                ? 'bg-slate-600 hover:bg-slate-500 active:bg-slate-500 text-slate-200'
                                : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white'
                            }`}
                          >
                            {done ? '📖 查看证词' : '🔍 开始审讯'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}