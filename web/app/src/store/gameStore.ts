import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ========== 线索类型 ==========

export interface MarkedFragment {
  id: string;
  sourcePageId: string;
  sourceBlockId: string;
  content: string;
  sourceTitle: string;
  sourceUrl: string;
  note?: string;
  category?: string;
  linkedTo?: string[];
  isValidClue: boolean;
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

// 23条有效线索的ID列表
export const VALID_CLUE_IDS = [
  'E01', 'E02', 'E03', 'E04', 'E05', 'E06',
  'F01', 'F02', 'F03', 'F04', 'F05', 'F06',
  'S01', 'S02', 'S03', 'S04',
  'T01', 'T02', 'T03',
  'P01', 'P02', 'P03', 'P04',
];

export const TOTAL_CLUE_COUNT = VALID_CLUE_IDS.length; // 23

// 论坛帖子中包含的线索映射
export const POST_CLUE_MAP: Record<string, string[]> = {
  'post-3': ['S04'],
  'post-4': ['S02', 'S03'],
  'post-5': ['P01'],
  'post-6': ['E05', 'T02'],
  'post-7': ['P04'],
  'post-8': ['T01', 'E03', 'E04'],
  'post-9': ['F03'],
  'post-11': ['T03'],
  'post-12': ['P03'],
};

// 新闻中包含的线索映射
export const NEWS_CLUE_MAP: Record<string, string[]> = {
  'news-3': ['F01', 'F02', 'E02', 'E06'],
  'news-5': ['T01', 'E03', 'E04'],
  'news-6': ['E01'],
  'news-7': ['S01'],
  'news-8': ['P01'],
};

// 人物资料中包含的线索映射
export const PROFILE_CLUE_MAP: Record<string, string[]> = {
  'profile-a': ['E05'], // 张运来 - 山茶种植园关联
  'profile-b': ['F04', 'F05', 'S03', 'P02'], // 李文彬 - 医用酒精、口罩、医学背景
  'profile-c': [], // 赵刚 - 无直接线索（F03已在论坛）
  'profile-d': [], // 周明 - 无直接线索
};

// ========== 游戏状态 ==========

interface GameState {
  // 基础
  gameStarted: boolean;
  playerName: string;

  // 阶段
  currentPhase: 1 | 2 | 3;
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

  // Phase 3 状态
  completedInvestigations: string[];
  interrogatedSuspects: string[];
  finalAnswer: string | null;
  ending: 'good' | 'bad' | null;

  // 辅助
  notebook: string;

  // 提示系统
  hasSeenHotPosts: boolean;
  hasSeenForumHint: boolean;
  lastActivityTime: number;

  // ===== Actions =====
  startGame: (name: string) => void;
  recordPageVisit: (pageId: string) => void;
  recordSearch: (keyword: string) => void;
  setCurrentUrl: (url: string) => void;

  markFragment: (fragment: MarkedFragment) => void;
  unmarkFragment: (fragmentId: string) => void;
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

  updateNotebook: (text: string) => void;
  resetGame: () => void;

  // 提示
  markHotPostsSeen: () => void;
  markForumHintSeen: () => void;
  updateActivityTime: () => void;
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

      notebook: '',
      hasSeenHotPosts: false,
      hasSeenForumHint: false,
      lastActivityTime: Date.now(),

      // ===== Actions =====

      startGame: (name: string) =>
        set({
          gameStarted: true,
          playerName: name,
          currentPhase: 1,
          lastActivityTime: Date.now(),
        }),

      recordPageVisit: (pageId: string) => {
        const { visitedPages } = get();
        if (!visitedPages.includes(pageId)) {
          set({ visitedPages: [...visitedPages, pageId], lastActivityTime: Date.now() });
        } else {
          set({ lastActivityTime: Date.now() });
        }
      },

      recordSearch: (keyword: string) => {
        const { searchHistory } = get();
        if (!searchHistory.includes(keyword)) {
          set({
            searchHistory: [...searchHistory, keyword],
            lastActivityTime: Date.now(),
          });
        }
      },

      setCurrentUrl: (url: string) => set({ currentUrl: url }),

