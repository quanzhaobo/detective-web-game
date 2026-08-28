import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { FORUM_POSTS, COLLECTION_BOX_POST, getForumPostsByBoard } from '../data/forum';
import BrowserFrame from '../components/BrowserFrame';

export default function ForumHome() {
  const navigate = useNavigate();
  const { recordPageVisit, hasSeenHotPosts, markHotPostsSeen, currentPhase } = useGameStore();

  useEffect(() => { recordPageVisit('forum'); }, [recordPageVisit]);

  const hotPosts = FORUM_POSTS.filter((p) => p.board === '案件热议');
  const reasoningPosts = getForumPostsByBoard('推理交流');
  const noticePosts = [COLLECTION_BOX_POST];

  return (
    <BrowserFrame currentUrl="forum.qf推理.local" title="清风推理论坛">
      <div className="max-w-4xl mx-auto p-3 md:p-4">
        {/* 论坛头部 */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-t-lg p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold">💬 清风推理论坛</h1>
          <p className="text-blue-200 text-xs md:text-sm mt-1">鹤城推理爱好者社区 — 以理服人，以据求真</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 md:mt-3 text-xs md:text-sm">
            <span>今日：<strong>1,258</strong> 帖</span>
            <span>昨日：<strong>2,341</strong> 帖</span>
            <span>会员：<strong>15,672</strong></span>
          </div>
        </div>

        {/* 板块导航 */}
        <div className="bg-white border-x border-b border-gray-200 p-3 md:p-4">
          <div className="flex gap-2 mb-3 md:mb-4 text-xs md:text-sm">
            <span className="text-gray-600">📂</span>
            <a href="#" className="text-gray-600 hover:text-blue-600">清风论坛</a>
            <span className="text-gray-400">›</span>
            <span className="text-gray-800 font-medium">论坛首页</span>
          </div>

          {/* 公告区 */}
          {noticePosts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase">📢 公告区</h3>
              {noticePosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/forum/post/${post.id}`)}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2 cursor-pointer hover:bg-yellow-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded font-bold">公告</span>
                    <span className="text-sm font-medium text-gray-800">{post.title}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {post.author} · {post.date} · {post.views.toLocaleString()} 阅读
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 案件热议区 */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase">
              🔥 案件热议
              {!hasSeenHotPosts && (
                <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded animate-pulse">NEW</span>
              )}
            </h3>
            <div className="space-y-2">
              {hotPosts.map((post) => (
                <ForumPostItem
                  key={post.id}
                  post={post}
                  onClick={() => {
                    markHotPostsSeen();
                    navigate(`/forum/post/${post.id}`);
                  }}
                />
              ))}
            </div>
          </div>

          {/* 推理交流区 */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase">🔍 推理交流</h3>
            <div className="space-y-2">
              {reasoningPosts.map((post) => (
                <ForumPostItem
                  key={post.id}
                  post={post}
                  onClick={() => navigate(`/forum/post/${post.id}`)}
                />
              ))}
            </div>
          </div>

          {/* 收集箱入口（Phase 2 高亮） */}
          {currentPhase >= 1 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div
                onClick={() => navigate('/collection-box')}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">📥</span>
                  <div>
                    <div className="font-bold text-blue-800">专案组民间线索收集箱</div>
                    <div className="text-xs text-blue-600 mt-0.5">
                      点击进入提交线索 → {currentPhase >= 2 ? '（已解锁）' : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BrowserFrame>
  );
}

function ForumPostItem({ post, onClick }: { post: typeof FORUM_POSTS[0]; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-lg p-3 md:p-4 cursor-pointer hover:border-blue-200 hover:shadow-sm active:bg-gray-50 transition-all group"
    >
      <div className="flex items-start gap-2 md:gap-3">
        <div className="text-xl md:text-2xl shrink-0">{post.avatar}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
            {post.title}
          </h4>
          <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1 text-[10px] md:text-xs text-gray-500">
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 mt-1 md:mt-2 flex-wrap">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[10px] md:text-xs bg-gray-100 text-gray-500 px-1 md:px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right text-[10px] md:text-xs text-gray-400 shrink-0">
          <div>{post.replies.length} 回复</div>
          <div className="hidden md:block">{post.views.toLocaleString()} 阅读</div>
        </div>
      </div>
    </div>
  );
}