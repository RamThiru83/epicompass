/**
 * The student's own OpenRouter connection. The key is obtained with OpenRouter's OAuth (PKCE) flow, so the
 * student never copies a key, and it is kept in this browser only: requests go straight from the browser to
 * OpenRouter. EpiCompass's database never sees the key or the conversation.
 */
import { useSyncExternalStore } from 'react';
import { FREE_MODELS, LOW_COST_MODELS, type ModelPlan } from './models';

const API = 'https://openrouter.ai/api/v1';
const K_KEY = 'epicompass.or.key';
const K_PLAN = 'epicompass.or.plan';
const K_PKCE = 'epicompass.or.pkce';

const ls = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string | null) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

interface State { key: string | null; plan: ModelPlan; connecting: boolean; error: string | null }
let st: State = { key: ls.get(K_KEY), plan: ls.get(K_PLAN) === 'low-cost' ? 'low-cost' : 'free', connecting: false, error: null };
const subs = new Set<() => void>();
const set = (p: Partial<State>) => { st = { ...st, ...p }; subs.forEach(f => f()); };
export const useOpenRouter = () => useSyncExternalStore(f => { subs.add(f); return () => subs.delete(f); }, () => st);

export function setPlan(plan: ModelPlan) { ls.set(K_PLAN, plan); set({ plan }); }
export function disconnect() { ls.set(K_KEY, null); set({ key: null, error: null }); }
/** Fallback for students who already have a key: paste it instead of connecting. */
export function pasteKey(key: string) { const k = key.trim(); if (!/^sk-or-/.test(k)) return 'That does not look like an OpenRouter key (it should start with sk-or-).'; ls.set(K_KEY, k); set({ key: k, error: null }); return null; }

const b64url = (b: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const randomString = (n = 48) => b64url(crypto.getRandomValues(new Uint8Array(n)));
const callbackUrl = () => location.origin + location.pathname;

/** Step 1: send the student to OpenRouter to sign in (or sign up) and approve EpiCompass. */
export async function connect() {
  const verifier = randomString();
  const challenge = b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
  const state = randomString(16);
  try { sessionStorage.setItem(K_PKCE, JSON.stringify({ verifier, state, back: location.hash || '#/' })); } catch { /* ignore */ }
  const q = new URLSearchParams({ callback_url: callbackUrl(), code_challenge: challenge, code_challenge_method: 'S256', state, key_label: 'EpiCompass study assistant' });
  location.assign(`https://openrouter.ai/auth?${q}`);
}

/** Step 2, on return: exchange the one-time code for the student's key. Returns the hash to go back to. */
export async function finishConnect(): Promise<string | null> {
  const q = new URLSearchParams(location.search);
  const code = q.get('code');
  if (!code) return null;
  let saved: { verifier: string; state: string; back: string } | null = null;
  try { saved = JSON.parse(sessionStorage.getItem(K_PKCE) ?? 'null'); sessionStorage.removeItem(K_PKCE); } catch { /* ignore */ }
  history.replaceState(null, '', location.pathname + (saved?.back ?? location.hash));
  if (!saved || (q.get('state') && q.get('state') !== saved.state)) { set({ error: 'The connection could not be verified. Please try connecting again.' }); return saved?.back ?? null; }
  set({ connecting: true, error: null });
  try {
    const r = await fetch(`${API}/auth/keys`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, code_verifier: saved.verifier, code_challenge_method: 'S256' }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.key) throw new Error(j?.error?.message ?? `OpenRouter returned ${r.status}`);
    ls.set(K_KEY, j.key); set({ key: j.key, connecting: false });
  } catch (e) {
    set({ connecting: false, error: `Connecting to OpenRouter failed: ${(e as Error).message}. Please try again.` });
  }
  return saved.back;
}

export interface KeyInfo { freeTier: boolean; freeLeft: number | null; freeLimit: number | null; creditLeft: number | null }
/** Free-question allowance and credit, for the quota line in the chat. */
export async function keyInfo(): Promise<KeyInfo | null> {
  if (!st.key) return null;
  try {
    const r = await fetch(`${API}/key`, { headers: { Authorization: `Bearer ${st.key}` } });
    if (r.status === 401) { disconnect(); set({ error: 'Your OpenRouter connection has expired or was removed. Please connect again.' }); return null; }
    const d = (await r.json())?.data; if (!d) return null;
    return { freeTier: !!d.is_free_tier, freeLeft: d.free_model_daily_requests?.remaining ?? null, freeLimit: d.free_model_daily_requests?.limit ?? null, creditLeft: d.limit_remaining ?? null };
  } catch { return null; }
}

