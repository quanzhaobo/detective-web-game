import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CORRECT_ANSWER_ID } from '../data/reasoning.ts';
import {
  computeCollectionStats,
  MAX_SUBMISSIONS,
  PASS_COLLECTION_RATE,
} from './collectionStats.ts';

// ========== 线索碎片 ==========

export interface MarkedFragment {
  id: string;
  sourcePageId: string;
  sourceBlockId: string;
  content: string;
  sourceTitle: string;
  sourceUrl: string;
  /** 玩家批注 */
  note?: string;
  /** 是否为 23 条有效线索之一 */
  isValidClue: boolean;
  /** 对应的线索 ID，如 'E01'、'P04' */
  clueId?: string;
}

export interface CollectionSubmission {
  id: string;
  submittedAt: number;
  fragments: MarkedFragment[];
  validClueCount: number;
  invalidClueCount: number;
  collectionRate: number;
  errorRate: number;
  passed: boolean;
  attemptNumber: number;
  feedback: string;
}

// ========== 游戏状态 ==========

interface GameState {
  // 基础
  gameStarted: boolean;
  playerName: string;

  // 阶段：只在审核通过时从 1 推进到 2。坏结局不是「进入下一阶段」，
  // 推进它会让我论坛把收集箱标成「已解锁」，与刚刚失败的处境矛盾。
  currentPhase: 1 | 2;
  teamUnlocked: boolean;

  // 浏览历史
  visitedPages: string[];
  searchHistory: string[];
  currentUrl: string;

  // 线索系统
  markedFragments: MarkedFragment[];
  linkedPairs: Array<{ a: string; b: string }>;

  // 收集箱
  submissions: CollectionSubmission[];
  submissionCount: number;

  // Phase 3
  completedInvestigations: string[];
  interrogatedSuspects: string[];
  finalAnswer: string | null;
  ending: 'good' | 'bad' | null;

  // 辅助
  hasSeenHotPosts: boolean;

  // ===== Actions =====
  startGame: (name: string) => void;
  recordPageVisit: (pageId: string) => void;
  recordSearch: (keyword: string) => void;
  setCurrentUrl: (url: string) => void;

  markFragment: (fragment: MarkedFragment) => void;
  /**
   * 按内容块整体取消标记。
   * 标记与取消都是**内容块粒度** —— 一个块可能承载多条线索（如 post-8 = T01/E03/E04），
   * 若允许逐条删除，来源页的按钮状态（块级判断）就会与线索板（碎片级删除）互相矛盾。
   */
  unmarkBlock: (sourceBlockId: string) => void;
  isFragmentMarked: (sourceBlockId: string) => boolean;
  addNote: (fragmentId: string, note: string) => void;
  linkFragments: (a: string, b: string) => void;
  unlinkFragments: (a: string, b: string) => void;

  submitToCollectionBox: () => CollectionSubmission;
  canSubmit: () => boolean;

  completeInvestigation: (id: string) => void;
  interrogateSuspect: (id: string) => void;
  setFinalAnswer: (answer: string) => void;
  calculateEnding: () => void;

  resetGame: () => void;
  markHotPostsSeen: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      gameStarted: false,
      playerName: '',

      currentPhase: 1,
      teamUnlocked: false,

      visitedPages: [],
      searchHistory: [],
      currentUrl: '/',

      markedFragments: [],
      linkedPairs: [],

      submissions: [],
      submissionCount: 0,

      completedInvestigations: [],
      interrogatedSuspects: [],
      finalAnswer: null,
      ending: null,

      hasSeenHotPosts: false,

      // ===== Actions =====

      startGame: (name: string) =>
        set({ gameStarted: true, playerName: name, currentPhase: 1 }),

      recordPageVisit: (pageId: string) => {
        const { visitedPages } = get();
        if (!visitedPages.includes(pageId)) {
          set({ visitedPages: [...visitedPages, pageId] });
        }
      },

      recordSearch: (keyword: string) => {
        const { searchHistory } = get();
        if (!searchHistory.includes(keyword)) {
          set({ searchHistory: [...searchHistory, keyword] });
        }
      },

      setCurrentUrl: (url: string) => set({ currentUrl: url }),

      markFragment: (fragment: MarkedFragment) => {
        const { markedFragments } = get();
        if (!markedFragments.some((f) => f.id === fragment.id)) {
          set({ markedFragments: [...markedFragments, fragment] });
        }
      },

