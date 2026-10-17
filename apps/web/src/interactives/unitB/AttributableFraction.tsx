/** Attributable fractions as an icon array of 1,000 people (Rothman ch. 4). */
import { useState } from 'react';
import { attributableFractionExposed, populationAttributableFraction, populationAttributableFractionLevin } from '@epicompass/epi-core';
import type { InteractiveProps } from '../types';
import { Stat, Row, f2, pct } from '../ui';
import { useReachOnce } from './common';

const N = 1000, COLS = 40;
type Kind = 'attr' | 'anyway' | 'expNon' | 'unexpCase' | 'unexpNon';
const FILL: Record<Kind, { fill: string; op: number }> = {
  attr: { fill: 'var(--exp)', op: 1 },
  anyway: { fill: 'var(--exp)', op: 0.35 },
  expNon: { fill: 'var(--line)', op: 1 },
  unexpCase: { fill: 'var(--unexp)', op: 1 },
  unexpNon: { fill: 'var(--line)', op: 0.6 },
};

export function AttributableFraction({ onReached }: InteractiveProps) {
  const [rr, setRr] = useState(2);
  const [pExp, setPExp] = useState(0.3);
  const [r0, setR0] = useState(0.05);
  const reach = useReachOnce(onReached);
  const changeRr = (v: number) => { setRr(v); if (v > 3) reach(`RR set to ${v}`); };

  // Expected counts in 1,000 people.
  const nExp = Math.round(N * pExp), nUnexp = N - nExp;
  const r1 = Math.min(1, r0 * rr);
  const expCases = Math.round(nExp * r1);
  const anyway = Math.min(expCases, Math.round(nExp * r0));
  const attr = expCases - anyway;
  const unexpCases = Math.round(nUnexp * r0);
  const totalCases = expCases + unexpCases;
  const rrEff = r1 / r0; // differs from the slider when risk is capped at 1
  const afe = attributableFractionExposed(rrEff);
  const pc = totalCases > 0 ? expCases / totalCases : 0;
  const paf = populationAttributableFractionLevin(rrEff, pExp);
  const pafCases = populationAttributableFraction(rrEff, pc);

  const kinds: Kind[] = [
    ...Array<Kind>(attr).fill('attr'), ...Array<Kind>(anyway).fill('anyway'), ...Array<Kind>(nExp - expCases).fill('expNon'),
    ...Array<Kind>(unexpCases).fill('unexpCase'), ...Array<Kind>(nUnexp - unexpCases).fill('unexpNon'),
  ];
  const cell = 15, gx = 10, gy = 26, rows = N / COLS;
  const W = gx * 2 + COLS * cell, H = gy + rows * cell + 12;
  const splitRow = Math.floor(nExp / COLS), splitCol = nExp % COLS;

  return (
    <div className="ix">
      <div className="ix-panel">
        <h4>Population of 1,000</h4>
        <Row label={<span>Risk ratio <b className="mono">{f2(rr)}</b></span>}>
          <input id="af-rr" aria-label="Risk ratio" type="range" min={1} max={10} step={0.1} value={rr} onChange={e => changeRr(+e.target.value)} />
        </Row>
        <Row label={<span>Exposure prevalence <b className="mono">{pct(pExp, 0)}</b></span>}>
          <input id="af-p" aria-label="Exposure prevalence" type="range" min={0} max={1} step={0.01} value={pExp} onChange={e => setPExp(+e.target.value)} />
        </Row>
        <Row label={<span>Baseline risk <b className="mono">{pct(r0)}</b></span>}>
          <input id="af-r0" aria-label="Baseline risk in the unexposed" type="range" min={0.01} max={0.3} step={0.005} value={r0} onChange={e => setR0(+e.target.value)} />
        </Row>
        <p className="hint">Exposed: {nExp} people, {expCases} cases ({attr} attributable, {anyway} would have occurred anyway). Unexposed: {nUnexp} people, {unexpCases} cases.</p>
        {r1 >= 1 && <p className="hint">Risk in the exposed is capped at 100%; the effective RR is {f2(rrEff)}.</p>}
      </div>
      <div>
        <div className="stats">
          <Stat k="AF among exposed" v={pct(afe)} s={`(RR − 1)/RR · ${attr}/${expCases || 0} cases`} tone="exp" />
          <Stat k="Population AF" v={pct(paf)} s={`Levin · ${attr}/${totalCases} cases`} tone="ok" />
          <Stat k="Same PAF from cases" v={pct(pafCases)} s={`pc × AFe, pc = ${pct(pc)}`} />
          <Stat k="Total cases" v={totalCases} s="in 1,000 people" tone="unexp" />
        </div>
        <div className="fig">
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Icon array of 1,000 people coloured by exposure and case status">
            <rect x="0" y="0" width={W} height={H} fill="var(--panel)" />
            <text x={gx} y={16} fontSize="12" fill="var(--fg)">Exposed first, then unexposed; one square per person (hypothetical)</text>
            {kinds.map((kd, i) => {
              const c = i % COLS, r = Math.floor(i / COLS);
              return <rect key={i} x={gx + c * cell + 1} y={gy + r * cell + 1} width={cell - 3} height={cell - 3} rx={2}
                fill={FILL[kd].fill} opacity={FILL[kd].op} />;
            })}
            {nExp > 0 && nExp < N && <path fill="none" stroke="var(--fg)" strokeWidth="1.5"
              d={`M${gx},${gy + (splitRow + 1) * cell - 1} H${gx + splitCol * cell - 1} V${gy + splitRow * cell - 1} H${gx + COLS * cell}`} />}
          </svg>
        </div>
        <div className="legend">
          <span><i style={{ background: 'var(--exp)' }} />exposed case, attributable to exposure</span>
          <span><i style={{ background: 'var(--exp)', opacity: 0.35 }} />exposed case that would have occurred anyway</span>
          <span><i style={{ background: 'var(--unexp)' }} />unexposed case</span>
          <span><i style={{ background: 'var(--line)' }} />non-case</span>
        </div>
        <div className="note">
          The attributable fraction is the excess fraction: the share of cases that would not have occurred, by the end of follow-up,
          had the exposed been unexposed. It is not necessarily the etiologic fraction, the share of cases in which exposure played
          any causal role. Exposure may only hasten cases that would have occurred anyway, or cause some cases while preventing
          others, so the etiologic fraction can be larger than (RR − 1)/RR and cannot be estimated from these data alone. The
          figures also assume the RR is causal and unconfounded.
        </div>
      </div>
    </div>
  );
}
