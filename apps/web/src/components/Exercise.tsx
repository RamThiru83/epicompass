import { useMemo, useState } from 'react';
import type { ExerciseTemplate } from '../content/types';
import { generate, checkAnswer, formatValue } from '../exercises/engine';
import { Markdown, fill } from './Markdown';
import { exercisePassed, recordAttempt, useProgress } from '../store/progress';

export function Exercise({ cardId, template, required, onSatisfied }: { cardId: string; template: ExerciseTemplate; required: number; onSatisfied: () => void }) {
  const p = useProgress();
  const passed = p.cards[cardId]?.exercisesPassed ?? 0;
  const [seed, setSeed] = useState(() => Date.now() % 1_000_000);
  const inst = useMemo(() => generate(template, seed), [template, seed]);
  const [given, setGiven] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Record<string, boolean> | null>(null);
  const [hints, setHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

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

  return (
    <div>
      <Markdown>{inst.narrative}</Markdown>
      <div className="answers">
        {template.answerFields.map(f => (
          <label key={f.key}>{f.label}
            <input type="text" inputMode="decimal" className={result ? (result[f.key] ? 'good' : 'bad') : ''} value={given[f.key] ?? ''} onChange={e => setGiven(g => ({ ...g, [f.key]: e.target.value }))} placeholder={f.format === 'pct' ? '%' : ''} />
          </label>
        ))}
      </div>
      <div className="actions">
        <button className="btn" onClick={submit} disabled={!!result && Object.values(result).every(Boolean)}>Check answer</button>
        <button className="btn ghost" onClick={fresh}>New problem</button>
        {hints < template.hints.length && <button className="btn ghost" onClick={() => setHints(h => h + 1)}>Hint</button>}
        {result && !Object.values(result).every(Boolean) && <button className="btn ghost" onClick={() => setShowSolution(true)}>Show worked solution</button>}
      </div>
      {template.hints.slice(0, hints).map((h, i) => <p key={i} className="hint">Hint {i + 1}: {h}</p>)}
      {result && Object.values(result).every(Boolean) && <p className="reached">Correct. {passed + 1 >= required ? 'Practice requirement met.' : `${required - passed - 1} more to go.`}</p>}
      {showSolution && <div className="panel" style={{ marginTop: 16 }}><h3 style={{ marginBottom: 8 }}>Worked solution</h3><Markdown>{fill(template.solution, { ...inst.params, ...inst.key, ...formatted })}</Markdown></div>}
    </div>
  );
}
