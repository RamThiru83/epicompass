/** Ch. 3 — Induction and latent periods, and why the exposure window must reach back far enough. */
import { useMemo, useState } from 'react';
import { rng } from '@epicompass/epi-core';
import type { InteractiveProps } from '../types';
import { Stat, Row, pct, linear, frame, XAxis } from '../ui';
import { useReached } from './useReached';

const NPEOPLE = 30;

export function InductionTimeline({ onReached }: InteractiveProps) {
  const [ind, setInd] = useState(8);
  const [lat, setLat] = useState(2);
  const [win, setWin] = useState(12);
  const [sawShort, setSawShort] = useState(false);

  const changeInd = (v: number) => { setInd(v); if (win < v) setSawShort(true); };
  const changeWin = (v: number) => { setWin(v); if (v < ind) setSawShort(true); };
  const reached = useReached(sawShort && win > ind, onReached, 'window shorter then longer than induction period');

  // Synthetic cohort: exposure age and an individual deviation in induction time (±2 years), seeded.
  const base = useMemo(() => {
    const rand = rng(31);
    return Array.from({ length: NPEOPLE }, () => ({ e: 20 + rand() * 30, j: (rand() - 0.5) * 4 }))
      .sort((p, q) => p.e - q.e);
  }, []);
  const cohort = base.map(p => { const d = p.e + Math.max(0.5, ind + p.j) + lat; return { ...p, d, inside: d - p.e <= win }; });
  const nIn = cohort.filter(p => p.inside).length;

  // Single-person timeline
  const t = frame(540, 120, { l: 20, r: 20, t: 20, b: 38 });
  const xt = linear(0, 20, t.l, t.l + t.iw);
  const yb = t.t + 26;

  // Cohort view
  const c = frame(540, 14 + NPEOPLE * 9 + 40, { l: 20, r: 20, t: 12, b: 40 });
  const xa = linear(15, 80, c.l, c.l + c.iw);
  const rowY = (i: number) => c.t + i * 9 + 4;

  return <div className="ix">
    <div className="ix-panel">
      <h4>One person</h4>
      <Row label={`Induction period: ${ind} y`}>
        <input id="ind-ind" type="range" min={1} max={15} step={1} value={ind} onChange={e => changeInd(+e.target.value)} />
      </Row>
      <Row label={`Latent period: ${lat} y`}>
        <input id="ind-lat" type="range" min={0} max={5} step={1} value={lat} onChange={e => setLat(+e.target.value)} />
      </Row>
      <h4 style={{ marginTop: 12 }}>Cohort analysis</h4>
      <Row label={`Count as exposed: last ${win} y before diagnosis`}>
        <input id="ind-win" type="range" min={1} max={25} step={1} value={win} onChange={e => changeWin(+e.target.value)} />
      </Row>
      <p className="note">{NPEOPLE} synthetic people, each exposed once; individual induction times vary by up to ±2 years.</p>
    </div>
    <div>
      <div className="stats">
        <Stat k="Exposure inside window" v={`${nIn} / ${NPEOPLE}`} s={pct(nIn / NPEOPLE, 0)} tone="ok" />
        <Stat k="Wrongly called unexposed" v={NPEOPLE - nIn} tone={nIn < NPEOPLE ? 'warn' : undefined} />
        <Stat k="Window vs induction + latent" v={`${win} vs ${ind + lat} y`} />
      </div>
      <div className="fig">
        <svg viewBox={`0 0 ${t.W} ${t.H}`} role="img" aria-label={`Exposure at year 0, disease begins at year ${ind}, detected at year ${ind + lat}`}>
          <rect x={xt(0)} y={yb - 8} width={xt(ind) - xt(0)} height={16} fill="var(--exp)" fillOpacity={0.35} />
          <rect x={xt(ind)} y={yb - 8} width={Math.max(0, xt(ind + lat) - xt(ind))} height={16} fill="var(--unexp)" fillOpacity={0.35} />
          <circle cx={xt(0)} cy={yb} r={6} fill="var(--exp)" />
          <rect x={xt(ind) - 1.5} y={yb - 12} width={3} height={24} fill="var(--fg)" />
          <circle cx={xt(ind + lat)} cy={yb} r={6} fill="var(--unexp)" />
          <text x={xt(0)} y={t.t - 6} fontSize="11" fill="var(--fg)">exposure</text>
          <text x={xt(ind / 2)} y={yb + 4} textAnchor="middle" fontSize="11" fill="var(--fg)">induction</text>
          <text x={Math.min(xt(ind + lat), t.l + t.iw - 4)} y={t.t - 6} textAnchor="end" fontSize="11" fill="var(--fg)">detection</text>
          <XAxis ticks={[0, 5, 10, 15, 20]} x={xt} y={yb + 22} W={t.W} label="Years since exposure" />
        </svg>
      </div>
      <div className="fig">
        <svg viewBox={`0 0 ${c.W} ${c.H}`} role="img" aria-label={`${nIn} of ${NPEOPLE} people had their exposure inside a ${win}-year window before diagnosis`}>
          {cohort.map((p, i) => <g key={i}>
            <rect x={xa(Math.max(15, p.d - win))} y={rowY(i) - 3} width={xa(p.d) - xa(Math.max(15, p.d - win))} height={6} fill="var(--accent)" fillOpacity={0.2} />
            <line x1={xa(p.e)} x2={xa(p.d)} y1={rowY(i)} y2={rowY(i)} stroke="var(--muted)" strokeWidth={1} />
            <circle cx={xa(p.e)} cy={rowY(i)} r={3.2} fill={p.inside ? 'var(--ok)' : 'var(--warn)'} />
            <rect x={xa(p.d) - 1} y={rowY(i) - 3.5} width={2} height={7} fill="var(--fg)" />
          </g>)}
          <XAxis ticks={[20, 30, 40, 50, 60, 70, 80]} x={xa} y={c.t + c.ih + 2} W={c.W} label="Age (years)" />
        </svg>
      </div>
      <div className="legend">
        <span><i style={{ background: 'var(--ok)' }} />exposure counted</span>
        <span><i style={{ background: 'var(--warn)' }} />exposure missed</span>
        <span><i style={{ background: 'var(--accent)' }} />exposure window</span>
        <span><i style={{ background: 'var(--fg)' }} />diagnosis</span>
      </div>
      <div className="note">
        Exposure matters only if it fell before the induction period began: a window shorter than induction plus latent period ({ind + lat} y) misses causally relevant exposures and misclassifies cases as unexposed.
      </div>
      {reached && <div className="reached">The exposure window must reach back at least as far as the (empirical) induction period.</div>}
    </div>
  </div>;
}
