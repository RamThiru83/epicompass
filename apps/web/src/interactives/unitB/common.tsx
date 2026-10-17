/** Small hooks shared by the Unit B interactives. */
import { useCallback, useEffect, useRef } from 'react';

/** Returns a function that calls onReached(true, detail) only the first time. */
export function useReachOnce(onReached?: (reached: boolean, detail?: string) => void) {
  const done = useRef(false);
  const cb = useRef(onReached);
  cb.current = onReached;
  return useCallback((detail?: string) => {
    if (done.current) return;
    done.current = true;
    cb.current?.(true, detail);
  }, []);
}

/** Runs tick() every ms while running is true; cleans up on stop/unmount. */
export function useTicker(running: boolean, ms: number, tick: () => void) {
  const t = useRef(tick);
  t.current = tick;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => t.current(), ms);
    return () => window.clearInterval(id);
  }, [running, ms]);
}

/** True when the learner has asked the OS for reduced motion. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const SYNTH = 'Synthetic data, generated in the browser for teaching; no real participants.';
