import { useState } from 'react';
import { CHAPTERS, UNITS, conceptById } from '../content';
import { useProgress, dueConcepts, setSettings, resetProgress } from '../store/progress';
import { chapterCompletion } from '../store/gates';
import { go } from '../App';

export function HomePage() {
  const p = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const due = dueConcepts(p);
  const totalCards = CHAPTERS.reduce((s, c) => s + c.cards.length, 0);
  const doneCards = CHAPTERS.reduce((s, c) => s + c.cards.filter(k => p.cards[k.id]?.completedAt).length, 0);
  const next = CHAPTERS.find(c => c.cards.length && chapterCompletion(p, c) < 1);
  return (
    <div>
      <div className="crumbs">Epidemiology 101 · MSc Clinical Research</div>
      <h2>Self-paced epidemiology, keyed to Rothman, Huybrechts &amp; Murray</h2>
      <p className="reading">Read the chapter first, then work the cards: each has a hook, an exploration, a short formal explanation, generated practice and a check. Mastery, not time, moves you on.</p>

      <div className="stats">
        <div className="stat"><div className="k">Cards completed</div><div className="v">{doneCards} / {totalCards}</div></div>
        <div className="stat ok"><div className="k">Concepts mastered</div><div className="v">{Object.values(p.mastery).filter(m => m.pKnown >= 0.85).length}</div></div>
        <div className="stat warn"><div className="k">Revisits due</div><div className="v">{due.length}</div></div>
      </div>

      {due.length > 0 && (
        <div className="section">
          <h3>Revisit before new material</h3>
          <p className="prose">These concepts are due for a spaced check: {due.map(d => conceptById(d)?.title ?? d).join(', ')}. Open the card that teaches each one and redo its check.</p>
        </div>
      )}

      <div className="section">
        <h3>Continue</h3>
        {next ? <button className="btn" onClick={() => go(`#/ch/${next.number}`)}>Chapter {next.number}: {next.title}</button> : <p className="prose">All available chapters complete. More arrive in the next release.</p>}
      </div>

      <div className="section">
        <h3>Course map</h3>
        <div className="prose">
          {UNITS.map(u => (
            <p key={u.id}><strong>Unit {u.id} · {u.title}</strong> (chapters {u.chapters.join(', ')}): {u.outcome}</p>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>Settings</h3>
        <label className="row" style={{ justifyContent: 'flex-start' }}>
          <input type="checkbox" checked={p.settings.hardGates} onChange={e => setSettings({ hardGates: e.target.checked })} />
          Lock later units until the previous unit's concepts are mastered
        </label>
        <div className="actions">
          <button className="btn ghost" onClick={() => { if (confirmReset) { resetProgress(); setConfirmReset(false); } else { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 4000); } }}>{confirmReset ? 'Click again to confirm reset' : 'Reset my progress'}</button>
          <span className="hint">Progress is stored in this browser only (v0.1).</span>
        </div>
      </div>
    </div>
  );
}
