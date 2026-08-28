import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getCaseById } from '../data/cases';

export default function SuspectsPage() {
  const navigate = useNavigate();
  const { currentCaseId, interrogatedSuspects, interrogateSuspect } = useGameStore();
  const caseData = currentCaseId ? getCaseById(currentCaseId) : undefined;
  const suspects = caseData?.suspects ?? [];

  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [showInterrogation, setShowInterrogation] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const suspect = suspects.find((s) => s.id === selectedSuspect);

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

  const allDone = interrogatedSuspects.length >= suspects.length;

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">👤 嫌疑人排查</h2>
          <p className="text-gray-400 text-sm mt-1">
            已审讯 {interrogatedSuspects.length}/{suspects.length} 名嫌疑人
          </p>
        </div>
        <div className="flex gap-2">
          {allDone && (
            <button onClick={() => navigate('/reasoning')} className="btn-primary text-sm">
              🧩 进入推理室 →
            </button>
          )}
          <button
            onClick={() => navigate(`/case/${currentCaseId}`)}
            className="btn-secondary text-sm"
          >
            ← 返回工作台
          </button>
        </div>
      </div>

      {/* 审讯对话模式 */}
      {showInterrogation && suspect && (
        <div className="bg-dark-700 border border-accent/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-accent">
              审讯中：{suspect.name}（{suspect.id}号嫌疑人）
            </h3>
            <button
              onClick={() => {
                setShowInterrogation(false);
                setDialogueIndex(0);
              }}
              className="text-gray-400 hover:text-white text-sm"
            >
              ✕ 关闭
            </button>
          </div>

          {/* 对话记录 */}
          <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
            {suspect.interrogation.slice(0, dialogueIndex + 1).map((line, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-sm ${
                  line.speaker === 'player'
                    ? 'bg-accent/10 border border-accent/20 ml-8'
                    : line.speaker === 'suspect'
                    ? 'bg-dark-600 border border-dark-500 mr-8'
                    : 'bg-dark-800 text-gray-500 italic text-center'
                }`}
              >
                {line.speaker !== 'narrator' && (
                  <span className="text-xs font-bold text-gray-400 block mb-1">
                    {line.speaker === 'player' ? '🔹 你' : '🔸 ' + suspect.name}
                  </span>
                )}
                {line.text}
              </div>
            ))}
          </div>

          <button onClick={handleNextDialogue} className="btn-primary w-full">
            {dialogueIndex < suspect.interrogation.length - 1 ? '继续 ▸' : '✓ 结束审讯'}
          </button>
        </div>
      )}

      {/* 嫌疑人列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suspects.map((s) => {
          const done = interrogatedSuspects.includes(s.id);
          const isSelected = selectedSuspect === s.id;

          return (
            <div key={s.id} className="card">
              {/* 嫌疑人卡片头部 */}
              <div
                className="flex items-center gap-3 cursor-pointer mb-3"
                onClick={() => setSelectedSuspect(isSelected ? null : s.id)}
              >
                <div className="w-12 h-12 rounded-full bg-dark-600 flex items-center justify-center text-xl font-bold text-accent border border-dark-500">
                  {s.id}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white">
                    {s.name}
                    {done && <span className="ml-2 text-green-400 text-xs">✅ 已审讯</span>}
                  </div>
                  <div className="text-sm text-gray-400">{s.occupation}</div>
                </div>
                <span className="text-gray-500 text-xs">{isSelected ? '▲ 收起' : '▼ 展开'}</span>
              </div>

              {/* 详细档案 */}
              {isSelected && (
                <div className="space-y-3 border-t border-dark-500 pt-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-gray-400">年龄：<span className="text-white">{s.age}岁</span></div>
                    <div className="text-gray-400">籍贯：<span className="text-white">{s.origin}</span></div>
                    <div className="text-gray-400">居住地：<span className="text-white">{s.residence}</span></div>
                    <div className="text-gray-400">身高：<span className="text-white">{s.height}</span></div>
                    <div className="text-gray-400">惯用手：<span className="text-white">{s.handedness}</span></div>
                    <div className="text-gray-400">车辆：<span className="text-white">{s.vehicle}</span></div>
                  </div>

                  <div className="text-xs text-gray-300 bg-dark-800 rounded p-3 leading-relaxed">
                    {s.profile}
                  </div>

                  {/* 矛盾点 */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 mb-1">⚠️ 审讯中暴露的矛盾点：</h4>
                    <ul className="text-xs text-gray-300 space-y-1">
                      {s.contradictions.map((c, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-danger">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 审讯按钮 */}
                  {!done && !showInterrogation && (
                    <button onClick={handleStartInterrogation} className="btn-primary w-full text-sm">
                      🔍 开始审讯
                    </button>
                  )}
                  {done && (
                    <div className="text-center text-green-400 text-sm py-2">
                      ✅ 审讯已完成
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
