import { useEffect, useMemo, useRef, useState } from 'react';
import type { Card, Chapter } from '../content/types';
import { coreCards } from '../content/types';
import { templates, CHAPTERS, UNITS, conceptById, cardLabel } from '../content';
import { EditableMd } from '../components/EditableMd';
import { Check } from '../components/Check';
import { Exercise } from '../components/Exercise';
import { MasteryMeter, masteryText, masteryPct } from '../components/Mastery';
import { INTERACTIVES } from '../interactives/registry';
import { useProgress, markStep, completeCard, getProgress } from '../store/progress';
import { go } from '../App';
import { STEP_LABEL as LABEL, stepsOf, type Step } from '../components/Path';

/** Steps that are read rather than answered count as done once they have been opened. */
const DONE_ON_VIEW: Step[] = ['hook', 'explore', 'formalise'];

export function CardPage({ card, chapter }: { card: Card; chapter: Chapter }) {
  const p = useProgress();
  const prog = p.cards[card.id];
  const steps = stepsOf(card);
  const firstOpen = steps.find(s => !prog?.steps[s]) ?? steps[steps.length - 1];
  const [now, setNow] = useState<Step>(firstOpen);
  const [finished, setFinished] = useState(false);
  // Mastery when the card was opened, to show what this card changed.
  const before = useRef<Record<string, { pKnown: number; attempts: number } | undefined>>({});
  useEffect(() => {
    setNow(firstOpen); setFinished(false);
    const m = getProgress().mastery;
    before.current = Object.fromEntries(card.concepts.map(c => [c, m[c] ? { pKnown: m[c].pKnown, attempts: m[c].attempts } : undefined]));
  }, [card.id]);
  useEffect(() => { if (DONE_ON_VIEW.includes(now) && !prog?.steps[now] && !card.bonus) markStep(card.id, now); }, [now, card.id]);

  const idx = steps.indexOf(now);
  const next = steps[idx + 1];
  const done = (s: Step) => !!prog?.steps[s];
  const advance = () => { markStep(card.id, now); if (next) { setNow(next); scrollToSteps(); } };
  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollToSteps = () => requestAnimationFrame(() => tabsRef.current?.scrollIntoView({ block: 'nearest' }));

  const siblings = chapter.cards;
  const pos = siblings.findIndex(c => c.id === card.id);
  const nextCard = siblings[pos + 1] ?? CHAPTERS.find(c => c.number === chapter.number + 1 && c.cards.length)?.cards[0];

  const Interactive = card.explore ? INTERACTIVES[card.explore.interactive]?.component : undefined;
  const template = card.practise ? templates[card.practise.template] : undefined;
  const allChecksDone = useMemo(() => done('check'), [prog]);

  const unit = UNITS.find(u => u.id === chapter.unit);
  const crumb = `Unit ${chapter.unit}: ${unit?.title ?? ''} · Chapter ${chapter.number} · ${cardLabel(card)}`;

  const nextLink = nextCard && (
    <a className="rowcard" href={`#/card/${nextCard.id}`} style={{ textDecoration: 'none' }}>
      <span><div className="title">{nextCard.title}</div><div className="meta">{nextCard.chapter === chapter.number ? cardLabel(nextCard) : `Chapter ${nextCard.chapter}`} · {nextCard.minutes} min</div></span>
    </a>
  );
  const rail = (
    <aside className="rail">
      <section className="panel" aria-labelledby="h-ctx">
        <div className="panel-head"><h2 id="h-ctx">{nextCard ? 'Up next' : 'Chapter'}</h2></div>
        {nextLink ?? <p className="hint">This is the last card of the chapter.</p>}
        <p className="hint" style={{ marginTop: 12 }}>Read first: {chapter.reading}</p>
        <p className="hint" style={{ marginTop: 6 }}><a href={`#/ch/${chapter.number}`}>All cards in Chapter {chapter.number}</a></p>
      </section>
      {card.concepts.length > 0 && <section className="panel" aria-labelledby="h-cc">
        <div className="panel-head"><h2 id="h-cc">Concepts in this card</h2></div>
        {card.concepts.map(id => (
          <div className="concept" key={id}>
            <div className="top"><span>{conceptById(id)?.title ?? id}</span><span>{masteryText(p.mastery[id])}</span></div>
            <MasteryMeter m={p.mastery[id]} />
          </div>
        ))}
      </section>}
    </aside>
  );

  if (card.bonus) {
    const b = card.bonus;
    return (
      <div>
        <div className="title-row"><div>
          <div className="crumbs">{crumb} · optional</div>
          <h1>{card.title}</h1>
        </div></div>
        <div className="card-layout"><div className="card-main">
        <div className="section"><EditableMd scope={`card.${card.id}.hook`}>{card.hook}</EditableMd>
          <div className="video">
            <p className="video-fallback">The video is loading. If it does not appear, <a href={`https://youtu.be/${b.youtubeId}`} target="_blank" rel="noreferrer">watch it on YouTube</a>.</p>
            <iframe src={`https://www.youtube-nocookie.com/embed/${b.youtubeId}?rel=0`} title={b.videoTitle} loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
          </div>
          <p className="hint">{b.channel}: {b.videoTitle}. <a href={`https://youtu.be/${b.youtubeId}`} target="_blank" rel="noreferrer">Watch on YouTube</a></p>
          <EditableMd scope={`card.${card.id}.formalise`}>{card.formalise}</EditableMd>
          <div className="actions">
            <button className="btn" onClick={() => { completeCard(card.id); go(nextCard ? `#/card/${nextCard.id}` : `#/ch/${chapter.number}`); }}>{!nextCard ? 'Done' : nextCard.chapter === chapter.number ? 'Done, continue' : 'Done, on to the next chapter'}</button>
            <span className="hint">Optional: this card does not count towards your progress.</span>
          </div>
        </div>
        </div>{rail}</div>
      </div>
    );
  }

  // ---------------------------------------------------------------- end of card
  if (finished) {
    const pNow = getProgress();
    const core = coreCards(chapter);
    const chapterDone = core.every(k => pNow.cards[k.id]?.completedAt);
    return (
      <div>
        <div className="title-row"><div>
          <div className="crumbs">{crumb}</div>
          <h1>{card.title}</h1>
        </div></div>
        <div className="card-layout"><div className="card-main">
          <section className="section finish" role="status" aria-live="polite">
            <h2 className="finish-title">{chapterDone ? `Chapter ${chapter.number} complete.` : `${cardLabel(card)} complete.`}</h2>
            <p className="finish-sub">{chapterDone
              ? `That is every card in ${chapter.title.toLowerCase()}. Concepts you have not yet mastered will come back as revisits in a few days.`
              : 'Here is what this card did to your mastery estimates.'}</p>
            <div className="shift">
              {card.concepts.map(id => {
                const b = before.current[id], a = pNow.mastery[id];
                return (
                  <div className="shift-row" key={id}>
                    <span className="nm">{conceptById(id)?.title ?? id}</span>
                    <MasteryMeter m={a} from={b?.pKnown} />
                    <span className="val">{b && b.attempts >= 2 ? `${masteryPct(b.pKnown)} → ` : ''}{masteryText(a)}</span>
                  </div>
                );
              })}
            </div>
            <div className="actions">
              {nextCard
                ? <button className="btn" onClick={() => go(`#/card/${nextCard.id}`)}>Next: {nextCard.title}</button>
                : <button className="btn" onClick={() => go(`#/ch/${chapter.number}`)}>Back to Chapter {chapter.number}</button>}
              {nextCard && <a className="textlink" href={`#/ch/${chapter.number}`}>Back to Chapter {chapter.number}</a>}
            </div>
          </section>
        </div>{rail}</div>
      </div>
    );
  }

  // ---------------------------------------------------------------- the card's steps
  const what: Record<Step, string> = {
    hook: 'A short case to think about.',
    explore: card.explore ? `Interactive: ${INTERACTIVES[card.explore.interactive]?.title ?? 'explore the idea'}.` : '',
    formalise: 'The idea stated properly, with its formula.',
    practise: card.practise ? `Solve ${card.practise.count} generated problem${card.practise.count > 1 ? 's' : ''} to continue.` : '',
    check: `${card.checks.length} question${card.checks.length > 1 ? 's' : ''}. Your first answer to each one updates your mastery.`,
  };
  const onTabKey = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : e.key === 'Home' ? -99 : e.key === 'End' ? 99 : 0;
    if (!d) return;
    e.preventDefault();
    const n = steps[Math.max(0, Math.min(steps.length - 1, idx + d))];
    setNow(n);
    requestAnimationFrame(() => document.getElementById(`tab-${n}`)?.focus());
  };
  const panel = (body: React.ReactNode) => (
    <div className="section step-body" role="tabpanel" id={`panel-${now}`} aria-labelledby={`tab-${now}`}>
      <p className="step-meta">Step {idx + 1} of {steps.length} · {what[now]}</p>
      {body}
    </div>
  );

  return (
    <div>
      <div className="title-row"><div>
        <div className="crumbs">{crumb} · {card.minutes} min</div>
        <h1>{card.title}</h1>
      </div></div>
      <div className="card-layout"><div className="card-main">
      <div className="steps" role="tablist" aria-label="Steps in this card" ref={tabsRef} onKeyDown={onTabKey}>
        {steps.map(s => (
          <button key={s} id={`tab-${s}`} role="tab" aria-selected={now === s} aria-controls={`panel-${s}`} tabIndex={now === s ? 0 : -1}
            className={`step ${done(s) ? 'done' : ''} ${now === s ? 'now' : ''}`} onClick={() => setNow(s)}>
            {LABEL[s]}<span className="sr-only">{done(s) ? ', done' : ''}</span>
          </button>
        ))}
      </div>

      {now === 'hook' && panel(<>
        <EditableMd scope={`card.${card.id}.hook`}>{card.hook}</EditableMd>
        <div className="actions"><button className="btn" onClick={advance}>Continue</button></div>
      </>)}

      {now === 'explore' && card.explore && panel(<>
        <EditableMd scope={`card.${card.id}.explore`}>{card.explore.prompt}</EditableMd>
        {Interactive ? <Interactive config={card.explore.props} onReached={(r) => { if (r) markStep(card.id, 'explore-reached'); }} />
          : <p className="hint">This interactive is not available in this build.</p>}
        <div className="actions"><button className="btn" onClick={advance}>Continue</button>
          <span className="reached" role="status" aria-live="polite">{prog?.steps['explore-reached'] ? 'Target reached.' : ''}</span></div>
      </>)}

      {now === 'formalise' && panel(<>
        <EditableMd scope={`card.${card.id}.formalise`}>{card.formalise}</EditableMd>
        <div className="actions"><button className="btn" onClick={advance}>Continue</button></div>
      </>)}

      {now === 'practise' && card.practise && panel(<>
        {template ? <Exercise cardId={card.id} template={template} required={card.practise.count} onSatisfied={() => markStep(card.id, 'practise')} />
          : <p className="hint">This exercise is not available in this build.</p>}
        <div className="actions"><button className="btn" disabled={!!template && (prog?.exercisesPassed ?? 0) < card.practise.count} onClick={advance}>Continue</button>
          <span className="hint">{Math.min(prog?.exercisesPassed ?? 0, card.practise.count)} of {card.practise.count} solved</span></div>
      </>)}

      {now === 'check' && panel(<>
        <Check cardId={card.id} items={card.checks} onAllAnswered={() => markStep(card.id, 'check')} />
        <div className="actions">
          <button className="btn" disabled={!allChecksDone} onClick={() => { completeCard(card.id); setFinished(true); window.scrollTo(0, 0); }}>Complete card</button>
          {!allChecksDone && <span className="hint">Answer every question to complete the card.</span>}
        </div>
      </>)}
      </div>{rail}</div>
    </div>
  );
}
