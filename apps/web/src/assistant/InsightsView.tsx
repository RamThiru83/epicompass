/** Dashboard: where students who opted in asked the study assistant for help. Totals only, never who asked. */
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { cardById, cardLabel } from '../content';
import { STEP_LABEL } from '../components/Path';

type Ask = { card_id: string; step: string | null; action: string; excerpt: string | null; cohort_id: string | null; user_id: string; created_at: string };
const DAYS = 90;

export function AskInsights({ cohort, consented }: { cohort: string; consented: number }) {
  const [rows, setRows] = useState<Ask[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    if (!supabase) return;
    const since = new Date(Date.now() - DAYS * 864e5).toISOString();
    supabase.from('assistant_asks').select('card_id, step, action, excerpt, cohort_id, user_id, created_at').gte('created_at', since).limit(5000)
      .then(({ data, error }) => { if (error) setErr(error.message); else setRows(data as Ask[]); });
  }, []);

  const byCard = useMemo(() => {
    const list = (rows ?? []).filter(r => cohort === 'all' || r.cohort_id === cohort);
    const m = new Map<string, { asks: number; students: Set<string>; steps: Map<string, number>; passages: Map<string, number> }>();
    for (const r of list) {
      const e = m.get(r.card_id) ?? { asks: 0, students: new Set(), steps: new Map(), passages: new Map() };
      e.asks++; e.students.add(r.user_id);
      if (r.step) e.steps.set(r.step, (e.steps.get(r.step) ?? 0) + 1);
      if (r.excerpt) { const k = r.excerpt.replace(/\s+/g, ' ').trim().slice(0, 160); e.passages.set(k, (e.passages.get(k) ?? 0) + 1); }
      m.set(r.card_id, e);
    }
    return [...m.entries()].sort((a, b) => b[1].students.size - a[1].students.size || b[1].asks - a[1].asks);
  }, [rows, cohort]);

  return (
    <div className="section">
      <h2 className='sec-h'>Where students ask the study assistant for help</h2>
      <p className="hint">Last {DAYS} days, from the {consented} student{consented === 1 ? '' : 's'} who have agreed to share this. Totals only: you do not see who asked, what they typed or what the assistant replied.</p>
      {err ? <p className="hint">{/assistant_asks|does not exist|schema cache/i.test(err) ? 'Not switched on yet: the database table for this has not been created.' : `Could not load: ${err}`}</p>
        : rows === null ? <p className="hint">Loading…</p>
        : byCard.length === 0 ? <p className="hint">Nothing yet.</p>
        : <div className="t2-wrap"><table className="t2 asks"><thead><tr><th style={{ textAlign: 'left' }}>Card</th><th>Students</th><th>Requests</th><th style={{ textAlign: 'left' }}>Passages asked about most</th></tr></thead>
          <tbody>{byCard.slice(0, 30).map(([id, e]) => {
            const card = cardById(id);
            const steps = [...e.steps.entries()].sort((a, b) => b[1] - a[1]).map(([s, n]) => `${STEP_LABEL[s as keyof typeof STEP_LABEL] ?? s} ${n}`).join(', ');
            const top = [...e.passages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
            return <tr key={id}>
              <td style={{ textAlign: 'left' }}>{card ? <a href={`#/card/${id}`}>{cardLabel(card)} · {card.title}</a> : id}{steps && <div className="hint">{steps}</div>}</td>
              <td>{e.students.size}</td><td>{e.asks}</td>
              <td style={{ textAlign: 'left' }}>{top.length ? <ul className="asks-top">{top.map(([p, n]) => <li key={p}>“{p}{p.length >= 160 ? '…' : ''}” <span className="hint">×{n}</span></li>)}</ul> : <span className="hint">Typed questions only</span>}</td>
            </tr>;
          })}</tbody></table></div>}
    </div>
  );
}
