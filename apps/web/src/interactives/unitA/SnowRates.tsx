/** Ch. 2 — John Snow's natural experiment (stylised): cholera deaths per 10,000 houses by water company. */
import { useState } from 'react';
import { riskRatio, riskDifference } from '@epicompass/epi-core';
import type { InteractiveProps } from '../types';
import { Stat, f2, frame, linear } from '../ui';
import { useReached } from './useReached';

type Co = { houses: number; deaths: number };
const PER = 10000;
const f1 = (x: number) => (isFinite(x) ? x.toFixed(1) : '–');

export function SnowRates({ onReached }: InteractiveProps) {
  const [s, setS] = useState<Co>({ houses: 40046, deaths: 1263 });
  const [l, setL] = useState<Co>({ houses: 26107, deaths: 98 });
  const [edited, setEdited] = useState(false);
  const reached = useReached(edited, onReached, 'edited the Snow table');

  const upd = (set: (f: (c: Co) => Co) => void, key: keyof Co) => (v: string) => {
    const n = Math.max(0, Math.round(Number(v) || 0));
    set(c => ({ ...c, [key]: n })); setEdited(true);
  };
  const valid = s.houses > 0 && l.houses > 0 && s.deaths <= s.houses && l.deaths <= l.houses;
  const t = { a: s.deaths, b: l.deaths, c: s.houses - s.deaths, d: l.houses - l.deaths };
  const rr = valid ? riskRatio(t) : null;
  const rd = valid ? riskDifference(t) : null;
  const rateS = valid ? (s.deaths / s.houses) * PER : NaN;
  const rateL = valid ? (l.deaths / l.houses) * PER : NaN;

  const fr = frame(420, 230);
  const top = Math.max(50, Math.ceil(Math.max(rateS || 0, rateL || 0) / 50) * 50);
  const y = linear(0, top, fr.t + fr.ih, fr.t);
  const ticks = [0, top / 4, top / 2, (3 * top) / 4, top];
  const bars = [{ k: 'Company S', v: rateS, fill: 'var(--exp)' }, { k: 'Company L', v: rateL, fill: 'var(--unexp)' }];
  const bw = fr.iw / 2;

  const cellInput = (id: string, label: string, val: number, on: (v: string) => void) =>
    <input id={id} aria-label={label} type="number" min={0} step={1} value={val} onChange={e => on(e.target.value)} />;

  return <div className="ix">
    <div className="ix-panel">
      <h4>London, 1854 (stylised)</h4>
      <table className="t2">
        <thead><tr><th>Supplier</th><th>Houses</th><th>Cholera deaths</th></tr></thead>
        <tbody>
          <tr><th>Company S<br /><small>downstream intake</small></th>
            <td>{cellInput('snow-sh', 'Company S houses supplied', s.houses, upd(setS, 'houses'))}</td>
            <td>{cellInput('snow-sd', 'Company S cholera deaths', s.deaths, upd(setS, 'deaths'))}</td></tr>
          <tr><th>Company L<br /><small>upstream intake</small></th>
            <td>{cellInput('snow-lh', 'Company L houses supplied', l.houses, upd(setL, 'houses'))}</td>
            <td>{cellInput('snow-ld', 'Company L cholera deaths', l.deaths, upd(setL, 'deaths'))}</td></tr>
        </tbody>
      </table>
      <p className="note">Defaults are the figures as commonly cited for the first 7 weeks of the epidemic. Edit any cell.</p>
      <div className="actions">
        <button className="btn ghost" type="button" onClick={() => { setS({ houses: 40046, deaths: 1263 }); setL({ houses: 26107, deaths: 98 }); }}>Reset to cited figures</button>
      </div>
    </div>
    <div>
      <div className="stats">
        <Stat k="Deaths / 10,000 houses, S" v={f1(rateS)} tone="exp" />
        <Stat k="Deaths / 10,000 houses, L" v={f1(rateL)} tone="unexp" />
        <Stat k="Rate ratio (S vs L)" v={rr ? f2(rr.estimate) : '–'} s={rr && isFinite(rr.ci.lower) ? `95% CI ${f2(rr.ci.lower)}–${f2(rr.ci.upper)}` : undefined} />
        <Stat k="Rate difference / 10,000" v={rd ? f2(rd.estimate * PER) : '–'} s={rd ? `95% CI ${f2(rd.ci.lower * PER)} to ${f2(rd.ci.upper * PER)}` : undefined} />
      </div>
      {!valid && <div className="note">Each company needs at least one house, and deaths cannot exceed houses.</div>}
      <div className="fig">
        <svg viewBox={`0 0 ${fr.W} ${fr.H}`} role="img" aria-label="Cholera deaths per 10,000 houses by water company">
          {ticks.map(tk => <g key={tk}>
            <line x1={fr.l} x2={fr.l + fr.iw} y1={y(tk)} y2={y(tk)} stroke="var(--line)" />
            <text x={fr.l - 6} y={y(tk) + 4} textAnchor="end" fontSize="11" fill="var(--muted)" fontFamily="var(--mono)">{Math.round(tk)}</text>
          </g>)}
          <text transform={`translate(12,${fr.t + fr.ih / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="var(--fg)">Deaths / 10,000 houses</text>
          {bars.map((b, i) => {
            const x = fr.l + i * bw + bw * 0.25, w = bw * 0.5, v = isFinite(b.v) ? b.v : 0;
            return <g key={b.k}>
              <rect x={x} width={w} y={y(v)} height={Math.max(0, y(0) - y(v))} fill={b.fill} />
              <text x={x + w / 2} y={y(v) - 5} textAnchor="middle" fontSize="11" fill="var(--fg)" fontFamily="var(--mono)">{isFinite(b.v) ? Math.round(b.v) : '–'}</text>
              <text x={x + w / 2} y={fr.t + fr.ih + 18} textAnchor="middle" fontSize="12" fill="var(--fg)">{b.k}</text>
            </g>;
          })}
        </svg>
      </div>
      <div className="note">
        A natural experiment: both companies piped water into the same streets, often to neighbouring houses, so households differed mainly in which intake their water came from, not in who chose it.
      </div>
      {reached && <div className="reached">Change the numbers and watch how the comparison of rates responds.</div>}
    </div>
  </div>;
}
