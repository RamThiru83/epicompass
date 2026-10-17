import type { Chapter } from '../content/types';
import { Markdown } from '../components/Markdown';
import { useProgress } from '../store/progress';
import { go } from '../App';

export function ChapterPage({ chapter }: { chapter: Chapter }) {
  const p = useProgress();
  return (
    <div>
      <div className="crumbs">Unit {chapter.unit} · Chapter {chapter.number}</div>
      <h2>{chapter.title}</h2>
      <div className="reading">Read first: {chapter.reading}</div>
      <Markdown>{chapter.summary}</Markdown>
      <div className="cards" style={{ marginTop: 16 }}>
        {chapter.cards.map((c, i) => {
          const prog = p.cards[c.id];
          const done = !!prog?.completedAt;
          const started = prog && Object.values(prog.steps).some(Boolean);
          return (
            <button key={c.id} className="cardrow" onClick={() => go(`#/card/${c.id}`)}>
              <span className="idx">{chapter.number}.{i + 1}</span>
              <span><div className="title">{c.title}</div><div className="meta">{c.minutes} min · {c.concepts.length} concept{c.concepts.length > 1 ? 's' : ''}{c.explore ? ' · interactive' : ''}{c.practise ? ' · practice' : ''}</div></span>
              <span className={`pill ${done ? 'ok' : started ? '' : ''}`}>{done ? 'complete' : started ? 'in progress' : 'start'}</span>
            </button>
          );
        })}
        {chapter.cards.length === 0 && <p className="hint">Cards for this chapter arrive in the next release.</p>}
      </div>
    </div>
  );
}
