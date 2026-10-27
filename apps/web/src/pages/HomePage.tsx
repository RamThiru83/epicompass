import { useState } from 'react';
import { CHAPTERS, UNITS, conceptById, concepts } from '../content';
import { coreCards } from '../content/types';
import { useTextSize } from '../store/textSize';
import { useProgress, dueConcepts, setSettings, resetProgress, isMastered } from '../store/progress';
import { chapterCompletion } from '../store/gates';
import { go } from '../App';
import { useAccount } from '../store/account';
import { cloudEnabled } from '../lib/supabase';

export function HomePage() {
  const p = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const [textSize, setTextSize] = useTextSize();
  const acc = useAccount();
  const due = dueConcepts(p);
  const open = CHAPTERS.filter(c => c.cards.length);
  const totalCards = CHAPTERS.reduce((s, c) => s + coreCards(c).length, 0);
  const doneCards = CHAPTERS.reduce((s, c) => s + coreCards(c).filter(k => p.cards[k.id]?.completedAt).length, 0);
  const taught = concepts.filter(c => open.some(ch => ch.number === c.chapter));
  const mastered = taught.filter(c => isMastered(p, c.id)).length;
  const next = open.find(c => chapterCompletion(p, c) < 1);
  return (
    <div>
      <div className="title-row">
        <div>
          <h1>My progress</h1>
          <p className="sub">Mastery, not time, moves you on. Read the chapter first, then work its cards; revisits appear here when a concept is due.</p>
        </div>
        {next && <button className="btn" onClick={() => go(`#/ch/${next.number}`)}>Continue Chapter {next.number}</button>}
      </div>

      <div className="grid">
        <div className="tiles three s12">
          <div className="tile"><span className="k">Cards completed</span><span className="v">{doneCards} <small>of {totalCards}</small></span><span className="c">Optional videos are not counted</span></div>
          <div className="tile"><span className="k">Concepts mastered</span><span className="v">{mastered} <small>of {taught.length}</small></span><span className="c">At 85% estimated mastery</span></div>
          <div className="tile"><span className="k">Revisits due</span><span className="v">{due.length}</span><span className="c">{due.length ? 'Redo the check of each card below' : 'Nothing due today'}</span></div>
        </div>

        <section className="panel s8" aria-labelledby="h-chapters">
          <div className="panel-head"><h2 id="h-chapters">Chapters</h2><span className="aside">Cards complete</span></div>
          <div className="rows">
            {open.map(c => {
              const core = coreCards(c);
              const d = core.filter(k => p.cards[k.id]?.completedAt).length;
              return (
                <button key={c.number} className="rowcard" onClick={() => go(`#/ch/${c.number}`)}>
                  <span><div className="title">{c.number}. {c.title}</div><div className="meta">Unit {c.unit} · {c.reading}</div></span>
                  <span style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span className="bar" style={{ width: 72 }}><i style={{ width: `${(100 * d) / core.length}%` }} /></span>
                    <span className="num" style={{ minWidth: 44, textAlign: 'right' }}>{d} / {core.length}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="s4" style={{ display: 'grid', gap: 16 }}>
        <section className="panel" aria-labelledby="h-due">
          <div className="panel-head"><h2 id="h-due">Revisit before new material</h2></div>
          {due.length > 0
            ? <div className="kv">{due.map(d => <div key={d}><dt>{conceptById(d)?.title ?? d}</dt><dd>Chapter {conceptById(d)?.chapter}</dd></div>)}</div>
            : <p className="hint">No concept is due for a spaced check. Concepts you have answered come back here a few days later, so the idea stays with you.</p>}
        </section>
        <section className="panel" aria-labelledby="h-cbc">
          <div className="panel-head"><h2 id="h-cbc">Concepts mastered</h2><span className="aside">By chapter</span></div>
          <dl className="kv">{open.map(c => {
            const cs = taught.filter(k => k.chapter === c.number);
            return <div key={c.number}><dt>Chapter {c.number}</dt><dd className="num">{cs.filter(k => isMastered(p, k.id)).length} of {cs.length}</dd></div>;
          })}</dl>
        </section>
        </div>

        <section className="panel s12" aria-labelledby="h-map">
          <div className="panel-head"><h2 id="h-map">Course map</h2><span className="aside">What you should be able to do at the end of each unit</span></div>
          <div className="kv">
            {UNITS.map(u => <div key={u.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 220px) minmax(0, 1fr)', gap: 16 }}><dt>Unit {u.id}: {u.title}<br /><span className="hint">Chapters {u.chapters.join(', ')}</span></dt><dd style={{ textAlign: 'left' }}>{u.outcome}</dd></div>)}
          </div>
        </section>
      </div>

      <section style={{ marginTop: 48 }} aria-labelledby="h-settings">
        <h2 id="h-settings" style={{ fontSize: '1.1875rem', marginBottom: 24 }}>Settings</h2>
        <div className="setrow">
          <div className="lbl"><h2 id="h-textsize">Text size</h2><p>Applies on this device. Your browser’s own text-size setting also works.</p></div>
          <div className="panel">
            <div className="seg" role="radiogroup" aria-labelledby="h-textsize">
              {(['standard', 'large'] as const).map(v => (
                <button key={v} type="button" role="radio" aria-checked={textSize === v} className={`btn ${textSize === v ? '' : 'ghost'}`} onClick={() => setTextSize(v)}>
                  {v === 'standard' ? 'Standard' : 'Large'}
                </button>))}
            </div>
          </div>
        </div>
        <div className="setrow">
          <div className="lbl"><h2>Unit locks</h2><p>Keep yourself to the course order.</p></div>
          <div className="panel">
            <label className="toggle-row"><input type="checkbox" checked={p.settings.hardGates} onChange={e => setSettings({ hardGates: e.target.checked })} />
              <span>Lock later units until the previous unit's concepts are mastered</span></label>
          </div>
        </div>
        <div className="setrow">
          <div className="lbl"><h2>Where your progress is kept</h2><p>{acc.session ? 'Saved to your account and on this device.' : 'In this browser only.'}</p></div>
          <div className="panel">
            <p style={{ margin: 0 }}>{acc.session ? 'Sign in with the same email on any device to continue where you left off.' : cloudEnabled ? <>Progress is stored in this browser only. <a href="#/account">Sign in or join</a> to save it across devices.</> : 'Progress is stored in this browser only.'}</p>
            <div className="actions" style={{ marginTop: 16 }}>
              <button className="btn ghost" style={{ color: 'var(--negative)' }} onClick={() => { if (confirmReset) { resetProgress(); setConfirmReset(false); } else { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 4000); } }}>{confirmReset ? 'Click again to erase all progress' : 'Reset my progress'}</button>
              <span className="hint">Erases every card, answer and mastery estimate.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
