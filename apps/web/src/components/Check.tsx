import { useEffect, useState } from 'react';
import type { CheckItem } from '../content/types';
import { EditableMd } from './EditableMd';
import { recordAttempt } from '../store/progress';
import { useEditing, useOverrides, resolveBlock } from '../store/overrides';
import { Markdown } from './Markdown';

const Tick = () => <svg className="vicon" viewBox="0 0 16 16" aria-hidden><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Cross = () => <svg className="vicon" viewBox="0 0 16 16" aria-hidden><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;

/** An option's feedback, with live edits applied and a leading "Correct." / "Yes." dropped when we already say so. */
function Feedback({ scope, text }: { scope: string; text: string }) {
  const over = useOverrides();
  const r = resolveBlock(over, `${scope}:0`, text);
  const md = r.md.replace(/^(correct|yes|right|exactly)[.!,:;]?\s+/i, '');
  return <Markdown inline className="" sanitize={r.edited}>{md.charAt(0).toUpperCase() + md.slice(1)}</Markdown>;
}

/** Multiple-choice retrieval items. The first answer to each item is final: it is recorded against the
 *  item's concept (BKT), the options lock, and the correct option and its explanation are shown. */
export function Check({ cardId, items, onAllAnswered }: { cardId: string; items: CheckItem[]; onAllAnswered: () => void }) {
  const [picked, setPicked] = useState<Record<string, number>>({});
  const editing = useEditing();
  useEffect(() => { if (items.length && items.every(i => picked[i.id] !== undefined)) onAllAnswered(); }, [picked]);

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
      <p className="check-note">Take your time: only your first answer to each question counts, and then the explanation appears.</p>
      {items.map((it, n) => {
        const sel = picked[it.id];
        const answered = sel !== undefined;
        const right = answered && it.options[sel].correct;
        const ci = it.options.findIndex(o => o.correct);
        return (
          <fieldset key={it.id} className="check-item">
            <legend className="qhead"><span>{n + 1}.</span><EditableMd scope={`chk.${it.id}.prompt`}>{it.prompt}</EditableMd></legend>
            <div className="opts">
              {it.options.map((o, i) => {
                const state = !answered ? '' : i === sel ? (o.correct ? 'right' : 'wrong') : o.correct ? 'answer' : 'dim';
                return (
                  <button key={i} type="button" className={`opt ${state}`} disabled={answered} aria-pressed={i === sel}
                    onClick={() => { recordAttempt(cardId, it.id, it.concept, o.correct); setPicked(p => ({ ...p, [it.id]: i })); }}>
                    {state === 'right' || state === 'answer' ? <Tick /> : state === 'wrong' ? <Cross /> : null}
                    <EditableMd inline className="" scope={`chk.${it.id}.o${i}`}>{o.text}</EditableMd>
                  </button>
                );
              })}
            </div>
            <div className="fb" role="status" aria-live="polite">
              {answered && <>
                <p><b className={right ? 'v-right' : 'v-wrong'}>{right ? 'Correct.' : 'Not quite.'}</b>{' '}<Feedback scope={`chk.${it.id}.f${sel}`} text={it.options[sel].feedback} /></p>
                {!right && ci >= 0 && <p><b>The answer:</b>{' '}<Feedback scope={`chk.${it.id}.f${ci}`} text={it.options[ci].feedback} /></p>}
              </>}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
