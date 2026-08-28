import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { CHAPTERS } from '../data/chapters';
import { SUSPECTS } from '../data/suspects';
import BrowserFrame from '../components/BrowserFrame';

export default function TeamWorkbench() {
  const navigate = useNavigate();
  const { recordPageVisit, completedInvestigations, interrogatedSuspects, teamUnlocked } = useGameStore();

  useEffect(() => { recordPageVisit('team'); }, [recordPageVisit]);

  useEffect(() => {
    if (!teamUnlocked) {
      navigate('/collection-box');
    }
  }, [teamUnlocked, navigate]);

  if (!teamUnlocked) {
    return null;
  }

  const allChaptersDone = completedInvestigations.length >= CHAPTERS.length;
  const allSuspectsDone = interrogatedSuspects.length >= SUSPECTS.length;

  return (
    <BrowserFrame currentUrl="team.internal.local" title="专案组工作台">
      <div className="max-w-4xl mx-auto p-3 md:p-4">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-lg p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl">🔬</span>
            <div>
              <h1 className="text-lg md:text-xl font-bold">专案组工作台</h1>
              <p className="text-slate-300 text-xs md:text-sm">3·12连环女性失踪案 — 协助调查系统</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border-x border-b border-slate-700 p-4 md:p-6">
          {/* 欢迎信息 */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
            <p className="text-xs md:text-sm text-slate-300">
              感谢您对本案的贡献。专案组已采纳您在收集箱中提交的线索，现邀请您进入专案组工作台，
              协助进行更深层次的调查分析。
            </p>
          </div>

          {/* 模块入口 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* 案件档案室 */}
            <div
              onClick={() => navigate('/team/investigation/1')}
              className="bg-slate-700 border border-slate-600 rounded-lg p-4 md:p-5 cursor-pointer active:border-blue-500/50 transition-all group"
            >
              <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                <span className="text-xl md:text-2xl">📂</span>
                <div>
                  <h3 className="font-bold text-white text-sm md:text-base">案件档案室</h3>
                  <p className="text-[10px] md:text-xs text-slate-400">
                    {completedInvestigations.length}/{CHAPTERS.length} 章已完成
                  </p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                查看完整法医报告、痕检报告、物证清单等专业调查资料
              </p>
            </div>

            {/* 审讯记录 */}
            <div
              onClick={() => navigate('/team/suspects')}
              className="bg-slate-700 border border-slate-600 rounded-lg p-4 md:p-5 cursor-pointer active:border-blue-500/50 transition-all group"
            >
              <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                <span className="text-xl md:text-2xl">👤</span>
                <div>
                  <h3 className="font-bold text-white text-sm md:text-base">审讯记录</h3>
                  <p className="text-[10px] md:text-xs text-slate-400">
                    {interrogatedSuspects.length}/{SUSPECTS.length} 名已审讯
                  </p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                查看4名嫌疑人的审讯对话记录，发现矛盾点
              </p>
            </div>

            {/* 最终推理 */}
            <div
              onClick={() => {
                if (allChaptersDone && allSuspectsDone) {
                  navigate('/team/reasoning');
                }
              }}
              className={`bg-slate-700 border border-slate-600 rounded-lg p-4 md:p-5 transition-all md:col-span-2
                ${allChaptersDone && allSuspectsDone
                  ? 'cursor-pointer active:border-yellow-500/50'
                  : 'opacity-50 cursor-not-allowed'
                }`}
            >
              <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                <span className="text-xl md:text-2xl">🧩</span>
                <div>
                  <h3 className="font-bold text-white text-sm md:text-base">最终推理</h3>
                  <p className="text-[10px] md:text-xs text-slate-400">
                    {allChaptersDone && allSuspectsDone
                      ? '所有条件已满足，可以进入'
                      : '需完成全部档案查看和嫌疑人审讯'}
                  </p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                核心设问四选一 + 证据链构建，给出你的最终推理结论
              </p>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}