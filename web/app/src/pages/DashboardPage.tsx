import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getCaseById } from '../data/cases';

export default function DashboardPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { playerName, completedChapters, discoveredClues, interrogatedSuspects, exitCase } =
    useGameStore();

  const caseData = caseId ? getCaseById(caseId) : undefined;

  if (!caseData) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">❓</div>
        <p className="text-gray-500">案件不存在</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-secondary text-sm mt-4"
        >
          ← 返回案件大厅
        </button>
      </div>
    );
  }

  const allChaptersCompleted = completedChapters.length >= caseData.chapters.length;
  const allSuspectsDone = interrogatedSuspects.length >= caseData.suspects.length;
  const collectionRate = Math.round(
    (discoveredClues.length / caseData.totalClueCount) * 100
  );

  const handleExitCase = () => {
    exitCase();
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6">
      {/* 欢迎栏 */}
      <div className="bg-dark-700 border border-dark-500 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">欢迎回来，{playerName}</h2>
            <p className="text-gray-400 text-sm mt-1">
              案件编号：{caseData.caseNumber} | {caseData.title} | 机密等级：
              <span className="text-danger font-bold">{caseData.classification}级</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">线索收集率</div>
              <div className="text-2xl font-bold text-accent">{collectionRate}%</div>
              <div className="text-xs text-gray-500">
                {discoveredClues.length}/{caseData.totalClueCount} 条线索
              </div>
            </div>
            <button
              onClick={handleExitCase}
              className="btn-secondary text-sm"
            >
              ← 案件大厅
            </button>
          </div>
        </div>
      </div>

      {/* 案件概览 */}
      <div className="bg-dark-800 border border-dark-600 rounded-lg p-5">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          📋 案件概览
        </h3>
        <div className="text-sm text-gray-300 leading-relaxed space-y-2">
          {caseData.keyFacts.map((fact, i) => (
            <p key={i}>
              • {fact.includes('3起') ? (
                <>近三个月内，本市连续发生 <span className="text-danger font-bold">3起女性失踪案</span>，失踪者均为外地务工年轻女性</>
              ) : fact.includes('18天') ? (
                <>作案周期固定为 <span className="text-warning font-bold">每18天1起</span>，预计下次作案时间迫近</>
              ) : (
                <>{fact}</>
              )}
            </p>
          ))}
        </div>
      </div>

      {/* 章节入口 */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          📂 调查任务
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {caseData.chapters.map((ch) => {
            const isCompleted = completedChapters.includes(ch.id);
            const isUnlocked = ch.id === 1 || completedChapters.includes(ch.id - 1);

            return (
              <div
                key={ch.id}
                onClick={() => isUnlocked && navigate(`/investigation/${ch.id}`)}
                className={`card flex items-center justify-between cursor-pointer
                  ${isCompleted ? 'border-green-500/30' : ''}
                  ${!isUnlocked ? 'opacity-40 cursor-not-allowed' : 'hover:border-accent/60'}
                `}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{ch.icon}</span>
                  <div>
                    <div className="font-medium text-white">{ch.title}</div>
                    <div className="text-sm text-gray-400">{ch.subtitle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isCompleted && <span className="text-green-400 text-sm">✅ 已完成</span>}
                  {isUnlocked && !isCompleted && <span className="text-accent text-sm">▶ 进入调查</span>}
                  {!isUnlocked && <span className="text-gray-600 text-sm">🔒 未解锁</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 嫌疑人排查 & 推理室 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => allChaptersCompleted && navigate('/suspects')}
          className={`card cursor-pointer text-center py-8
            ${allChaptersCompleted ? 'hover:border-accent/60' : 'opacity-40 cursor-not-allowed'}
          `}
        >
          <div className="text-4xl mb-3">👤</div>
          <div className="font-bold text-white text-lg">嫌疑人排查</div>
          <div className="text-sm text-gray-400 mt-1">
            {allChaptersCompleted
              ? `${interrogatedSuspects.length}/${caseData.suspects.length} 名嫌疑人已审讯`
              : '完成全部章节后解锁'}
          </div>
        </div>

        <div
          onClick={() => allSuspectsDone && navigate('/reasoning')}
          className={`card cursor-pointer text-center py-8
            ${allSuspectsDone ? 'hover:border-accent/60' : 'opacity-40 cursor-not-allowed'}
          `}
        >
          <div className="text-4xl mb-3">🧩</div>
          <div className="font-bold text-white text-lg">推理室</div>
          <div className="text-sm text-gray-400 mt-1">
            {allSuspectsDone ? '可以进入最终推理' : '审讯全部嫌疑人后解锁'}
          </div>
        </div>
      </div>
    </div>
  );
}
