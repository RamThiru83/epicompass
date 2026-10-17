/** Measures of disease occurrence (Rothman ch. 4) and their confidence intervals (ch. 8). */
import { zFor } from './stats';

export interface Interval { lower: number; upper: number; level: number }

/** Risk (incidence proportion) with Wald CI on the proportion scale. */
export function risk(cases: number, n: number, level = 95): { estimate: number; ci: Interval } {
  if (n <= 0) throw new Error('n must be positive');
  const p = cases / n;
  const se = Math.sqrt((p * (1 - p)) / n);
  const z = zFor(level);
  return { estimate: p, ci: { lower: Math.max(0, p - z * se), upper: Math.min(1, p + z * se), level } };
}

/** Incidence rate = cases / person-time, CI via the log transform (SE[ln rate] = 1/sqrt(cases)). */
export function rate(cases: number, personTime: number, level = 95): { estimate: number; ci: Interval } {
  if (personTime <= 0) throw new Error('person-time must be positive');
  const r = cases / personTime;
  const z = zFor(level);
  if (cases === 0) return { estimate: 0, ci: { lower: 0, upper: NaN, level } };
  const se = 1 / Math.sqrt(cases);
  return { estimate: r, ci: { lower: r * Math.exp(-z * se), upper: r * Math.exp(z * se), level } };
}

/** Prevalence proportion; same statistics as a risk. */
export const prevalence = risk;

/** Risk over time t from a constant incidence rate: R = 1 - exp(-rate * t). */
export function riskFromRate(ratePerUnit: number, time: number): number {
  return 1 - Math.exp(-ratePerUnit * time);
}

/** Steady-state relation: prevalence odds = incidence rate × mean duration. */
export function prevalenceFromIncidence(ratePerUnit: number, meanDuration: number): number {
  const odds = ratePerUnit * meanDuration;
  return odds / (1 + odds);
}

/** Expected prevalence over time for a population with constant inflow (incidence) and outflow (1/duration). */
export function prevalenceTrajectory(ratePerUnit: number, meanDuration: number, steps: number, dt = 0.1): number[] {
  const out: number[] = [];
  let p = 0;
  for (let i = 0; i < steps; i++) {
    out.push(p);
    const dp = ratePerUnit * (1 - p) - (p / meanDuration);
    p = Math.max(0, Math.min(1, p + dp * dt));
  }
  return out;
}
