import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { NEWS_ARTICLES, NEWS_CATEGORIES } from '../data/news';
import BrowserFrame from '@platform/browser-frame';

const CATEGORY_LABEL: Record<string, string> = {
  police: '警方通报',
  investigation: '案件调查',
  society: '社会新闻',
};

export default function NewsHome() {
  const navigate = useNavigate();
  const recordPageVisit = useGameStore((s) => s.recordPageVisit);
  const [category, setCategory] = useState('all');

  useEffect(() => { recordPageVisit('news'); }, [recordPageVisit]);

  const articles =
    category === 'all' ? NEWS_ARTICLES : NEWS_ARTICLES.filter((a) => a.category === category);

  return (
    <BrowserFrame currentUrl="news.hecheng.local" title="鹤城新闻网">
      <div className="max-w-4xl mx-auto p-3 md:p-4">
        {/* 新闻头部 */}
        <div className="bg-gradient-to-r from-red-700 to-red-800 text-white rounded-t-lg p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold">📰 鹤城新闻网</h1>
          <p className="text-red-200 text-xs md:text-sm mt-1">鹤城最权威的新闻资讯平台</p>
        </div>

        {/* 导航 */}
        <div className="bg-white border-x border-b border-gray-200">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {NEWS_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm whitespace-nowrap shrink-0 transition-colors
                  ${category === cat.id
                    ? 'text-red-600 font-medium border-b-2 border-red-600'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* 新闻列表 */}
          <div className="p-2 md:p-4">
            {articles.length === 0 ? (
              <p className="text-xs md:text-sm text-gray-400 text-center py-8">该分类暂无报道</p>
            ) : (
              <div className="space-y-0">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => navigate(`/news/article/${article.id}`)}
                    className="flex items-start gap-3 md:gap-4 p-3 md:p-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-bold text-gray-900 hover:text-red-600 transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2">
                        {article.content[1]?.text || ''}
                      </p>
                      <div className="flex items-center gap-2 md:gap-3 mt-1.5 md:mt-2 text-[10px] md:text-xs text-gray-400 flex-wrap">
                        <span className="text-red-500 font-medium">{article.source}</span>
                        <span className="hidden md:inline">{article.author}</span>
                        <span>{article.date}</span>
                        <span className="bg-gray-100 text-gray-500 px-1 md:px-1.5 py-0.5 rounded">
                          {CATEGORY_LABEL[article.category] ?? '社会新闻'}
                        </span>
                        {article.clueIds.length > 0 && (
                          <span className="text-yellow-600">💡 {article.clueIds.length}条线索</span>
                        )}
                      </div>
                    </div>
                    {article.clueIds.length > 0 && (
                      <div className="shrink-0 mt-1">
                        <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full" title="包含线索" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
