import { useEffect, useMemo, useState } from 'react';
import type { ExerciseTemplate } from '../content/types';
import { generate, checkAnswer, formatValue } from '../exercises/engine';
import { Markdown, fill } from './Markdown';
import { exercisePassed, recordAttempt, useProgress } from '../store/progress';

/** The problem and the answers typed so far survive leaving the card (per device). */
const draftKey = (cardId: string) => `epicompass.draft.${cardId}`;
function readDraft(cardId: string): { seed: number; given: Record<string, string> } | null {
  try { const d = JSON.parse(localStorage.getItem(draftKey(cardId)) ?? 'null'); return d && typeof d.seed === 'number' ? d : null; } catch { return null; }
}
function writeDraft(cardId: string, d: { seed: number; given: Record<string, string> } | null) {
  try { if (d) localStorage.setItem(draftKey(cardId), JSON.stringify(d)); else localStorage.removeItem(draftKey(cardId)); } catch { /* storage unavailable */ }
}

const PLACEHOLDER = { pct: 'Percent', int: 'Whole number', dec2: 'To 2 decimal places', dec3: 'To 3 decimal places', sci: 'Decimal or e-notation' } as const;

export function Exercise({ cardId, template, required, onSatisfied }: { cardId: string; template: ExerciseTemplate; required: number; onSatisfied: () => void }) {
  const p = useProgress();
  const passed = p.cards[cardId]?.exercisesPassed ?? 0;
  const draft = useMemo(() => readDraft(cardId), [cardId]);
  const [seed, setSeed] = useState(() => draft?.seed ?? Date.now() % 1_000_000);
  const inst = useMemo(() => generate(template, seed), [template, seed]);
  const [given, setGiven] = useState<Record<string, string>>(draft?.given ?? {});
  const [result, setResult] = useState<Record<string, boolean> | null>(null);
  const [hints, setHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  useEffect(() => { writeDraft(cardId, { seed, given }); }, [seed, given]);

  const allRight = !!result && Object.values(result).every(Boolean);
  const submit = () => {
    const r: Record<string, boolean> = {};
    for (const f of template.answerFields) r[f.key] = checkAnswer(given[f.key] ?? '', inst.key[f.key], f.tolerance, f.format);
    setResult(r);
    const ok = Object.values(r).every(Boolean);
    template.concepts.forEach(c => recordAttempt(cardId, template.id + ':' + seed, c, ok));
    if (ok) { exercisePassed(cardId); if (passed + 1 >= required) onSatisfied(); }
  };
  const fresh = () => { setSeed(s => s + 7919); setGiven({}); setResult(null); setHints(0); setShowSolution(false); };
  const formatted = Object.fromEntries(template.answerFields.map(f => [f.key, formatValue(inst.key[f.key], f.format)]));
  const wrongN = result ? Object.values(result).filter(v => !v).length : 0;

  return (
    <div>
      <Markdown>{inst.narrative}</Markdown>
      <form className="answers" onSubmit={e => { e.preventDefault(); if (!allRight) submit(); }}>
        {template.answerFields.map(f => (
          <label key={f.key}>{f.label}
            <input type="text" inputMode="decimal" autoComplete="off" className={result ? (result[f.key] ? 'good' : 'bad') : ''}
              aria-invalid={result ? !result[f.key] : undefined} value={given[f.key] ?? ''}
              onChange={e => { setGiven(g => ({ ...g, [f.key]: e.target.value })); if (result && !allRight) setResult(null); }}
              placeholder={PLACEHOLDER[f.format]} />
            {result && template.answerFields.length > 1 && <span className={`field-v ${result[f.key] ? 'v-right' : 'v-wrong'}`}>{result[f.key] ? 'Correct' : 'Not quite'}</span>}
          </label>
        ))}
        <button type="submit" hidden />
      </form>
      <div className="actions">
        <button className="btn" onClick={submit} disabled={allRight}>Check answer</button>
        {!allRight && hints < template.hints.length && <button className="btn ghost" onClick={() => setHints(h => h + 1)}>{hints ? 'Another hint' : 'Hint'}</button>}
        {result && !allRight && !showSolution && <button className="btn ghost" onClick={() => setShowSolution(true)}>Show worked solution</button>}
        <button className="textlink" onClick={fresh}>{allRight ? 'Try another problem' : 'Skip to a new problem'}</button>
      </div>
      {template.hints.slice(0, hints).map((h, i) => <p key={i} className="hint">Hint {i + 1}: {h}</p>)}
      <p className="ex-verdict" role="status" aria-live="polite">
        {allRight ? <><b className="v-right">Correct.</b> {passed >= required ? 'Practice requirement met.' : `${required - passed} more to go.`}</>
          : result ? <><b className="v-wrong">Not quite.</b> {wrongN === 1 && template.answerFields.length > 1 ? 'One answer needs another look.' : 'Check your working against the question.'} Try again, take a hint, or open the worked solution.</> : null}
      </p>
      {showSolution && <div className="panel" style={{ marginTop: 16 }}><h3 style={{ marginBottom: 8 }}>Worked solution</h3><Markdown>{fill(template.solution, { ...inst.params, ...inst.key, ...formatted })}</Markdown></div>}
    </div>
  );
}
