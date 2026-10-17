import { useEffect, useMemo, useState } from 'react';
import type { Card, Chapter } from '../content/types';
import { templates } from '../content';
import { Markdown } from '../components/Markdown';
import { Check } from '../components/Check';
import { Exercise } from '../components/Exercise';
import { INTERACTIVES } from '../interactives/registry';
import { useProgress, markStep, completeCard } from '../store/progress';
import { go } from '../App';
import { CHAPTERS } from '../content';

const STEPS = ['hook', 'explore', 'formalise', 'practise', 'check'] as const;
type Step = typeof STEPS[number];
const LABEL: Record<Step, string> = { hook: 'Hook', explore: 'Explore', formalise: 'Formalise', practise: 'Practise', check: 'Check' };

export function CardPage({ card, chapter }: { card: Card; chapter: Chapter }) {
  const p = useProgress();
  const prog = p.cards[card.id];
  const steps = STEPS.filter(s => (s === 'explore' ? !!card.explore : s === 'practise' ? !!card.practise : true));
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

  return (
    <div>
      <div className="crumbs">Unit {chapter.unit} · Chapter {chapter.number} · Card {chapter.number}.{pos + 1} · concepts: {card.concepts.join(', ')}</div>
      <h2>{card.title}</h2>
      <div className="steps">
        {steps.map(s => <button key={s} className={`step ${done(s) ? 'done' : ''} ${now === s ? 'now' : ''}`} onClick={() => setNow(s)} style={{ cursor: 'pointer' }}>{LABEL[s]}</button>)}
      </div>

      {now === 'hook' && (
        <div className="section"><h3>Hook</h3><Markdown>{card.hook}</Markdown>
          <div className="actions"><button className="btn" onClick={advance}>Continue</button></div></div>
      )}

      {now === 'explore' && card.explore && (
        <div className="section"><h3>Explore</h3><Markdown>{card.explore.prompt}</Markdown>
          {Interactive ? <Interactive config={card.explore.props} onReached={(r, d) => { if (r) markStep(card.id, 'explore-reached'); }} />
            : <p className="hint">Interactive "{card.explore.interactive}" is not available in this build.</p>}
          <div className="actions"><button className="btn" onClick={advance}>Continue</button>{prog?.steps['explore-reached'] && <span className="reached">Target state reached.</span>}</div></div>
      )}

      {now === 'formalise' && (
        <div className="section"><h3>Formalise</h3><Markdown>{card.formalise}</Markdown>
          <div className="actions"><button className="btn" onClick={advance}>Continue</button></div></div>
      )}

      {now === 'practise' && card.practise && (
        <div className="section"><h3>Practise</h3>
          {template ? <Exercise cardId={card.id} template={template} required={card.practise.count} onSatisfied={() => markStep(card.id, 'practise')} />
            : <p className="hint">Exercise template "{card.practise.template}" is not available in this build.</p>}
          <div className="actions"><button className="btn" disabled={!!template && (prog?.exercisesPassed ?? 0) < card.practise.count} onClick={advance}>Continue</button>
            <span className="hint">{prog?.exercisesPassed ?? 0} of {card.practise.count} solved</span></div></div>
      )}

      {now === 'check' && (
        <div className="section"><h3>Check</h3>
          <Check cardId={card.id} items={card.checks} onAllAnswered={() => markStep(card.id, 'check')} />
          <div className="actions">
            <button className="btn" disabled={!allChecksDone} onClick={() => { completeCard(card.id); if (nextCard) go(`#/card/${nextCard.id}`); else go(`#/ch/${chapter.number}`); }}>
              {nextCard ? 'Complete card and continue' : 'Complete card'}
            </button>
            {!allChecksDone && <span className="hint">Answer every item to complete the card.</span>}
          </div></div>
      )}
    </div>
  );
}
