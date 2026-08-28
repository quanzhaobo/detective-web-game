import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore, PROFILE_CLUE_MAP, VALID_CLUE_IDS } from '../store/gameStore';
import { getProfileById } from '../data/profiles';
import BrowserFrame from '../components/BrowserFrame';

export default function ProfilePage() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { recordPageVisit, markFragment, unmarkFragment, isFragmentMarked } = useGameStore();

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

  const profileClueIds = PROFILE_CLUE_MAP[profile.id] || [];

  // 根据区块内容匹配对应的线索ID
  const getClueIdForBlock = (blockText: string): string | undefined => {
    for (const clueId of profileClueIds) {
      if (blockText.includes(clueId === 'E05' ? '种植园' :
        clueId === 'F04' ? '酒精' :
        clueId === 'F05' ? '口罩' :
        clueId === 'S03' ? 'SUV' :
        clueId === 'P02' ? '较真' :
        clueId === 'F03' ? '骨骼关节' : '')) {
        return clueId;
      }
    }
    return undefined;
  };

  const createMarkAction = (blockId: string, text: string, clueId?: string) => {
    const isMarked = isFragmentMarked(blockId);
    return () => {
      if (isMarked) {
        unmarkFragment(`frag-${blockId}`);
      } else {
        markFragment({
          id: `frag-${blockId}`,
          sourcePageId: `profile-${profile.id}`,
          sourceBlockId: blockId,
          content: text.substring(0, 200),
          sourceTitle: `${profile.name} - 人物资料`,
          sourceUrl: `/life/profile/${profile.id}`,
          isValidClue: !!clueId && VALID_CLUE_IDS.includes(clueId),
          clueId,
        });
      }
    };
  };

  return (
    <BrowserFrame currentUrl={`life.hecheng.local/profile/${profile.id}`} title={`${profile.name} - 人物资料`}>
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
            <MarkableBlock
              blockId={`${profile.id}-occupation`}
              text={`${profile.occupation} · ${profile.workplace} · ${profile.personality}`}
              onToggle={createMarkAction(`${profile.id}-occupation`, `${profile.occupation} · ${profile.workplace}`, getClueIdForBlock(`${profile.workplace}`))}
            />
          </div>

          {/* 社交评价 */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <h2 className="text-xs md:text-sm font-bold text-gray-500 uppercase mb-2 md:mb-3">💬 社交评价</h2>
            {profile.neighborReviews.length > 0 && (
              <div className="mb-3">
                <span className="text-[10px] md:text-xs text-gray-500 font-medium">邻居评价：</span>
                {profile.neighborReviews.map((review, i) => {
                  const blockId = `${profile.id}-neighbor-${i}`;
                  return (
                    <div key={i} className="mt-1">
                      <div className="text-xs md:text-sm text-gray-600 bg-gray-50 rounded p-2 italic">
                        "{review}"
                      </div>
                      <MarkableBlock
                        blockId={blockId}
                        text={review}
                        onToggle={createMarkAction(blockId, review, getClueIdForBlock(review))}
                        compact
                      />
                    </div>
                  );
                })}
              </div>
            )}
            {profile.colleagueReviews.length > 0 && (
              <div className="mb-3">
                <span className="text-[10px] md:text-xs text-gray-500 font-medium">同事评价：</span>
                {profile.colleagueReviews.map((review, i) => {
                  const blockId = `${profile.id}-colleague-${i}`;
                  return (
                    <div key={i} className="mt-1">
                      <div className="text-xs md:text-sm text-gray-600 bg-gray-50 rounded p-2 italic">
                        "{review}"
                      </div>
                      <MarkableBlock
                        blockId={blockId}
                        text={review}
                        onToggle={createMarkAction(blockId, review, getClueIdForBlock(review))}
                        compact
                      />
                    </div>
                  );
                })}
              </div>
            )}
            {profile.spouseReview && (
              <div>
                <span className="text-[10px] md:text-xs text-gray-500 font-medium">配偶（社区走访记录）：</span>
                <div className="mt-1 text-xs md:text-sm text-gray-600 bg-gray-50 rounded p-2 italic">
                  "{profile.spouseReview}"
                </div>
                <MarkableBlock
                  blockId={`${profile.id}-spouse`}
                  text={profile.spouseReview}
                  onToggle={createMarkAction(`${profile.id}-spouse`, profile.spouseReview, getClueIdForBlock(profile.spouseReview))}
                  compact
                />
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
                  <div key={i} className="flex gap-2 md:gap-3">
                    <div className="text-[10px] md:text-xs text-gray-500 font-mono w-20 md:w-24 shrink-0 pt-0.5">{entry.date}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs md:text-sm text-gray-700">{entry.event}</div>
                      <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1 flex-wrap">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${entry.verifiable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {entry.verifiable ? '✓ 可验证' : '✗ 无法验证'}
                        </span>
                        <MarkableBlock
                          blockId={blockId}
                          text={entry.event}
                          onToggle={createMarkAction(blockId, entry.event)}
                          compact
                        />
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

function MarkableBlock({ blockId, onToggle, compact }: { blockId: string; onToggle: () => void; text?: string; compact?: boolean }) {
  const isMarked = useGameStore((s) => s.isFragmentMarked(blockId));
  return (
    <button
      onClick={onToggle}
      className={`${compact ? 'text-xs' : 'text-xs mt-2'} inline-flex items-center gap-1 px-2 py-0.5 rounded transition-all
        ${isMarked
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'text-gray-400 hover:text-blue-500'
        }`}
    >
      <span>{isMarked ? '✅' : '📌'}</span>
      {isMarked ? '已标记' : '标记'}
    </button>
  );
}