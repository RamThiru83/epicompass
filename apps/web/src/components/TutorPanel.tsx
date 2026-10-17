import { useEffect, useRef, useState } from 'react';
import type { Card } from '../content/types';
import { localTutor, type TutorContext, type TutorTurn } from '../ai/tutor';
import { useProgress } from '../store/progress';

export function TutorPanel({ card }: { card?: Card }) {
  const p = useProgress();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<TutorTurn[]>([]);
  const [q, setQ] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctx: TutorContext = {
    cardId: card?.id ?? 'home', cardTitle: card?.title ?? 'the course home', concepts: card?.concepts ?? [], openExerciseTemplate: card?.practise?.template,
    masteryVector: Object.fromEntries(Object.entries(p.mastery).map(([k, v]) => [k, v.pKnown])),
    recentWrong: p.attempts.slice(-20).filter(a => !a.correct).map(a => a.itemId),
  };
  useEffect(() => { setHistory([localTutor.opening(ctx)]); }, [card?.id]);
  useEffect(() => { bodyRef.current?.scrollTo(0, 1e6); }, [history]);

  if (!open) return <button className="tutor-fab" onClick={() => setOpen(true)}>Ask the tutor</button>;
  return (
    <div className="tutor" role="dialog" aria-label="Tutor">
      <div className="tutor-head"><span>Tutor <span className="pill">{localTutor.name}</span></span><button className="btn ghost" onClick={() => setOpen(false)}>Close</button></div>
      <div className="tutor-body" ref={bodyRef}>
        {history.map((h, i) => <div key={i} className={`msg ${h.role === 'tutor' ? 't' : 'u'}`}>{h.text}{h.source && <span className="src">{h.source}</span>}</div>)}
      </div>
      <form onSubmit={async e => { e.preventDefault(); if (!q.trim()) return; const next = [...history, { role: 'learner', text: q } as TutorTurn]; setHistory(next); setQ(''); const r = await localTutor.ask(ctx, next, q); setHistory(h => [...h, r]); }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Ask about this card…" aria-label="Ask the tutor" /><button className="btn" type="submit">Send</button>
      </form>
    </div>
  );
}
