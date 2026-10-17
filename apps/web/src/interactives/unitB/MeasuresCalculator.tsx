/** Measures of effect and attributable fractions (Rothman ch. 4): ratio versus difference, AF and PAF. */
import { useState } from 'react';
import { attributableFractionExposed, populationAttributableFractionLevin } from '@epicompass/epi-core';
import type { InteractiveProps } from '../types';
import { Stat, Row, f2, f3, pct, linear, logScale, YAxis } from '../ui';
import { useReachOnce } from './common';

interface Scenario { name: string; r1: number; r0: number; p: number }
const PRESETS: Scenario[] = [
  { name: 'Rare but strong', r1: 0.10, r0: 0.01, p: 0.01 },
  { name: 'Common but weak', r1: 0.02, r0: 0.01, p: 0.5 },
];
const clamp01 = (x: number) => (isFinite(x) ? Math.max(0, Math.min(1, x)) : 0);
const measures = (s: Scenario) => {
  const rr = s.r1 / s.r0;
  return { rr, rd: s.r1 - s.r0, afe: attributableFractionExposed(rr), paf: populationAttributableFractionLevin(rr, s.p) };
};

export function MeasuresCalculator({ onReached }: InteractiveProps) {
  const [scen, setScen] = useState<Scenario[]>([{ name: 'Your scenario', r1: 0.2, r0: 0.05, p: 0.3 }]);
  const [sel, setSel] = useState(0);
  const [scale, setScale] = useState<'ratio' | 'difference'>('ratio');
  const reach = useReachOnce(onReached);
  const cur = scen[sel];
  const m = measures(cur);
  const edit = (k: 'r1' | 'r0' | 'p', v: number) => setScen(list => list.map((s, i) => (i === sel ? { ...s, [k]: clamp01(v) } : s)));
  const loadPresets = () => { setScen(PRESETS.map(s => ({ ...s }))); setSel(0); reach('presets loaded'); };

  // Chart: paired bars per scenario; log axis shows ratios as equal gaps, linear axis shows differences.
  const W = 620, H = 260, L = 56, T = 18, B = 52, ih = H - T - B;
  const allR = scen.flatMap(s => [s.r1, s.r0]).filter(v => v > 0);
  const hi = Math.max(0.05, ...allR);
  const lo = Math.max(0.001, Math.min(...allR, hi / 2) / 2);
  const Y = scale === 'ratio' ? logScale(lo, hi * 1.3, T + ih, T) : linear(0, hi * 1.15, T + ih, T);
  const base = T + ih;
  const ticks = scale === 'ratio'
    ? [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1].filter(v => v >= lo && v <= hi * 1.3)
    : [0, 0.25, 0.5, 0.75, 1].map(f => +(f * hi * 1.1).toPrecision(2));
  const groupW = (W - L - 20) / scen.length, bw = Math.min(56, groupW / 4);
  const yOf = (v: number) => (v > 0 ? Y(Math.max(v, scale === 'ratio' ? lo : 0)) : base);

  return (
    <div className="ix">
      <div className="ix-panel">
        <h4>Inputs</h4>
        {scen.length > 1 && (
          <Row label="Editing">
            <select id="mc-sel" aria-label="Scenario to edit" value={sel} onChange={e => setSel(+e.target.value)}>
              {scen.map((s, i) => <option key={s.name} value={i}>{s.name}</option>)}
            </select>
          </Row>
        )}
        <Row label="Risk in exposed">
          <input id="mc-r1" type="number" min={0} max={1} step={0.01} value={cur.r1} onChange={e => edit('r1', +e.target.value)} />
        </Row>
        <Row label="Risk in unexposed">
          <input id="mc-r0" type="number" min={0} max={1} step={0.01} value={cur.r0} onChange={e => edit('r0', +e.target.value)} />
        </Row>
        <Row label="Proportion exposed">
          <input id="mc-p" type="number" min={0} max={1} step={0.01} value={cur.p} onChange={e => edit('p', +e.target.value)} />
        </Row>
        <Row label="Chart scale">
          <select id="mc-scale" value={scale} onChange={e => setScale(e.target.value as 'ratio' | 'difference')}>
            <option value="ratio">Ratio (log)</option>
            <option value="difference">Difference (linear)</option>
          </select>
        </Row>
        <div className="actions">
          <button className="btn" onClick={loadPresets}>Rare but strong vs common but weak</button>
          {scen.length > 1 && <button className="btn ghost" onClick={() => { setScen([{ ...cur, name: 'Your scenario' }]); setSel(0); }}>Single scenario</button>}
        </div>
      </div>
      <div>
        <div className="stats">
          <Stat k="Risk ratio" v={f2(m.rr)} tone="exp" />
          <Stat k="Risk difference" v={f3(m.rd)} s="excess risk in exposed" tone="unexp" />
          <Stat k="AF among exposed" v={pct(m.afe)} s="(RR − 1)/RR" />
          <Stat k="Population AF (Levin)" v={pct(m.paf)} s="p(RR − 1)/[p(RR − 1) + 1]" tone="ok" />
        </div>
        <div className="fig">
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Paired bars of risk in exposed and unexposed">
            <rect x="0" y="0" width={W} height={H} fill="var(--panel)" />
            <YAxis ticks={ticks} y={Y} x={L} x1={W - 10} label={scale === 'ratio' ? 'Risk (log scale)' : 'Risk'} fmt={v => String(v)} />
            {scen.map((s, i) => {
              const mm = measures(s), cx = L + groupW * i + groupW / 2;
              const y1 = yOf(s.r1), y0 = yOf(s.r0);
              return <g key={s.name}>
                <rect x={cx - bw - 3} y={y1} width={bw} height={Math.max(0, base - y1)} fill="var(--exp)" />
                <rect x={cx + 3} y={y0} width={bw} height={Math.max(0, base - y0)} fill="var(--unexp)" />
                <line x1={cx - bw - 3} x2={cx + bw + 3} y1={y1} y2={y1} stroke="var(--muted)" strokeDasharray="3 3" />
                <text x={cx} y={base + 16} textAnchor="middle" fontSize="12" fill="var(--fg)">{s.name}{i === sel && scen.length > 1 ? ' (editing)' : ''}</text>
                <text x={cx} y={base + 32} textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="var(--mono)">
                  {scale === 'ratio' ? `RR ${f2(mm.rr)}` : `RD ${f3(mm.rd)}`} · PAF {pct(mm.paf)}
                </text>
              </g>;
            })}
          </svg>
        </div>
        <div className="legend">
          <span><i style={{ background: 'var(--exp)' }} />risk in exposed</span>
          <span><i style={{ background: 'var(--unexp)' }} />risk in unexposed</span>
        </div>
        <div className="note">
          On the log (ratio) scale equal ratios look like equal gaps; on the linear (difference) scale the gap is the excess risk.
          The population attributable fraction depends on both the strength of the effect and how common the exposure is: load the
          presets to see a weak but common exposure account for a larger share of cases than a strong but rare one.
          Fractions assume the ratio is causal and unconfounded. Hypothetical values.
        </div>
      </div>
    </div>
  );
}
