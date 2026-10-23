import { useEffect, useState } from 'react';
import type { CheckItem } from '../content/types';
import { EditableMd } from './EditableMd';
import { recordAttempt } from '../store/progress';
import { useEditing } from '../store/overrides';

/** Multiple-choice retrieval items. Each first answer is recorded against the item's concept (BKT). */
export function Check({ cardId, items, onAllAnswered }: { cardId: string; items: CheckItem[]; onAllAnswered: () => void }) {
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [first, setFirst] = useState<Record<string, boolean>>({});
  const editing = useEditing();
  useEffect(() => { if (items.length && items.every(i => picked[i.id] !== undefined && items.find(x => x.id === i.id)!.options[picked[i.id]].correct)) onAllAnswered(); }, [picked]);

  // Edit mode: every question, option and feedback is shown and editable; nothing is recorded.
  if (editing) return (
    <div>
      <p className="hint">Editing: wording only. Which option is correct is fixed in the course content.</p>
      {items.map((it, n) => (
        <div key={it.id} className="check-item">
          <div className="qhead"><span>{n + 1}.</span><EditableMd scope={`chk.${it.id}.prompt`}>{it.prompt}</EditableMd></div>
          {it.options.map((o, i) => (
            <div key={i} className={`opt opt-edit ${o.correct ? 'right' : ''}`}>
              <div><span className="hint">{o.correct ? 'Correct option' : `Option ${i + 1}`}: </span><EditableMd inline scope={`chk.${it.id}.o${i}`}>{o.text}</EditableMd></div>
              <div className="fb"><span className="hint">Feedback: </span><EditableMd inline scope={`chk.${it.id}.f${i}`}>{o.feedback}</EditableMd></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {items.map((it, n) => (
        <div key={it.id} className="check-item">
          <div className="qhead"><span>{n + 1}.</span><EditableMd scope={`chk.${it.id}.prompt`}>{it.prompt}</EditableMd></div>
          <div className="opts">
            {it.options.map((o, i) => {
              const sel = picked[it.id] === i;
              return <button key={i} className={`opt ${sel ? (o.correct ? 'right' : 'wrong') : ''}`} onClick={() => {
                if (!first[it.id]) { recordAttempt(cardId, it.id, it.concept, o.correct); setFirst(f => ({ ...f, [it.id]: true })); }
                setPicked(p => ({ ...p, [it.id]: i }));
              }}><EditableMd inline className="" scope={`chk.${it.id}.o${i}`}>{o.text}</EditableMd></button>;
            })}
          </div>
          {picked[it.id] !== undefined && <div className="fb"><EditableMd inline className="" scope={`chk.${it.id}.f${picked[it.id]}`}>{it.options[picked[it.id]].feedback}</EditableMd></div>}
        </div>
      ))}
    </div>
  );
}
