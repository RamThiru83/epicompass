/** Single-table analyser (Rothman ch. 4 and 8): estimates, confidence intervals and the P-value function. */
import { useState } from 'react';
import {
  riskRatio, riskDifference, rateRatio, rateDifference, oddsRatio, chi2x2, chiRate, pValueFunction,
} from '@epicompass/epi-core';
import type { InteractiveProps } from '../types';
import { Stat, Row, f2, f3, fP, linear, logScale, XAxis, YAxis } from '../ui';
import { useReachOnce } from './common';

type DataType = 'risk' | 'rate' | 'cc';
const DEFAULTS: Record<DataType, [number, number, number, number]> = {
  risk: [30, 20, 270, 380],
  rate: [30, 20, 2800, 3900],
  cc: [40, 25, 120, 175],
};
const LABELS: Record<DataType, { r2: string; ratio: string; occ: [string, string] }> = {
  risk: { r2: 'Non-cases', ratio: 'Risk ratio', occ: ['Risk, exposed', 'Risk, unexposed'] },
  rate: { r2: 'Person-time', ratio: 'Rate ratio', occ: ['Rate, exposed (per 1,000 PT)', 'Rate, unexposed (per 1,000 PT)'] },
  cc: { r2: 'Controls', ratio: 'Odds ratio', occ: ['Exposure odds, cases', 'Exposure odds, controls'] },
};

function analyse(type: DataType, [a, b, c, d]: number[], level: number) {
  if (type === 'risk') {
    const t = { a, b, c, d };
    return { occ: [a / (a + c), b / (b + d)], ratio: riskRatio(t, level), diff: riskDifference(t, level), p: chi2x2(t).p, k: 1 };
  }
  if (type === 'rate') {
    const t = { a, b, pt1: c, pt0: d };
    return { occ: [a / c, b / d], ratio: rateRatio(t, level), diff: rateDifference(t, level), p: chiRate(t).p, k: 1000 };
  }
  const t = { a, b, c, d };
  return { occ: [a / b, c / d], ratio: oddsRatio(t, level), diff: undefined, p: chi2x2(t).p, k: 1 };
}

