import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getProfileById, type ReviewEntry } from '../data/profiles';
import MarkButton from '../components/MarkButton';
import BrowserFrame from '@platform/browser-frame';

export default function ProfilePage() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const recordPageVisit = useGameStore((s) => s.recordPageVisit);

  const profile = profileId ? getProfileById(profileId) : undefined;

  useEffect(() => {
    if (profile) {
      recordPageVisit(`profile-${profile.id}`);
    }
  }, [profile, recordPageVisit]);

  if (!profile) {
    return (
      <BrowserFrame currentUrl="life.hecheng.local">
        <div className="max-w-3xl mx-auto p-8 text-center">
          <div className="text-4xl mb-4">🧑</div>
          <p className="text-gray-500">人物资料不存在</p>
          <button onClick={() => navigate('/life')} className="text-blue-500 mt-4 text-sm hover:underline">
            ← 返回生活通
          </button>
        </div>
      </BrowserFrame>
    );
  }

  const pageId = `profile-${profile.id}`;
  const sourceTitle = `${profile.name} - 人物资料`;
  const sourceUrl = `/life/profile/${profile.id}`;

  // 统一构造可标记块；线索由数据层声明，页面不再做关键词猜测
  const mark = (blockId: string, content: string, clueIds?: readonly string[]) => (
    <MarkButton
      blockId={blockId}
      content={content}
      clueIds={clueIds}
      sourcePageId={pageId}
      sourceTitle={sourceTitle}
      sourceUrl={sourceUrl}
      markLabel="标记"
      markedLabel="已标记"
      compact
    />
  );

  const renderReviews = (entries: ReviewEntry[], kind: 'neighbor' | 'colleague') =>
    entries.map((entry, i) => {
      const blockId = `${profile.id}-${kind}-${i}`;
      return (
        <div key={blockId} className="mt-1">
          <div className="text-xs md:text-sm text-gray-600 bg-gray-50 rounded p-2 italic">
            "{entry.text}"
          </div>
          {mark(blockId, entry.text, entry.clueIds)}
        </div>
      );
    });

  return (
    <BrowserFrame currentUrl={`life.hecheng.local/profile/${profile.id}`} title={sourceTitle}>
      <div className="max-w-3xl mx-auto p-3 md:p-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* 头部 */}
          <div className="p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-orange-100 flex items-center justify-center text-2xl md:text-3xl border-2 border-orange-200 shrink-0">
                {profile.suspectId || '👤'}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold text-gray-900">{profile.name}</h1>
                <div className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1 truncate">
                  {profile.occupation} · {profile.workplace}
                </div>
              </div>
            </div>
          </div>

          {/* 基本信息 */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <h2 className="text-xs md:text-sm font-bold text-gray-500 uppercase mb-2 md:mb-3">📋 基本信息</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 text-xs md:text-sm">
              <InfoItem label="姓名" value={profile.name} />
              <InfoItem label="性别" value={profile.gender} />
              <InfoItem label="年龄" value={`${profile.age}岁`} />
              <InfoItem label="籍贯" value={profile.origin} />
              <InfoItem label="身高" value={profile.height} />
              <InfoItem label="惯用手" value={profile.handedness} />
              <InfoItem label="居住地" value={profile.residence} />
              <InfoItem label="车辆" value={profile.vehicle} />
              <InfoItem label="家庭" value={profile.familyStatus} />
            </div>
          </div>

          {/* 职业信息 */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <h2 className="text-xs md:text-sm font-bold text-gray-500 uppercase mb-2 md:mb-3">💼 职业信息</h2>
            <div className="text-xs md:text-sm text-gray-700 space-y-1.5 md:space-y-2">
              <p><span className="text-gray-500">单位：</span>{profile.workplace}</p>
              <p><span className="text-gray-500">职务：</span>{profile.occupation}</p>
              <p><span className="text-gray-500">性格：</span>{profile.personality}</p>
            </div>
            <div className="mt-2">
              {mark(
                `${profile.id}-occupation`,
                `${profile.occupation} · ${profile.workplace} · ${profile.personality}`,
                profile.occupationClueIds
              )}
            </div>
          </div>

          {/* 社交评价 */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <h2 className="text-xs md:text-sm font-bold text-gray-500 uppercase mb-2 md:mb-3">💬 社交评价</h2>
            {profile.neighborReviews.length > 0 && (
              <div className="mb-3">
                <span className="text-[10px] md:text-xs text-gray-500 font-medium">邻居评价：</span>
                {renderReviews(profile.neighborReviews, 'neighbor')}
              </div>
            )}
            {profile.colleagueReviews.length > 0 && (
              <div className="mb-3">
                <span className="text-[10px] md:text-xs text-gray-500 font-medium">同事评价：</span>
                {renderReviews(profile.colleagueReviews, 'colleague')}
              </div>
            )}
            {profile.spouseReview && (
              <div>
                <span className="text-[10px] md:text-xs text-gray-500 font-medium">配偶（社区走访记录）：</span>
                <div className="mt-1 text-xs md:text-sm text-gray-600 bg-gray-50 rounded p-2 italic">
                  "{profile.spouseReview.text}"
                </div>
                {mark(`${profile.id}-spouse`, profile.spouseReview.text, profile.spouseReview.clueIds)}
              </div>
            )}
          </div>

          {/* 时间线 */}
          <div className="p-4 md:p-6">
            <h2 className="text-xs md:text-sm font-bold text-gray-500 uppercase mb-2 md:mb-3">🕐 案发时段时间线</h2>
            <div className="space-y-2 md:space-y-3">
              {profile.timeline.map((entry, i) => {
                const blockId = `${profile.id}-timeline-${i}`;
                return (
                  <div key={blockId} className="flex gap-2 md:gap-3">
                    <div className="text-[10px] md:text-xs text-gray-500 font-mono w-20 md:w-24 shrink-0 pt-0.5">{entry.date}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs md:text-sm text-gray-700">{entry.event}</div>
                      <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1 flex-wrap">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${entry.verifiable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {entry.verifiable ? '✓ 可验证' : '✗ 无法验证'}
                        </span>
                        {mark(blockId, entry.event)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded p-2">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-sm font-medium text-gray-800">{value}</div>
    </div>
  );
}
