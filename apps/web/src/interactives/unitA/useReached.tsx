/** Shared helper for unit A interactives: reports the target state to the parent once (latched via a ref). */
import { useEffect, useRef } from 'react';

export function useReached(reached: boolean, onReached?: (r: boolean, detail?: string) => void, detail?: string) {
  const done = useRef(false);
  useEffect(() => {
    if (reached && !done.current) { done.current = true; onReached?.(true, detail); }
  }, [reached, onReached, detail]);
  return reached;
}
