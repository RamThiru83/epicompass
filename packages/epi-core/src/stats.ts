/** Basic statistical helpers used across epi-core. */

export const Z: Record<number, number> = { 80: 1.2816, 90: 1.6449, 95: 1.96, 99: 2.5758 };

export function zFor(level: number): number {
  const z = Z[level];
  if (z === undefined) throw new Error(`Unsupported confidence level ${level}`);
  return z;
}

/** Standard normal CDF (Abramowitz & Stegun 26.2.17, |error| < 7.5e-8). */
export function normalCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327 * Math.exp((-x * x) / 2);
  const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - p : p;
}

/** Two-sided P-value from a standard normal deviate. */
export function twoSidedP(z: number): number {
  return 2 * (1 - normalCdf(Math.abs(z)));
}

export function round(x: number, dp = 4): number {
  const f = Math.pow(10, dp);
  return Math.round(x * f) / f;
}
