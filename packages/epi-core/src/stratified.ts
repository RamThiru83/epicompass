/** Stratified analysis (Rothman ch. 9): Mantel-Haenszel pooling and standardisation. */
import { zFor } from './stats';
import type { Interval } from './occurrence';
import type { RiskTable, RateTable, CaseControlTable } from './association';

export interface PooledResult { estimate: number; seLog?: number; se?: number; ci: Interval }

/** Mantel-Haenszel risk ratio with the Greenland-Robins variance. */
export function mhRiskRatio(strata: RiskTable[], level = 95): PooledResult {
  let num = 0, den = 0, v = 0;
  for (const s of strata) {
    const n1 = s.a + s.c, n0 = s.b + s.d, T = n1 + n0, m1 = s.a + s.b;
    num += (s.a * n0) / T;
    den += (s.b * n1) / T;
    v += (m1 * n1 * n0) / (T * T) - (s.a * s.b) / T;
  }
  const est = num / den;
  const seLog = Math.sqrt(v / (num * den));
  const z = zFor(level);
  return { estimate: est, seLog, ci: { lower: est * Math.exp(-z * seLog), upper: est * Math.exp(z * seLog), level } };
}

/** Mantel-Haenszel risk difference with the Greenland-Robins variance. */
export function mhRiskDifference(strata: RiskTable[], level = 95): PooledResult {
  let num = 0, W = 0, v = 0;
  for (const s of strata) {
    const n1 = s.a + s.c, n0 = s.b + s.d, T = n1 + n0;
    num += (s.a * n0 - s.b * n1) / T;
    const w = (n1 * n0) / T;
    W += w;
    const r1 = s.a / n1, r0 = s.b / n0;
    v += (r1 * (1 - r1) / n1 + r0 * (1 - r0) / n0) * w * w;
  }
  const est = num / W;
  const se = Math.sqrt(v) / W;
  const z = zFor(level);
  return { estimate: est, se, ci: { lower: est - z * se, upper: est + z * se, level } };
}

/** Mantel-Haenszel rate ratio with the Greenland-Robins variance. */
export function mhRateRatio(strata: RateTable[], level = 95): PooledResult {
  let num = 0, den = 0, v = 0;
  for (const s of strata) {
    const T = s.pt1 + s.pt0, M = s.a + s.b;
    num += (s.a * s.pt0) / T;
    den += (s.b * s.pt1) / T;
    v += (M * s.pt1 * s.pt0) / (T * T);
  }
  const est = num / den;
  const seLog = Math.sqrt(v / (num * den));
  const z = zFor(level);
  return { estimate: est, seLog, ci: { lower: est * Math.exp(-z * seLog), upper: est * Math.exp(z * seLog), level } };
}

/** Mantel-Haenszel odds ratio with the Robins-Breslow-Greenland variance. */
export function mhOddsRatio(strata: CaseControlTable[], level = 95): PooledResult {
  let R = 0, S = 0, PR = 0, PSQR = 0, QS = 0;
  for (const s of strata) {
    const T = s.a + s.b + s.c + s.d;
    const r = (s.a * s.d) / T, q = (s.b * s.c) / T;
    const P = (s.a + s.d) / T, Q = (s.b + s.c) / T;
    R += r; S += q;
    PR += P * r; PSQR += P * q + Q * r; QS += Q * q;
  }
  const est = R / S;
  const varLog = PR / (2 * R * R) + PSQR / (2 * R * S) + QS / (2 * S * S);
  const seLog = Math.sqrt(varLog);
  const z = zFor(level);
  return { estimate: est, seLog, ci: { lower: est * Math.exp(-z * seLog), upper: est * Math.exp(z * seLog), level } };
}

/** Direct standardisation: weighted average of stratum-specific rates using a standard population. */
export function directStandardisedRate(stratumRates: number[], standardWeights: number[]): number {
  const W = standardWeights.reduce((a, b) => a + b, 0);
  return stratumRates.reduce((acc, r, i) => acc + r * standardWeights[i], 0) / W;
}

/** Standardised morbidity/mortality ratio: observed / expected, with CI via the log transform. */
export function smr(observed: number, expected: number, level = 95): PooledResult {
  const est = observed / expected;
  const seLog = 1 / Math.sqrt(observed);
  const z = zFor(level);
  return { estimate: est, seLog, ci: { lower: est * Math.exp(-z * seLog), upper: est * Math.exp(z * seLog), level } };
}

/** Rothman's rule of thumb: confounding is material when crude and adjusted differ by more than ~10 %. */
export function confoundingRatio(crude: number, adjusted: number): { ratio: number; material: boolean } {
  const ratio = crude / adjusted;
  return { ratio, material: Math.abs(Math.log(ratio)) > Math.log(1.1) };
}
