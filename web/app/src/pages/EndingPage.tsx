import { useNavigate } from 'react-router-dom';
import { useGameStore, TOTAL_CLUE_COUNT } from '../store/gameStore';
import { REASONING_OPTIONS } from '../data/reasoning';

export default function EndingPage() {
  const navigate = useNavigate();
  const { ending, finalAnswer, markedFragments, playerName, resetGame } = useGameStore();

  const uniqueValidClueIds = new Set(
    markedFragments.filter((f) => f.isValidClue && f.clueId).map((f) => f.clueId)
  );
  const validCount = uniqueValidClueIds.size;
  const collectionRate = Math.round((validCount / TOTAL_CLUE_COUNT) * 100);
  const selectedOption = REASONING_OPTIONS.find((o) => o.id === finalAnswer);
  const isGoodEnding = ending === 'good';

  const handleRestart = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-2xl w-full px-4 md:px-6 py-8 md:py-12 space-y-6 md:space-y-8">
        {/* 结局标识 */}
        <div className="text-center">
          <div className="text-5xl md:text-7xl mb-3 md:mb-4">{isGoodEnding ? '🌟' : '💀'}</div>
          <h1
            className={`text-2xl md:text-4xl font-bold ${isGoodEnding ? 'text-green-400' : 'text-red-500'}`}
          >
            {isGoodEnding ? '真相大白' : '迷雾未散'}
          </h1>
          <p className="text-gray-500 mt-1.5 md:mt-2 text-sm md:text-lg">
            {isGoodEnding ? '证据链完整闭环，凶手落网' : '证据链断裂，真相仍然隐藏在迷雾中'}
          </p>
        </div>

        {/* 结局叙事 */}
        <div
          className={`rounded-lg p-4 md:p-6 border ${
            isGoodEnding ? 'bg-green-900/20 border-green-800/30' : 'bg-red-900/20 border-red-800/30'
          }`}
        >
          {isGoodEnding ? (
            <div className="text-xs md:text-sm text-gray-200 leading-relaxed space-y-2 md:space-y-3">
              <p>
                <span className="text-blue-400 font-bold">{playerName}</span>，
                你的推理完全正确。
              </p>
              <p>
                根据你构建的完整证据链，专案组迅速锁定了嫌疑人
                <span className="text-blue-400 font-bold">李文彬</span>
                ——城南社区卫生服务站全科医生，湖南籍入赘本地，定居南郊新区。
              </p>
              <p>抓捕行动中，警方在其住所和车辆里查获了关键物证：</p>
              <ul className="list-disc list-inside text-gray-300 space-y-0.5 md:space-y-1 ml-2 md:ml-4 text-[10px] md:text-sm">
                <li>与现场同款的75%医用酒精（大量库存）</li>
                <li>与尸块纤维同款的薄荷味口罩（同品牌同批次）</li>
                <li>鞋底检出南方红壤残留，与受害人指甲缝土壤一致</li>
                <li>车内后备箱发现微量血迹残留（DNA比对中）</li>
                <li>行车记录仪数据恢复后显示抛尸当晚行驶路线</li>
              </ul>
              <p>
                审讯中，李文彬交代了因偏执型人格障碍对特定类型女性产生杀意的犯罪事实。
                其作案行为呈现明显的仪式化特征，每18天为一个强迫性周期。
              </p>
              <p className="text-green-400 font-bold text-sm md:text-base">
                案件告破。第四名潜在受害者得以幸免。你获得了「金牌推理师」评价。
              </p>
            </div>
          ) : (
            <div className="text-xs md:text-sm text-gray-200 leading-relaxed space-y-2 md:space-y-3">
              <p>
                <span className="text-blue-400 font-bold">{playerName}</span>，
                很遗憾，你的推理结论未能形成完整的证据链。
              </p>
              {!selectedOption?.isCorrect && (
                <p>
                  你选择了 <span className="text-red-500 font-bold">选项 {finalAnswer}</span>，
                  但正确答案是 <span className="text-green-400 font-bold">选项 B</span>。
                </p>
              )}
              {collectionRate < 95 && (
                <p>
                  你的线索收集率仅为 <span className="text-yellow-400 font-bold">{collectionRate}%</span>
                  （需≥95%），关键证据缺失导致专案组无法实施抓捕。
                </p>
              )}
              <p>
                由于证据不足，专案组无法锁定真凶。嫌疑人
                <span className="text-blue-400 font-bold">李文彬</span>
                继续潜伏在日常生活中，伪装成一名普通的社区医生。
              </p>
              <p className="text-red-500 text-sm md:text-base">
                5月5日，第四名受害者出现了……案件仍在继续。
              </p>
              <p className="text-gray-400">
                你获得了「实习推理师」评价。不要气馁，真相永远在那里，等待被发现。
              </p>
            </div>
          )}
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-blue-400">{collectionRate}%</div>
            <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">线索收集率</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-white">{validCount}/{TOTAL_CLUE_COUNT}</div>
            <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">已发现线索</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 md:p-4 text-center">
            <div className={`text-xl md:text-2xl font-bold ${isGoodEnding ? 'text-green-400' : 'text-red-500'}`}>
              {isGoodEnding ? '金牌' : '实习'}
            </div>
            <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">评价等级</div>
          </div>
        </div>

        {/* 正确答案复盘 */}
        {!isGoodEnding && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-5">
            <h3 className="text-xs md:text-sm font-bold text-blue-400 mb-2 md:mb-3">📖 正确答案复盘（选项 B）</h3>
            <div className="space-y-1.5 md:space-y-2">
              {REASONING_OPTIONS.find((o) => o.id === 'B')?.analysis.map((line, i) => (
                <div key={i} className="text-[10px] md:text-xs text-gray-300 leading-relaxed">{line}</div>
              ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRestart}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-sm md:text-base transition-colors"
          >
            🔄 重新调查
          </button>
        </div>
      </div>
    </div>
  );
}