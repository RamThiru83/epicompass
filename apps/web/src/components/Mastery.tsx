/** Mastery display used wherever a learner sees their own estimate.
 *  One attempt says very little, so the estimate is shown as "Learning" until there are two;
 *  the 85% mastery line is always drawn so the bar reads as distance to a goal, not a grade. */
import type { MasteryState } from '../store/progress';
import { MASTERY_THRESHOLD } from '@epicompass/epi-core';

export const MIN_ATTEMPTS = 2;

/** Percent shown for an estimate. Below the line it rounds down, so 84.6% never reads as "85%" while not yet mastered. */
export function masteryPct(pKnown: number): string {
  return `${pKnown >= MASTERY_THRESHOLD ? Math.round(pKnown * 100) : Math.floor(pKnown * 100)}%`;
}

export function masteryText(m?: Pick<MasteryState, 'pKnown' | 'attempts'>): string {
  if (!m || !m.attempts) return 'Not started';
  if (m.attempts < MIN_ATTEMPTS) return 'Learning';
  return `${m.pKnown >= MASTERY_THRESHOLD ? 'Mastered' : 'Learning'} · ${masteryPct(m.pKnown)}`;
}

/** `from` draws where the estimate stood before (the end-of-card view). */
export function MasteryMeter({ m, from }: { m?: Pick<MasteryState, 'pKnown' | 'attempts'>; from?: number }) {
  const early = !m || m.attempts < MIN_ATTEMPTS;
  const v = m && m.attempts ? m.pKnown : 0;
  return (
    <div className={`meter ${early ? 'early' : ''}`} aria-hidden>
      {from !== undefined && !early && <i className="was" style={{ width: `${from * 100}%` }} />}
      <i style={{ width: `${(early ? Math.min(v, 0.35) : v) * 100}%` }} />
      <b style={{ left: `${MASTERY_THRESHOLD * 100}%` }} />
    </div>
  );
}