      markFragment: (fragment: MarkedFragment) => {
        const { markedFragments } = get();
        if (!markedFragments.some((f) => f.id === fragment.id)) {
          set({
            markedFragments: [...markedFragments, fragment],
            lastActivityTime: Date.now(),
          });
        }
      },

      unmarkFragment: (fragmentId: string) => {
        const { markedFragments, linkedPairs } = get();
        set({
          markedFragments: markedFragments.filter((f) => f.id !== fragmentId),
          linkedPairs: linkedPairs.filter((p) => p.a !== fragmentId && p.b !== fragmentId),
          lastActivityTime: Date.now(),
        });
      },

      isFragmentMarked: (sourceBlockId: string) => {
        return get().markedFragments.some((f) => f.sourceBlockId === sourceBlockId);
      },

      addNote: (fragmentId: string, note: string) => {
        const { markedFragments } = get();
        set({
          markedFragments: markedFragments.map((f) =>
            f.id === fragmentId ? { ...f, note } : f
          ),
          lastActivityTime: Date.now(),
        });
      },

      linkFragments: (a: string, b: string) => {
        const { linkedPairs } = get();
        if (!linkedPairs.some((p) => (p.a === a && p.b === b) || (p.a === b && p.b === a))) {
          set({ linkedPairs: [...linkedPairs, { a, b }], lastActivityTime: Date.now() });
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
        const uniqueValidClueIds = new Set(
          markedFragments.filter((f) => f.isValidClue && f.clueId).map((f) => f.clueId)
        );
        const validClueCount = uniqueValidClueIds.size;
        const invalidClueCount = markedFragments.filter((f) => !f.isValidClue).length;
        const totalMarked = markedFragments.length;
        const collectionRate = totalMarked > 0 ? validClueCount / TOTAL_CLUE_COUNT : 0;
        const errorRate = totalMarked > 0 ? invalidClueCount / totalMarked : 0;
        const passed = collectionRate >= 0.95 && errorRate <= 0.5;

        const submission: CollectionSubmission = {
          id: `sub-${Date.now()}`,
          submittedAt: Date.now(),
          fragments: [...markedFragments],
          validClueCount,
          invalidClueCount,
          collectionRate,
          errorRate,
          passed,
          attemptNumber: submissions.length + 1,
          feedback: passed
            ? '✅ 收集箱审核通过！专案组感谢您的贡献，已采纳相关线索并展开进一步调查。'
            : `❌ 审核不通过。线索收集度：${Math.round(collectionRate * 100)}%（需≥95%），错误判定率：${Math.round(errorRate * 100)}%（需≤50%）。建议继续调查后重新提交。`,
        };

        const newSubmissions = [...submissions, submission];
        const newPhase = passed ? 2 : 1;
        // 3次不通过 → 坏结局
        const badEnding = !passed && newSubmissions.length >= 3;

        set({
          submissions: newSubmissions,
          submissionCount: newSubmissions.length,
          currentPhase: badEnding ? 3 : newPhase, // 坏结局也进入Phase 3但直接跳结局
          teamUnlocked: passed,
          ending: badEnding ? 'bad' : null,
          lastActivityTime: Date.now(),
        });

        return submission;
      },

      canSubmit: () => {
        const { submissionCount, markedFragments } = get();
        return submissionCount < 3 && markedFragments.length > 0;
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
        const uniqueValidClueIds = new Set(
          markedFragments.filter((f) => f.isValidClue && f.clueId).map((f) => f.clueId)
        );
        const validClueCount = uniqueValidClueIds.size;
        const collectionRate = validClueCount / TOTAL_CLUE_COUNT;
        const isCorrect = finalAnswer === 'B';
        const ending = isCorrect && collectionRate >= 0.95 ? 'good' : 'bad';
        set({ ending });
      },

      updateNotebook: (text: string) => set({ notebook: text }),

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
          notebook: '',
          hasSeenHotPosts: false,
          hasSeenForumHint: false,
          lastActivityTime: Date.now(),
        }),

      markHotPostsSeen: () => set({ hasSeenHotPosts: true }),
      markForumHintSeen: () => set({ hasSeenForumHint: true }),
      updateActivityTime: () => set({ lastActivityTime: Date.now() }),
    }),
    {
      name: 'darkweb-game-v2',
    }
  )
);