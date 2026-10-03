import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import BrowserFrame from '@platform/browser-frame';

const DEFAULT_NAME = '推理爱好者';

export default function BrowserHome() {
  const navigate = useNavigate();
  const { gameStarted, playerName, startGame, recordPageVisit } = useGameStore();
  const [name, setName] = useState(playerName || DEFAULT_NAME);
  const [query, setQuery] = useState('');

  /** 任何一次“开始浏览”都会落定昵称并进入对应站点 */
  const begin = (path: string) => {
    startGame(name.trim() || DEFAULT_NAME);
    recordPageVisit('home');
    navigate(path);
  };

  const search = () => {
    const q = query.trim();
    if (q) {
      begin(`/search/results?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <BrowserFrame currentUrl="search.hesou.local">
      <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-2xl w-full px-4 md:px-6 py-8 md:py-12 text-center">
          {/* Logo */}
          <div className="mb-6 md:mb-8">
            <div className="text-5xl md:text-6xl mb-3 md:mb-4">🔍</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1 md:mb-2">鹤搜</h1>
            <p className="text-gray-500 text-sm md:text-lg">Hesou — 发现鹤城的每一个角落</p>
          </div>

          {/* 搜索框 */}
          <form
            className="mb-6 md:mb-8 flex items-center gap-2 w-full max-w-lg mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              search();
            }}
          >
            <div className="flex flex-1 items-center bg-white rounded-full shadow-lg border border-gray-200 px-4 md:px-5 py-3 md:py-3.5">
              <span className="text-gray-400 mr-3 text-xl">🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索鹤城..."
                className="flex-1 bg-transparent text-base text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full px-5 md:px-6 py-3 md:py-3.5 font-medium transition-colors"
            >
              搜索
            </button>
          </form>

          {/* 快捷入口 */}
          <div className="grid grid-cols-4 gap-2 md:gap-3 w-full max-w-lg mx-auto mb-6 md:mb-8">
            <QuickLink icon="💬" label="清风论坛" onClick={() => begin('/forum')} />
            <QuickLink icon="📰" label="鹤城新闻" onClick={() => begin('/news')} />
            <QuickLink icon="🏪" label="生活通" onClick={() => begin('/life')} />
            <QuickLink icon="📋" label="线索板" onClick={() => begin('/clueboard')} />
          </div>

          {/* 欢迎信息 */}
          {!gameStarted && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 w-full max-w-md mx-auto">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2 md:mb-3">👋 欢迎来到鹤城</h3>
              <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                你是一名推理爱好者，清风推理论坛的活跃用户。最近鹤城不太平，也许你该去论坛看看……
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 shrink-0">昵称：</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400"
                  placeholder={DEFAULT_NAME}
                />
              </div>
              <button
                onClick={() => begin('/forum')}
                className="mt-3 md:mt-4 w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-2.5 md:py-2 rounded-lg font-medium transition-colors"
              >
                开始浏览 →
              </button>
            </div>
          )}

          {gameStarted && (
            <p className="text-gray-400 text-sm">
              欢迎回来，{playerName}。点击导航开始探索吧。
            </p>
          )}
        </div>
      </div>
    </BrowserFrame>
  );
}

function QuickLink({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 p-2.5 md:p-3 rounded-xl bg-white hover:bg-gray-50 active:bg-gray-100 shadow-sm border border-gray-100 transition-all hover:shadow-md"
    >
      <span className="text-xl md:text-2xl">{icon}</span>
      <span className="text-[10px] md:text-xs text-gray-600">{label}</span>
    </button>
  );
}