      unmarkBlock: (sourceBlockId: string) => {
        const { markedFragments, linkedPairs } = get();
        const removed = new Set(
          markedFragments.filter((f) => f.sourceBlockId === sourceBlockId).map((f) => f.id)
        );
        if (removed.size === 0) return;
        set({
          markedFragments: markedFragments.filter((f) => f.sourceBlockId !== sourceBlockId),
          linkedPairs: linkedPairs.filter((p) => !removed.has(p.a) && !removed.has(p.b)),
        });
      },

      isFragmentMarked: (sourceBlockId: string) =>
        get().markedFragments.some((f) => f.sourceBlockId === sourceBlockId),

      addNote: (fragmentId: string, note: string) => {
        const { markedFragments } = get();
        set({
          markedFragments: markedFragments.map((f) =>
            f.id === fragmentId ? { ...f, note } : f
          ),
        });
      },

      linkFragments: (a: string, b: string) => {
        const { linkedPairs } = get();
        if (!linkedPairs.some((p) => (p.a === a && p.b === b) || (p.a === b && p.b === a))) {
          set({ linkedPairs: [...linkedPairs, { a, b }] });
        }
      },

      unlinkFragments: (a: string, b: string) => {
        const { linkedPairs } = get();
        set({
          linkedPairs: linkedPairs.filter(
            (p) => !((p.a === a && p.b === b) || (p.a === b && p.b === a))
          ),
        });
      },

      submitToCollectionBox: () => {
        const { markedFragments, submissions } = get();
        const stats = computeCollectionStats(markedFragments);
        const passed = stats.meetsThresholds;

        const submission: CollectionSubmission = {
          id: `sub-${Date.now()}`,
          submittedAt: Date.now(),
          fragments: [...markedFragments],
          validClueCount: stats.validClueCount,
          invalidClueCount: stats.invalidClueCount,
          collectionRate: stats.collectionRate,
          errorRate: stats.errorRate,
          passed,
          attemptNumber: submissions.length + 1,
          feedback: passed
            ? '✅ 收集箱审核通过！专案组感谢您的贡献，已采纳相关线索并展开进一步调查。'
            : `❌ 审核不通过。线索收集度：${stats.collectionPercent}%（需≥${
                PASS_COLLECTION_RATE * 100
              }%），错误判定率：${stats.errorPercent}%（需≤50%）。建议继续调查后重新提交。`,
        };

        const newSubmissions = [...submissions, submission];
        // 三次提交均未通过 → 坏结局
        const badEnding = !passed && newSubmissions.length >= MAX_SUBMISSIONS;

        set({
          submissions: newSubmissions,
          submissionCount: newSubmissions.length,
          currentPhase: passed ? 2 : 1,
          teamUnlocked: passed,
          ending: badEnding ? 'bad' : null,
        });

        return submission;
      },

      canSubmit: () => {
        const { submissionCount, markedFragments } = get();
        return submissionCount < MAX_SUBMISSIONS && markedFragments.length > 0;
      },

      completeInvestigation: (id: string) => {
        const { completedInvestigations } = get();
        if (!completedInvestigations.includes(id)) {
          set({ completedInvestigations: [...completedInvestigations, id] });
        }
      },

      interrogateSuspect: (id: string) => {
        const { interrogatedSuspects } = get();
        if (!interrogatedSuspects.includes(id)) {
          set({ interrogatedSuspects: [...interrogatedSuspects, id] });
        }
      },

      setFinalAnswer: (answer: string) => set({ finalAnswer: answer }),

      calculateEnding: () => {
        const { finalAnswer, markedFragments } = get();
        const { collectionRate } = computeCollectionStats(markedFragments);
        const isCorrect = finalAnswer === CORRECT_ANSWER_ID;
        const ending =
          isCorrect && collectionRate >= PASS_COLLECTION_RATE ? 'good' : 'bad';
        set({ ending });
      },

      resetGame: () =>
        set({
          gameStarted: false,
          playerName: '',
          currentPhase: 1,
          teamUnlocked: false,
          visitedPages: [],
          searchHistory: [],
          currentUrl: '/',
          markedFragments: [],
          linkedPairs: [],
          submissions: [],
          submissionCount: 0,
          completedInvestigations: [],
          interrogatedSuspects: [],
          finalAnswer: null,
          ending: null,
          hasSeenHotPosts: false,
        }),

      markHotPostsSeen: () => set({ hasSeenHotPosts: true }),
    }),
    {
      // 存档 key 保持不变：碎片 id 规则未变，旧存档可继续使用。
      name: 'darkweb-game-v2',
    }
  )
);
