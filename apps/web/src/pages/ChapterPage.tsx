import type { Chapter } from '../content/types';
import { coreCards } from '../content/types';
import { UNITS, conceptById } from '../content';
import { EditableMd } from '../components/EditableMd';
import { Path, cardState } from '../components/Path';
import { useProgress } from '../store/progress';
import { MASTERY_THRESHOLD } from '@epicompass/epi-core';
import { go } from '../App';

export function ChapterPage({ chapter }: { chapter: Chapter }) {
  const p = useProgress();
  const unit = UNITS.find(u => u.id === chapter.unit);
  const core = coreCards(chapter);
  const done = core.filter(k => p.cards[k.id]?.completedAt).length;
  const minutes = core.reduce((s, k) => s + k.minutes, 0);
  const ids = [...new Set(core.flatMap(k => k.concepts))];
  const nextCard = chapter.cards.find(k => !k.bonus && !p.cards[k.id]?.completedAt);
  return (
    <div>
      <div className="title-row">
        <div>
          <div className="crumbs">Unit {chapter.unit}: {unit?.title} · Chapter {chapter.number}</div>
          <h1>{chapter.title}</h1>
        </div>
        {nextCard && <button className="btn" onClick={() => go(`#/card/${nextCard.id}`)}>{done || Object.keys(p.cards).some(id => chapter.cards.some(k => k.id === id)) ? 'Resume' : 'Start the first card'}</button>}
      </div>

      <div className="grid">
        <div className={core.length ? 's9' : 's12'}>
          <div className="sheet" style={{ marginBottom: 16 }}>
            <EditableMd scope={`ch.${chapter.number}.summary`}>{chapter.summary}</EditableMd>
            <p className="reading">Read first: {chapter.reading}</p>
          </div>
          {core.length === 0 && unit && <section className="panel" aria-labelledby="h-unit" style={{ marginBottom: 16 }}>
            <div className="panel-head"><h2 id="h-unit">What Unit {unit.id} will let you do</h2><span className="aside">Chapters {unit.chapters.join(', ')}</span></div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: '23px', maxWidth: '72ch' }}>{unit.outcome}</p>
          </section>}
          <section className="panel" aria-labelledby="h-cards">
            <div className="panel-head"><h2 id="h-cards">Cards</h2><span className="aside">{done} of {core.length} complete{chapter.cards.length > core.length ? ` · ${chapter.cards.length - core.length} optional video${chapter.cards.length - core.length > 1 ? 's' : ''}` : ''}</span></div>
            <div className="cardlist">
              {chapter.cards.map((c, i) => {
                const st = cardState(c, p);
                return (
                  <button key={c.id} className="cardrow" onClick={() => go(`#/card/${c.id}`)}>
                    <span className="idx">{chapter.number}.{i + 1}</span>
                    <span><div className="title">{c.title}</div><div className="meta">{c.bonus ? <>{c.minutes} min · video · optional</> : <>{c.minutes} min · {c.concepts.length} concept{c.concepts.length > 1 ? 's' : ''}{c.explore ? ' · interactive' : ''}{c.practise ? ' · practice problems' : ''}</>}</div></span>
                    {c.bonus ? <span /> : <Path card={c} p={p} />}
                    <span className={`state ${st}`}>{st === 'done' ? 'Complete' : st === 'started' ? 'In progress' : c.bonus ? 'Watch' : 'Not started'}</span>
                  </button>
                );
              })}
              {chapter.cards.length === 0 && <p className="hint">Cards for this chapter arrive in a later release. Until then, read the chapter in the book.</p>}
            </div>
          </section>
        </div>

        {core.length > 0 && <aside className="s3" style={{ display: 'grid', gap: 16 }}>
          <section className="panel" aria-labelledby="h-ch">
            <div className="panel-head"><h2 id="h-ch">This chapter</h2></div>
            <dl className="kv">
              <div><dt>Cards</dt><dd className="num">{core.length}</dd></div>
              <div><dt>Time</dt><dd className="num">about {minutes} min</dd></div>
              <div><dt>Concepts</dt><dd className="num">{ids.length}</dd></div>
            </dl>
          </section>
          {ids.length > 0 && <section className="panel" aria-labelledby="h-con">
            <div className="panel-head"><h2 id="h-con">Concept mastery</h2></div>
            {ids.map(id => {
              const m = p.mastery[id];
              const v = m && m.attempts ? m.pKnown : 0;
              return (
                <div className="concept" key={id}>
                  <div className="top"><span>{conceptById(id)?.title ?? id}</span><span>{m && m.attempts ? `${Math.round(v * 100)}%` : '—'}</span></div>
                  <div className="meter" aria-hidden><i style={{ width: `${v * 100}%` }} /><b style={{ left: `${MASTERY_THRESHOLD * 100}%` }} /></div>
                </div>
              );
            })}
            <p className="hint" style={{ marginTop: 10 }}>The tick marks the 85% mastery line.</p>
          </section>}
        </aside>}
      </div>
    </div>
  );
}
