/**
 * Learner progress. Always cached in localStorage (one slot per signed-in user, plus a guest slot);
 * when a student is signed in, every change is also pushed to Supabase (see store/sync.ts).
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
  settings: { hardGates: boolean; learnerName: string; editor: boolean };
}

const GUEST_KEY = 'epicompass.progress.v1';
let key = GUEST_KEY;
export const emptyProgress = (): Progress => ({ version: 1, mastery: {}, cards: {}, attempts: [], settings: { hardGates: false, learnerName: '', editor: false } });

const empty = emptyProgress;
const listeners = new Set<() => void>();
const changeHooks = new Set<(p: Progress) => void>();

/** Fill in any fields missing from an older or partial saved document. */
export function normalise(j: Partial<Progress> | null | undefined): Progress {
  const e = empty();
  if (!j || typeof j !== 'object') return e;
  return { ...e, ...j, mastery: j.mastery ?? {}, cards: j.cards ?? {}, attempts: j.attempts ?? [], settings: { ...e.settings, ...(j.settings ?? {}) } } as Progress;
}
function load(k: string): Progress {
  try { const raw = localStorage.getItem(k); if (raw) return normalise(JSON.parse(raw)); } catch { /* storage unavailable */ }
  return empty();
}
let state: Progress = load(key);

function commit(next: Progress, notify = true) {
  state = next;
  try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ }
  listeners.forEach(l => l());
  if (notify) changeHooks.forEach(h => h(next));
}

/** Subscribe to learner-driven changes (used by the cloud sync). */
export function onProgressChange(h: (p: Progress) => void) { changeHooks.add(h); return () => changeHooks.delete(h); }
export const getProgress = () => state;
export const guestProgress = () => load(GUEST_KEY);
export function clearGuestProgress() { try { localStorage.removeItem(GUEST_KEY); } catch { /* ignore */ } }

/** Switch to a user's local slot (or back to guest when userId is null) without triggering a cloud push. */
export function switchSlot(userId: string | null, initial?: Progress) {
  key = userId ? `epicompass.progress.u.${userId}` : GUEST_KEY;
  commit(initial ?? load(key), false);
}
/** Replace the current state, e.g. after merging with the cloud copy. */
export function replaceProgress(p: Progress, push = false) { commit(p, push); }

/**
 * Merge two progress documents (e.g. this device's and the cloud's) without losing work:
 * cards keep the union of completed steps, attempts are de-duplicated, and for each concept
 * the mastery estimate with more evidence (or, on a tie, the more recent) wins.
 */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const mastery: Progress['mastery'] = { ...a.mastery };
  for (const [k, m] of Object.entries(b.mastery)) {
    const x = mastery[k];
    if (!x || m.attempts > x.attempts || (m.attempts === x.attempts && m.lastSeen > x.lastSeen)) mastery[k] = m;
  }
  const cards: Progress['cards'] = { ...a.cards };
  for (const [k, c] of Object.entries(b.cards)) {
    const x = cards[k];
    if (!x) { cards[k] = c; continue; }
    const steps = { ...x.steps };
    for (const [s, v] of Object.entries(c.steps)) steps[s] = steps[s] || v;
    const done = [x.completedAt, c.completedAt].filter((v): v is number => typeof v === 'number');
    cards[k] = { steps, exercisesPassed: Math.max(x.exercisesPassed, c.exercisesPassed), completedAt: done.length ? Math.min(...done) : undefined };
  }
  const seen = new Set<string>();
  const attempts = [...a.attempts, ...b.attempts]
    .filter(t => { const id = `${t.t}|${t.itemId}`; if (seen.has(id)) return false; seen.add(id); return true; })
    .sort((x, y) => x.t - y.t).slice(-1000);
  return { version: 1, mastery, cards, attempts, settings: { ...b.settings, ...a.settings } };
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
