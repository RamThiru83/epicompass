/** Prevalence as a bathtub (Rothman ch. 4): incidence fills the tank, duration sets how fast it drains. */
import { useEffect, useMemo, useState } from 'react';
import { prevalenceFromIncidence, prevalenceTrajectory } from '@epicompass/epi-core';
import type { InteractiveProps } from '../types';
import { Stat, Row, f2, f3, pct, linear, XAxis, YAxis } from '../ui';
import { useReachOnce, useTicker, prefersReducedMotion, SYNTH } from './common';

const DT = 0.1, STEPS_PER_TICK = 4, MAX_POINTS = 250;

export function PrevalenceBathtub({ onReached }: InteractiveProps) {
  const [inc, setInc] = useState(0.1);
  const [dur, setDur] = useState(4);
  const [treated, setTreated] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [series, setSeries] = useState<number[]>([0]);
  const [seg, setSeg] = useState({ p0: 0, k: 0 });
  const reach = useReachOnce(onReached);

  const effDur = treated ? dur / 2 : dur;
  const steady = prevalenceFromIncidence(inc, effDur);
  // Trajectory from zero for the current inflow/outflow; reused to continue from any starting level.
  const traj = useMemo(() => prevalenceTrajectory(inc, effDur, 4000, DT), [inc, effDur]);
  const pAt = (p0: number, k: number) => {
    const fromZero = traj[Math.min(k, traj.length - 1)];
    return steady + (p0 - steady) * (1 - fromZero / steady); // linear ODE: same approach to equilibrium from any start
  };
  const current = series[series.length - 1];

  // Any change in inflow or outflow starts a new segment from the current level.
  useEffect(() => { setSeg({ p0: current, k: 0 }); }, [inc, effDur]); // eslint-disable-line react-hooks/exhaustive-deps

  const advance = () => {
    const k = seg.k + STEPS_PER_TICK;
    setSeg({ p0: seg.p0, k });
    setSeries(s => [...s, pAt(seg.p0, k)].slice(-MAX_POINTS));
  };
  useTicker(playing, prefersReducedMotion() ? 400 : 80, advance);

  const reset = () => { setPlaying(false); setSeries([0]); setSeg({ p0: 0, k: 0 }); };
  const toggleTreat = () => { setTreated(v => !v); reach('treatment toggled'); };

  // Tank geometry
  const tx = 70, ty = 50, tw = 160, th = 190;
  const level = th * current, sLevel = th * steady;
  // Time chart
  const X = linear(0, MAX_POINTS - 1, 310, 620), maxP = Math.max(0.05, ...series, steady) * 1.1;
  const Y = linear(0, Math.min(1, maxP), 240, 30);
  const yt = [0, 0.25, 0.5, 0.75, 1].map(v => v * Math.min(1, maxP));
  const line = series.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p).toFixed(1)}`).join(' ');
  const yearsShown = (MAX_POINTS - 1) * STEPS_PER_TICK * DT;

  return (
    <div className="ix">
      <div className="ix-panel">
        <h4>Inflow and outflow</h4>
        <Row label={<span>Incidence rate I <b className="mono">{f2(inc)}</b>/y</span>}>
          <input id="bt-inc" aria-label="Incidence rate per year" type="range" min={0.01} max={0.5} step={0.01} value={inc} onChange={e => setInc(+e.target.value)} />
        </Row>
        <Row label={<span>Mean duration D <b className="mono">{f2(dur)}</b> y</span>}>
          <input id="bt-dur" aria-label="Mean duration in years" type="range" min={0.2} max={10} step={0.1} value={dur} onChange={e => setDur(+e.target.value)} />
        </Row>
        <Row label="A treatment shortens duration">
          <input id="bt-treat" type="checkbox" checked={treated} onChange={toggleTreat} />
        </Row>
        <div className="actions">
          <button className="btn" onClick={() => setPlaying(p => !p)}>{playing ? 'Pause' : 'Play'}</button>
          <button className="btn ghost" onClick={() => { setPlaying(false); advance(); }}>Step</button>
          <button className="btn ghost" onClick={reset}>Reset</button>
        </div>
        <p className="hint">Let the tank settle, then switch the treatment on while it plays.</p>
      </div>
      <div>
        <div className="stats">
          <Stat k="Incidence rate I" v={f3(inc)} s="per person-year" tone="exp" />
          <Stat k="Mean duration D" v={f2(effDur)} s={treated ? 'halved by treatment' : 'years'} tone="unexp" />
          <Stat k="Prevalence now" v={pct(current)} />
          <Stat k="Steady-state prevalence" v={pct(steady)} s={`odds = I × D = ${f3(inc * effDur)}`} tone="ok" />
        </div>
        <div className="fig">
          <svg viewBox="0 0 640 280" role="img" aria-label="Bathtub tank showing prevalence and a time chart">
            <rect x="0" y="0" width="640" height="280" fill="var(--panel)" />
            {/* tap */}
            <rect x={tx - 50} y={14} width={70} height={12} fill="var(--muted)" />
            <rect x={tx + 8} y={14} width={12} height={22} fill="var(--muted)" />
            <rect x={tx + 10} y={36} width={8} height={ty + th - level - 36} fill="var(--exp)" opacity={playing ? 0.9 : 0.25} />
            <text x={tx - 50} y={10} fontSize="11" fill="var(--fg)">Incidence (inflow)</text>
            {/* tank */}
            <rect x={tx} y={ty} width={tw} height={th} fill="var(--bg)" stroke="var(--line)" />
            <rect x={tx} y={ty + th - level} width={tw} height={level} fill="var(--exp)" opacity={0.75} />
            <line x1={tx} x2={tx + tw} y1={ty + th - sLevel} y2={ty + th - sLevel} stroke="var(--ok)" strokeDasharray="5 3" strokeWidth="2" />
            <text x={tx + tw - 4} y={ty + th - sLevel - 4} textAnchor="end" fontSize="11" fill="var(--ok)">steady state</text>
            <text x={tx + tw / 2} y={ty + th - level / 2 + 4} textAnchor="middle" fontSize="13" fill="var(--fg)" fontFamily="var(--mono)">{pct(current)}</text>
            {/* drain */}
            <rect x={tx + tw - 20} y={ty + th} width={12} height={16} fill="var(--muted)" />
            <rect x={tx + tw - 18} y={ty + th + 16} width={8} height={10} fill="var(--unexp)" opacity={current > 0 ? 0.9 : 0.2} />
            <text x={tx + tw + 4} y={ty + th + 24} fontSize="11" fill="var(--fg)">Recovery or death (1/D)</text>
            {/* trajectory */}
            <YAxis ticks={yt} y={Y} x={310} x1={620} fmt={v => pct(v, 0)} />
            <XAxis ticks={[0, MAX_POINTS - 1]} x={X} y={240} W={0} fmt={i => `${Math.round((i * yearsShown) / (MAX_POINTS - 1))} y`} />
            <text x={465} y={272} textAnchor="middle" fontSize="12" fill="var(--fg)">Time window (most recent {Math.round(yearsShown)} years)</text>
            <line x1={310} x2={620} y1={Y(steady)} y2={Y(steady)} stroke="var(--ok)" strokeDasharray="5 3" />
            <path d={line} fill="none" stroke="var(--exp)" strokeWidth="2.2" />
          </svg>
        </div>
        <div className="legend">
          <span><i style={{ background: 'var(--exp)' }} />prevalent cases</span>
          <span><i style={{ background: 'var(--ok)' }} />steady state: P/(1 − P) = I × D</span>
        </div>
        <div className="note">
          Prevalence depends on how fast cases arrive and how long they stay. At steady state the prevalence odds equal
          incidence × mean duration, so P = I·D / (1 + I·D). A treatment that shortens illness empties the tank faster: prevalence
          falls although incidence has not changed. A treatment that prolongs survival without curing does the opposite. {SYNTH}
        </div>
      </div>
    </div>
  );
}
