import { coreCards, type Chapter, type Unit } from '../content/types';
import { UNITS } from '../content/units';
import { isMastered, type Progress } from './progress';

export function chapterCompletion(p: Progress, ch: Chapter): number {
  const cards = coreCards(ch);
  if (!cards.length) return 0;
  return cards.filter(c => p.cards[c.id]?.completedAt).length / cards.length;
}

/** A unit is unlocked when every concept taught in the previous unit's cards is mastered (or the previous unit has no content yet). */
export function unitUnlocked(p: Progress, u: Unit, chapters: Chapter[]): boolean {
  const idx = UNITS.findIndex(x => x.id === u.id);
  if (idx <= 0) return true;
  const prev = UNITS[idx - 1];
  const concepts = new Set(chapters.filter(c => prev.chapters.includes(c.number)).flatMap(c => c.cards).flatMap(c => c.concepts));
  if (concepts.size === 0) return true;
  return [...concepts].every(c => isMastered(p, c));
}

export function cardComplete(p: Progress, cardId: string): boolean { return !!p.cards[cardId]?.completedAt; }
