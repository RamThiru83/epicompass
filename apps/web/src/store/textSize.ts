/** Per-device text size. "large" scales every rem-based size by 112.5%; the browser's own
 *  default text size is honoured underneath either choice. Stored in this browser only. */
import { useEffect, useState } from 'react';

export type TextSize = 'standard' | 'large';
const KEY = 'epicompass.textsize';

export function readTextSize(): TextSize {
  try { return localStorage.getItem(KEY) === 'large' ? 'large' : 'standard'; } catch { return 'standard'; }
}
export function applyTextSize(t: TextSize = readTextSize()) {
  if (t === 'large') document.documentElement.dataset.text = 'large';
  else delete document.documentElement.dataset.text;
}
export function useTextSize(): [TextSize, (t: TextSize) => void] {
  const [t, setT] = useState<TextSize>(readTextSize);
  useEffect(() => { applyTextSize(t); try { localStorage.setItem(KEY, t); } catch { /* storage unavailable */ } }, [t]);
  return [t, setT];
}
