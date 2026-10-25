/**
 * Inline editing of course text by the instructor (published to all learners).
 *
 * Every markdown field shown to learners is split into blocks at blank lines. An edit is stored per block in
 * Supabase (table epi_overrides) under key '<scope>:<index>', with a hash of the original block. If the
 * course text in the repository later changes, the hash no longer matches and the edit is ignored (shown as
 * "outdated" on the dashboard) rather than pasted over new content.
 */
import { useSyncExternalStore } from 'react';
import { supabase } from '../lib/supabase';
import { useAccount } from './account';
import { CHAPTERS, cardById, cardLabel } from '../content';
import { WELCOME } from '../content/welcome';

export interface Override { key: string; md: string; base_hash: string; updated_at: string }

/** djb2 hash of a block's text, base 36 (matches the scheme used in CliPr). */
export function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
export const splitBlocks = (md: string) => md.split(/\n{2,}/);

// ---------------------------------------------------------------- store
interface State { over: Record<string, Override>; dirty: Record<string, { md: string; base_hash: string }>; edit: boolean; saving: boolean; msg: string | null }
let st: State = { over: {}, dirty: {}, edit: readEdit(), saving: false, msg: null };
const subs = new Set<() => void>();
const set = (p: Partial<State>) => { st = { ...st, ...p }; subs.forEach(f => f()); };
const useStore = () => useSyncExternalStore(f => { subs.add(f); return () => subs.delete(f); }, () => st);

function readEdit() { try { return sessionStorage.getItem('epicompass.edit') === '1'; } catch { return false; } }

export async function loadOverrides() {
  if (!supabase) return;
  const { data, error } = await supabase.from('epi_overrides').select('key, md, base_hash, updated_at');
  if (error) return;
  set({ over: Object.fromEntries((data ?? []).map(o => [o.key, o as Override])) });
}
loadOverrides();

export const useOverrides = () => useStore().over;

/** The text to show for one block: a live override if its base still matches, otherwise the original. */
export function resolveBlock(over: Record<string, Override>, key: string, original: string): { md: string; edited: boolean } {
  const o = over[key];
  return o && o.base_hash === hash(original) ? { md: o.md, edited: true } : { md: original, edited: false };
}
/** Whole field with live overrides applied (for places that need the text, not the rendering). */
export function resolveField(over: Record<string, Override>, scope: string, md: string): string {
  return splitBlocks(md).map((b, i) => resolveBlock(over, `${scope}:${i}`, b).md).join('\n\n');
}

// ---------------------------------------------------------------- editing
/** Edit mode is on only for the signed-in instructor who has switched it on (per browser tab session). */
export function useEditing() {
  const s = useStore();
  const a = useAccount();
  return s.edit && a.profile?.role === 'instructor';
}
export const useEditState = () => useStore();
export function setEditMode(on: boolean) {
  try { sessionStorage.setItem('epicompass.edit', on ? '1' : '0'); } catch { /* ignore */ }
  set({ edit: on, dirty: on ? st.dirty : {}, msg: null });
}
export function setDraft(key: string, md: string, original: string) {
  const d = { ...st.dirty };
  const current = resolveBlock(st.over, key, original).md;
  if (md === current) delete d[key]; else d[key] = { md, base_hash: hash(original) };
  set({ dirty: d, msg: null });
}
export const discardDrafts = () => set({ dirty: {}, msg: null });

export async function saveDrafts(originals: Record<string, string>) {
  if (!supabase) return;
  set({ saving: true, msg: null });
  const ups: { key: string; md: string; base_hash: string; updated_at: string }[] = [];
  const dels: string[] = [];
  for (const [key, d] of Object.entries(st.dirty)) {
    const md = d.md.replace(/\s+$/, '');
    if (md.trim() === '' ) continue;                       // never publish an empty block
    if (md === originals[key]) dels.push(key);             // edited back to the original: drop the override
    else ups.push({ key, md: md.slice(0, 19000), base_hash: d.base_hash, updated_at: new Date().toISOString() });
  }
  const errs: string[] = [];
  if (ups.length) { const { error } = await supabase.from('epi_overrides').upsert(ups, { onConflict: 'key' }); if (error) errs.push(error.message); }
  if (dels.length) { const { error } = await supabase.from('epi_overrides').delete().in('key', dels); if (error) errs.push(error.message); }
  await loadOverrides();
  set(errs.length ? { saving: false, msg: `Could not save: ${errs.join('; ')}` } : { saving: false, dirty: {}, msg: `Published ${ups.length + dels.length} change${ups.length + dels.length === 1 ? '' : 's'} to all learners.` });
}
export async function revertKeys(keys: string[]) {
  if (!supabase || !keys.length) return;
  await supabase.from('epi_overrides').delete().in('key', keys);
  const d = { ...st.dirty }; keys.forEach(k => delete d[k]);
  set({ dirty: d });
  await loadOverrides();
}

// ---------------------------------------------------------------- blocks mounted on the current page
/** Editable blocks register their original text so Save can tell "edited back to original" and Revert knows the page. */
const mounted = new Map<string, string>();
let bump = 0;
const touched = () => { const n = ++bump; queueMicrotask(() => { if (n === bump) set({}); }); };
export const registerBlock = (key: string, original: string) => { mounted.set(key, original); touched(); return () => { mounted.delete(key); touched(); }; };
export const pageOriginals = () => Object.fromEntries(mounted);

// ---------------------------------------------------------------- where an override lives (dashboard)
/** Find the original text and a link for a stored key, or null if the content no longer exists. */
export function locate(key: string): { where: string; href: string; original: string | null } {
  const [scope, idx] = [key.slice(0, key.lastIndexOf(':')), +key.slice(key.lastIndexOf(':') + 1)];
  const parts = scope.split('.');
  let field: string | undefined, where = scope, href = '#/';
  if (parts[0] === 'welcome') { const w = WELCOME as Record<string, string>; field = w[Object.keys(w).find(k => k.toLowerCase() === parts[1]) ?? '']; where = 'Welcome note'; href = '#/'; }
  else if (parts[0] === 'ch') { const ch = CHAPTERS.find(c => String(c.number) === parts[1]); field = ch?.summary; where = `Chapter ${parts[1]} summary`; href = `#/ch/${parts[1]}`; }
  else if (parts[0] === 'card') {
    const card = cardById(parts[1]); href = `#/card/${parts[1]}`;
    where = card ? `${cardLabel(card)} ${parts[2]}` : parts[1];
    field = parts[2] === 'hook' ? card?.hook : parts[2] === 'formalise' ? card?.formalise : parts[2] === 'explore' ? card?.explore?.prompt : undefined;
  } else if (parts[0] === 'chk') {
    for (const ch of CHAPTERS) for (const c of ch.cards) {
      const it = c.checks.find(x => x.id === parts[1]); if (!it) continue;
      href = `#/card/${c.id}`; const n = c.checks.indexOf(it) + 1;
      const f = parts[2];
      where = `${cardLabel(c)} check ${n} ${f === 'prompt' ? 'question' : f.startsWith('o') ? `option ${+f.slice(1) + 1}` : `feedback ${+f.slice(1) + 1}`}`;
      field = f === 'prompt' ? it.prompt : f.startsWith('o') ? it.options[+f.slice(1)]?.text : it.options[+f.slice(1)]?.feedback;
    }
  }
  const blocks = field === undefined ? null : (parts[0] === 'chk' && parts[2] !== 'prompt' ? [field] : splitBlocks(field));
  return { where: `${where}, paragraph ${idx + 1}`, href, original: blocks?.[idx] ?? null };
}
