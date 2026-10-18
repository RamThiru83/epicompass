/** Ch. 1 preview — screening: predictive values depend on prevalence, not only on test accuracy. */
import { useState } from 'react';
import { predictiveValues, iconArrayCounts } from '@epicompass/epi-core';
import type { InteractiveProps } from '../types';
import { Stat, Row, pct } from '../ui';
import { useReached } from './useReached';

const PREV_STEPS = [0.1, 0.2, 0.5, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 30, 40, 50]; // %
const COLS = 40, ROWS = 25;
const COLOURS = { tp: 'var(--exp)', fp: 'var(--warn)', fn: 'var(--unexp)', tn: 'var(--line)' } as const;

export function ScreeningPreview({ onReached }: InteractiveProps) {
  const [sens, setSens] = useState(90);
  const [spec, setSpec] = useState(90);
  const [pi, setPi] = useState(PREV_STEPS.indexOf(10));
  const prev = PREV_STEPS[pi];

  const pv = predictiveValues(sens / 100, spec / 100, prev / 100);
  const n = iconArrayCounts(sens / 100, spec / 100, prev / 100, COLS * ROWS);
  const reached = useReached(prev < 2 && pv.ppv < 0.5, onReached, 'low prevalence gives PPV below 50%');

  // order: diseased (TP then FN), then non-diseased (FP then TN)
  const kinds: (keyof typeof COLOURS)[] = [];
  (['tp', 'fn', 'fp', 'tn'] as const).forEach(k => { for (let i = 0; i < n[k]; i++) kinds.push(k); });
  const cell = 12, W = COLS * cell + 4, H = ROWS * cell + 4;

  return <div className="ix">
    <div className="ix-panel">
      <h4>Test and population</h4>
      <Row label={`Sensitivity: ${sens}%`}>
        <input id="scr-sens" type="range" min={50} max={100} step={1} value={sens} onChange={e => setSens(+e.target.value)} />
      </Row>
      <Row label={`Specificity: ${spec}%`}>
        <input id="scr-spec" type="range" min={50} max={100} step={1} value={spec} onChange={e => setSpec(+e.target.value)} />
      </Row>
      <Row label={`Prevalence: ${prev}%`}>
        <input id="scr-prev" type="range" min={0} max={PREV_STEPS.length - 1} step={1} value={pi}
          aria-valuetext={`${prev}%`} onChange={e => setPi(+e.target.value)} />
      </Row>
      <p className="note">1000 synthetic people screened once.</p>
    </div>
    <div>
      <div className="stats">
        <Stat k="PPV" v={pct(pv.ppv)} s={`${n.tp} / ${n.tp + n.fp} test +`} tone={pv.ppv < 0.5 ? 'warn' : 'ok'} />
        <Stat k="NPV" v={pct(pv.npv)} s={`${n.tn} / ${n.tn + n.fn} test −`} />
      </div>
      <div className="fig">
        <svg viewBox={`0 0 ${W} ${H}`} role="img"
          aria-label={`Icon array of 1000 people: ${n.tp} true positives, ${n.fp} false positives, ${n.fn} false negatives, ${n.tn} true negatives`}>
          {kinds.map((k, i) => <rect key={i} x={2 + (i % COLS) * cell + 1} y={2 + Math.floor(i / COLS) * cell + 1}
            width={cell - 2} height={cell - 2} rx={2} fill={COLOURS[k]} />)}
        </svg>
      </div>
      <div className="legend">
        <span><i style={{ background: COLOURS.tp }} />true positive ({n.tp})</span>
        <span><i style={{ background: COLOURS.fp }} />false positive ({n.fp})</span>
        <span><i style={{ background: COLOURS.fn }} />false negative ({n.fn})</span>
        <span><i style={{ background: COLOURS.tn }} />true negative ({n.tn})</span>
      </div>
      <div className="note">
        Sensitivity and specificity are properties of the test; PPV also depends on prevalence. When the condition is rare, false positives from the large healthy group outnumber true positives.
      </div>
      {reached && <div className="reached">At {prev}% prevalence most positive results are false positives.</div>}
    </div>
  </div>;
}
