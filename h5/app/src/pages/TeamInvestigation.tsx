import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { CHAPTERS } from '../data/chapters';
import BrowserFrame from '../components/BrowserFrame';

export default function TeamInvestigation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recordPageVisit, completedInvestigations, completeInvestigation } = useGameStore();

  const chapterId = id || '1';
  const chapter = CHAPTERS.find((c) => String(c.id) === chapterId);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    if (chapter) {
      recordPageVisit(`team-investigation-${chapterId}`);
    }
  }, [chapter, chapterId, recordPageVisit]);

  if (!chapter) {
    return (
      <BrowserFrame currentUrl="team.internal.local">
        <div className="max-w-3xl mx-auto p-8 text-center">
          <div className="text-4xl mb-4">📂</div>
          <p className="text-gray-500">档案不存在</p>
          <button onClick={() => navigate('/team')} className="text-blue-500 mt-4 text-sm hover:underline">
            ← 返回工作台
          </button>
        </div>
      </BrowserFrame>
    );
  }

  const isCompleted = completedInvestigations.includes(String(chapter.id));
  const section = chapter.content[currentSection];
  const isLastSection = currentSection === chapter.content.length - 1;

  const handleComplete = () => {
    completeInvestigation(String(chapter.id));
    navigate('/team');
  };

  return (
    <BrowserFrame currentUrl={`team.internal.local/investigation/${chapterId}`} title={chapter.title}>
      <div className="max-w-4xl mx-auto p-3 md:p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg">
          {/* 头部 */}
          <div className="p-4 md:p-5 border-b border-slate-700">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-1.5 md:gap-2">
                  <span className="shrink-0">{chapter.icon}</span>
                  <span className="truncate">{chapter.title}</span>
                </h2>
                <p className="text-slate-400 text-xs md:text-sm mt-0.5 md:mt-1 truncate">{chapter.subtitle}</p>
              </div>
              <button
                onClick={() => navigate('/team')}
                className="text-slate-400 active:text-white text-xs md:text-sm shrink-0"
              >
                ← 返回
              </button>
            </div>
          </div>

          {/* 段落标签 */}
          <div className="flex border-b border-slate-700 bg-slate-900/50 overflow-x-auto">
            {chapter.content.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrentSection(i)}
                className={`px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm font-medium transition-colors whitespace-nowrap shrink-0
                  ${i === currentSection
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 active:text-white'
                  }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* 段落内容 */}
          <div className="p-4 md:p-6">
            <h3 className="text-sm md:text-base font-bold text-white mb-3 md:mb-4">{section.title}</h3>
            <div className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {section.body}
            </div>
          </div>

          {/* 导航 */}
          <div className="flex items-center justify-between p-3 md:p-4 border-t border-slate-700">
            <button
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className="px-3 md:px-4 py-2 text-xs md:text-sm bg-slate-700 text-slate-300 rounded hover:bg-slate-600 disabled:opacity-30 active:bg-slate-600"
            >
              ← 上一段
            </button>
            <span className="text-slate-500 text-xs md:text-sm">
              {currentSection + 1} / {chapter.content.length}
            </span>
            {!isLastSection ? (
              <button
                onClick={() => setCurrentSection(currentSection + 1)}
                className="px-3 md:px-4 py-2 text-xs md:text-sm bg-blue-600 text-white rounded hover:bg-blue-500 active:bg-blue-700"
              >
                下一段 →
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-3 md:px-4 py-2 text-xs md:text-sm bg-green-600 text-white rounded hover:bg-green-500 active:bg-green-700"
              >
                {isCompleted ? '✅ 已完成' : '✓ 完成本章'}
              </button>
            )}
          </div>
        </div>

        {/* 章节列表 */}
        <div className="mt-3 md:mt-4 grid grid-cols-3 md:grid-cols-5 gap-1.5 md:gap-2">
          {CHAPTERS.map((ch) => {
            const done = completedInvestigations.includes(String(ch.id));
            return (
              <button
                key={ch.id}
                onClick={() => navigate(`/team/investigation/${ch.id}`)}
                className={`p-2 rounded text-center text-[10px] md:text-xs transition-colors active:opacity-80
                  ${String(ch.id) === chapterId
                    ? 'bg-blue-600 text-white'
                    : done
                    ? 'bg-green-800 text-green-300'
                    : 'bg-slate-700 text-slate-400 active:bg-slate-600'
                  }`}
              >
                <div className="text-base md:text-lg">{ch.icon}</div>
                <div>第{ch.id}章</div>
              </button>
            );
          })}
        </div>
      </div>
    </BrowserFrame>
  );
}