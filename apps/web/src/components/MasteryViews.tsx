import { useState } from 'react';
/**
 * Concept-mastery views for the class dashboard.
 *  - StudentMastery: one student's concepts as bullet bars (estimate vs the 85% mastery line), grouped by chapter.
 *  - CohortConcepts: for each concept, how a cohort splits into mastered / learning / not started (100% stacked bars).
 * One hue (the accent) carries magnitude; status is always written out in text, never colour alone.
 */
import type { Concept } from '../content/types';
import type { Progress } from '../store/progress';
import { MASTERY_THRESHOLD } from '@epicompass/epi-core';

const pct = (v: number) => `${Math.round(v * 100)}%`;
type Status = 'mastered' | 'learning' | 'none';
export const statusOf = (p: Progress, id: string): Status => {
  const m = p.mastery[id];
  if (!m || m.attempts === 0) return 'none';
  return m.pKnown >= MASTERY_THRESHOLD ? 'mastered' : 'learning';
};
const byChapter = (cs: Concept[]) => {
  const g = new Map<number, Concept[]>();
  for (const c of cs) g.set(c.chapter, [...(g.get(c.chapter) ?? []), c]);
  return [...g.entries()].sort((a, b) => a[0] - b[0]);
};

export function MasteryLegend() {
  return (
    <div className="mv-legend" aria-hidden>
      <span><i className="sw mastered" />Mastered (≥ {pct(MASTERY_THRESHOLD)})</span>
      <span><i className="sw learning" />Learning</span>
      <span><i className="sw none" />Not started</span>
    </div>
  );
}

export function StudentMastery({ name, progress, concepts }: { name: string; progress: Progress; concepts: Concept[] }) {
  const counts = { mastered: 0, learning: 0, none: 0 };
  for (const c of concepts) counts[statusOf(progress, c.id)]++;
  const [all, setAll] = useState(false);
  // Default view: what needs attention (learning, weakest first); mastered and not-started on request.
  const learning = concepts.filter(c => statusOf(progress, c.id) === 'learning').sort((a, b) => progress.mastery[a.id].pKnown - progress.mastery[b.id].pKnown);
  if (!all) return (
    <div className="mv-student">
      <div className="mv-head">
        <b>{name}</b>
        <span className="hint">{counts.mastered} mastered · {counts.learning} learning · {counts.none} not started, of {concepts.length} concepts</span>
      </div>
      <div className="mv-chapter">
        <div className="mv-ch">{learning.length ? 'Still learning, weakest first' : 'Nothing in progress'}</div>
        {learning.map(c => { const m = progress.mastery[c.id]; const label = `Learning · ${pct(m.pKnown)} · ${m.attempts} attempt${m.attempts === 1 ? '' : 's'}`; return (
          <div key={c.id} className="mv-row" title={`${c.title}: ${label}`}>
            <span className="mv-name">Ch {c.chapter} · {c.title}</span>
            <span className="mv-track" role="img" aria-label={`${c.title}: ${label}`}><i className="mv-fill learning" style={{ width: `${Math.max(2, m.pKnown * 100)}%` }} /><b className="mv-goal" style={{ left: pct(MASTERY_THRESHOLD) }} /></span>
            <span className="mv-val learning">{label}</span>
          </div>); })}
      </div>
      <button className="textlink" onClick={() => setAll(true)}>Show all {concepts.length} concepts by chapter</button>
    </div>
  );
  return (
    <div className="mv-student">
      <div className="mv-head">
        <b>{name}</b>
        <span className="hint">{counts.mastered} mastered · {counts.learning} learning · {counts.none} not started, of {concepts.length} concepts</span>
      </div>
      <button className="textlink" onClick={() => setAll(false)}>Show only concepts still being learnt</button>
      {byChapter(concepts).map(([ch, cs]) => (
        <div key={ch} className="mv-chapter">
          <div className="mv-ch">Chapter {ch}</div>
          {cs.map(c => {
            const m = progress.mastery[c.id];
            const s = statusOf(progress, c.id);
            const v = s === 'none' ? 0 : m!.pKnown;
            const label = s === 'none' ? 'Not started' : `${s === 'mastered' ? 'Mastered' : 'Learning'} · ${pct(v)} · ${m!.attempts} attempt${m!.attempts === 1 ? '' : 's'}`;
            return (
              <div key={c.id} className="mv-row" title={`${c.title}: ${label}`}>
                <span className="mv-name">{c.title}</span>
                <span className="mv-track" role="img" aria-label={`${c.title}: ${label}`}>
                  {s !== 'none' && <i className={`mv-fill ${s}`} style={{ width: `${Math.max(2, v * 100)}%` }} />}
                  <b className="mv-goal" style={{ left: pct(MASTERY_THRESHOLD) }} />
                </span>
                <span className={`mv-val ${s}`}>{label}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function CohortConcepts({ students, concepts }: { students: { progress: Progress }[]; concepts: Concept[] }) {
  const n = students.length;
  if (!n) return <p className="hint">No students in this cohort yet.</p>;
  return (
    <div className="mv-cohort">
      <MasteryLegend />
      {byChapter(concepts).map(([ch, cs]) => (
        <div key={ch} className="mv-chapter">
          <div className="mv-ch">Chapter {ch}</div>
          {cs.map(c => {
            const k = { mastered: 0, learning: 0, none: 0 };
            for (const s of students) k[statusOf(s.progress, c.id)]++;
            const label = `${k.mastered} mastered, ${k.learning} learning, ${k.none} not started (of ${n})`;
            return (
              <div key={c.id} className="mv-row" title={`${c.title}: ${label}`}>
                <span className="mv-name">{c.title}</span>
                <span className="mv-stack" role="img" aria-label={`${c.title}: ${label}`}>
                  {(['mastered', 'learning', 'none'] as const).map(s => k[s] > 0 && <i key={s} className={`seg ${s}`} style={{ flexGrow: k[s] }} />)}
                </span>
                <span className="mv-val">{k.mastered}/{n} mastered</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
