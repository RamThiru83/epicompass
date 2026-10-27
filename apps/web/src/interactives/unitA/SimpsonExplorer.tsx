/** Ch. 1 — Confounding: crude vs stratum-specific risk ratios for two synthetic groups.
 *  Labels and defaults come from `config` so the interactive can match the card's scenario
 *  (e.g. two hospitals confounded by birth weight) instead of generic populations. */
import { useState } from 'react';
import { risk, riskRatio } from '@epicompass/epi-core';
import type { InteractiveProps } from '../types';
import { Stat, Row, f2, linear, frame, Preview } from '../ui';
import { useReached } from './useReached';

const N = 100000; // nominal population size (synthetic)
const NS = 1000;  // nominal stratum size for stratum-specific RRs

const rrOf = (r1: number, r0: number) =>
  riskRatio({ a: r1 * NS, b: r0 * NS, c: NS - r1 * NS, d: NS - r0 * NS }).estimate;

interface SimpsonConfig {
  groups?: [string, string];        // the two compared groups (exposure levels)
  strata?: [string, string];        // [low-risk stratum, high-risk stratum] of the confounder
  confounder?: string;              // e.g. 'age', 'birth weight'
  outcome?: string;                 // e.g. 'mortality'
  unit?: string;                    // y-axis / tile unit, e.g. 'Deaths per 100 births'
  shareHigh?: [number, number];     // % of each group in the high-risk stratum
  risks?: [number, number, number, number]; // % risk: [A low, A high, B low, B high]
}

