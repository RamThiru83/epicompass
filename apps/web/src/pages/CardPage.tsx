import { useEffect, useMemo, useState } from 'react';
import type { Card, Chapter } from '../content/types';
import { templates } from '../content';
import { Markdown } from '../components/Markdown';
import { Check } from '../components/Check';
import { Exercise } from '../components/Exercise';
import { INTERACTIVES } from '../interactives/registry';
import { useProgress, markStep, completeCard } from '../store/progress';
import { useEditorMode } from '../store/account';
import { go } from '../App';
import { CHAPTERS } from '../content';
import { editUrl, chapterFile } from '../config';
import { UNITS, conceptById } from '../content';
import { STEP_LABEL as LABEL, stepsOf, type Step } from '../components/Path';
import { MASTERY_THRESHOLD } from '@epicompass/epi-core';


export function CardPage({ card, chapter }: { card: Card; chapter: Chapter }) {
  const p = useProgress();
  const editor = useEditorMode();
  const prog = p.cards[card.id];
  const steps = stepsOf(card);
  const firstOpen = steps.find(s => !prog?.steps[s]) ?? steps[steps.length - 1];
  const [now, setNow] = useState<Step>(firstOpen);
  useEffect(() => { setNow(firstOpen); }, [card.id]);

  const idx = steps.indexOf(now);
  const next = steps[idx + 1];
  const done = (s: Step) => !!prog?.steps[s];
  const advance = () => { markStep(card.id, now); if (next) setNow(next); else completeCard(card.id); };

  const siblings = chapter.cards;
  const pos = siblings.findIndex(c => c.id === card.id);
  const nextCard = siblings[pos + 1] ?? CHAPTERS.find(c => c.number === chapter.number + 1 && c.cards.length)?.cards[0];

  const Interactive = card.explore ? INTERACTIVES[card.explore.interactive]?.component : undefined;
  const template = card.practise ? templates[card.practise.template] : undefined;
  const allChecksDone = useMemo(() => done('check'), [prog]);

  const unit = UNITS.find(u => u.id === chapter.unit);
  const crumb = `Unit ${chapter.unit}: ${unit?.title ?? ''} · Chapter ${chapter.number} · Card ${chapter.number}.${pos + 1}`;
  const rail = (
    <aside className="rail">
      {card.concepts.length > 0 && <section className="panel" aria-labelledby="h-cc">
        <div className="panel-head"><h2 id="h-cc">Concepts in this card</h2></div>
        {card.concepts.map(id => {
          const m = p.mastery[id];
          const v = m && m.attempts ? m.pKnown : 0;
          return (
            <div className="concept" key={id}>
              <div className="top"><span>{conceptById(id)?.title ?? id}</span><span>{m && m.attempts ? `${Math.round(v * 100)}%` : '—'}</span></div>
              <div className="meter" aria-hidden><i style={{ width: `${v * 100}%` }} /><b style={{ left: `${MASTERY_THRESHOLD * 100}%` }} /></div>
            </div>
          );
        })}
      </section>}
      <section className="panel" aria-labelledby="h-ctx">
        <div className="panel-head"><h2 id="h-ctx">{nextCard ? 'Up next' : 'Chapter'}</h2></div>
        {nextCard
          ? <a className="rowcard" href={`#/card/${nextCard.id}`} style={{ textDecoration: 'none' }}><span><div className="title">{nextCard.title}</div><div className="meta">{nextCard.chapter === chapter.number ? `Card ${chapter.number}.${pos + 2}` : `Chapter ${nextCard.chapter}`} · {nextCard.minutes} min</div></span></a>
          : <p className="hint">This is the last card of the chapter.</p>}
        <p className="hint" style={{ marginTop: 12 }}>Read first: {chapter.reading}</p>
        <p className="hint" style={{ marginTop: 6 }}><a href={`#/ch/${chapter.number}`}>All cards in Chapter {chapter.number}</a></p>
      </section>
    </aside>
  );

  const what: Record<Step, string> = {
    hook: 'A short case to think about',
    explore: card.explore ? `Interactive: ${INTERACTIVES[card.explore.interactive]?.title ?? 'explore the idea'}` : '',
    formalise: 'The idea stated properly, with its formula',
    practise: card.practise ? `Solve ${card.practise.count} generated problem${card.practise.count > 1 ? 's' : ''}` : '',
    check: `${card.checks.length} question${card.checks.length > 1 ? 's' : ''}; your first answers update mastery`,
  };
  const ahead = (
    <section className="panel ahead" aria-labelledby="h-ahead" style={{ marginTop: 16 }}>
      <div className="panel-head"><h2 id="h-ahead">The steps of this card</h2><span className="aside">{steps.filter(done).length} of {steps.length} done</span></div>
      <ol>{steps.map(s => <li key={s} className={now === s ? 'now' : ''}>
        <span className={`dot ${done(s) ? 'done' : ''}`} aria-hidden />
        <span className="nm">{LABEL[s]}</span><span className="ds">{what[s]}</span>
        <span className="st">{done(s) ? 'Done' : s === 'practise' ? `${prog?.exercisesPassed ?? 0} of ${card.practise!.count} solved` : ''}</span>
      </li>)}</ol>
    </section>
  );

  if (card.bonus) {
    const b = card.bonus;
    return (
      <div>
        <div className="title-row"><div>
          <div className="crumbs">{crumb} · optional video</div>
          <h1>{card.title}</h1>
          {editor && <p className="edit-link">Instructor: <a href={editUrl(chapterFile(chapter.number))} target="_blank" rel="noreferrer">edit this card on GitHub</a> (search for <code>id: '{card.id}'</code>).</p>}
        </div></div>
        <div className="card-layout"><div className="card-main">
        <div className="section"><Markdown>{card.hook}</Markdown>
          <div className="video">
            <iframe src={`https://www.youtube-nocookie.com/embed/${b.youtubeId}?rel=0`} title={b.videoTitle} loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
          </div>
          <p className="hint">{b.channel}: {b.videoTitle}. <a href={`https://youtu.be/${b.youtubeId}`} target="_blank" rel="noreferrer">Watch on YouTube</a></p>
          <Markdown>{card.formalise}</Markdown>
          <div className="actions">
            <button className="btn" onClick={() => { completeCard(card.id); go(nextCard ? `#/card/${nextCard.id}` : `#/ch/${chapter.number}`); }}>{!nextCard ? 'Done' : nextCard.chapter === chapter.number ? 'Done, continue' : 'Done, on to the next chapter'}</button>
            <span className="hint">Optional: this card does not count towards your progress.</span>
          </div>
        </div>
        </div>{rail}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="title-row"><div>
        <div className="crumbs">{crumb} · {card.minutes} min</div>
        <h1>{card.title}</h1>
        {editor && <p className="edit-link">Instructor: <a href={editUrl(chapterFile(chapter.number))} target="_blank" rel="noreferrer">edit this card on GitHub</a> (search the file for <code>id: '{card.id}'</code>; the site redeploys about two minutes after you commit).</p>}
      </div></div>
      <div className="card-layout"><div className="card-main">
      <div className="steps" role="tablist" aria-label="Steps in this card">
        {steps.map(s => <button key={s} role="tab" aria-selected={now === s} className={`step ${done(s) ? 'done' : ''} ${now === s ? 'now' : ''}`} onClick={() => setNow(s)}>{LABEL[s]}</button>)}
      </div>

      {now === 'hook' && (
        <div className="section step-body" role="tabpanel"><Markdown>{card.hook}</Markdown>
          <div className="actions"><button className="btn" onClick={advance}>Continue</button></div></div>
      )}

      {now === 'explore' && card.explore && (
        <div className="section step-body" role="tabpanel"><Markdown>{card.explore.prompt}</Markdown>
          {Interactive ? <Interactive config={card.explore.props} onReached={(r, d) => { if (r) markStep(card.id, 'explore-reached'); }} />
            : <p className="hint">Interactive "{card.explore.interactive}" is not available in this build.</p>}
          <div className="actions"><button className="btn" onClick={advance}>Continue</button>{prog?.steps['explore-reached'] && <span className="reached">Target state reached.</span>}</div></div>
      )}

      {now === 'formalise' && (
        <div className="section step-body" role="tabpanel"><Markdown>{card.formalise}</Markdown>
          <div className="actions"><button className="btn" onClick={advance}>Continue</button></div></div>
      )}

      {now === 'practise' && card.practise && (
        <div className="section step-body" role="tabpanel">
          {template ? <Exercise cardId={card.id} template={template} required={card.practise.count} onSatisfied={() => markStep(card.id, 'practise')} />
            : <p className="hint">Exercise template "{card.practise.template}" is not available in this build.</p>}
          <div className="actions"><button className="btn" disabled={!!template && (prog?.exercisesPassed ?? 0) < card.practise.count} onClick={advance}>Continue</button>
            <span className="hint">{prog?.exercisesPassed ?? 0} of {card.practise.count} solved</span></div></div>
      )}

      {now === 'check' && (
        <div className="section step-body" role="tabpanel">
          <Check cardId={card.id} items={card.checks} onAllAnswered={() => markStep(card.id, 'check')} />
          <div className="actions">
            <button className="btn" disabled={!allChecksDone} onClick={() => { completeCard(card.id); if (nextCard) go(`#/card/${nextCard.id}`); else go(`#/ch/${chapter.number}`); }}>
              {nextCard ? 'Complete card and continue' : 'Complete card'}
            </button>
            {!allChecksDone && <span className="hint">Answer every item to complete the card.</span>}
          </div></div>
      )}
      {ahead}
      </div>{rail}</div>
    </div>
  );
}
