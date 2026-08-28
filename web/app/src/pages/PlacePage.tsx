import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getPlaceById } from '../data/places';
import { getProfileById } from '../data/profiles';
import BrowserFrame from '../components/BrowserFrame';

export default function PlacePage() {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const { recordPageVisit } = useGameStore();

  const place = placeId ? getPlaceById(placeId) : undefined;

  useEffect(() => {
    if (place) {
      recordPageVisit(`place-${place.id}`);
    }
  }, [place, recordPageVisit]);

  if (!place) {
    return (
      <BrowserFrame currentUrl="life.hecheng.local">
        <div className="max-w-3xl mx-auto p-8 text-center">
          <div className="text-4xl mb-4">📍</div>
          <p className="text-gray-500">地点信息不存在</p>
          <button onClick={() => navigate('/life')} className="text-blue-500 mt-4 text-sm hover:underline">
            ← 返回生活通
          </button>
        </div>
      </BrowserFrame>
    );
  }

  return (
    <BrowserFrame currentUrl={`life.hecheng.local/place/${place.id}`} title={`${place.name} - 地点信息`}>
      <div className="max-w-3xl mx-auto p-3 md:p-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* 头部 */}
          <div className="p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center gap-3 md:gap-4">
              <span className="text-2xl md:text-3xl shrink-0">{place.icon}</span>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold text-gray-900">{place.name}</h1>
                <div className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1 truncate">{place.address}</div>
              </div>
            </div>
          </div>

          {/* 详细介绍 */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <h2 className="text-xs md:text-sm font-bold text-gray-500 uppercase mb-2 md:mb-3">📋 基本信息</h2>
            <p className="text-xs md:text-sm text-gray-700 mb-2 md:mb-3">{place.description}</p>
            <ul className="space-y-1 md:space-y-1.5">
              {place.details.map((d, i) => (
                <li key={i} className="text-xs md:text-sm text-gray-600 flex items-start gap-1.5 md:gap-2">
                  <span className="text-orange-400 shrink-0">•</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* 周边信息 */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <h2 className="text-xs md:text-sm font-bold text-gray-500 uppercase mb-2 md:mb-3">📍 周边信息</h2>
            <ul className="space-y-1 md:space-y-1.5">
              {place.surroundingInfo.map((info, i) => (
                <li key={i} className="text-xs md:text-sm text-gray-600 flex items-start gap-1.5 md:gap-2">
                  <span className="text-blue-400 shrink-0">📍</span>
                  {info}
                </li>
              ))}
            </ul>
          </div>

          {/* 关联人物 */}
          {place.relatedProfiles && place.relatedProfiles.length > 0 && (
            <div className="p-4 md:p-6">
              <h2 className="text-xs md:text-sm font-bold text-gray-500 uppercase mb-2 md:mb-3">🧑 关联人物</h2>
              <div className="space-y-2">
                {place.relatedProfiles.map((pid) => {
                  const profile = getProfileById(pid);
                  if (!profile) return null;
                  return (
                    <button
                      key={pid}
                      onClick={() => navigate(`/life/profile/${pid}`)}
                      className="block w-full text-left bg-gray-50 rounded-lg p-2.5 md:p-3 active:bg-orange-50 transition-colors"
                    >
                      <div className="font-medium text-gray-800 text-xs md:text-sm">{profile.name}</div>
                      <div className="text-[10px] md:text-xs text-gray-500">{profile.occupation} · {profile.workplace}</div>
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