export function SimpsonExplorer({ onReached, config }: InteractiveProps) {
  const cfg = (config ?? {}) as SimpsonConfig;
  const groups = cfg.groups ?? ['Population A', 'Population B'];
  const strata = cfg.strata ?? ['Younger', 'Older'];
  const confounder = cfg.confounder ?? 'age';
  const outcome = cfg.outcome ?? 'Mortality';
  const unit = cfg.unit ?? 'Risk per 100';
  const [oldA, setOldA] = useState(cfg.shareHigh?.[0] ?? 30);
  const [oldB, setOldB] = useState(cfg.shareHigh?.[1] ?? 30);
  // stratum-specific risks in %: [low A, high A, low B, high B]
  const [r, setR] = useState<[number, number, number, number]>(cfg.risks ?? [0.5, 4, 0.5, 4]);
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
  const reached = useReached(paradox, onReached, 'overall comparison contradicts the within-group comparisons');

  // Grouped bars: risk per 100 in each hospital/group, overall and within each stratum (linear scale, no ratios).
  const fr = frame(520, 240);
  const rows = [
    { k: 'All births', a: crudeA * 100, b: crudeB * 100, ratio: crudeRR },
    { k: strata[0], a: yA * 100, b: yB * 100, ratio: rrY },
    { k: strata[1], a: oA * 100, b: oB * 100, ratio: rrO },
  ];
  const vmax = Math.max(1, ...rows.flatMap(r => [r.a, r.b])) * 1.15;
  const y = linear(0, vmax, fr.t + fr.ih, fr.t);
  const step = vmax > 40 ? 10 : vmax > 20 ? 5 : vmax > 8 ? 2 : 1;
  const ticks = Array.from({ length: Math.floor(vmax / step) + 1 }, (_, i) => i * step);
  const gw = fr.iw / rows.length;
  const times = (x: number) => !isFinite(x) ? '–' : Math.abs(x - 1) < 0.005 ? 'the same' : `${f2(x)} times ${x > 1 ? '(higher)' : '(lower)'}`;
  const p2 = (x: number) => x.toFixed(2);

  return <div className="ix">
    <div className="ix-panel">
      <h4>{confounder} mix</h4>
      <Row label={`${groups[0]}: ${oldA}% ${strata[1].toLowerCase()}`}>
        <input id="simp-oldA" type="range" min={0} max={100} step={1} value={oldA} onChange={e => setOldA(+e.target.value)} />
      </Row>
      <Row label={`${groups[1]}: ${oldB}% ${strata[1].toLowerCase()}`}>
        <input id="simp-oldB" type="range" min={0} max={100} step={1} value={oldB} onChange={e => setOldB(+e.target.value)} />
      </Row>
      <h4 style={{ marginTop: 12 }}>{outcome} risk by {confounder} (%)</h4>
      <table className="t2">
        <thead><tr><th></th><th>{strata[0]}</th><th>{strata[1]}</th></tr></thead>
        <tbody>
          {groups.map((p, pi) => <tr key={p}>
            <th>{p}</th>
            {[0, 1].map(s => { const i = pi * 2 + s; const lab = `${p}, ${strata[s]} risk (%)`;
              return <td key={s}><input id={`simp-r${i}`} aria-label={lab} type="number" min={0} max={100} step={0.1} value={r[i]} onChange={e => setRi(i, +e.target.value)} /></td>; })}
          </tr>)}
        </tbody>
      </table>
      <p className="note">Synthetic data. Defaults: {strata[0].toLowerCase()} {cfg.risks?.[0] ?? 0.5}% and {strata[1].toLowerCase()} {cfg.risks?.[1] ?? 4}% in {groups[0]}; {cfg.risks?.[2] ?? 0.5}% and {cfg.risks?.[3] ?? 4}% in {groups[1]}.</p>
    </div>
    <div>
      <div className="stats">
        {rows.map((r, i) => <Stat key={r.k} k={i === 0 ? 'All births' : `Only ${r.k.charAt(0).toLowerCase()}${r.k.slice(1)}`} v={`${p2(r.a)} vs ${p2(r.b)}`}
          s={`${groups[0]}: ${times(r.ratio)}`} tone={i === 0 ? (paradox ? 'warn' : undefined) : 'unexp'} />)}
      </div>
      <div className="fig">
        <svg viewBox={`0 0 ${fr.W} ${fr.H}`} role="img" aria-label={`${unit} in each group, overall and within each ${confounder} group`}>
          {ticks.map(t => <g key={t}>
            <line x1={fr.l} x2={fr.l + fr.iw} y1={y(t)} y2={y(t)} stroke="var(--line)" />
            <text x={fr.l - 6} y={y(t) + 4} textAnchor="end" fontSize="13" fill="var(--muted)" fontFamily="var(--mono)">{t}</text>
          </g>)}
          <text transform={`translate(12,${fr.t + fr.ih / 2}) rotate(-90)`} textAnchor="middle" fontSize="14" fill="var(--fg)">{unit}</text>
          {rows.map((r, i) => {
            const x0 = fr.l + i * gw + gw * 0.18, w = gw * 0.3;
            return <g key={r.k}>
              {[{ v: r.a, f: 'var(--exp)' }, { v: r.b, f: 'var(--unexp)' }].map((b, j) => <g key={j}>
                <rect x={x0 + j * (w + 4)} width={w} y={y(b.v)} height={Math.max(1, y(0) - y(b.v))} fill={b.f} />
                <text x={x0 + j * (w + 4) + w / 2} y={y(b.v) - 5} textAnchor="middle" fontSize="13" fill="var(--fg)" fontFamily="var(--mono)">{p2(b.v)}</text>
              </g>)}
              <text x={x0 + w + 2} y={fr.t + fr.ih + 18} textAnchor="middle" fontSize="14" fill="var(--fg)" fontWeight={i === 0 ? 600 : 400}>{r.k}</text>
            </g>;
          })}
        </svg>
      </div>
      <div className="legend"><span><i style={{ background: 'var(--exp)' }} />{groups[0]}</span><span><i style={{ background: 'var(--unexp)' }} />{groups[1]}</span></div>
      <div className="note">
        {groups[0]} has {oldA}% of its births {strata[1].toLowerCase()}; {groups[1]} has {oldB}%. The "all births" figure is a blend of the two {confounder} groups, so changing the mix alone moves it, while the comparison within each {confounder} group stays put. ("{groups[0]}: {f2(crudeRR)} times" is a comparison Chapter 4 will name the <Preview term="risk ratio" />.)
      </div>
      {reached && <div className="reached">The overall comparison now points the opposite way to the comparison within every {confounder} group: {confounder} is confounding.</div>}
    </div>
  </div>;
}
