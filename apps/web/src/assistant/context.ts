/** What the student is looking at, for the study assistant: set by the card page, read by the chat. */
import { useSyncExternalStore } from 'react';
import type { Card, Chapter } from '../content/types';
import type { Step } from '../components/Path';

export interface PageContext { card: Card; chapter: Chapter; step: Step }
let ctx: PageContext | null = null;
const subs = new Set<() => void>();
export function setPageContext(c: PageContext | null) { ctx = c; subs.forEach(f => f()); }
export const usePageContext = () => useSyncExternalStore(f => { subs.add(f); return () => subs.delete(f); }, () => ctx);
export const getPageContext = () => ctx;
