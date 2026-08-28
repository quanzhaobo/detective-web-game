import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { CASES, type CaseData, type CaseClassification, type CaseStatus } from '../data/cases';

const CLASSIFICATION_COLORS: Record<CaseClassification, string> = {
  A: 'border-l-danger',
  B: 'border-l-warning',
  C: 'border-l-accent',
};

const CLASSIFICATION_BADGE: Record<CaseClassification, string> = {
  A: 'bg-danger/20 text-danger',
  B: 'bg-warning/20 text-warning',
  C: 'bg-accent/20 text-accent',
};

const STATUS_LABELS: Record<CaseStatus, { text: string; className: string }> = {
  active: { text: '进行中', className: 'bg-green-500/20 text-green-400' },
  cold: { text: '冷案', className: 'bg-gray-500/20 text-gray-400' },
  closed: { text: '已结', className: 'bg-accent/20 text-accent' },
};

function CaseCard({ caseData }: { caseData: CaseData }) {
  const navigate = useNavigate();
  const { caseProgress, enterCase } = useGameStore();
  const progress = caseProgress[caseData.id];

  const hasProgress = progress && progress.completedChapters.length > 0;
  const chapterProgress = hasProgress
    ? Math.round((progress.completedChapters.length / caseData.chapters.length) * 100)
    : 0;
  const clueProgress = hasProgress
    ? `${progress.discoveredClues.length}/${caseData.totalClueCount}`
    : `0/${caseData.totalClueCount}`;

  const handleEnter = () => {
    enterCase(caseData.id);
    navigate(`/case/${caseData.id}`);
  };

  const borderColor = CLASSIFICATION_COLORS[caseData.classification];
  const badgeColor = CLASSIFICATION_BADGE[caseData.classification];
  const statusInfo = STATUS_LABELS[caseData.status];

  return (
    <div
      onClick={handleEnter}
      className={`bg-dark-700 border border-dark-500 border-l-4 ${borderColor} rounded-lg
        hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all cursor-pointer group`}
    >
      <div className="p-5">
        {/* 顶部：编号 + 状态 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500">{caseData.caseNumber}</span>
            <span className={`text-xs px-2 py-0.5 rounded font-bold ${badgeColor}`}>
              {caseData.classification}级
            </span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        </div>

        {/* 标题 */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{caseData.coverEmoji}</span>
          <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">
            {caseData.title}
          </h3>
        </div>

        {/* 概要 */}
        <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
          {caseData.summary}
        </p>

        {/* 底部统计 */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-500">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>📂 {caseData.chapters.length} 章节</span>
            <span>👤 {caseData.suspects.length} 嫌疑人</span>
            <span>📎 {clueProgress} 线索</span>
          </div>

          {hasProgress ? (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-dark-500 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${chapterProgress}%` }}
                />
              </div>
              <span className="text-xs text-accent font-mono">{chapterProgress}%</span>
            </div>
          ) : (
            <span className="text-xs text-accent group-hover:translate-x-1 transition-transform">
              进入调查 →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CaseListPage() {
  const { playerName, caseProgress } = useGameStore();

  const activeCases = CASES.filter((c) => c.status === 'active');
  const otherCases = CASES.filter((c) => c.status !== 'active');
  const participatedCount = Object.keys(caseProgress).filter((id) => {
    const p = caseProgress[id];
    return p && (p.completedChapters.length > 0 || p.discoveredClues.length > 0);
  }).length;

  return (
    <div className="space-y-6">
      {/* 欢迎栏 */}
      <div className="bg-dark-700 border border-dark-500 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              欢迎回来，{playerName}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              案件协作平台 · 选择一个案件进入调查工作台
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">已参与案件</div>
            <div className="text-2xl font-bold text-accent">{participatedCount}</div>
            <div className="text-xs text-gray-500">共 {CASES.length} 个案件</div>
          </div>
        </div>
      </div>

      {/* 进行中案件 */}
      {activeCases.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            🔴 进行中案件
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCases.map((c) => (
              <CaseCard key={c.id} caseData={c} />
            ))}
          </div>
        </div>
      )}

      {/* 其他案件 */}
      {otherCases.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            📁 案件档案
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherCases.map((c) => (
              <CaseCard key={c.id} caseData={c} />
            ))}
          </div>
        </div>
      )}

      {/* 空状态（未来无案件时） */}
      {CASES.length === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📂</div>
          <p className="text-gray-500">暂无可用案件</p>
        </div>
      )}
    </div>
  );
}
