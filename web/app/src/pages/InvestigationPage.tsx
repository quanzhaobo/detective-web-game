import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getCaseById } from '../data/cases';

export default function InvestigationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chapterId = parseInt(id || '1');

  const { currentCaseId, discoveredClues, discoverClue, completeChapter, completedChapters } =
    useGameStore();
  const caseData = currentCaseId ? getCaseById(currentCaseId) : undefined;
  const chapter = caseData?.chapters.find((c) => c.id === chapterId);

  const [currentSection, setCurrentSection] = useState(0);
  const [revealedClues, setRevealedClues] = useState<string[]>([]);

  if (!chapter || !caseData) {
    return <div className="text-center py-20 text-gray-500">章节不存在</div>;
  }

  const chapterClues = caseData.clues.filter((c) => c.chapter === chapterId);
  const section = chapter.content[currentSection];
  const isLastSection = currentSection === chapter.content.length - 1;
  const isCompleted = completedChapters.includes(chapterId);

  const handleDiscoverClue = (clueId: string) => {
    discoverClue(clueId);
    if (!revealedClues.includes(clueId)) {
      setRevealedClues((prev) => [...prev, clueId]);
    }
  };

  const handleComplete = () => {
    chapterClues.forEach((c) => discoverClue(c.id));
    completeChapter(chapterId);
    navigate(`/case/${currentCaseId}`);
  };

  return (
    <div className="space-y-6">
      {/* 章节头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {chapter.icon} {chapter.title}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{chapter.subtitle}</p>
        </div>
        <button
          onClick={() => navigate(`/case/${currentCaseId}`)}
          className="btn-secondary text-sm"
        >
          ← 返回工作台
        </button>
      </div>

      {/* 内容区域 */}
      <div className="bg-dark-700 border border-dark-500 rounded-lg overflow-hidden">
        {/* 段落标签 */}
        <div className="flex border-b border-dark-500">
          {chapter.content.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrentSection(i)}
              className={`px-4 py-3 text-sm font-medium transition-colors
                ${i === currentSection
                  ? 'text-accent border-b-2 border-accent bg-dark-600'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* 段落正文 */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">{section.title}</h3>
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {section.body}
          </div>
        </div>
      </div>

      {/* 段落导航 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className="btn-secondary text-sm disabled:opacity-30"
        >
          ← 上一段
        </button>
        <span className="text-gray-500 text-sm">
          {currentSection + 1} / {chapter.content.length}
        </span>
        {!isLastSection ? (
          <button
            onClick={() => setCurrentSection(currentSection + 1)}
            className="btn-primary text-sm"
          >
            下一段 →
          </button>
        ) : (
          <button onClick={handleComplete} className="btn-primary text-sm">
            {isCompleted ? '✅ 重新完成' : '✓ 完成本章'}
          </button>
        )}
      </div>

      {/* 本章线索 */}
      {chapterClues.length > 0 && (
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-5">
          <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
            📎 本章可收集线索 ({revealedClues.length}/{chapterClues.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {chapterClues.map((clue) => {
              const isDiscovered = discoveredClues.includes(clue.id) || revealedClues.includes(clue.id);
              return (
                <div
                  key={clue.id}
                  onClick={() => !isDiscovered && handleDiscoverClue(clue.id)}
                  className={`rounded-lg p-3 border transition-all
                    ${isDiscovered
                      ? 'bg-dark-600 border-accent/30 clue-pulse'
                      : 'bg-dark-700 border-dark-500 cursor-pointer hover:border-accent/50'
                    }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">
                      {isDiscovered ? clue.name : '??? 未发现'}
                    </span>
                    <span className="text-xs font-mono text-gray-500">{clue.id}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {isDiscovered ? clue.description : '点击此处发现线索'}
                  </p>
                  {isDiscovered && (
                    <div className="mt-2 text-xs text-gray-300 bg-dark-800 rounded p-2 leading-relaxed">
                      {clue.detail}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
