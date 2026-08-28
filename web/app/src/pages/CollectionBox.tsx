import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore, TOTAL_CLUE_COUNT } from '../store/gameStore';
import BrowserFrame from '../components/BrowserFrame';

export default function CollectionBox() {
  const navigate = useNavigate();
  const {
    markedFragments,
    submissions,
    submissionCount,
    submitToCollectionBox,
    canSubmit,
    teamUnlocked,
    ending,
    recordPageVisit,
  } = useGameStore();

  useEffect(() => { recordPageVisit('collection-box'); }, [recordPageVisit]);

  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<ReturnType<typeof submitToCollectionBox> | null>(null);

  const uniqueValidClueIds = new Set(
    markedFragments.filter((f) => f.isValidClue && f.clueId).map((f) => f.clueId)
  );
  const validCount = uniqueValidClueIds.size;
  const invalidCount = markedFragments.filter((f) => !f.isValidClue).length;
  const collectionRate = Math.round((validCount / TOTAL_CLUE_COUNT) * 100);
  const errorRate = markedFragments.length > 0 ? Math.round((invalidCount / markedFragments.length) * 100) : 0;

  const handleSubmit = () => {
    const result = submitToCollectionBox();
    setLastResult(result);
    setShowResult(true);
  };

  const isBadEnding = ending === 'bad';

  return (
    <BrowserFrame currentUrl="forum.qf推理.local/collection-box" title="收集箱">
      <div className="max-w-3xl mx-auto p-3 md:p-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* 头部 */}
          <div className="p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
            <h1 className="text-lg md:text-xl font-bold text-gray-800">📥 专案组民间线索收集箱</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              本收集箱由市公安局专案组设立，用于征集市民对"3·12连环女性失踪案"的线索和分析。
            </p>
          </div>

          {/* 提交要求 */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <h2 className="text-xs md:text-sm font-bold text-gray-500 uppercase mb-2 md:mb-3">📋 提交要求</h2>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className={collectionRate >= 95 ? 'text-green-500' : 'text-gray-400'}>
                  {collectionRate >= 95 ? '✅' : '⬜'}
                </span>
                线索收集度需达到 95%（当前：{collectionRate}%）
              </li>
              <li className="flex items-center gap-2">
                <span className={errorRate <= 50 ? 'text-green-500' : 'text-gray-400'}>
                  {errorRate <= 50 ? '✅' : '⬜'}
                </span>
                无效线索占比需低于 50%（当前：{errorRate}%）
              </li>
              <li className="flex items-center gap-2">
                <span className={submissionCount < 3 ? 'text-green-500' : 'text-red-500'}>
                  {submissionCount < 3 ? '✅' : '❌'}
                </span>
                每人最多提交 3 次（已提交：{submissionCount} 次）
              </li>
            </ul>
          </div>

          {/* 当前状态 */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <h2 className="text-xs md:text-sm font-bold text-gray-500 uppercase mb-2 md:mb-3">📊 我的线索板</h2>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs md:text-sm mb-1">
                  <span className="text-gray-500">已标记碎片</span>
                  <span className="font-bold text-gray-800">{markedFragments.length} 条</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm mb-1">
                  <span className="text-gray-500">有效线索</span>
                  <span className="font-bold text-green-600">{validCount}/{TOTAL_CLUE_COUNT}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-500">无效标记</span>
                  <span className="font-bold text-red-500">{invalidCount}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/clueboard')}
                className="text-xs md:text-sm text-blue-500 active:text-blue-700 shrink-0"
              >
                前往整理 →
              </button>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            {!teamUnlocked && !isBadEnding && (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                  text-white py-3 rounded-lg font-medium transition-colors"
              >
                📤 提交到收集箱
              </button>
            )}
            {teamUnlocked && (
              <div className="text-center">
                <div className="text-green-500 text-base md:text-lg font-bold mb-2">✅ 审核已通过！</div>
                <p className="text-xs md:text-sm text-gray-600 mb-3">
                  专案组已采纳您的线索，邀请您进入专案组工作台协助深入调查。
                </p>
                <button
                  onClick={() => navigate('/team')}
                  className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium"
                >
                  🔬 进入专案组工作台 →
                </button>
              </div>
            )}
            {isBadEnding && (
              <div className="text-center">
                <div className="text-red-500 text-base md:text-lg font-bold mb-2">💀 调查失败</div>
                <p className="text-xs md:text-sm text-gray-600 mb-3">
                  3次提交均未通过审核。证据链不完整，真相仍然隐藏在迷雾中。
                </p>
                <button
                  onClick={() => navigate('/ending')}
                  className="w-full md:w-auto bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium"
                >
                  查看结局 →
                </button>
              </div>
            )}
          </div>

          {/* 提交历史 */}
          <div className="p-4 md:p-6">
            <h2 className="text-xs md:text-sm font-bold text-gray-500 uppercase mb-2 md:mb-3">📜 提交历史</h2>
            {submissions.length === 0 ? (
              <p className="text-xs md:text-sm text-gray-400">暂无提交记录</p>
            ) : (
              <div className="space-y-2">
                {submissions.map((sub) => (
                  <div key={sub.id} className="bg-gray-50 rounded-lg p-2.5 md:p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm font-medium text-gray-700">
                        第{sub.attemptNumber}次提交
                      </span>
                      <span className={`text-xs md:text-sm font-bold ${sub.passed ? 'text-green-600' : 'text-red-500'}`}>
                        {sub.passed ? '✅ 通过' : '❌ 未通过'}
                      </span>
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-500 mt-1">
                      收集度：{Math.round(sub.collectionRate * 100)}% · 错误率：{Math.round(sub.errorRate * 100)}%
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-500 mt-1">
                      {sub.feedback}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 提交结果弹窗 */}
        {showResult && lastResult && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 w-full max-w-md">
              <div className="text-center">
                <div className="text-4xl mb-3">
                  {lastResult.passed ? '🎉' : '📋'}
                </div>
                <h3 className={`text-base md:text-lg font-bold mb-2 ${lastResult.passed ? 'text-green-600' : 'text-red-500'}`}>
                  {lastResult.passed ? '审核通过！' : '审核不通过'}
                </h3>
                <div className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                  <p>线索收集度：{Math.round(lastResult.collectionRate * 100)}%</p>
                  <p>错误判定率：{Math.round(lastResult.errorRate * 100)}%</p>
                  <p>有效线索：{lastResult.validClueCount}/{TOTAL_CLUE_COUNT}</p>
                </div>
                <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">{lastResult.feedback}</p>
                <button
                  onClick={() => setShowResult(false)}
                  className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium"
                >
                  {lastResult.passed ? '太好了！' : '继续调查'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BrowserFrame>
  );
}
