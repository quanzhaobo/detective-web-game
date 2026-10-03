import { CHAPTERS } from '../data/chapters.ts';
import { SUSPECTS } from '../data/suspects.ts';

/**
 * 路由门槛的判定逻辑（纯函数，不依赖 React）。
 *
 * 单独抽出来是为了能被 scripts/playthrough.mjs 直接测到：
 * 门槛写错只会表现为「某个页面进不去」，构建、类型检查、lint 全都不会报错。
 * 这里曾经真实发生过一次事故 —— 结局页被要求「必须已作答」，
 * 而三次提交失败触发的坏结局根本没有作答环节，导致玩家卡死在收集箱。
 */

export interface GateState {
  teamUnlocked: boolean;
  completedInvestigations: string[];
  interrogatedSuspects: string[];
  finalAnswer: string | null;
  ending: 'good' | 'bad' | null;
}

export function canEnterTeam(state: GateState): boolean {
  return state.teamUnlocked;
}

export function canEnterReasoning(state: GateState): boolean {
  return (
    state.teamUnlocked &&
    state.completedInvestigations.length >= CHAPTERS.length &&
    state.interrogatedSuspects.length >= SUSPECTS.length
  );
}

/**
 * 结局页的准入条件：**已经产生了结局**。
 *
 * 注意不能写成「必须已作答」—— 三条路都会进结局页：
 *   1. 最终推理答对 + 收集率达标  → ending = 'good'，有 finalAnswer
 *   2. 最终推理答错或收集率不足   → ending = 'bad'，有 finalAnswer
 *   3. 收集箱三次提交均未通过     → ending = 'bad'，**没有 finalAnswer**
 * 第 3 条路上玩家永远进不了专案组，若这里要求 finalAnswer，就会被永久卡住。
 */
export function canViewEnding(state: GateState): boolean {
  return state.ending !== null || state.finalAnswer !== null;
}
