/** Ch. 3 — Sufficient-component causes: build causal pies and see how the strength of A depends on its complements. */
import { useMemo, useState } from 'react';
import { rng, riskRatio } from '@epicompass/epi-core';
import type { InteractiveProps } from '../types';
import { Stat, Row, f2, pct } from '../ui';
import { useReached } from './useReached';

const COMPS = ['A', 'B', 'C', 'D', 'E', 'U'] as const;
type Comp = typeof COMPS[number];
const COLOUR: Record<Comp, string> = { A: 'var(--exp)', B: 'var(--accent)', C: 'var(--unexp)', D: 'var(--ok)', E: 'var(--warn)', U: 'var(--muted)' };
const BASE_PREV: Record<Comp, number> = { A: 0.5, B: 0.3, C: 0.4, D: 0.3, E: 0.2, U: 0.5 };
const N = 100;

function sector(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  return `M${cx},${cy} L${p(a0)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z`;
}

export function CausalPies({ onReached }: InteractiveProps) {
  const [pies, setPies] = useState<Comp[][]>([['A', 'B'], [], []]);
  const [sel, setSel] = useState(0);
  const [bPrev, setBPrev] = useState(30);
  const [bChanged, setBChanged] = useState(false);
  const [seed, setSeed] = useState(1854);

  const toggle = (c: Comp) => setPies(ps => ps.map((p, i) => i !== sel ? p : p.includes(c) ? p.filter(x => x !== c) : [...p, c].sort()));

  // Each person draws one uniform per component, so moving the B slider only changes who has B.
  const people = useMemo(() => {
    const rand = rng(seed);
    return Array.from({ length: N }, () => {
      const has = {} as Record<Comp, boolean>;
      COMPS.forEach(c => { const u = rand(); has[c] = u < (c === 'B' ? bPrev / 100 : BASE_PREV[c]); });
      return has;
    });
  }, [seed, bPrev]);

  const built = pies.filter(p => p.length > 0);
  const ill = people.map(h => built.some(p => p.every(c => h[c])));
  const cases = ill.filter(Boolean).length;
  let a = 0, n1 = 0, b = 0, n0 = 0;
  people.forEach((h, i) => { if (h.A) { n1++; if (ill[i]) a++; } else { n0++; if (ill[i]) b++; } });
  const rr = n1 > 0 && n0 > 0 ? riskRatio({ a, b, c: n1 - a, d: n0 - b }).estimate : NaN;
  const rrText = Number.isNaN(rr) ? '–' : rr === Infinity ? '∞' : f2(rr);

  const reached = useReached(built.length >= 2 && bChanged, onReached, 'built two pies and varied B');

  const W = 540, H = 170, R = 62;
  const cx = (i: number) => 90 + i * 180;

  return <div className="ix">
    <div className="ix-panel">
      <h4>Pie being edited</h4>
      <div className="actions" role="group" aria-label="Choose a pie to edit">
        {pies.map((_, i) => <button key={i} type="button" className={`btn${sel === i ? '' : ' ghost'}`} aria-pressed={sel === i} onClick={() => setSel(i)}>Pie {i + 1}</button>)}
      </div>
      <h4 style={{ marginTop: 12 }}>Component causes</h4>
      <div className="actions" role="group" aria-label={`Add or remove components in pie ${sel + 1}`}>
        {COMPS.map(c => { const on = pies[sel].includes(c);
          return <button key={c} type="button" className={`btn${on ? '' : ' ghost'}`} aria-pressed={on}
            aria-label={`${c === 'U' ? 'U (unknown component)' : c}: ${on ? 'remove from' : 'add to'} pie ${sel + 1}`} onClick={() => toggle(c)}>{c}</button>; })}
      </div>
      <Row label={`Prevalence of B: ${bPrev}%`}>
        <input id="pies-bprev" type="range" min={0} max={100} step={5} value={bPrev} onChange={e => { setBPrev(+e.target.value); setBChanged(true); }} />
      </Row>
      <div className="actions">
        <button type="button" className="btn ghost" onClick={() => setSeed(s => s + 1)}>New random sample</button>
      </div>
      <p className="note">Synthetic population of {N}. Other prevalences: A 50%, C 40%, D 30%, E 20%, U 50%.</p>
    </div>
    <div>
      <div className="stats">
        <Stat k="Cases" v={`${cases} / ${N}`} />
        <Stat k="Risk with A" v={pct(n1 ? a / n1 : NaN, 0)} s={`${a} / ${n1}`} tone="exp" />
        <Stat k="Risk without A" v={pct(n0 ? b / n0 : NaN, 0)} s={`${b} / ${n0}`} tone="unexp" />
        <Stat k="Strength of A (risk with A ÷ risk without A)" v={rrText} />
      </div>
      <div className="fig">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Sufficient causes: ${pies.map((p, i) => `pie ${i + 1} ${p.join(', ') || 'empty'}`).join('; ')}`}>
          {pies.map((p, i) => <g key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
            {p.length === 0 && <circle cx={cx(i)} cy={78} r={R} fill="var(--panel)" stroke="var(--line)" strokeDasharray="4 4" />}
            {p.length === 1 && <circle cx={cx(i)} cy={78} r={R} fill={COLOUR[p[0]]} fillOpacity={0.3} stroke={COLOUR[p[0]]} />}
            {p.length > 1 && p.map((c, j) => { const st = (2 * Math.PI) / p.length, a0 = -Math.PI / 2 + j * st;
              return <path key={c} d={sector(cx(i), 78, R, a0, a0 + st)} fill={COLOUR[c]} fillOpacity={0.3} stroke={COLOUR[c]} />; })}
            {p.map((c, j) => { const st = (2 * Math.PI) / p.length, m = -Math.PI / 2 + (j + 0.5) * st, rr2 = p.length === 1 ? 0 : R * 0.6;
              return <text key={c} x={cx(i) + rr2 * Math.cos(m)} y={78 + rr2 * Math.sin(m) + 5} textAnchor="middle" fontSize="15" fontWeight={600} fill="var(--fg)">{c}</text>; })}
            {sel === i && <circle cx={cx(i)} cy={78} r={R + 4} fill="none" stroke="var(--accent)" strokeWidth={2} />}
            <text x={cx(i)} y={162} textAnchor="middle" fontSize="12" fill="var(--muted)">Pie {i + 1}{p.length === 0 ? ' (empty)' : ''}</text>
          </g>)}
        </svg>
      </div>
      <div className="fig">
        <svg viewBox="0 0 204 204" style={{ maxWidth: 260 }} role="img" aria-label={`${N} people, ${cases} with disease`}>
          {people.map((h, i) => <circle key={i} cx={12 + (i % 10) * 20} cy={12 + Math.floor(i / 10) * 20} r={7}
            fill={ill[i] ? 'var(--exp)' : 'var(--panel)'} stroke={h.A ? 'var(--fg)' : 'var(--line)'} strokeWidth={h.A ? 2 : 1} />)}
        </svg>
      </div>
      <div className="legend">
        <span><i style={{ background: 'var(--exp)' }} />has disease</span>
        <span><i style={{ background: 'var(--fg)' }} />dark ring: has A</span>
      </div>
      <div className="note">
        A causes disease only when its complementary components are present: when B is common, more people with A complete a pie and A looks strong; when B is rare, the same A looks weak.
      </div>
      {reached && <div className="reached">The strength of a cause is not a fixed property; it depends on the prevalence of its complements.</div>}
    </div>
  </div>;
}
