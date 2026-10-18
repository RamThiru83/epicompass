import { useEffect, useState } from 'react';
import type { CheckItem } from '../content/types';
import { Markdown } from './Markdown';
import { recordAttempt } from '../store/progress';

/** Multiple-choice retrieval items. Each first answer is recorded against the item's concept (BKT). */
export function Check({ cardId, items, onAllAnswered }: { cardId: string; items: CheckItem[]; onAllAnswered: () => void }) {
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [first, setFirst] = useState<Record<string, boolean>>({});
  useEffect(() => { if (items.length && items.every(i => picked[i.id] !== undefined && items.find(x => x.id === i.id)!.options[picked[i.id]].correct)) onAllAnswered(); }, [picked]);
  return (
    <div>
      {items.map((it, n) => (
        <div key={it.id} style={{ marginBottom: 16 }}>
          <div className="prose" style={{ fontWeight: 500 }}><Markdown>{`${n + 1}. ${it.prompt}`}</Markdown></div>
          <div className="opts">
            {it.options.map((o, i) => {
              const sel = picked[it.id] === i;
              return <button key={i} className={`opt ${sel ? (o.correct ? 'right' : 'wrong') : ''}`} onClick={() => {
                if (!first[it.id]) { recordAttempt(cardId, it.id, it.concept, o.correct); setFirst(f => ({ ...f, [it.id]: true })); }
                setPicked(p => ({ ...p, [it.id]: i }));
              }}><Markdown inline className="">{o.text}</Markdown></button>;
            })}
          </div>
          {picked[it.id] !== undefined && <div className="fb"><Markdown inline className="">{it.options[picked[it.id]].feedback}</Markdown></div>}
        </div>
      ))}
    </div>
  );
}
