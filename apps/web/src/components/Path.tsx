import type { Card } from '../content/types';
import type { Progress } from '../store/progress';

export const STEPS = ['hook', 'explore', 'formalise', 'practise', 'check'] as const;
export type Step = typeof STEPS[number];
export const STEP_LABEL: Record<Step, string> = { hook: 'Hook', explore: 'Explore', formalise: 'Formalise', practise: 'Practise', check: 'Check' };
export const stepsOf = (card: Card): Step[] => STEPS.filter(s => (s === 'explore' ? !!card.explore : s === 'practise' ? !!card.practise : true));

/** The card's own path (hook → explore → formalise → practise → check), one segment per step it has. */
export function Path({ card, p }: { card: Card; p: Progress }) {
  const prog = p.cards[card.id];
  const steps = stepsOf(card);
  const doneN = steps.filter(s => prog?.steps[s]).length;
  const firstOpen = prog?.completedAt ? -1 : steps.findIndex(s => !prog?.steps[s]);
  const label = prog?.completedAt ? 'All steps done' : `${doneN} of ${steps.length} steps done`;
  return (
    <span className="path" role="img" aria-label={label} title={steps.map(s => `${STEP_LABEL[s]}${prog?.steps[s] ? ' (done)' : ''}`).join(' → ')}>
      {steps.map((s, i) => <i key={s} className={prog?.completedAt || prog?.steps[s] ? 'done' : i === firstOpen && doneN > 0 ? 'now' : ''} />)}
    </span>
  );
}

export function cardState(card: Card, p: Progress): 'done' | 'started' | 'new' {
  const prog = p.cards[card.id];
  if (prog?.completedAt) return 'done';
  if (prog && Object.values(prog.steps).some(Boolean)) return 'started';
  return 'new';
}
