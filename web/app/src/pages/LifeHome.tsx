import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import BrowserFrame from '../components/BrowserFrame';

export default function LifeHome() {
  const navigate = useNavigate();
  const { recordPageVisit } = useGameStore();

  useEffect(() => { recordPageVisit('life'); }, [recordPageVisit]);

  return (
    <BrowserFrame currentUrl="life.hecheng.local" title="鹤城生活通">
      <div className="max-w-4xl mx-auto p-3 md:p-4">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold">🏪 鹤城生活通</h1>
          <p className="text-orange-100 text-xs md:text-sm mt-1">找信息、查商户、看点评 — 鹤城人的生活指南</p>
        </div>

        <div className="bg-white border-x border-b border-gray-200 p-3 md:p-4">
          {/* 搜索框 */}
          <div>
            <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 px-3 md:px-4 py-2.5">
              <span className="text-gray-400 mr-2">🔍</span>
              <input
                type="text"
                placeholder="搜索人物、商户、地点..."
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
      </div>
    </BrowserFrame>
  );
}