/** Shared building blocks for interactives: stat tiles, a linear/log scale helper, axis renderers. All colours come from CSS tokens. */
import type { ReactNode } from 'react';

export function Stat({ k, v, s, tone }: { k: string; v: ReactNode; s?: ReactNode; tone?: 'exp' | 'unexp' | 'ok' | 'warn' }) {
  return <div className={`stat ${tone ?? ''}`}><div className="k">{k}</div><div className="v">{v}</div>{s !== undefined && <div className="s">{s}</div>}</div>;
}

export function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return <label className="row"><span>{label}</span>{children}</label>;
}

export const f2 = (x: number) => (isFinite(x) ? x.toFixed(2) : '–');
export const f3 = (x: number) => (isFinite(x) ? x.toFixed(3) : '–');
export const pct = (x: number, dp = 1) => (isFinite(x) ? (100 * x).toFixed(dp) + '%' : '–');
export const fP = (p: number) => (p < 0.001 ? '< 0.001' : p.toFixed(3));

/** Linear scale: maps [d0,d1] → [r0,r1]. */
export const linear = (d0: number, d1: number, r0: number, r1: number) => (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
/** Log scale on the data side. */
export const logScale = (d0: number, d1: number, r0: number, r1: number) => { const l = linear(Math.log(d0), Math.log(d1), r0, r1); return (v: number) => l(Math.log(v)); };

/** Standard chart frame: returns margins and inner size for a viewBox of W×H. */
export const frame = (W: number, H: number, m = { l: 48, r: 16, t: 14, b: 38 }) => ({ W, H, ...m, iw: W - m.l - m.r, ih: H - m.t - m.b });

export function XAxis({ ticks, x, y, label, W, fmt = String }: { ticks: number[]; x: (v: number) => number; y: number; label?: string; W: number; fmt?: (v: number) => string }) {
  return <g>
    <line x1={x(ticks[0])} x2={x(ticks[ticks.length - 1])} y1={y} y2={y} stroke="var(--line)" />
    {ticks.map(t => <g key={t}><line x1={x(t)} x2={x(t)} y1={y} y2={y + 4} stroke="var(--muted)" /><text x={x(t)} y={y + 16} textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="var(--mono)">{fmt(t)}</text></g>)}
    {label && <text x={W / 2} y={y + 32} textAnchor="middle" fontSize="12" fill="var(--fg)">{label}</text>}
  </g>;
}
export function YAxis({ ticks, y, x, x1, label, fmt = String }: { ticks: number[]; y: (v: number) => number; x: number; x1: number; label?: string; fmt?: (v: number) => string }) {
  return <g>
    {ticks.map(t => <g key={t}><line x1={x} x2={x1} y1={y(t)} y2={y(t)} stroke="var(--line)" /><text x={x - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted)" fontFamily="var(--mono)">{fmt(t)}</text></g>)}
    {label && <text transform={`translate(12,${(y(ticks[0]) + y(ticks[ticks.length - 1])) / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="var(--fg)">{label}</text>}
  </g>;
}

import { GLOSSARY } from '../content/glossary';
/** Inline preview of a term formally taught in a later chapter (dotted underline + tooltip). */
export function Preview({ term, children }: { term: string; children?: ReactNode }) {
  const g = GLOSSARY[term];
  const tip = g ? `${g.plain} Formally introduced in Chapter ${g.chapter}.` : '';
  return <span className="preview" tabIndex={0} data-tip={tip}>{children ?? term}</span>;
}
