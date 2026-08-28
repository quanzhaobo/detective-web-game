import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore, TOTAL_CLUE_COUNT } from '../store/gameStore';
import BrowserFrame from '../components/BrowserFrame';

export default function ClueBoardPage() {
  const navigate = useNavigate();
  const {
    markedFragments,
    unmarkFragment,
    addNote,
    linkFragments,
    unlinkFragments,
    linkedPairs,
    recordPageVisit,
  } = useGameStore();

  useEffect(() => { recordPageVisit('clueboard'); }, [recordPageVisit]);

  const [linkMode, setLinkMode] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const uniqueValidClueIds = new Set(
    markedFragments.filter((f) => f.isValidClue && f.clueId).map((f) => f.clueId)
  );
  const validCount = uniqueValidClueIds.size;
  const collectionRate = Math.round((validCount / TOTAL_CLUE_COUNT) * 100);

  const handleLink = (fragId: string) => {
    if (!linkMode) {
      setLinkMode(fragId);
    } else if (linkMode !== fragId) {
      // 检查是否已关联
      const alreadyLinked = linkedPairs.some(
        (p) => (p.a === linkMode && p.b === fragId) || (p.a === fragId && p.b === linkMode)
      );
      if (alreadyLinked) {
        unlinkFragments(linkMode, fragId);
      } else {
        linkFragments(linkMode, fragId);
      }
      setLinkMode(null);
    } else {
      setLinkMode(null);
    }
  };

  // 获取碎片关联的碎片
  const getLinkedFragments = (fragId: string) => {
    const linked = new Set<string>();
    linkedPairs.forEach((p) => {
      if (p.a === fragId) linked.add(p.b);
      if (p.b === fragId) linked.add(p.a);
    });
    return linked;
  };

  // 按来源分组
  const grouped: Record<string, typeof markedFragments> = {};
  markedFragments.forEach((f) => {
    const key = f.sourceTitle;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(f);
  });

  return (
    <BrowserFrame currentUrl="clueboard.local" title="线索板">
      <div className="max-w-4xl mx-auto p-3 md:p-4">
        {/* 头部 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-5 mb-3 md:mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-800">📋 线索板</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                已标记 {markedFragments.length} 条碎片 · 有效 {validCount}/{TOTAL_CLUE_COUNT} ({collectionRate}%)
              </p>
            </div>
            <button
              onClick={() => navigate('/collection-box')}
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 py-2.5 md:py-2 rounded-lg text-sm font-medium transition-colors"
            >
              📥 提交收集箱
            </button>
          </div>
          {/* 进度条 */}
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${collectionRate}%` }}
            />
          </div>
        </div>

        {linkMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3 md:mb-4 flex items-center justify-between">
            <span className="text-xs md:text-sm text-yellow-700">
              🔗 关联模式：点击另一条碎片建立关联
            </span>
            <button
              onClick={() => setLinkMode(null)}
              className="text-xs text-yellow-600 active:text-yellow-800 shrink-0 ml-2"
            >
              取消
            </button>
          </div>
        )}

        {/* 碎片列表 */}
        {markedFragments.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="text-3xl md:text-4xl mb-3 md:mb-4">📋</div>
            <p className="text-sm md:text-base text-gray-500">还没有标记任何线索碎片</p>
            <p className="text-xs md:text-sm text-gray-400 mt-2 px-4">
              浏览论坛帖子、新闻文章或人物资料时，点击"📌 标记为线索"按钮来收集碎片
            </p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {Object.entries(grouped).map(([source, frags]) => (
              <div key={source} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-3 md:px-4 py-2 bg-gray-50 rounded-t-lg border-b border-gray-100">
                  <span className="text-[10px] md:text-xs font-medium text-gray-500">📄 {source}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {frags.map((frag) => {
                    const linked = getLinkedFragments(frag.id);
                    const isLinked = linked.size > 0;
                    const isLinkMode = linkMode === frag.id;

                    return (
                      <div key={frag.id} className="p-3 md:p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 md:gap-2 mb-1 flex-wrap">
                              <span className={`text-[10px] md:text-xs px-1 md:px-1.5 py-0.5 rounded font-mono
                                ${frag.isValidClue ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {frag.clueId || '?'}
                              </span>
                              {frag.isValidClue && (
                                <span className="text-[10px] md:text-xs text-green-600">✅ 有效</span>
                              )}
                              {isLinked && (
                                <span className="text-[10px] md:text-xs text-blue-600">
                                  🔗 {linked.size}
                                </span>
                              )}
                            </div>
                            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{frag.content}</p>
                            {frag.note && (
                              <div className="mt-1.5 md:mt-2 text-[10px] md:text-xs text-gray-500 bg-yellow-50 rounded p-1.5 md:p-2 italic">
                                📝 {frag.note}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col md:flex-row items-center gap-0.5 md:gap-1 shrink-0">
                            <button
                              onClick={() => handleLink(frag.id)}
                              className={`p-1.5 md:p-1 rounded text-xs transition-colors active:opacity-80
                                ${isLinkMode ? 'bg-yellow-100 text-yellow-700' : 'text-gray-400 active:text-blue-500'}`}
                              title="关联"
                            >
                              🔗
                            </button>
                            <button
                              onClick={() => {
                                setEditingNote(frag.id);
                                setNoteText(frag.note || '');
                              }}
                              className="p-1.5 md:p-1 rounded text-xs text-gray-400 active:text-blue-500"
                              title="批注"
                            >
                              📝
                            </button>
                            <button
                              onClick={() => navigate(frag.sourceUrl)}
                              className="p-1.5 md:p-1 rounded text-xs text-gray-400 active:text-blue-500"
                              title="查看来源"
                            >
                              🔗
                            </button>
                            <button
                              onClick={() => unmarkFragment(frag.id)}
                              className="p-1.5 md:p-1 rounded text-xs text-gray-400 active:text-red-500"
                              title="移除"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 批注弹窗 */}
        {editingNote && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 w-full max-w-md">
              <h3 className="font-bold text-gray-800 mb-3">📝 添加批注</h3>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm h-24 resize-none focus:outline-none focus:border-blue-400"
                placeholder="记录你的分析..."
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setEditingNote(null)}
                  className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 active:bg-gray-200 rounded"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    addNote(editingNote, noteText);
                    setEditingNote(null);
                  }}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BrowserFrame>
  );
}