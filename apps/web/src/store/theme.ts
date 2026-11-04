/** Light or dark appearance, per device. "system" follows the operating system's setting. Stored in this
 *  browser only; styles.css defines both palettes and reads data-theme on <html>. */
import { useEffect, useState } from 'react';

export type Theme = 'system' | 'light' | 'dark';
const KEY = 'epicompass.theme';
const EVT = 'epi:theme';
const mq = () => (typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null);

export function readTheme(): Theme {
  try { const v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : 'system'; } catch { return 'system'; }
}
/** The appearance actually showing, after resolving "system". */
export const effectiveTheme = (t: Theme = readTheme()): 'light' | 'dark' => (t === 'system' ? (mq()?.matches ? 'dark' : 'light') : t);

export function applyTheme(t: Theme = readTheme()) {
  const el = document.documentElement;
  if (t === 'system') delete el.dataset.theme; else el.dataset.theme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', effectiveTheme(t) === 'dark' ? '#111111' : '#FAFAF9');
}
export function setTheme(t: Theme) {
  try { if (t === 'system') localStorage.removeItem(KEY); else localStorage.setItem(KEY, t); } catch { /* storage unavailable */ }
  applyTheme(t); window.dispatchEvent(new CustomEvent(EVT));
}
/** Current choice and the appearance showing; re-renders when either changes (including the OS setting). */
export function useTheme(): { theme: Theme; shown: 'light' | 'dark'; set: (t: Theme) => void } {
  const [, tick] = useState(0);
  useEffect(() => {
    const f = () => { applyTheme(); tick(n => n + 1); };
    window.addEventListener(EVT, f); mq()?.addEventListener?.('change', f);
    return () => { window.removeEventListener(EVT, f); mq()?.removeEventListener?.('change', f); };
  }, []);
  const theme = readTheme();
  return { theme, shown: effectiveTheme(theme), set: setTheme };
}
