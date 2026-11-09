import { CHAPTERS, UNITS, conceptById, concepts } from '../content';
import { coreCards } from '../content/types';
import { useProgress, dueConcepts, isMastered } from '../store/progress';
import { chapterCompletion } from '../store/gates';
import { go } from '../App';

export function HomePage() {
  const p = useProgress();
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
          <p className="sub">Mastery, not time, moves you on. Read the chapter first, then work its cards; revisits appear here when a concept is due. Text size, appearance and Kenny are in <a href="#/settings">Settings</a>.</p>
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
          <div className="panel-head"><h2 id="h-map">Course map</h2><span className="aside">What you should be able to do at the end of each unit open so far</span></div>
          <div className="kv">
            {UNITS.filter(u => u.chapters.some(n => open.some(c => c.number === n))).map(u => <div key={u.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 220px) minmax(0, 1fr)', gap: 16 }}><dt>Unit {u.id}: {u.title}<br /><span className="hint">Chapters {u.chapters.join(', ')}</span></dt><dd style={{ textAlign: 'left' }}>{u.outcome}</dd></div>)}
          </div>
        </section>
      </div>

    </div>
  );
}
