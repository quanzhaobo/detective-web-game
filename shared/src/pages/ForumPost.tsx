import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getForumPostById } from '../data/forum';
import MarkButton from '../components/MarkButton';
import BrowserFrame from '@platform/browser-frame';

export default function ForumPost() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const recordPageVisit = useGameStore((s) => s.recordPageVisit);

  const post = postId ? getForumPostById(postId) : undefined;

  useEffect(() => {
    if (post) {
      recordPageVisit(`forum-post-${post.id}`);
    }
  }, [post, recordPageVisit]);

  if (!post) {
    return (
      <BrowserFrame currentUrl="forum.qf推理.local">
        <div className="max-w-3xl mx-auto p-8 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-500">帖子不存在或已被删除</p>
          <button onClick={() => navigate('/forum')} className="text-blue-500 mt-4 text-sm hover:underline">
            ← 返回论坛首页
          </button>
        </div>
      </BrowserFrame>
    );
  }

  const pageId = `forum-post-${post.id}`;
  const sourceUrl = `/forum/post/${post.id}`;

  return (
    <BrowserFrame currentUrl={`forum.qf推理.local/thread-${post.id}`} title={post.title}>
      <div className="max-w-3xl mx-auto p-3 md:p-4">
        {/* 面包屑 */}
        <div className="text-xs text-gray-500 mb-3 md:mb-4">
          <button onClick={() => navigate('/forum')} className="hover:text-blue-600 active:text-blue-800">
            清风论坛
          </button>
          <span className="mx-1">›</span>
          <span>{post.board}</span>
          <span className="mx-1">›</span>
          <span className="text-gray-700">阅读帖子</span>
        </div>

        {/* 帖子主体 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* 帖子头部 */}
          <div className="p-4 md:p-5 border-b border-gray-100">
            <h1 className="text-base md:text-lg font-bold text-gray-900">{post.title}</h1>
            <div className="flex items-center gap-2 md:gap-3 mt-2 text-xs md:text-sm text-gray-500">
              <span className="text-lg md:text-xl">{post.avatar}</span>
              <span className="font-medium text-gray-700">{post.author}</span>
              <span className="hidden md:inline">发表于 {post.date}</span>
              <span className="md:hidden">{post.date}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[10px] md:text-xs bg-blue-50 text-blue-600 px-1.5 md:px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
              <span className="text-[10px] md:text-xs text-gray-400">
                {post.views.toLocaleString()} 阅读 · {post.replies.length} 回复
              </span>
            </div>
          </div>

          {/* 帖子正文 */}
          <div className="p-4 md:p-5">
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>

            {/* 标记按钮：post.clueIds 为空时照样可标记，但会算作无效标记 */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <MarkButton
                blockId={`post-${post.id}-content`}
                content={post.content}
                clueIds={post.clueIds}
                sourcePageId={pageId}
                sourceTitle={post.title}
                sourceUrl={sourceUrl}
                className="w-full justify-center md:w-auto"
              />
            </div>
          </div>
        </div>

        {/* 回复列表 */}
        {post.replies.length > 0 && (
          <div className="mt-3 md:mt-4">
            <h3 className="text-xs md:text-sm font-bold text-gray-600 mb-2 md:mb-3">
              💬 全部回复（{post.replies.length}）
            </h3>
            <div className="space-y-2 md:space-y-3">
              {post.replies.map((reply) => (
                <div key={reply.id} className="bg-white rounded-lg border border-gray-100 p-3 md:p-4">
                  <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                    <span className="text-base md:text-lg">{reply.avatar}</span>
                    <span className="text-xs md:text-sm font-medium text-gray-700">{reply.author}</span>
                    <span className="text-[10px] md:text-xs text-gray-400">{reply.date}</span>
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 leading-relaxed">{reply.text}</div>
                  <div className="mt-2 pt-2 border-t border-gray-50">
                    <MarkButton
                      blockId={`reply-${reply.id}`}
                      content={reply.text}
                      clueIds={reply.clueId ? [reply.clueId] : []}
                      sourcePageId={pageId}
                      sourceTitle={`回复: ${post.title}`}
                      sourceUrl={`${sourceUrl}#${reply.id}`}
                      markLabel="标记"
                      markedLabel="已标记"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BrowserFrame>
  );
}