export type ChatMsg = { role: 'system' | 'user' | 'assistant'; content: string };
export class AssistantError extends Error { constructor(msg: string, public kind: 'auth' | 'quota' | 'credit' | 'busy' | 'other') { super(msg); } }

/** Stream a reply. `onText` receives the reply so far. If a model returns nothing (some free models spend
 *  their whole allowance "thinking"), it is retried once with the remaining models. */
export async function chat(messages: ChatMsg[], onText: (s: string) => void, signal?: AbortSignal): Promise<{ text: string; model: string }> {
  if (!st.key) throw new AssistantError('Not connected', 'auth');
  if (st.plan === 'low-cost') {
    // Qwen on its own, so the "no data storage" filter can apply; any failure falls back to the free models
    try { const r = await once(LOW_COST_MODELS, messages, onText, signal); if (r.text.trim()) return r; }
    catch (e) { if (e instanceof AssistantError && e.kind === 'auth') throw e; if ((e as Error).name === 'AbortError') throw e; }
    onText('');
  }
  return freeChain(messages, onText, signal);
}

async function freeChain(messages: ChatMsg[], onText: (s: string) => void, signal?: AbortSignal): Promise<{ text: string; model: string }> {
  const all = FREE_MODELS;
  // OpenRouter accepts at most 3 models per request; a second try uses the ones not tried yet
  const first = all.slice(0, 3);
  const second = all.slice(3);
  let r: { text: string; model: string };
  try { r = await once(first, messages, onText, signal); }
  catch (e) { if (e instanceof AssistantError && e.kind === 'busy' && second.length) return once(second, messages, onText, signal); throw e; }
  if (r.text.trim()) return r;
  const retry = [...first.filter(m => m !== r.model && m !== `${r.model}:free`), ...second].slice(0, 3);
  return retry.length ? once(retry, messages, onText, signal) : r;
}

async function once(models: string[], messages: ChatMsg[], onText: (s: string) => void, signal?: AbortSignal): Promise<{ text: string; model: string }> {
  const r = await fetch(`${API}/chat/completions`, {
    method: 'POST', signal,
    headers: { Authorization: `Bearer ${st.key}`, 'Content-Type': 'application/json', 'HTTP-Referer': callbackUrl(), 'X-OpenRouter-Title': 'EpiCompass', 'X-Title': 'EpiCompass' },
    body: JSON.stringify({
      models, messages, stream: true, temperature: 0.3, max_tokens: 3000,
      // keep "thinking" short and out of the reply, so it cannot use up the answer
      reasoning: { effort: 'low', exclude: true },
      // paid models can avoid providers that store prompts; the free ones are only offered by such providers
      ...(models.every(m => !m.endsWith(':free')) ? { provider: { data_collection: 'deny' } } : {}),
    }),
  });
  if (!r.ok || !r.body) {
    const j = await r.json().catch(() => ({}));
    const m: string = j?.error?.message ?? '';
    const raw = JSON.stringify(j?.error?.metadata ?? {});
    if (r.status === 401) { disconnect(); throw new AssistantError('Your OpenRouter connection has expired or was removed. Please connect again.', 'auth'); }
    if (r.status === 429 && /upstream|provider/i.test(m + raw)) throw new AssistantError('The free AI models are busy just now. Please try again in a minute.', 'busy');
    if (r.status === 429) throw new AssistantError('You have reached OpenRouter’s limit for free questions for now (20 a minute, and 50 a day on a free account). Try again later, or tomorrow.', 'quota');
    if (r.status === 402) throw new AssistantError('Your OpenRouter account needs credit for this model. Switch to the free models in My progress and settings, or add credit at openrouter.ai.', 'credit');
    if (r.status >= 500) throw new AssistantError('The AI models are busy just now. Please try again in a minute.', 'busy');
    throw new AssistantError(m || `OpenRouter returned an error (${r.status}).`, 'other');
  }
  const reader = r.body.getReader(); const dec = new TextDecoder();
  let buf = '', text = '', model = '';
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    buf += dec.decode(value, { stream: true });
    let i: number;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim(); if (data === '[DONE]') continue;
      let j: any;
      try { j = JSON.parse(data); } catch { continue; }
      model = j.model ?? model;
      if (j.error && !text) throw new AssistantError('The AI model stopped with an error. Please try again in a minute.', 'busy');
      const d = j.choices?.[0]?.delta?.content; if (d) { text += d; onText(text); }
    }
  }
  return { text, model };
}
