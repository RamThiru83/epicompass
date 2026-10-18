/**
 * Accounts and cloud sync. Students sign up with a cohort join code, their name, email and a password.
 * While signed in, progress is cached locally under the user's own slot and pushed to Supabase a couple of
 * seconds after each change. On sign-in, this device's guest progress and the cloud copy are merged.
 */
import { useSyncExternalStore } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import {
  getProgress, guestProgress, clearGuestProgress, mergeProgress, normalise, onProgressChange,
  replaceProgress, switchSlot, type Progress,
} from './progress';

export interface Profile { id: string; full_name: string; email: string; cohort_id: string | null; role: 'student' | 'instructor' }
export type SyncStatus = 'offline' | 'idle' | 'saving' | 'saved' | 'error';
interface AccountState { ready: boolean; session: Session | null; profile: Profile | null; cohortName: string | null; sync: SyncStatus; lastSaved?: number }

let st: AccountState = { ready: !supabase, session: null, profile: null, cohortName: null, sync: supabase ? 'idle' : 'offline' };
const subs = new Set<() => void>();
const set = (patch: Partial<AccountState>) => { st = { ...st, ...patch }; subs.forEach(f => f()); };
export const useAccount = () => useSyncExternalStore(f => { subs.add(f); return () => subs.delete(f); }, () => st);

// ---------------------------------------------------------------- cloud push (debounced)
let timer: ReturnType<typeof setTimeout> | undefined;
async function push(p: Progress) {
  if (!supabase || !st.session) return;
  set({ sync: 'saving' });
  const { error } = await supabase.from('progress').upsert({ user_id: st.session.user.id, data: p, updated_at: new Date().toISOString() });
  set(error ? { sync: 'error' } : { sync: 'saved', lastSaved: Date.now() });
}
onProgressChange(p => {
  if (!st.session) return;
  clearTimeout(timer);
  timer = setTimeout(() => push(p), 1500);
});
// Flush pending work when the tab is hidden (phones often never "close" a tab).
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && timer) { clearTimeout(timer); timer = undefined; push(getProgress()); }
});

// ---------------------------------------------------------------- session handling
async function loadUser(session: Session) {
  if (!supabase) return;
  const uid = session.user.id;
  const [{ data: prof }, { data: row }] = await Promise.all([
    supabase.from('profiles').select('id, full_name, email, cohort_id, role').eq('id', uid).maybeSingle(),
    supabase.from('progress').select('data').eq('user_id', uid).maybeSingle(),
  ]);
  let cohortName: string | null = null;
  if (prof?.cohort_id) {
    const { data: c } = await supabase.from('cohorts').select('name').eq('id', prof.cohort_id).maybeSingle();
    cohortName = c?.name ?? null;
  }
  // Merge: this user's cached slot + cloud copy + anything done as a guest on this device.
  switchSlot(uid);
  const local = getProgress();
  const guest = guestProgress();
  const merged = mergeProgress(mergeProgress(local, normalise(row?.data as Partial<Progress>)), guest);
  clearGuestProgress();
  replaceProgress(merged, false);
  set({ ready: true, session, profile: (prof as Profile) ?? null, cohortName });
  await push(merged);
}

if (supabase) {
  supabase.auth.getSession().then(({ data }) => { if (data.session) loadUser(data.session); else set({ ready: true }); });
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session && session.user.id !== st.session?.user.id) loadUser(session);
    if (event === 'SIGNED_OUT') { switchSlot(null); set({ session: null, profile: null, cohortName: null, sync: 'idle' }); }
  });
}

// ---------------------------------------------------------------- actions
const friendly = (m: string) =>
  /invalid login credentials/i.test(m) ? 'That email and password do not match. Check both, or ask your instructor to reset your password.'
  : /already registered|already exists/i.test(m) ? 'An account with this email already exists. Use "Sign in" instead.'
  : /join code/i.test(m) || /database error saving new user/i.test(m) ? 'That join code was not accepted. Check it with your instructor.'
  : /password/i.test(m) && /6|8|characters|short/i.test(m) ? 'Choose a password of at least 8 characters.'
  : m;

export async function checkJoinCode(code: string): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.rpc('check_join_code', { code });
  return (data as string | null) ?? null;
}

export async function signUp(a: { joinCode: string; fullName: string; email: string; password: string; consent: boolean }): Promise<string | null> {
  if (!supabase) return 'Accounts are not available in this build.';
  if (a.password.length < 8) return 'Choose a password of at least 8 characters.';
  if (!a.consent) return 'Please read the note on what is stored and tick the box to continue.';
  const cohort = await checkJoinCode(a.joinCode);
  if (!cohort) return 'That join code was not accepted. Check it with your instructor.';
  const { error } = await supabase.auth.signUp({
    email: a.email.trim(), password: a.password,
    options: { data: { full_name: a.fullName.trim(), join_code: a.joinCode.trim(), consent: 'true' } },
  });
  return error ? friendly(error.message) : null;
}

export async function signIn(email: string, password: string): Promise<string | null> {
  if (!supabase) return 'Accounts are not available in this build.';
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  return error ? friendly(error.message) : null;
}

export async function changePassword(password: string): Promise<string | null> {
  if (!supabase) return 'Accounts are not available in this build.';
  if (password.length < 8) return 'Choose a password of at least 8 characters.';
  const { error } = await supabase.auth.updateUser({ password });
  return error ? friendly(error.message) : null;
}

export async function signOut() {
  if (!supabase) return;
  if (timer) { clearTimeout(timer); timer = undefined; await push(getProgress()); }
  await supabase.auth.signOut();
}
