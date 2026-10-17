/** Synthetic-data generators for simulations. Deterministic given a seed. No real participant data anywhere. */

/** Mulberry32 PRNG: small, fast, seedable. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function binomial(n: number, p: number, rand: () => number): number {
  let k = 0;
  for (let i = 0; i < n; i++) if (rand() < p) k++;
  return k;
}

export interface Person { id: number; exposed: boolean; confounder: 0 | 1; outcome: boolean; time: number }

export interface CohortSpec {
  n: number;
  /** Proportion with confounder level 1. */
  pConfounder: number;
  /** Probability of exposure given confounder level. */
  pExposed: [number, number];
  /** Baseline (unexposed) risk given confounder level. */
  baselineRisk: [number, number];
  /** True causal risk ratio (same in both strata). */
  trueRR: number;
  /** Follow-up length (years); event times drawn uniformly for simplicity. */
  followUp: number;
  seed: number;
}

/** Generate a closed cohort with a binary confounder, binary exposure and binary outcome. */
export function generateCohort(spec: CohortSpec): Person[] {
  const rand = rng(spec.seed);
  const people: Person[] = [];
  for (let i = 0; i < spec.n; i++) {
    const confounder: 0 | 1 = rand() < spec.pConfounder ? 1 : 0;
    const exposed = rand() < spec.pExposed[confounder];
    const r = Math.min(0.98, spec.baselineRisk[confounder] * (exposed ? spec.trueRR : 1));
    const outcome = rand() < r;
    const time = outcome ? rand() * spec.followUp : spec.followUp;
    people.push({ id: i, exposed, confounder, outcome, time });
  }
  return people;
}

export interface Tabulation { a: number; b: number; c: number; d: number; pt1: number; pt0: number }

/** Tabulate a cohort into a 2×2 (risk) and person-time table, optionally within one confounder level. */
export function tabulate(people: Person[], confounderLevel?: 0 | 1): Tabulation {
  const t: Tabulation = { a: 0, b: 0, c: 0, d: 0, pt1: 0, pt0: 0 };
  for (const p of people) {
    if (confounderLevel !== undefined && p.confounder !== confounderLevel) continue;
    if (p.exposed) { p.outcome ? t.a++ : t.c++; t.pt1 += p.time; }
    else { p.outcome ? t.b++ : t.d++; t.pt0 += p.time; }
  }
  return t;
}

/** Sample controls from a cohort for a case-control study. */
export type ControlSampling = 'cumulative' | 'density' | 'caseCohort';
export function sampleCaseControl(people: Person[], controlsPerCase: number, scheme: ControlSampling, seed: number)
  : { a: number; b: number; c: number; d: number } {
  const rand = rng(seed);
  const cases = people.filter(p => p.outcome);
  const out = { a: 0, b: 0, c: 0, d: 0 };
  for (const c of cases) c.exposed ? out.a++ : out.b++;
  // Pools are built once. For density sampling, people sorted by time (descending) let the risk set at any
  // case's event time be the prefix of those still under observation.
  const nonCases = people.filter(p => !p.outcome);
  const byTimeDesc = [...people].sort((x, y) => y.time - x.time);
  const riskSetSize = (t: number) => { // count of people with time >= t (binary search on the descending array)
    let lo = 0, hi = byTimeDesc.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (byTimeDesc[mid].time >= t) lo = mid + 1; else hi = mid; }
    return lo;
  };
  for (const cs of cases) {
    for (let k = 0; k < controlsPerCase; k++) {
      let ctrl: Person;
      if (scheme === 'cumulative') ctrl = nonCases[Math.floor(rand() * nonCases.length)];
      else if (scheme === 'caseCohort') ctrl = people[Math.floor(rand() * people.length)];
      else {
        const n = riskSetSize(cs.time);
        do { ctrl = byTimeDesc[Math.floor(rand() * n)]; } while (ctrl.id === cs.id && n > 1);
      }
      ctrl.exposed ? out.c++ : out.d++;
    }
  }
  return out;
}

/** Reed-Frost chain binomial: returns generations of new cases for each stochastic run plus the deterministic expectation. */
export function reedFrost(N: number, initialCases: number, p: number, propImmune: number, runs: number, seed: number, maxGen = 60)
  : { runs: number[][]; expected: number[]; s0: number } {
  const rand = rng(seed);
  const s0 = Math.round(N * (1 - propImmune)) - initialCases;
  const out: number[][] = [];
  for (let r = 0; r < runs; r++) {
    let S = s0, C = initialCases;
    const g = [C];
    while (C > 0 && S > 0 && g.length < maxGen) {
      const q = 1 - Math.pow(1 - p, C);
      const nc = binomial(S, q, rand);
      S -= nc; C = nc; g.push(C);
    }
    out.push(g);
  }
  let S = s0, C = initialCases;
  const expected = [C];
  while (C > 0.5 && expected.length < maxGen) {
    const nc = S * (1 - Math.pow(1 - p, C));
    S -= nc; C = nc; expected.push(C);
  }
  return { runs: out, expected, s0 };
}
