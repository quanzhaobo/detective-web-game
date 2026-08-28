import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getSearchSuggestions } from '../data/searchIndex';

interface BrowserFrameProps {
  children: React.ReactNode;
  currentUrl: string;
  title?: string;
}

export default function BrowserFrame({ children, currentUrl: _currentUrl, title }: BrowserFrameProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchHistory, visitedPages, recordSearch, setCurrentUrl, markedFragments, teamUnlocked } = useGameStore();
  const [searchInput, setSearchInput] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // 设置页面标题
  useEffect(() => {
    if (title) {
      document.title = `${title} - 暗网追凶`;
    } else {
      document.title = '暗网追凶 - 论坛推理版';
    }
  }, [title]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const query = searchInput.trim();
      if (query) {
        recordSearch(query);
        setShowMobileSearch(false);
        navigate(`/search/results?q=${encodeURIComponent(query)}`);
      }
    },
    [searchInput, navigate, recordSearch]
  );

  const handleNavClick = useCallback(
    (url: string) => {
      setCurrentUrl(url);
      setShowMoreMenu(false);
      navigate(url);
    },
    [navigate, setCurrentUrl]
  );

  const canGoBack = location.pathname !== '/';

  // 搜索建议（历史记录 + 基于已访问站点的关键词推荐）
  const suggestions = searchInput
    ? [
        ...searchHistory.filter((h) => h.includes(searchInput)).slice(0, 3),
        ...getSearchSuggestions(searchInput, visitedPages),
      ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 5)
    : [];

  // 论坛红点：仅在玩家尚未访问论坛时显示
  const showForumBadge = !visitedPages.some((p) => p.startsWith('forum-post-'));

  // 当前页面标题（顶部显示）
  const getPageTitle = () => {
    if (title) return title;
    const path = location.pathname;
    if (path === '/') return '鹤搜';
    if (path.startsWith('/forum/post/')) return '帖子详情';
    if (path.startsWith('/forum')) return '清风论坛';
    if (path.startsWith('/news/article/')) return '新闻详情';
    if (path.startsWith('/news')) return '鹤城新闻';
    if (path.startsWith('/life/profile/')) return '人物资料';
    if (path.startsWith('/life/place/')) return '地点详情';
    if (path.startsWith('/life')) return '生活通';
    if (path === '/clueboard') return '线索板';
    if (path === '/collection-box') return '收集箱';
    if (path.startsWith('/team/investigation/')) return '案件档案';
    if (path === '/team/suspects') return '审讯记录';
    if (path === '/team/reasoning') return '最终推理';
    if (path.startsWith('/team')) return '专案组工作台';
    if (path.startsWith('/search')) return '搜索结果';
    if (path === '/ending') return '结局';
    return '暗网追凶';
  };

  // 当前激活的 Tab
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/forum')) return 'forum';
    if (path.startsWith('/news')) return 'news';
    if (path.startsWith('/life')) return 'life';
    return 'more';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ===== H5 顶部导航栏 ===== */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center h-12 px-3">
          {/* 左侧：返回按钮 */}
          {canGoBack ? (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-10 h-10 flex items-center justify-center">
              <span className="text-lg">🔍</span>
            </div>
          )}

          {/* 中间：页面标题 */}
          <div className="flex-1 text-center">
            <h1 className="text-base font-semibold text-gray-800 truncate px-2">
              {getPageTitle()}
            </h1>
          </div>

          {/* 右侧：搜索按钮 */}
          <button
            onClick={() => setShowMobileSearch(true)}
            className="flex items-center justify-center w-10 h-10 -mr-2 rounded-full active:bg-gray-100"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ===== H5 搜索面板（全屏覆盖） ===== */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-[100] bg-white">
          <div className="flex items-center h-12 px-3 border-b border-gray-200">
            <button
              onClick={() => { setShowMobileSearch(false); setSearchInput(''); }}
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <form onSubmit={handleSearch} className="flex-1 mx-2">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
                <span className="text-gray-400 mr-2 text-sm">🔍</span>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="在鹤搜中搜索..."
                  className="flex-1 bg-transparent text-base text-gray-700 placeholder-gray-400 outline-none"
                  autoFocus
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    className="text-gray-400 ml-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>
            <button
              onClick={handleSearch as any}
              className="text-blue-500 text-sm font-medium px-2"
            >
              搜索
            </button>
          </div>
          {/* 搜索建议 */}
          {suggestions.length > 0 && (
            <div className="px-4 py-2">
              <div className="text-xs text-gray-400 mb-2">搜索历史</div>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSearchInput(s);
                    recordSearch(s);
                    setShowMobileSearch(false);
                    navigate(`/search/results?q=${encodeURIComponent(s)}`);
                  }}
                  className="w-full text-left px-3 py-3 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 rounded-lg active:bg-gray-100"
                >
                  <span className="text-gray-400">🕐</span> {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== 页面内容 ===== */}
      <div className="flex-1 pb-16">
        {children}
      </div>

      {/* ===== H5 底部 TabBar ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-[480px] bg-white border-t border-gray-200 pb-safe">
        <div className="flex items-center h-14">
          <TabBarItem
            icon="🏠"
            label="鹤搜"
            active={getActiveTab() === 'home'}
            onClick={() => handleNavClick('/')}
          />
          <TabBarItem
            icon="💬"
            label="论坛"
            active={getActiveTab() === 'forum'}
            onClick={() => handleNavClick('/forum')}
            badge={showForumBadge}
          />
          <TabBarItem
            icon="📰"
            label="新闻"
            active={getActiveTab() === 'news'}
            onClick={() => handleNavClick('/news')}
          />
          <TabBarItem
            icon="🏪"
            label="生活通"
            active={getActiveTab() === 'life'}
            onClick={() => handleNavClick('/life')}
          />
          <TabBarItem
            icon="📋"
            label="更多"
            active={getActiveTab() === 'more'}
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            badge={markedFragments.length > 0}
            badgeCount={markedFragments.length}
          />
        </div>
      </div>

      {/* ===== H5 "更多"菜单面板 ===== */}
      {showMoreMenu && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setShowMoreMenu(false)}
          />
          {/* 菜单面板 */}
          <div className="fixed bottom-14 left-0 right-0 z-50 mx-auto w-full max-w-[480px] bg-white rounded-t-2xl shadow-2xl border-t border-gray-200">
            <div className="p-2 pb-4">
              {/* 拖拽指示器 */}
              <div className="flex justify-center mb-3">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <MoreMenuItem
                  icon="📋"
                  label={`线索板(${markedFragments.length})`}
                  active={location.pathname === '/clueboard'}
                  onClick={() => handleNavClick('/clueboard')}
                />
                <MoreMenuItem
                  icon="📥"
                  label="收集箱"
                  active={location.pathname === '/collection-box'}
                  onClick={() => handleNavClick('/collection-box')}
                />
                {teamUnlocked && (
                  <MoreMenuItem
                    icon="🔬"
                    label="专案组"
                    active={location.pathname.startsWith('/team')}
                    onClick={() => handleNavClick('/team')}
                    highlight={true}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ===== H5 TabBar 项 ===== */
function TabBarItem({
  icon,
  label,
  active,
  onClick,
  badge,
  badgeCount,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: boolean;
  badgeCount?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 flex flex-col items-center justify-center h-full gap-0.5 transition-colors
        ${active ? 'text-blue-600' : 'text-gray-500'}
      `}
    >
      <span className="text-xl leading-none">{icon}</span>
      <span className="text-[10px] leading-none">{label}</span>
      {badge && badgeCount !== undefined && badgeCount > 0 && (
        <span className="absolute top-1 right-1/4 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
      {badge && badgeCount === undefined && (
        <span className="absolute top-1.5 right-1/3 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  );
}

/* ===== H5 "更多"菜单项 ===== */
function MoreMenuItem({
  icon,
  label,
  active,
  onClick,
  highlight,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors active:bg-gray-100
        ${active
          ? 'bg-blue-50 text-blue-600'
          : highlight
          ? 'bg-orange-50 text-orange-600'
          : 'text-gray-700 hover:bg-gray-50'
        }
      `}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  );
}
