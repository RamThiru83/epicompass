/**
 * Ch. 1 first look at screening (formal treatment in Ch. 12).
 * Natural frequencies, not formulas: 1,000 people, who has the condition, who tests positive.
 * Encoding uses two channels so it survives colour-vision deficiency and greyscale:
 *   hue  = true status (teal: has the condition; orange: false alarm; grey: healthy and cleared)
 *   fill = test result (solid: test positive; hollow: test negative)
 */
import { useEffect, useRef, useState } from 'react';
import { predictiveValues, iconArrayCounts } from '@epicompass/epi-core';
import type { InteractiveProps } from '../types';
import { Stat, Row, pct, Preview } from '../ui';
import { useReached } from './useReached';

const PREV_STEPS = [0.1, 0.2, 0.5, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 30, 40, 50]; // %
const COLS = 40, ROWS = 25, N = COLS * ROWS;
type Kind = 'tp' | 'fp' | 'fn' | 'tn';

/** One icon: solid = tested positive, hollow = tested negative. */
function Icon({ k, x, y, s }: { k: Kind; x: number; y: number; s: number }) {
  const r = s / 2 - 1.2, cx = x + s / 2, cy = y + s / 2;
  switch (k) {
    case 'tp': return <circle cx={cx} cy={cy} r={r} fill="var(--tp)" />;
    case 'fp': return <circle cx={cx} cy={cy} r={r} fill="var(--fp)" />;
    case 'fn': return <circle cx={cx} cy={cy} r={r - 0.8} fill="var(--panel)" stroke="var(--tp)" strokeWidth={1.8} />;
    case 'tn': return <circle cx={cx} cy={cy} r={r - 1.5} fill="var(--tn)" />;
  }
}

function Swatch({ k }: { k: Kind }) {
  return <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 5 }}><Icon k={k} x={0} y={0} s={14} /></svg>;
}

export function ScreeningPreview({ onReached, config }: InteractiveProps) {
  const target = (config?.target as string) ?? 'prevalence';
  const [sens, setSens] = useState(Number(config?.sens ?? 90));
  const [spec, setSpec] = useState(Number(config?.spec ?? 90));
  const [pi, setPi] = useState(PREV_STEPS.indexOf(Number(config?.prev ?? 10)) >= 0 ? PREV_STEPS.indexOf(Number(config?.prev ?? 10)) : 9);
  const prev = PREV_STEPS[pi];
  const moved = useRef({ sens: false, spec: false });
  const [movedBoth, setMovedBoth] = useState(false);
  useEffect(() => { if (moved.current.sens && moved.current.spec) setMovedBoth(true); }, [sens, spec]);

  const pv = predictiveValues(sens / 100, spec / 100, prev / 100);
  const n = iconArrayCounts(sens / 100, spec / 100, prev / 100, N);
  const diseased = n.tp + n.fn, healthy = n.fp + n.tn, positives = n.tp + n.fp;
  const goal = target === 'accuracy' ? movedBoth : prev < 2 && pv.ppv < 0.5;
  const reached = useReached(goal, onReached, target === 'accuracy' ? 'explored sensitivity and specificity' : 'low prevalence: most positives are false alarms');

  // Positives first (true, then false alarms), then negatives (missed, then cleared), so the block of
  // positive results is visible as one group and its composition can be read at a glance.
  const kinds: Kind[] = [];
  (['tp', 'fp', 'fn', 'tn'] as const).forEach(k => { for (let i = 0; i < n[k]; i++) kinds.push(k); });
  const cell = 12, W = COLS * cell + 4, H = ROWS * cell + 4;

  return <div className="ix">
    <div className="ix-panel">
      <h4>The test</h4>
      <Row label={`Sensitivity: ${sens}%`}>
        <input id="scr-sens" type="range" min={50} max={100} step={1} value={sens} onChange={e => { moved.current.sens = true; setSens(+e.target.value); }} />
      </Row>
      <p className="hint" style={{ marginTop: -4 }}>Of people who <b>have</b> the condition, the share the test catches.</p>
      <Row label={`Specificity: ${spec}%`}>
        <input id="scr-spec" type="range" min={50} max={100} step={1} value={spec} onChange={e => { moved.current.spec = true; setSpec(+e.target.value); }} />
      </Row>
      <p className="hint" style={{ marginTop: -4 }}>Of people who <b>do not have</b> it, the share the test correctly clears.</p>
      <h4 style={{ marginTop: 12 }}>The population</h4>
      <Row label={`Have the condition: ${prev}%`}>
        <input id="scr-prev" type="range" min={0} max={PREV_STEPS.length - 1} step={1} value={pi}
          aria-valuetext={`${prev}%`} onChange={e => setPi(+e.target.value)} />
      </Row>
      <p className="note">1,000 synthetic people, each tested once. Chapter 12 returns to tests in depth.</p>
    </div>
    <div>
      <div className="stats">
        <Stat k="Test positive" v={`${positives}`} s={`of ${N.toLocaleString('en-GB')} people`} />
        <Stat k="…of whom truly have it" v={`${n.tp} of ${positives}`} s={positives ? pct(pv.ppv) : '–'} tone={pv.ppv < 0.5 ? 'warn' : 'ok'} />
        <Stat k="Missed by the test" v={`${n.fn}`} s={`of ${diseased} with the condition`} />
      </div>
      <div className="ix-panel" style={{ marginBottom: 10, fontSize: 14 }}>
        Of {N.toLocaleString('en-GB')} people, <b>{diseased}</b> have the condition. The test catches <b>{n.tp}</b> of them and misses <b>{n.fn}</b>.{' '}
        The other <b>{healthy}</b> do not have it; the test clears <b>{n.tn}</b> but wrongly flags <b>{n.fp}</b>.{' '}
        So <b>{positives}</b> people test positive, and only <b>{n.tp}</b> of them truly have the condition.
      </div>
      <div className="fig">
        <svg viewBox={`0 0 ${W} ${H}`} role="img"
          aria-label={`1,000 people: ${n.tp} correctly flagged, ${n.fp} false alarms, ${n.fn} missed, ${n.tn} correctly cleared`}>
          <rect x="0" y="0" width={W} height={H} fill="var(--panel)" />
          {kinds.map((k, i) => <Icon key={i} k={k} x={2 + (i % COLS) * cell} y={2 + Math.floor(i / COLS) * cell} s={cell} />)}
        </svg>
      </div>
      <div className="legend" style={{ gap: '6px 16px' }}>
        <span><Swatch k="tp" />has it, test positive ({n.tp})</span>
        <span><Swatch k="fp" />false alarm: does not have it, test positive ({n.fp})</span>
        <span><Swatch k="fn" />missed: has it, test negative ({n.fn})</span>
        <span><Swatch k="tn" />does not have it, test negative ({n.tn})</span>
      </div>
      <div className="note">
        Solid dots tested positive; hollow dots tested negative. Sensitivity and specificity describe the test. Whether a positive result can be trusted also depends on how common the condition is: when it is rare, false alarms from the many healthy people can outnumber the true cases. (Chapter 12 adds the <Preview term="negative predictive value" />, cut-offs and how tests are evaluated.)
      </div>
      {reached && <div className="reached">{target === 'accuracy'
        ? 'Sensitivity changes how many cases are missed; specificity changes how many false alarms there are.'
        : `At ${prev}% most positive results are false alarms, even though the test itself has not changed.`}</div>}
    </div>
  </div>;
}
