import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { canEnterReasoning, canEnterTeam, canViewEnding, type GateState } from '../store/routeGates';

/**
 * 路由级门槛。
 * 之前只有工作台页面内部做重定向，直接敲 URL 仍能进 Phase 3；
 * 这里把门槛提到路由层，页面组件不再承担守卫职责。
 *
 * 判定逻辑本身在 store/routeGates.ts（纯函数，可被自检脚本直接测试）。
 */

/**
 * 逐字段订阅。
 * 注意不要写成 `useGameStore((s) => ({ ... }))` —— 每次都会返回新对象，
 * zustand v5 默认用引用比较，会导致无限重渲染。
 */
function useGateState(): GateState {
  const teamUnlocked = useGameStore((s) => s.teamUnlocked);
  const completedInvestigations = useGameStore((s) => s.completedInvestigations);
  const interrogatedSuspects = useGameStore((s) => s.interrogatedSuspects);
  const finalAnswer = useGameStore((s) => s.finalAnswer);
  const ending = useGameStore((s) => s.ending);
  return { teamUnlocked, completedInvestigations, interrogatedSuspects, finalAnswer, ending };
}

export function RequireTeam({ children }: { children: ReactNode }) {
  const state = useGateState();
  if (!canEnterTeam(state)) {
    return <Navigate to="/collection-box" replace />;
  }
  return <>{children}</>;
}

export function RequireReasoningReady({ children }: { children: ReactNode }) {
  const state = useGateState();
  if (!canEnterTeam(state)) {
    return <Navigate to="/collection-box" replace />;
  }
  if (!canEnterReasoning(state)) {
    return <Navigate to="/team" replace />;
  }
  return <>{children}</>;
}

export function RequireEnding({ children }: { children: ReactNode }) {
  const state = useGateState();
  if (!canViewEnding(state)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
