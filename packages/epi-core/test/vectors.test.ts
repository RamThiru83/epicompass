import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as core from '../src/index';

const vec = JSON.parse(readFileSync(resolve(__dirname, '../../../tests/vectors/epi-core.json'), 'utf8'));
const TOL = 1e-6;
const close = (got: number, exp: number) => expect(Math.abs(got - exp)).toBeLessThanOrEqual(TOL * Math.max(1, Math.abs(exp)));

function run(c: any) {
  const i = c.input, e = c.expected;
  switch (c.fn) {
    case 'riskRatio': case 'oddsRatio': case 'rateRatio': case 'mhRiskRatio': case 'mhOddsRatio': case 'mhRateRatio': case 'smr': {
      const r = c.fn === 'smr' ? core.smr(i.observed, i.expected)
        : c.fn.startsWith('mh') ? (core as any)[c.fn](i.strata) : (core as any)[c.fn](i);
      close(r.estimate, e.estimate); if (e.seLog !== undefined) close(r.seLog, e.seLog); close(r.ci.lower, e.ci[0]); close(r.ci.upper, e.ci[1]); break; }
    case 'riskDifference': case 'rateDifference': {
      const r = (core as any)[c.fn](i); close(r.estimate, e.estimate); close(r.se, e.se); close(r.ci.lower, e.ci[0]); close(r.ci.upper, e.ci[1]); break; }
    case 'chi2x2': case 'chiRate': { const r = (core as any)[c.fn](i); close(r.chi, e.chi); close(r.p, e.p); break; }
    case 'risk': { const r = core.risk(i.cases, i.n); close(r.estimate, e.estimate); close(r.ci.lower, e.ci[0]); close(r.ci.upper, e.ci[1]); break; }
    case 'rate': { const r = core.rate(i.cases, i.personTime); close(r.estimate, e.estimate); close(r.ci.lower, e.ci[0]); close(r.ci.upper, e.ci[1]); break; }
    case 'riskFromRate': close(core.riskFromRate(i.rate, i.time), e.value); break;
    case 'prevalenceFromIncidence': close(core.prevalenceFromIncidence(i.rate, i.duration), e.value); break;
    case 'attributableFractionExposed': close(core.attributableFractionExposed(i.rr), e.value); break;
    case 'populationAttributableFraction': close(core.populationAttributableFraction(i.rr, i.pc), e.value); break;
    case 'populationAttributableFractionLevin': close(core.populationAttributableFractionLevin(i.rr, i.pe), e.value); break;
    case 'directStandardisedRate': close(core.directStandardisedRate(i.rates, i.weights), e.value); break;
    case 'predictiveValues': { const r = core.predictiveValues(i.sens, i.spec, i.prev); close(r.ppv, e.ppv); close(r.npv, e.npv); break; }
    case 'bktUpdate': close(core.bktUpdate(i.pKnown, i.correct), e.value); break;
    case 'twoSidedP': close(core.twoSidedP(i.z), e.value); break;
    default: throw new Error('no runner for ' + c.fn);
  }
}

describe('epi-core shared vectors', () => {
  for (const c of vec.cases) it(`${c.fn} ${JSON.stringify(c.input).slice(0, 60)}`, () => run(c));
});

describe('simulation sanity', () => {
  it('density sampling OR approximates the rate ratio', () => {
    const cohort = core.generateCohort({ n: 20000, pConfounder: 0.5, pExposed: [0.3, 0.3], baselineRisk: [0.05, 0.05], trueRR: 2, followUp: 5, seed: 7 });
    const t = core.tabulate(cohort);
    const irr = core.rateRatio({ a: t.a, b: t.b, pt1: t.pt1, pt0: t.pt0 }).estimate;
    const cc = core.sampleCaseControl(cohort, 2, 'density', 11);
    const or = core.oddsRatio(cc).estimate;
    expect(Math.abs(Math.log(or / irr))).toBeLessThan(0.2);
  });
  it('reed-frost deterministic expectation is monotone until peak then declines', () => {
    const { expected } = core.reedFrost(500, 2, 0.004, 0, 1, 3);
    const peak = expected.indexOf(Math.max(...expected));
    expect(peak).toBeGreaterThan(0);
    expect(expected[expected.length - 1]).toBeLessThan(expected[peak]);
  });
});
