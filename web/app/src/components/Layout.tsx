import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getCaseById } from '../data/cases';
import { useState } from 'react';
import CluePanel from './CluePanel';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { playerName, currentCaseId, completedChapters, discoveredClues, exitCase, resetGame } =
    useGameStore();
  const [showClues, setShowClues] = useState(false);

  const caseData = currentCaseId ? getCaseById(currentCaseId) : undefined;
  const totalChapters = caseData?.chapters.length ?? 5;
  const totalClues = caseData?.totalClueCount ?? discoveredClues.length;
  const collectionRate = totalClues > 0 ? Math.round((discoveredClues.length / totalClues) * 100) : 0;

  // 判断当前是否在案件内部页面
  const isInCase = currentCaseId && location.pathname !== '/dashboard';

  const navItems = [
    { path: '/dashboard', label: '案件大厅', icon: '📋' },
    ...(currentCaseId
      ? [{ path: `/case/${currentCaseId}`, label: '工作台', icon: '🔍' }]
      : []),
    ...(isInCase
      ? [
          { path: '/suspects', label: '嫌疑人', icon: '👤' },
          { path: '/reasoning', label: '推理室', icon: '🧩' },
        ]
      : []),
  ];

  const handleLogout = () => {
    if (confirm('确定要退出当前案件吗？进度将保存到本地。')) {
      if (currentCaseId) {
        exitCase();
      }
      resetGame();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 scanline">
      {/* 顶部导航栏 */}
      <header className="bg-dark-800 border-b border-dark-600 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-lg">🛡️</span>
            <span className="text-sm font-bold text-accent">案件协作平台</span>

            {/* 案件内 breadcrumb */}
            {caseData && isInCase && (
              <span className="text-xs text-gray-500 border-l border-dark-500 pl-3 ml-1">
                {caseData.caseNumber} · {caseData.title}
              </span>
            )}

            <nav className="flex items-center gap-1 ml-6">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    location.pathname === item.path
                      ? 'bg-accent/10 text-accent'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* 线索板按钮（仅在案件内部显示） */}
            {isInCase && (
              <button
                onClick={() => setShowClues(!showClues)}
                className="flex items-center gap-1 px-3 py-1.5 rounded text-sm bg-dark-700 border border-dark-500
                  hover:border-accent/50 transition-colors"
              >
                <span>📎</span>
                <span className="text-gray-300">线索板</span>
                <span className="text-accent font-mono text-xs">{collectionRate}%</span>
              </button>
            )}

            {/* 用户信息 */}
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-gray-300">{playerName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-danger text-sm transition-colors"
              title="退出登录"
            >
              ⏻
            </button>
          </div>
        </div>
      </header>

      {/* 进度条（仅在案件内部显示） */}
      {isInCase && (
        <div className="bg-dark-800 border-b border-dark-600">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-4 text-xs">
            <span className="text-gray-500">调查进度：</span>
            <div className="flex-1 h-1.5 bg-dark-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${(completedChapters.length / totalChapters) * 100}%` }}
              />
            </div>
            <span className="text-gray-400 font-mono">
              {completedChapters.length}/{totalChapters} 章
            </span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400 font-mono">
              {discoveredClues.length}/{totalClues} 线索
            </span>
          </div>
        </div>
      )}

      {/* 主内容区 */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* 线索板抽屉 */}
      {showClues && <CluePanel onClose={() => setShowClues(false)} />}
    </div>
  );
}
