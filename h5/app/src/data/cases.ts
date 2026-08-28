import { CHAPTERS, type Chapter } from './chapters';
import { SUSPECTS, type Suspect } from './suspects';
import { ALL_CLUES, type Clue } from './clues';
import { REASONING_QUESTION, REASONING_OPTIONS, type ReasoningOption } from './reasoning';

export type CaseClassification = 'A' | 'B' | 'C';
export type CaseStatus = 'active' | 'cold' | 'closed';

export interface CaseData {
  id: string;
  caseNumber: string;
  title: string;
  classification: CaseClassification;
  status: CaseStatus;
  summary: string;
  keyFacts: string[];
  startDate: string;
  coverEmoji: string;
  chapters: Chapter[];
  suspects: Suspect[];
  clues: Clue[];
  totalClueCount: number;
  reasoningQuestion: string;
  reasoningOptions: ReasoningOption[];
}

export const CASES: CaseData[] = [
  {
    id: 'case-001',
    caseNumber: 'XC-2026-0312',
    title: '连环女性碎尸抛尸案',
    classification: 'A',
    status: 'active',
    summary:
      '近三个月内，本市连续发生3起女性失踪案。失踪者均为外地务工年轻女性，失踪前均现身城郊连锁酒店。此后在环城高速不同匝道绿化带中发现被分尸的遗体残块，作案周期固定为每18天1起。',
    keyFacts: [
      '近三个月内连续发生 3起女性失踪案，失踪者均为外地务工年轻女性',
      '受害者失踪前均现身城郊"如家快捷"连锁酒店，酒店有无死角监控',
      '尸块被分别抛至环城高速不同匝道的绿化带，包裹物为黑色垃圾袋+保鲜膜',
      '作案周期固定为每18天1起，预计下次作案时间迫近',
    ],
    startDate: '2026-03-12',
    coverEmoji: '🔪',
    chapters: CHAPTERS,
    suspects: SUSPECTS,
    clues: ALL_CLUES,
    totalClueCount: ALL_CLUES.length,
    reasoningQuestion: REASONING_QUESTION,
    reasoningOptions: REASONING_OPTIONS,
  },
];

export function getCaseById(id: string): CaseData | undefined {
  return CASES.find((c) => c.id === id);
}
