/** Opt-in record of WHERE a student asked for help (card, step, quick action, the course passage selected).
 *  The question typed and the assistant's reply are never sent to EpiCompass. */
import { supabase } from '../lib/supabase';
import { useAccount } from '../store/account';
import type { Action } from './prompt';

export function useInsightsOn() {
  const a = useAccount();
  return !!(a.session && a.profile?.insights_consent_at);
}

export function logAsk(on: boolean, row: { card_id: string; step?: string; action: Action; excerpt?: string }) {
  if (!on || !supabase) return;
  supabase.from('assistant_asks').insert({ ...row, excerpt: row.excerpt ? row.excerpt.trim().slice(0, 400) : null }).then(() => { /* best effort */ });
}
