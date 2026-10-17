/** Ch. 1 — Confounding by age: crude vs age-specific risk ratios for two synthetic populations. */
import { useState } from 'react';
import { risk, riskRatio } from '@epicompass/epi-core';
import type { InteractiveProps } from '../types';
import { Stat, Row, f2, pct, logScale, frame } from '../ui';
import { useReached } from './useReached';

const N = 100000; // nominal population size (synthetic)
const NS = 1000;  // nominal stratum size for stratum-specific RRs

const rrOf = (r1: number, r0: number) =>
  riskRatio({ a: r1 * NS, b: r0 * NS, c: NS - r1 * NS, d: NS - r0 * NS }).estimate;

export function SimpsonExplorer({ onReached }: InteractiveProps) {
  const [oldA, setOldA] = useState(30);
  const [oldB, setOldB] = useState(30);
  // stratum-specific risks in %: [younger A, older A, younger B, older B]
  const [r, setR] = useState<[number, number, number, number]>([0.5, 4, 0.5, 4]);
  const setRi = (i: number, v: number) => setR(prev => { const n = [...prev] as typeof prev; n[i] = Math.max(0, Math.min(100, v || 0)); return n; });

  const [yA, oA, yB, oB] = r.map(x => x / 100);
  const casesA = yA * N * (1 - oldA / 100) + oA * N * (oldA / 100);
  const casesB = yB * N * (1 - oldB / 100) + oB * N * (oldB / 100);
  const crudeA = risk(casesA, N).estimate;
  const crudeB = risk(casesB, N).estimate;
  const crudeRR = riskRatio({ a: casesA, b: casesB, c: N - casesA, d: N - casesB }).estimate;
  const rrY = rrOf(yA, yB);
  const rrO = rrOf(oA, oB);

  const eq1 = (x: number) => Math.abs(x - 1) < 1e-9;
  const paradox = isFinite(crudeRR) && isFinite(rrY) && isFinite(rrO) && (
    (rrY > 1 && rrO > 1 && crudeRR < 1) || (rrY < 1 && rrO < 1 && crudeRR > 1) ||
    (eq1(rrY) && eq1(rrO) && Math.abs(crudeRR - 1) > 0.2));
  const reached = useReached(paradox, onReached, 'crude RR contradicts the age-specific RRs');

  const fr = frame(520, 230);
  const y = logScale(0.1, 10, fr.t + fr.ih, fr.t);
  const clamp = (v: number) => Math.max(0.1, Math.min(10, v));
  const bars = [
    { k: 'Crude', v: crudeRR, fill: 'var(--accent)' },
    { k: 'Younger', v: rrY, fill: 'var(--unexp)' },
    { k: 'Older', v: rrO, fill: 'var(--unexp)' },
  ];
  const bw = fr.iw / bars.length;
  const ticks = [0.1, 0.2, 0.5, 1, 2, 5, 10];

  return <div className="ix">
    <div className="ix-panel">
      <h4>Age mix</h4>
      <Row label={`Population A: ${oldA}% older`}>
        <input id="simp-oldA" type="range" min={0} max={100} step={1} value={oldA} onChange={e => setOldA(+e.target.value)} />
      </Row>
      <Row label={`Population B: ${oldB}% older`}>
        <input id="simp-oldB" type="range" min={0} max={100} step={1} value={oldB} onChange={e => setOldB(+e.target.value)} />
      </Row>
      <h4 style={{ marginTop: 12 }}>Mortality risk by age (%)</h4>
      <table className="t2">
        <thead><tr><th></th><th>Younger</th><th>Older</th></tr></thead>
        <tbody>
          {(['A', 'B'] as const).map((p, pi) => <tr key={p}>
            <th>Pop. {p}</th>
            {[0, 1].map(s => { const i = pi * 2 + s; const lab = `Population ${p}, ${s ? 'older' : 'younger'} risk (%)`;
              return <td key={s}><input id={`simp-r${i}`} aria-label={lab} type="number" min={0} max={100} step={0.1} value={r[i]} onChange={e => setRi(i, +e.target.value)} /></td>; })}
          </tr>)}
        </tbody>
      </table>
      <p className="note">Synthetic populations. Defaults: younger 0.5%, older 4% in both.</p>
    </div>
    <div>
      <div className="stats">
        <Stat k="Crude risk, A" v={pct(crudeA, 2)} tone="exp" />
        <Stat k="Crude risk, B" v={pct(crudeB, 2)} tone="unexp" />
        <Stat k="Crude RR (A vs B)" v={f2(crudeRR)} tone={paradox ? 'warn' : undefined} />
        <Stat k="RR, younger" v={f2(rrY)} />
        <Stat k="RR, older" v={f2(rrO)} />
      </div>
      <div className="fig">
        <svg viewBox={`0 0 ${fr.W} ${fr.H}`} role="img" aria-label="Crude and age-specific risk ratios on a log scale">
          {ticks.map(t => <g key={t}>
            <line x1={fr.l} x2={fr.l + fr.iw} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth={t === 1 ? 1.5 : 1} />
            <text x={fr.l - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted)" fontFamily="var(--mono)">{t}</text>
          </g>)}
          <text transform={`translate(12,${fr.t + fr.ih / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="var(--fg)">Risk ratio (log)</text>
          {bars.map((b, i) => {
            const x = fr.l + i * bw + bw * 0.25, w = bw * 0.5;
            const ok = isFinite(b.v) && b.v > 0;
            const yv = ok ? y(clamp(b.v)) : y(1);
            return <g key={b.k}>
              <rect x={x} width={w} y={Math.min(yv, y(1))} height={Math.max(1, Math.abs(yv - y(1)))} fill={b.fill} />
              <text x={x + w / 2} y={yv < y(1) ? yv - 5 : yv + 14} textAnchor="middle" fontSize="11" fill="var(--fg)" fontFamily="var(--mono)">{f2(b.v)}</text>
              <text x={x + w / 2} y={fr.t + fr.ih + 18} textAnchor="middle" fontSize="12" fill="var(--fg)">{b.k}</text>
            </g>;
          })}
        </svg>
      </div>
      <div className="note">
        A is {oldA}% older and B is {oldB}% older: the crude risk is a weighted average of the age-specific risks, so changing the age mix alone moves the crude RR while the age-specific RRs stay put.
      </div>
      {reached && <div className="reached">The crude comparison now misrepresents the age-specific comparisons: age is confounding.</div>}
    </div>
  </div>;
}
