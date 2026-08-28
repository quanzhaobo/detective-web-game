import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getSearchSuggestions } from '../data/searchIndex';

interface BrowserFrameProps {
  children: React.ReactNode;
  currentUrl: string;
  title?: string;
}

export default function BrowserFrame({ children, currentUrl, title }: BrowserFrameProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchHistory, visitedPages, recordSearch, setCurrentUrl, markedFragments, teamUnlocked } = useGameStore();
  const [searchInput, setSearchInput] = useState('');

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
        navigate(`/search/results?q=${encodeURIComponent(query)}`);
      }
    },
    [searchInput, navigate, recordSearch]
  );

  const handleNavClick = useCallback(
    (url: string) => {
      setCurrentUrl(url);
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ===== 桌面端浏览器顶部栏 ===== */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        {/* 标签栏 */}
        <div className="flex items-center px-3 py-1.5 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4">
            <div className="flex items-center bg-white rounded-md px-3 py-1 border border-gray-300 text-xs text-gray-600">
              <span className="mr-2">🔒</span>
              <span className="truncate">{currentUrl}</span>
            </div>
          </div>
        </div>

        {/* 导航栏 */}
        <div className="flex items-center px-3 py-2 gap-2">
          <button
            onClick={() => navigate(-1)}
            disabled={!canGoBack}
            className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
            title="后退"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => navigate(1)}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            title="前进"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <div className="flex items-center bg-white rounded-full border border-gray-300 px-3 py-1.5 focus-within:border-blue-400 focus-within:shadow-sm transition-all">
              <span className="text-gray-400 mr-2">🔍</span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="在鹤搜中搜索..."
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="text-gray-400 hover:text-gray-600 ml-1"
                >
                  ✕
                </button>
              )}
            </div>
            {/* 搜索建议 */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSearchInput(s);
                      recordSearch(s);
                      navigate(`/search/results?q=${encodeURIComponent(s)}`);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="text-gray-400">🕐</span> {s}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* 书签栏 */}
        <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 border-t border-gray-200 overflow-x-auto">
          <BookmarkButton
            onClick={() => handleNavClick('/')}
            active={location.pathname === '/'}
            icon="🏠"
            label="鹤搜"
          />
          <BookmarkButton
            onClick={() => handleNavClick('/forum')}
            active={location.pathname.startsWith('/forum')}
            icon="💬"
            label="清风论坛"
            hasNew={showForumBadge}
          />
          <BookmarkButton
            onClick={() => handleNavClick('/news')}
            active={location.pathname.startsWith('/news')}
            icon="📰"
            label="鹤城新闻"
          />
          <BookmarkButton
            onClick={() => handleNavClick('/life')}
            active={location.pathname.startsWith('/life')}
            icon="🏪"
            label="生活通"
          />
          <span className="text-gray-300 mx-1">|</span>
          <BookmarkButton
            onClick={() => handleNavClick('/clueboard')}
            active={location.pathname === '/clueboard'}
            icon="📋"
            label={`线索板(${markedFragments.length})`}
          />
          <BookmarkButton
            onClick={() => handleNavClick('/collection-box')}
            active={location.pathname === '/collection-box'}
            icon="📥"
            label="收集箱"
          />
          {teamUnlocked && (
            <BookmarkButton
              onClick={() => handleNavClick('/team')}
              active={location.pathname.startsWith('/team')}
              icon="🔬"
              label="专案组工作台"
              highlight={true}
            />
          )}
        </div>
      </div>

      {/* ===== 页面内容 ===== */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

/* ===== 桌面端书签按钮 ===== */
function BookmarkButton({
  onClick,
  active,
  icon,
  label,
  hasNew,
  highlight,
}: {
  onClick: () => void;
  active: boolean;
  icon: string;
  label: string;
  hasNew?: boolean;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1 px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-colors
        ${active
          ? 'bg-blue-50 text-blue-600 font-medium'
          : highlight
          ? 'bg-orange-50 text-orange-600 border border-orange-200'
          : 'text-gray-600 hover:bg-gray-200'
        }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {hasNew && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  );
}
