import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [booting, setBooting] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const login = useGameStore((s) => s.login);
  const isLoggedIn = useGameStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const lines = [
      '> 正在连接公安内网...',
      '> 身份验证模块加载中...',
      '> 加密通道建立完毕 [AES-256]',
      '> 案件协作平台 v3.7.2 已就绪',
      '> 等待用户登录...',
    ];
    let i = 0;
    const timer = setInterval(() => {
      if (i < lines.length) {
        setBootLines((prev) => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setBooting(false);
          setShowLogin(true);
        }, 500);
      }
    }, 600);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    if (name.trim()) {
      login(name.trim());
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center scanline">
      <div className="w-full max-w-lg p-8">
        {/* 警徽 */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🛡️</div>
          <h1 className="text-2xl font-bold text-accent">市公安局案件协作平台</h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">Criminal Case Collaboration System</p>
        </div>

        {/* 启动日志 */}
        {booting && (
          <div className="bg-dark-800 border border-dark-600 rounded-lg p-4 mb-6 font-mono text-sm">
            {bootLines.map((line, i) => (
              <div key={i} className="text-green-400 mb-1">
                {line}
              </div>
            ))}
            <span className="cursor-blink text-accent"></span>
          </div>
        )}

        {/* 登录表单 */}
        {showLogin && (
          <div className="bg-dark-700 border border-dark-500 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              系统已就绪 — 请输入警员编号登录
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">警员编号 / 姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="输入任意名称即可登录"
                className="w-full bg-dark-800 border border-dark-500 rounded px-4 py-3 text-white font-mono
                  focus:outline-none focus:border-accent transition-colors placeholder-gray-600"
                autoFocus
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={!name.trim()}
              className="w-full bg-accent hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed
                text-white py-3 rounded font-medium transition-colors"
            >
              🔐 安全登录
            </button>

            <p className="text-xs text-gray-600 text-center">
              本系统仅限授权人员使用 | 所有操作均有日志记录
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
