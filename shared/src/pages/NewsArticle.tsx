import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getNewsArticleById } from '../data/news';
import MarkButton from '../components/MarkButton';
import BrowserFrame from '@platform/browser-frame';

export default function NewsArticle() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const recordPageVisit = useGameStore((s) => s.recordPageVisit);

  const article = articleId ? getNewsArticleById(articleId) : undefined;

  useEffect(() => {
    if (article) {
      recordPageVisit(`news-${article.id}`);
    }
  }, [article, recordPageVisit]);

  if (!article) {
    return (
      <BrowserFrame currentUrl="news.hecheng.local">
        <div className="max-w-3xl mx-auto p-8 text-center">
          <div className="text-4xl mb-4">📰</div>
          <p className="text-gray-500">文章不存在</p>
          <button onClick={() => navigate('/news')} className="text-blue-500 mt-4 text-sm hover:underline">
            ← 返回新闻首页
          </button>
        </div>
      </BrowserFrame>
    );
  }

  const pageId = `news-${article.id}`;
  const sourceUrl = `/news/article/${article.id}`;

  return (
    <BrowserFrame currentUrl={`news.hecheng.local/article/${article.id}`} title={article.title}>
      <div className="max-w-3xl mx-auto p-3 md:p-4">
        {/* 文章 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* 头部 */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <div className="text-xs text-red-500 font-medium mb-1.5 md:mb-2">{article.source}</div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-snug">{article.title}</h1>
            <div className="flex items-center gap-2 md:gap-3 mt-2 md:mt-3 text-xs md:text-sm text-gray-500 flex-wrap">
              <span>{article.author}</span>
              <span>{article.date}</span>
              <span className="bg-gray-100 px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs">
                {article.category === 'police' ? '警方通报' : article.category === 'investigation' ? '案件调查' : '社会新闻'}
              </span>
            </div>
          </div>

          {/* 正文 */}
          <div className="p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              {article.content.map((block) => {
                const blockId = `news-${article.id}-${block.id}`;

                if (block.type === 'heading') {
                  return (
                    <h3 key={block.id} className="text-base font-bold text-gray-800 pt-2">
                      {block.text}
                    </h3>
                  );
                }

                const mark = (
                  <div className="mt-1">
                    <MarkButton
                      blockId={blockId}
                      content={block.text}
                      clueIds={block.clueId ? [block.clueId] : []}
                      sourcePageId={pageId}
                      sourceTitle={article.title}
                      sourceUrl={sourceUrl}
                    />
                  </div>
                );

                if (block.type === 'quote') {
                  return (
                    <div key={block.id} className="relative">
                      <blockquote className="border-l-4 border-red-400 pl-4 py-2 bg-red-50 rounded-r text-sm text-gray-600 italic">
                        {block.text}
                      </blockquote>
                      {mark}
                    </div>
                  );
                }

                return (
                  <div key={block.id}>
                    <p className="text-sm text-gray-700 leading-relaxed">{block.text}</p>
                    {mark}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 相关报道 */}
          {article.relatedArticles.length > 0 && (
            <div className="border-t border-gray-100 p-4 md:p-6 bg-gray-50 rounded-b-lg">
              <h3 className="text-xs md:text-sm font-bold text-gray-600 mb-2 md:mb-3">📎 相关报道</h3>
              <div className="space-y-2">
                {article.relatedArticles.map((relId) => {
                  const relArticle = getNewsArticleById(relId);
                  if (!relArticle) return null;
                  return (
                    <button
                      key={relId}
                      onClick={() => navigate(`/news/article/${relId}`)}
                      className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {relArticle.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </BrowserFrame>
  );
}