export function TwoByTwo({ onReached, config }: InteractiveProps) {
  const preset = config?.dataType;
  const initType: DataType = preset === 'rate' || preset === 'cc' || preset === 'risk' ? preset : preset === 'case-control' ? 'cc' : 'risk';
  const [type, setType] = useState<DataType>(initType);
  const [cells, setCells] = useState<number[]>(DEFAULTS[initType]);
  const [level, setLevel] = useState(95);
  const reach = useReachOnce(onReached);
  const lab = LABELS[type];

  const valid = cells.every(v => isFinite(v) && v > 0);
  const r = valid ? analyse(type, cells, level) : null;
  const fmtOcc = (x: number) => (r ? f3(x * r.k) : '–');
  const fmtDiff = (x: number) => (type === 'rate' ? f2(x * 1000) : f3(x));

  // P-value function chart
  const W = 600, H = 270, L = 48, R = 16, T = 14, B = 42;
  let chart = null;
  if (r && isFinite(r.ratio.estimate) && isFinite(r.ratio.seLog) && r.ratio.seLog > 0) {
    const pts = pValueFunction(r.ratio.estimate, r.ratio.seLog, 201, 3.3);
    const x0 = pts[0].x, x1 = pts[pts.length - 1].x;
    const X = logScale(x0, x1, L, W - R), Y = linear(0, 1, H - B, T);
    const ticks = [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50].filter(t => t >= x0 && t <= x1);
    const alpha = 1 - level / 100;
    const ci = r.ratio.ci;
    chart = <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`P-value function for the ${lab.ratio.toLowerCase()}`}>
      <rect x="0" y="0" width={W} height={H} fill="var(--panel)" />
      <YAxis ticks={[0, 0.25, 0.5, 0.75, 1]} y={Y} x={L} x1={W - R} label="P-value" />
      {ticks.map(t => <line key={t} x1={X(t)} x2={X(t)} y1={Y(1)} y2={Y(0)} stroke="var(--line)" />)}
      <XAxis ticks={ticks} x={X} y={H - B} W={W + L - R} label={`${lab.ratio} (log scale)`} />
      <line x1={X(1)} x2={X(1)} y1={Y(1)} y2={Y(0)} stroke="var(--muted)" strokeDasharray="4 3" />
      <line x1={L} x2={W - R} y1={Y(alpha)} y2={Y(alpha)} stroke="var(--exp)" strokeDasharray="2 3" />
      <line x1={X(Math.max(x0, ci.lower))} x2={X(Math.min(x1, ci.upper))} y1={Y(alpha)} y2={Y(alpha)} stroke="var(--exp)" strokeWidth="4" />
      <text x={X(Math.min(x1, ci.upper)) + 4} y={Y(alpha) - 4} fontSize="11" fill="var(--exp)" fontFamily="var(--mono)">{level}% CI</text>
      <polyline points={pts.map(p => `${X(p.x).toFixed(1)},${Y(p.p).toFixed(1)}`).join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2.2" />
      <circle cx={X(r.ratio.estimate)} cy={Y(1)} r={3.5} fill="var(--accent)" />
    </svg>;
  }

  const setCell = (i: number, v: number) => setCells(cs => cs.map((c, j) => (j === i ? v : c)));
  const cell = (i: number, id: string, name: string) =>
    <input id={id} aria-label={name} type="number" min={0} value={cells[i]} onChange={e => setCell(i, +e.target.value)} />;

  return (
    <div className="ix">
      <div className="ix-panel">
        <h4>Data</h4>
        <Row label="Data type">
          <select id="tbt-type" value={type} onChange={e => { const t = e.target.value as DataType; setType(t); setCells(DEFAULTS[t]); }}>
            <option value="risk">Cohort: risk data</option>
            <option value="rate">Cohort: person-time data</option>
            <option value="cc">Case-control data</option>
          </select>
        </Row>
        <table className="t2">
          <thead><tr><th></th><th>Exposed</th><th>Unexposed</th></tr></thead>
          <tbody>
            <tr><th>Cases</th><td>{cell(0, 'tbt-a', 'Exposed cases (a)')}</td><td>{cell(1, 'tbt-b', 'Unexposed cases (b)')}</td></tr>
            <tr><th>{lab.r2}</th><td>{cell(2, 'tbt-c', `Exposed ${lab.r2.toLowerCase()}`)}</td><td>{cell(3, 'tbt-d', `Unexposed ${lab.r2.toLowerCase()}`)}</td></tr>
          </tbody>
        </table>
        <Row label="Confidence level">
          <select id="tbt-level" value={level} onChange={e => { setLevel(+e.target.value); reach('confidence level changed'); }}>
            <option value={90}>90%</option><option value={95}>95%</option><option value={99}>99%</option>
          </select>
        </Row>
        <p className="hint mono">
          {type === 'risk' && 'RR = (a/N₁)/(b/N₀); SE[ln RR] = √(1/a − 1/N₁ + 1/b − 1/N₀)'}
          {type === 'rate' && 'IR = (a/PT₁)/(b/PT₀); SE[ln IR] = √(1/a + 1/b)'}
          {type === 'cc' && 'OR = ad/bc; SE[ln OR] = √(1/a + 1/b + 1/c + 1/d)'}
        </p>
      </div>
      <div>
        {r ? <div className="stats">
          <Stat k={lab.occ[0]} v={fmtOcc(r.occ[0])} tone="exp" />
          <Stat k={lab.occ[1]} v={fmtOcc(r.occ[1])} tone="unexp" />
          <Stat k={lab.ratio} v={f2(r.ratio.estimate)} s={`${level}% CI ${f2(r.ratio.ci.lower)} – ${f2(r.ratio.ci.upper)}`} />
          {r.diff && <Stat k={type === 'rate' ? 'Rate difference (per 1,000 PT)' : 'Risk difference'} v={fmtDiff(r.diff.estimate)}
            s={`${level}% CI ${fmtDiff(r.diff.ci.lower)} – ${fmtDiff(r.diff.ci.upper)}`} />}
          <Stat k="P-value (null = 1)" v={fP(r.p)} s="two-sided, large-sample" tone="ok" />
        </div> : <p className="note">Every cell must be a positive number for the large-sample formulas.</p>}
        <div className="fig">{chart}</div>
        <div className="legend">
          <span><i style={{ background: 'var(--accent)' }} />P-value function</span>
          <span><i style={{ background: 'var(--exp)' }} />{level}% CI, drawn at P = {f2(1 - level / 100)}</span>
          <span><i style={{ background: 'var(--muted)' }} />null value (1)</span>
        </div>
        <div className="note">
          The curve gives, for every hypothesised value of the {lab.ratio.toLowerCase()}, the two-sided P-value the data give it.
          It peaks at the point estimate; cutting it at P = 1 − level gives the confidence interval, and its height at 1 is the
          usual P-value. A wide curve means imprecise data, whatever the P-value. Example numbers are hypothetical.
        </div>
      </div>
    </div>
  );
}
