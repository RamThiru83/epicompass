/**
 * Learner progress, held in localStorage for v0.1. The shape mirrors the planned Supabase tables
 * (mastery, attempts, card_progress) so a later sync layer is a straight mapping.
 */
import { useSyncExternalStore } from 'react';
import { bktUpdate, DEFAULT_BKT, MASTERY_THRESHOLD, nextDueDays } from '@epicompass/epi-core';

export interface MasteryState { pKnown: number; attempts: number; streak: number; lastSeen: number; nextDue: number }
export interface CardProgress { steps: Record<string, boolean>; completedAt?: number; exercisesPassed: number }
export interface Attempt { t: number; cardId: string; itemId: string; concept: string; correct: boolean }

export interface Progress {
  version: 1;
  mastery: Record<string, MasteryState>;
  cards: Record<string, CardProgress>;
  attempts: Attempt[];
  settings: { hardGates: boolean; learnerName: string };
}

const KEY = 'epicompass.progress.v1';
const empty = (): Progress => ({ version: 1, mastery: {}, cards: {}, attempts: [], settings: { hardGates: false, learnerName: '' } });

let state: Progress = load();
const listeners = new Set<() => void>();

function load(): Progress {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...empty(), ...JSON.parse(raw) }; } catch { /* storage unavailable */ }
  return empty();
}
function commit(next: Progress) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  listeners.forEach(l => l());
}

export function useProgress(): Progress {
  return useSyncExternalStore(l => { listeners.add(l); return () => listeners.delete(l); }, () => state);
}

export function recordAttempt(cardId: string, itemId: string, concept: string, correct: boolean) {
  const m = state.mastery[concept] ?? { pKnown: DEFAULT_BKT.pInit, attempts: 0, streak: 0, lastSeen: 0, nextDue: 0 };
  const streak = correct ? m.streak + 1 : 0;
  const now = Date.now();
  const next: MasteryState = {
    pKnown: bktUpdate(m.pKnown, correct), attempts: m.attempts + 1, streak, lastSeen: now,
    nextDue: now + nextDueDays(streak) * 86400000,
  };
  commit({ ...state, mastery: { ...state.mastery, [concept]: next }, attempts: [...state.attempts.slice(-999), { t: now, cardId, itemId, concept, correct }] });
}

export function markStep(cardId: string, step: string, done = true) {
  const c = state.cards[cardId] ?? { steps: {}, exercisesPassed: 0 };
  commit({ ...state, cards: { ...state.cards, [cardId]: { ...c, steps: { ...c.steps, [step]: done } } } });
}
export function exercisePassed(cardId: string) {
  const c = state.cards[cardId] ?? { steps: {}, exercisesPassed: 0 };
  commit({ ...state, cards: { ...state.cards, [cardId]: { ...c, exercisesPassed: c.exercisesPassed + 1 } } });
}
export function completeCard(cardId: string) {
  const c = state.cards[cardId] ?? { steps: {}, exercisesPassed: 0 };
  commit({ ...state, cards: { ...state.cards, [cardId]: { ...c, completedAt: Date.now() } } });
}
export function setSettings(patch: Partial<Progress['settings']>) {
  commit({ ...state, settings: { ...state.settings, ...patch } });
}
export function resetProgress() { commit(empty()); }

export function isMastered(p: Progress, concept: string): boolean {
  return (p.mastery[concept]?.pKnown ?? 0) >= MASTERY_THRESHOLD;
}
/** Concepts whose review is due (spaced retrieval). */
export function dueConcepts(p: Progress, now = Date.now()): string[] {
  return Object.entries(p.mastery).filter(([, m]) => m.attempts > 0 && m.nextDue <= now && m.pKnown < 0.97).map(([id]) => id);
}
