import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { searchAll } from '../data/searchIndex';
import BrowserFrame from '../components/BrowserFrame';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { recordSearch } = useGameStore();

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      recordSearch(query);
    }
  }, [query, recordSearch]);

  const results = query ? searchAll(query) : [];

  return (
    <BrowserFrame currentUrl={`search.hesou.local/search?q=${encodeURIComponent(query)}`}>
      <div className="max-w-3xl mx-auto p-3 md:p-4">
        {/* 搜索结果头部 */}
        <div className="mb-3 md:mb-4">
          <div className="text-xs md:text-sm text-gray-500 mb-1">
            找到约 {results.length} 条结果
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white rounded-full border border-gray-300 px-3 md:px-4 py-2 flex-1">
              <span className="text-gray-400 mr-2">🔍</span>
              <input
                type="text"
                defaultValue={query}
                className="flex-1 bg-transparent text-sm outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = (e.target as HTMLInputElement).value.trim();
                    if (input) {
                      navigate(`/search/results?q=${encodeURIComponent(input)}`);
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* 筛选标签 */}
        <div className="flex gap-2 md:gap-3 mb-3 md:mb-4 text-xs md:text-sm">
          <span className="text-blue-600 border-b-2 border-blue-600 pb-1 font-medium">全部</span>
          <span className="text-gray-500 active:text-blue-600 cursor-pointer pb-1">论坛</span>
          <span className="text-gray-500 active:text-blue-600 cursor-pointer pb-1">新闻</span>
          <span className="text-gray-500 active:text-blue-600 cursor-pointer pb-1">生活通</span>
        </div>

        {/* 结果列表 */}
        {results.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {results.map((result, i) => (
              <div
                key={i}
                onClick={() => navigate(result.url)}
                className="bg-white rounded-lg border border-gray-100 p-3 md:p-4 cursor-pointer active:bg-gray-50 active:border-gray-200 transition-all"
              >
                <div className="flex items-center gap-1.5 md:gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] md:text-xs px-1 md:px-1.5 py-0.5 rounded font-medium
                    ${result.site === 'forum' ? 'bg-blue-50 text-blue-600' : ''}
                    ${result.site === 'news' ? 'bg-red-50 text-red-600' : ''}
                    ${result.site === 'life' ? 'bg-orange-50 text-orange-600' : ''}
                  `}>
                    {result.siteName}
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-400 truncate">{result.url}</span>
                </div>
                <h3 className="text-sm md:text-base text-blue-700 font-medium">
                  {result.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-1 leading-relaxed line-clamp-2">{result.snippet}</p>
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12 md:py-16">
            <div className="text-3xl md:text-4xl mb-3 md:mb-4">🔍</div>
            <p className="text-sm md:text-base text-gray-500">未找到与 "{query}" 相关的结果</p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">试试其他关键词？</p>
          </div>
        ) : (
          <div className="text-center py-12 md:py-16">
            <div className="text-3xl md:text-4xl mb-3 md:mb-4">🔍</div>
            <p className="text-sm md:text-base text-gray-500">请输入搜索关键词</p>
          </div>
        )}
      </div>
    </BrowserFrame>
  );
}