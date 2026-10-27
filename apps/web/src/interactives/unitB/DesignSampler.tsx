/** Cohort versus case-control sampling from one source population (Rothman ch. 5). */
import { useEffect, useMemo, useRef, useState } from 'react';
import { generateCohort, tabulate, sampleCaseControl, riskRatio, rateRatio, oddsRatio } from '@epicompass/epi-core';
import type { ControlSampling, RatioResult } from '@epicompass/epi-core';
import type { InteractiveProps } from '../types';
import { Stat, Row, f2, logScale, XAxis } from '../ui';
import { useReachOnce, SYNTH } from './common';

const TARGET: Record<ControlSampling, string> = {
  density: 'rate ratio (risk-set sampling)',
  caseCohort: 'risk ratio (controls from the whole cohort at baseline)',
  cumulative: 'odds ratio of risks; ≈ RR only when the outcome is rare',
};
const SCHEME_NAME: Record<ControlSampling, string> = { cumulative: 'Cumulative', density: 'Density', caseCohort: 'Case-cohort' };

interface Est { label: string; r: RatioResult; tone: string }

export function DesignSampler({ onReached }: InteractiveProps) {
  const [n, setN] = useState(10000);
  const [trueRR, setTrueRR] = useState(2);
  const [scheme, setScheme] = useState<ControlSampling>('density');
  const [k, setK] = useState(2);
  const [cohort, setCohort] = useState<{ rr: RatioResult; ir: RatioResult; orRisk: RatioResult } | null>(null);
  const [cc, setCc] = useState<{ scheme: ControlSampling; k: number; or: RatioResult; seed: number } | null>(null);
  const [repeats, setRepeats] = useState<{ scheme: ControlSampling; ors: number[] }>({ scheme: 'density', ors: [] });
  const seedRef = useRef(100);
  const timers = useRef<number[]>([]);
  const reach = useReachOnce(onReached);

  const people = useMemo(() => generateCohort({
    n, pConfounder: 0, pExposed: [0.3, 0.3], baselineRisk: [0.04, 0.04], trueRR, followUp: 5, seed: 2026,
  }), [n, trueRR]);
  const stopRepeats = () => { timers.current.forEach(id => window.clearTimeout(id)); timers.current = []; };
  useEffect(() => { stopRepeats(); setCohort(null); setCc(null); setRepeats({ scheme, ors: [] }); }, [people]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => stopRepeats, []);

  const tab = useMemo(() => tabulate(people), [people]);
  const runCohort = () => setCohort({
    rr: riskRatio(tab), ir: rateRatio({ a: tab.a, b: tab.b, pt1: tab.pt1, pt0: tab.pt0 }), orRisk: oddsRatio(tab),
  });
  const sampleOnce = (seed: number) => oddsRatio(sampleCaseControl(people, k, scheme, seed));
  const runCC = () => {
    const seed = ++seedRef.current;
    setCc({ scheme, k, or: sampleOnce(seed), seed });
    if (scheme === 'density') reach('density sample drawn');
  };
  const repeat20 = () => {
    stopRepeats();
    setRepeats({ scheme, ors: [] });
    for (let i = 0; i < 20; i++) {
      timers.current.push(window.setTimeout(() => {
        const or = sampleOnce(5000 + i * 37 + seedRef.current).estimate;
        setRepeats(rp => ({ scheme: rp.scheme, ors: [...rp.ors, or] }));
      }, 30 * (i + 1)));
    }
    if (scheme === 'density') reach('density samples drawn');
  };

  const ests: Est[] = [];
  if (cohort) {
    ests.push({ label: 'Cohort risk ratio', r: cohort.rr, tone: 'var(--accent)' });
    ests.push({ label: 'Cohort rate ratio', r: cohort.ir, tone: 'var(--unexp)' });
    ests.push({ label: 'Cohort odds ratio', r: cohort.orRisk, tone: 'var(--muted)' });
  }
  if (cc) ests.push({ label: `${SCHEME_NAME[cc.scheme]} OR (1:${cc.k})`, r: cc.or, tone: 'var(--exp)' });

  const W = 620, rowH = 30, T = 16, L = 170, R = 20;
  const rows = ests.length + (repeats.ors.length ? 1 : 0);
  const H = T + Math.max(1, rows) * rowH + 44;
  const X = logScale(0.5, 10, L, W - R), clampX = (v: number) => X(Math.min(10, Math.max(0.5, v)));
  const cases = tab.a + tab.b;

  return (
    <div className="ix">
      <div className="ix-panel">
        <h4>Source population</h4>
        <Row label={<span>Population size <b className="mono">{n.toLocaleString('en-GB')}</b></span>}>
          <input id="ds-n" aria-label="Population size" type="range" min={5000} max={20000} step={1000} value={n} onChange={e => setN(+e.target.value)} />
        </Row>
        <Row label={<span>True risk ratio <b className="mono">{f2(trueRR)}</b></span>}>
          <input id="ds-rr" aria-label="True risk ratio" type="range" min={1} max={4} step={0.1} value={trueRR} onChange={e => setTrueRR(+e.target.value)} />
        </Row>
        <p className="hint">30% exposed, 5-year risk 4% in the unexposed, 5 years of follow-up. {cases} cases.</p>
        <div className="actions"><button className="btn" onClick={runCohort}>Run cohort study</button></div>
        <h4 style={{ marginTop: 14 }}>Case-control study</h4>
        <Row label="Control sampling">
          <select id="ds-scheme" value={scheme} onChange={e => setScheme(e.target.value as ControlSampling)}>
            <option value="cumulative">Cumulative (non-cases at end)</option>
            <option value="density">Density (risk sets)</option>
            <option value="caseCohort">Case-cohort (whole cohort)</option>
          </select>
        </Row>
        <Row label="Controls per case">
          <select id="ds-k" value={k} onChange={e => setK(+e.target.value)}>
            {[1, 2, 3, 4].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </Row>
        <div className="actions">
          <button className="btn" onClick={runCC}>Sample case-control</button>
          <button className="btn ghost" onClick={repeat20}>Repeat 20 times</button>
        </div>
      </div>
      <div>
        <div className="stats">
          <Stat k="True risk ratio" v={f2(trueRR)} tone="ok" />
          {cohort && <Stat k="Cohort risk ratio" v={f2(cohort.rr.estimate)} s={`95% CI ${f2(cohort.rr.ci.lower)} – ${f2(cohort.rr.ci.upper)}`} />}
          {cohort && <Stat k="Cohort rate ratio" v={f2(cohort.ir.estimate)} s={`95% CI ${f2(cohort.ir.ci.lower)} – ${f2(cohort.ir.ci.upper)}`} tone="unexp" />}
          {cc && <Stat k={`${SCHEME_NAME[cc.scheme]} odds ratio`} v={f2(cc.or.estimate)} s={`95% CI ${f2(cc.or.ci.lower)} – ${f2(cc.or.ci.upper)}`} tone="exp" />}
        </div>
        {cc && <p className="hint">This sampling scheme estimates the <b>{TARGET[cc.scheme]}</b>.</p>}
        <div className="fig">
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Estimates with 95% confidence intervals against the true risk ratio">
            <rect x="0" y="0" width={W} height={H} fill="var(--panel)" />
            {!rows && <text x={L} y={T + 18} fontSize="14" fill="var(--muted)">Run a study to plot its estimate.</text>}
            {ests.map((e, i) => {
              const y = T + i * rowH + rowH / 2;
              return <g key={e.label}>
                <text x={L - 8} y={y + 4} textAnchor="end" fontSize="14" fill="var(--fg)">{e.label}</text>
                <line x1={clampX(e.r.ci.lower)} x2={clampX(e.r.ci.upper)} y1={y} y2={y} stroke={e.tone} strokeWidth="2.5" />
                <circle cx={clampX(e.r.estimate)} cy={y} r={5} fill={e.tone} />
              </g>;
            })}
            {repeats.ors.length > 0 && (() => {
              const y = T + ests.length * rowH + rowH / 2;
              return <g>
                <text x={L - 8} y={y + 4} textAnchor="end" fontSize="14" fill="var(--fg)">{SCHEME_NAME[repeats.scheme]} OR × {repeats.ors.length}</text>
                {repeats.ors.map((o, i) => <circle key={i} cx={clampX(o)} cy={y + ((i % 5) - 2) * 2.5} r={3.5} fill="var(--exp)" opacity={0.6} />)}
              </g>;
            })()}
            <line x1={X(trueRR)} x2={X(trueRR)} y1={T - 6} y2={H - 40} stroke="var(--ok)" strokeWidth="2" strokeDasharray="5 3" />
            <XAxis ticks={[0.5, 1, 2, 4, 8]} x={X} y={H - 40} W={W + L - R} label="Ratio (log scale)" />
          </svg>
        </div>
        <div className="legend">
          <span><i style={{ background: 'var(--ok)' }} />true risk ratio</span>
          <span><i style={{ background: 'var(--exp)' }} />case-control odds ratio(s)</span>
          <span><i style={{ background: 'var(--accent)' }} />cohort estimates, 95% CI</span>
        </div>
        <div className="note">
          A case-control study is an efficient way to sample the cohort. What the odds ratio estimates depends on how controls are
          drawn: risk-set (density) sampling gives the rate ratio, case-cohort sampling the risk ratio, and sampling non-cases at the
          end gives the odds ratio of risks, which approaches the risk ratio only when risks are small. Raise the true RR and compare
          the cumulative OR with the cohort RR. {SYNTH}
        </div>
      </div>
    </div>
  );
}
