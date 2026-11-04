/**
 * Kenny on the course's Claude API credit. Questions go from the browser to the Supabase Edge Function
 * "kenny" with the student's sign-in; the function holds the API key, applies the daily limit and streams
 * the reply. Claude Haiku answers first; Claude Sonnet takes over when the student is struggling.
 */
import { useSyncExternalStore } from 'react';
import { supabase, cloudEnabled } from '../lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';
import { AssistantError, type ChatMsg } from './openrouter';

const FN = `${SUPABASE_URL}/functions/v1/kenny`;
const K_SOURCE = 'epicompass.kenny.source';

/** Which account Kenny runs on: the course's (default) or the student's own OpenRouter account. */
export type Source = 'course' | 'openrouter';
const readSource = (): Source => { try { return localStorage.getItem(K_SOURCE) === 'openrouter' ? 'openrouter' : 'course'; } catch { return 'course'; } };

interface Status { checked: boolean; enabled: boolean; daily: number | null; source: Source }
let st: Status = { checked: false, enabled: false, daily: null, source: readSource() };
const subs = new Set<() => void>();
const set = (p: Partial<Status>) => { st = { ...st, ...p }; subs.forEach(f => f()); };
export const useCourseKenny = () => useSyncExternalStore(f => { subs.add(f); return () => subs.delete(f); }, () => st);

export function setSource(source: Source) { try { localStorage.setItem(K_SOURCE, source); } catch { /* storage unavailable */ } set({ source }); }

/** Ask the function whether the course credit is switched on. */
export async function checkCourse(): Promise<void> {
  if (!cloudEnabled) { set({ checked: true, enabled: false }); return; }
  try {
    const r = await fetch(FN, { headers: { apikey: SUPABASE_ANON_KEY } });
    const j = r.ok ? await r.json() : null;
    set({ checked: true, enabled: !!j?.enabled, daily: j?.daily ?? null });
  } catch { set({ checked: true, enabled: false }); }
}

/** Questions the signed-in student has left today on the course account. */
export async function questionsLeft(): Promise<number | null> {
  if (!supabase || !st.daily) return null;
  const { data, error } = await supabase.rpc('kenny_left', { daily_limit: st.daily });
  return error ? null : (data as number);
}

/**
 * Has the student not followed an earlier explanation? True when Kenny has already answered in this
 * conversation and the new message says so, asks again, or repeats a quick action on the same passage.
 */
const CONFUSED = /\b(don'?t|do not|didn'?t|did not|still( don'?t| not)?|can'?t|cannot)\b.{0,25}\b(get|understand|follow|see|clear)|\bconfus|\bnot clear|\bunclear|\blost\b|\bsimpler|\bexplain (it )?(again|differently|another way)|\banother way|\bwhat do you mean|\bi'?m not sure|\bhuh\b|\bsorry\??$/i;
export function isStruggling(history: { role: string; content: string; excerpt?: string; label?: string }[]): boolean {
  const users = history.filter(t => t.role === 'user');
  if (!history.some(t => t.role === 'assistant') || users.length < 2) return false;
  const last = users[users.length - 1], prev = users[users.length - 2];
  if (CONFUSED.test(last.label ?? last.content)) return true;
  // the same quick action on the same passage, or the same question typed again
  const norm = (t: { label?: string }) => (t.label ?? '').trim().toLowerCase();
  if (last.excerpt && last.excerpt === prev.excerpt && last.label === prev.label) return true;
  return norm(last) !== '' && norm(last) === norm(prev);
}

export async function courseChat(messages: ChatMsg[], struggling: boolean, onText: (s: string) => void, signal?: AbortSignal): Promise<{ text: string; model: string; left: number | null }> {
  if (!supabase) throw new AssistantError('Kenny on the course account needs the online version of EpiCompass.', 'other');
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new AssistantError('Please sign in to use Kenny on the course account.', 'auth');
  const system = messages.find(m => m.role === 'system')?.content ?? '';
  const rest = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content.slice(0, 6000) }));
  const r = await fetch(FN, {
    method: 'POST', signal,
    headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, messages: rest, struggling }),
  });
  if (!r.ok || !r.body) {
    const j = await r.json().catch(() => ({}));
    const kind = (['auth', 'quota', 'busy'] as const).find(k => k === j?.error) ?? (j?.error === 'unavailable' ? 'credit' : 'other');
    if (j?.error === 'unavailable') set({ enabled: false });
    throw new AssistantError(j?.message ?? `Kenny could not answer (error ${r.status}). Please try again.`, kind);
  }
  const reader = r.body.getReader(); const dec = new TextDecoder();
  let buf = '', text = '', model = '', left: number | null = null;
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    buf += dec.decode(value, { stream: true });
    let i: number;
    while ((i = buf.indexOf('\n\n')) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 2);
      if (!line.startsWith('data:')) continue;
      let j: any; try { j = JSON.parse(line.slice(5)); } catch { continue; }
      if (typeof j.t === 'string') { text = j.t; onText(text); }
      if (j.error && !text) throw new AssistantError(j.message ?? 'Kenny stopped part-way. Please try again.', 'busy');
      if (j.done) { model = j.model ?? ''; left = j.left ?? null; }
    }
  }
  return { text, model, left };
}

checkCourse();
