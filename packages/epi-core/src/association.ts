/** Measures of association and effect for a single 2×2 or person-time table (Rothman ch. 4, 7, 8). */
import { zFor, twoSidedP } from './stats';
import type { Interval } from './occurrence';

export interface RiskTable { a: number; b: number; c: number; d: number }      // a,b cases; c,d non-cases; exposed first
export interface RateTable { a: number; b: number; pt1: number; pt0: number }  // cases and person-time, exposed first
export interface CaseControlTable { a: number; b: number; c: number; d: number } // a,b cases; c,d controls; exposed first

export interface RatioResult { estimate: number; seLog: number; ci: Interval }
export interface DiffResult { estimate: number; se: number; ci: Interval }

function logCi(est: number, seLog: number, level: number): Interval {
  const z = zFor(level);
  return { lower: est * Math.exp(-z * seLog), upper: est * Math.exp(z * seLog), level };
}
function linCi(est: number, se: number, level: number): Interval {
  const z = zFor(level);
  return { lower: est - z * se, upper: est + z * se, level };
}

// ---------- Risk data ----------
export function riskRatio(t: RiskTable, level = 95): RatioResult {
  const n1 = t.a + t.c, n0 = t.b + t.d;
  const est = (t.a / n1) / (t.b / n0);
  const seLog = Math.sqrt(1 / t.a - 1 / n1 + 1 / t.b - 1 / n0);
  return { estimate: est, seLog, ci: logCi(est, seLog, level) };
}
export function riskDifference(t: RiskTable, level = 95): DiffResult {
  const n1 = t.a + t.c, n0 = t.b + t.d, r1 = t.a / n1, r0 = t.b / n0;
  const est = r1 - r0;
  const se = Math.sqrt((r1 * (1 - r1)) / n1 + (r0 * (1 - r0)) / n0);
  return { estimate: est, se, ci: linCi(est, se, level) };
}
/** Large-sample chi statistic for a 2×2 table: (a − E[a]) / sqrt(V), with the hypergeometric variance. */
export function chi2x2(t: RiskTable | CaseControlTable): { chi: number; p: number } {
  const n1 = t.a + t.c, n0 = t.b + t.d, m1 = t.a + t.b, m0 = t.c + t.d, T = n1 + n0;
  const E = (n1 * m1) / T;
  const V = (n1 * n0 * m1 * m0) / (T * T * (T - 1));
  const chi = (t.a - E) / Math.sqrt(V);
  return { chi, p: twoSidedP(chi) };
}

// ---------- Rate data ----------
export function rateRatio(t: RateTable, level = 95): RatioResult {
  const est = (t.a / t.pt1) / (t.b / t.pt0);
  const seLog = Math.sqrt(1 / t.a + 1 / t.b);
  return { estimate: est, seLog, ci: logCi(est, seLog, level) };
}
export function rateDifference(t: RateTable, level = 95): DiffResult {
  const est = t.a / t.pt1 - t.b / t.pt0;
  const se = Math.sqrt(t.a / (t.pt1 * t.pt1) + t.b / (t.pt0 * t.pt0));
  return { estimate: est, se, ci: linCi(est, se, level) };
}
/** Chi statistic for person-time data: binomial split of cases by person-time. */
export function chiRate(t: RateTable): { chi: number; p: number } {
  const M = t.a + t.b, T = t.pt1 + t.pt0;
  const E = (M * t.pt1) / T;
  const V = (M * t.pt1 * t.pt0) / (T * T);
  const chi = (t.a - E) / Math.sqrt(V);
  return { chi, p: twoSidedP(chi) };
}

// ---------- Case-control data ----------
export function oddsRatio(t: CaseControlTable, level = 95): RatioResult {
  const est = (t.a * t.d) / (t.b * t.c);
  const seLog = Math.sqrt(1 / t.a + 1 / t.b + 1 / t.c + 1 / t.d);
  return { estimate: est, seLog, ci: logCi(est, seLog, level) };
}

// ---------- Attributable fractions ----------
/** Attributable fraction among the exposed from a relative risk: (RR − 1)/RR. */
export function attributableFractionExposed(rr: number): number {
  return (rr - 1) / rr;
}
/** Population attributable fraction from RR and the proportion of cases that are exposed: pc × (RR − 1)/RR. */
export function populationAttributableFraction(rr: number, proportionOfCasesExposed: number): number {
  return proportionOfCasesExposed * (rr - 1) / rr;
}
/** Population attributable fraction from RR and prevalence of exposure in the population (Levin). */
export function populationAttributableFractionLevin(rr: number, prevalenceExposed: number): number {
  const p = prevalenceExposed;
  return (p * (rr - 1)) / (p * (rr - 1) + 1);
}

// ---------- P-value function ----------
/** P-value function on the ratio scale: for each hypothesised ratio, the two-sided P that the data give it. */
export function pValueFunction(estimate: number, seLog: number, points = 201, span = 3.5): { x: number; p: number }[] {
  const ln = Math.log(estimate);
  const lo = Math.min(ln - span * seLog, -0.2), hi = Math.max(ln + span * seLog, 0.2);
  const out: { x: number; p: number }[] = [];
  for (let i = 0; i < points; i++) {
    const v = lo + ((hi - lo) * i) / (points - 1);
    out.push({ x: Math.exp(v), p: twoSidedP((ln - v) / seLog) });
  }
  return out;
}
