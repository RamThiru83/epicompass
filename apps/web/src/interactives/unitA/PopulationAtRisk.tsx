/** Ch. 1 — The population at risk: only people who can develop the outcome belong in the denominator. */
import { useState } from 'react';
import { risk } from '@epicompass/epi-core';
import type { InteractiveProps } from '../types';
import { Stat, Row, pct } from '../ui';
import { useReached } from './useReached';

const TOTAL = 200, COLS = 20, ROWS = 10;
const REASONS: Record<string, string> = {
  disease: 'already have the disease',
  organ: 'have had the organ removed',
  sex: 'are of the other sex',
};

export function PopulationAtRisk({ onReached }: InteractiveProps) {
  const [inelig, setInelig] = useState(0);
  const [cases, setCases] = useState(10);
  const [reason, setReason] = useState('organ');
  const [shown, setShown] = useState(false);

  const atRisk = TOTAL - inelig;
  const c = Math.min(cases, atRisk);
  const wrong = risk(c, TOTAL).estimate;
  const right = atRisk > 0 ? risk(c, atRisk).estimate : NaN;
  const reached = useReached(inelig >= 20 && shown, onReached, 'compared risk with and without ineligible people');

  const setI = (v: number) => { setInelig(v); if (cases > TOTAL - v) setCases(TOTAL - v); };
  const cell = 22, W = COLS * cell + 8, H = ROWS * cell + 8;

  return <div className="ix">
    <div className="ix-panel">
      <h4>Population of {TOTAL} (synthetic)</h4>
      <Row label="Why ineligible">
        <select id="par-reason" value={reason} onChange={e => setReason(e.target.value)}>
          <option value="disease">Already diseased</option>
          <option value="organ">Organ removed</option>
          <option value="sex">Other sex</option>
        </select>
      </Row>
      <Row label={`Cannot develop the outcome: ${inelig}`}>
        <input id="par-inelig" type="range" min={0} max={150} step={1} value={inelig} onChange={e => setI(+e.target.value)} />
      </Row>
      <Row label={`New cases: ${c}`}>
        <input id="par-cases" type="range" min={0} max={Math.min(60, atRisk)} step={1} value={c} onChange={e => setCases(+e.target.value)} />
      </Row>
      <div className="actions">
        <button className="btn ghost" type="button" aria-pressed={shown} onClick={() => setShown(s => !s)}>
          {shown ? 'Hide' : 'Show'} the correct risk
        </button>
      </div>
    </div>
    <div>
      <div className="stats">
        <Stat k="Cases ÷ everyone" v={pct(wrong)} s={`${c} / ${TOTAL}`} tone="warn" />
        <Stat k="Cases ÷ people at risk" v={shown ? pct(right) : '?'} s={shown ? `${c} / ${atRisk}` : 'press “Show”'} tone="ok" />
        <Stat k="People at risk" v={atRisk} />
      </div>
      <div className="fig">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${TOTAL} people: ${inelig} cannot develop the outcome, ${c} new cases`}>
          {Array.from({ length: TOTAL }, (_, i) => {
            const cx = 4 + (i % COLS) * cell + cell / 2, cy = 4 + Math.floor(i / COLS) * cell + cell / 2;
            const isInelig = i >= atRisk, isCase = i < c;
            const fill = isInelig ? 'var(--line)' : isCase ? 'var(--exp)' : 'var(--panel)';
            return <circle key={i} cx={cx} cy={cy} r={8} fill={fill} stroke={isInelig ? 'var(--line)' : isCase ? 'var(--exp)' : 'var(--unexp)'} strokeWidth={1.5} />;
          })}
        </svg>
      </div>
      <div className="legend">
        <span><i style={{ background: 'var(--exp)' }} />new case</span>
        <span><i style={{ background: 'var(--unexp)' }} />at risk, no event</span>
        <span><i style={{ background: 'var(--line)' }} />cannot develop the outcome</span>
      </div>
      <div className="note">
        The {inelig} people who {REASONS[reason]} can never become cases, so counting them in the denominator dilutes the risk.
      </div>
      {reached && <div className="reached">Risk = new cases ÷ the population at risk, not ÷ everyone.</div>}
    </div>
  </div>;
}
