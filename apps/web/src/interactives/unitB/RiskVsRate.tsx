/** Risk versus rate in a closed cohort (Rothman ch. 4): people leave the risk set when they have the event. */
import { useEffect, useMemo, useState } from 'react';
import { rng, riskFromRate } from '@epicompass/epi-core';
import type { InteractiveProps } from '../types';
import { Stat, Row, f2, f3, linear, XAxis, YAxis } from '../ui';
import { useReachOnce, useTicker, prefersReducedMotion, SYNTH } from './common';

export function RiskVsRate({ onReached }: InteractiveProps) {
  const [n, setN] = useState(200);
  const [hazard, setHazard] = useState(0.1);
  const [years, setYears] = useState(5);
  const [seed, setSeed] = useState(11);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reach = useReachOnce(onReached);

  // Event times drawn once per setting from a constant hazard (exponential waiting times).
  const eventTime = useMemo(() => {
    const r = rng(seed * 7919 + n);
    return Array.from({ length: n }, () => -Math.log(1 - r()) / hazard);
  }, [n, hazard, seed]);

  const reset = () => { setPlaying(false); setT(0); };
  useEffect(reset, [n, hazard, years]);

  useTicker(playing, prefersReducedMotion() ? 1400 : 700, () => {
    setT(prev => { const nx = Math.min(years, prev + 1); if (nx >= years) setPlaying(false); return nx; });
  });

  const at = (time: number) => {
    let cases = 0, pt = 0;
    for (const e of eventTime) { if (e <= time) cases++; pt += Math.min(e, time); }
    return { cases, pt };
  };
  const { cases, pt } = at(t);
  const risk = cases / n;
  const rate = pt > 0 ? cases / pt : NaN;
  const predicted = isFinite(rate) ? riskFromRate(rate, t) : NaN;

  useEffect(() => { if (t >= 5 && hazard >= 0.2) reach(`ran ${t} years at hazard ${hazard}`); }, [t, hazard, reach]);

  // History for the small chart: observed risk and naive rate × t by year.
  const hist = useMemo(() => Array.from({ length: t + 1 }, (_, y) => {
    const s = at(y); const r = s.pt > 0 ? s.cases / s.pt : 0;
    return { y, risk: s.cases / n, rt: r * y };
  }), [t, eventTime]); // eslint-disable-line react-hooks/exhaustive-deps

  // Dot grid
  const cols = Math.ceil(Math.sqrt(n * 1.25)), rows = Math.ceil(n / cols);
  const cell = Math.min(300 / cols, 230 / rows), gx = 12, gy = 18;
  // Chart
  const cx0 = 360, cw = 260, cy0 = 20, ch = 200;
  const X = linear(0, 10, cx0, cx0 + cw), maxY = Math.max(1, ...hist.map(h => h.rt));
  const Y = linear(0, maxY, cy0 + ch, cy0);
  const yTicks = maxY > 1.5 ? [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5].filter(v => v <= maxY) : [0, 0.25, 0.5, 0.75, 1];
  const path = (k: 'risk' | 'rt') => hist.map((h, i) => `${i ? 'L' : 'M'}${X(h.y).toFixed(1)},${Y(h[k]).toFixed(1)}`).join(' ');

  return (
    <div className="ix">
      <div className="ix-panel">
        <h4>Closed cohort</h4>
        <Row label={<span>Cohort size <b className="mono">{n}</b></span>}>
          <input id="rvr-n" aria-label="Cohort size" type="range" min={50} max={400} step={10} value={n} onChange={e => setN(+e.target.value)} />
        </Row>
        <Row label={<span>Hazard per year <b className="mono">{f2(hazard)}</b></span>}>
          <input id="rvr-h" aria-label="Hazard per year" type="range" min={0.01} max={0.5} step={0.01} value={hazard} onChange={e => setHazard(+e.target.value)} />
        </Row>
        <Row label={<span>Follow-up years <b className="mono">{years}</b></span>}>
          <input id="rvr-y" aria-label="Follow-up years" type="range" min={1} max={10} step={1} value={years} onChange={e => setYears(+e.target.value)} />
        </Row>
        <div className="actions">
          <button className="btn" onClick={() => { if (t >= years) setT(0); setPlaying(p => !p); }}>{playing ? 'Pause' : 'Play'}</button>
          <button className="btn ghost" disabled={t >= years} onClick={() => { setPlaying(false); setT(v => Math.min(years, v + 1)); }}>Step 1 year</button>
          <button className="btn ghost" onClick={reset}>Reset</button>
          <button className="btn ghost" onClick={() => { setSeed(s => s + 1); reset(); }}>New cohort</button>
        </div>
        <p className="hint">Year {t} of {years}. Try a hazard of 0.2 or more and run at least 5 years.</p>
      </div>
      <div>
        <div className="stats">
          <Stat k="Cumulative cases" v={`${cases} / ${n}`} tone="exp" />
          <Stat k="Person-years accrued" v={pt.toFixed(1)} />
          <Stat k="Risk = cases / N" v={f3(risk)} s={`over ${t} y`} />
          <Stat k="Rate = cases / PY" v={f3(rate)} s="per person-year" tone="unexp" />
          <Stat k="Rate × t (naive)" v={f3(rate * t)} tone="warn" />
          <Stat k="1 − exp(−rate × t)" v={f3(predicted)} s="risk predicted from rate" tone="ok" />
        </div>
        <div className="fig">
          <svg viewBox="0 0 640 270" role="img" aria-label="Cohort dots and risk versus rate-times-time chart">
            <rect x="0" y="0" width="640" height="270" fill="var(--panel)" />
            <text x={gx} y={12} fontSize="12" fill="var(--fg)">Each dot is one person (synthetic)</text>
            {eventTime.map((e, i) => {
              const c = i % cols, r = Math.floor(i / cols);
              return <circle key={i} cx={gx + c * cell + cell / 2} cy={gy + r * cell + cell / 2} r={Math.max(1.5, cell * 0.36)}
                fill={e <= t ? 'var(--exp)' : 'var(--unexp)'} opacity={e <= t ? 1 : 0.55} />;
            })}
            <YAxis ticks={yTicks} y={Y} x={cx0} x1={cx0 + cw} fmt={v => String(v)} />
            <XAxis ticks={[0, 2, 4, 6, 8, 10]} x={X} y={cy0 + ch} W={0} />
            <text x={cx0 + cw / 2} y={cy0 + ch + 34} textAnchor="middle" fontSize="12" fill="var(--fg)">Years of follow-up</text>
            <line x1={cx0} x2={cx0 + cw} y1={Y(1)} y2={Y(1)} stroke="var(--muted)" strokeDasharray="4 3" />
            <path d={path('rt')} fill="none" stroke="var(--warn)" strokeWidth="2" strokeDasharray="5 3" />
            <path d={path('risk')} fill="none" stroke="var(--exp)" strokeWidth="2.4" />
          </svg>
        </div>
        <div className="legend">
          <span><i style={{ background: 'var(--unexp)' }} />still at risk</span>
          <span><i style={{ background: 'var(--exp)' }} />had the event (observed risk line)</span>
          <span><i style={{ background: 'var(--warn)' }} />rate × t</span>
        </div>
        <div className="note">
          Risk is a proportion of the people who started, so it can only climb towards 1 as the cohort is used up. The rate divides
          cases by the person-time actually spent at risk; people who have the event stop contributing time, so the rate stays close to
          the hazard you set. Rate × t keeps growing past 1 and overstates risk once risk is no longer small; 1 − exp(−rate × t)
          accounts for the shrinking risk set and tracks the observed risk. {SYNTH}
        </div>
      </div>
    </div>
  );
}
