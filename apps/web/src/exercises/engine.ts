/**
 * Deterministic exercise generation. The template draws parameters from a seed, the solver computes the key,
 * and the narrative is slot-filled. When the AI layer is added, only the narrative step is delegated to the model;
 * parameters and keys stay here.
 */
import { rng } from '@epicompass/epi-core';
import type { ExerciseTemplate, ExerciseInstance } from '../content/types';

export function generate(t: ExerciseTemplate, seed: number): ExerciseInstance {
  const rand = rng(seed);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  let params: Record<string, number> = {};
  for (let tries = 0; tries < 200; tries++) {
    params = {};
    for (const [k, r] of Object.entries(t.params)) {
      const v = r.min + rand() * (r.max - r.min);
      params[k] = r.integer ? Math.round(v) : v;
    }
    if (!t.constraints || t.constraints(params)) break;
  }
  return { templateId: t.id, seed, params, narrative: t.narrative(params, pick), key: t.solve(params) };
}

export function formatValue(v: number, fmt: 'dec2' | 'dec3' | 'pct' | 'int' | 'sci'): string {
  if (!isFinite(v)) return '–';
  switch (fmt) {
    case 'dec2': return v.toFixed(2);
    case 'dec3': return v.toFixed(3);
    case 'pct': return (100 * v).toFixed(1) + '%';
    case 'int': return String(Math.round(v));
    case 'sci': return v.toExponential(2);
  }
}

/** Check a learner's numeric answer against the key with a relative tolerance (absolute if key is 0). */
export function checkAnswer(given: string, key: number, tolerance: number, fmt: 'dec2' | 'dec3' | 'pct' | 'int' | 'sci'): boolean {
  let g = parseFloat(given.replace(/[%,\s]/g, ''));
  if (isNaN(g)) return false;
  if (fmt === 'pct') g = g / 100;
  if (key === 0) return Math.abs(g) <= tolerance;
  return Math.abs(g - key) / Math.abs(key) <= tolerance;
}
