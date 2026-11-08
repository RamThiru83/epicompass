/** Dashboard: where students who opted in asked the study assistant for help. Totals only, never who asked. */
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { cardById, cardLabel } from '../content';
import { STEP_LABEL } from '../components/Path';

type Ask = { card_id: string; step: string | null; action: string; excerpt: string | null; cohort_id: string | null; user_id: string; created_at: string };
const DAYS = 90;

type KennyCohort = { id: string; name: string; kenny: boolean; active: boolean };
type KennySettings = { enabled: boolean; daily_limit: number; monthly_budget: number; updated_at?: string };

/** Central controls for Kenny on the course's Claude API credit: on/off for every student, daily limit, budget. */
export function KennyControls() {
  const [s, setS] = useState<KennySettings | null>(null);
  const [draft, setDraft] = useState<{ daily: string; budget: string }>({ daily: '', budget: '' });
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cohorts, setCohorts] = useState<KennyCohort[] | null>(null);
  useEffect(() => {
    supabase?.from('cohorts').select('id, name, kenny, active').order('created_at').then(({ data, error }) => { if (!error && data) setCohorts(data as KennyCohort[]); });
    supabase?.from('kenny_settings').select('enabled, daily_limit, monthly_budget, updated_at').eq('id', 1).maybeSingle()
      .then(({ data, error }) => {
        if (error) { setMsg(/kenny_settings|does not exist|schema cache/i.test(error.message) ? 'Not available yet: the settings table has not been created.' : error.message); return; }
        if (data) { setS(data as KennySettings); setDraft({ daily: String(data.daily_limit), budget: String(data.monthly_budget) }); }
      });
  }, []);
  async function save(patch: Partial<KennySettings>) {
    if (!supabase) return;
    setBusy(true); setMsg(null);
    const { data, error } = await supabase.from('kenny_settings').update(patch).eq('id', 1).select('enabled, daily_limit, monthly_budget, updated_at').maybeSingle();
    setBusy(false);
    if (error || !data) { setMsg(`Could not save: ${error?.message ?? 'not permitted'}`); return; }
    setS(data as KennySettings); setMsg('Saved. Students’ apps pick this up the next time they open Kenny.');
  }
  async function setCohort(id: string, kenny: boolean) {
    if (!supabase) return;
    setBusy(true); setMsg(null);
    const { error } = await supabase.from('cohorts').update({ kenny }).eq('id', id);
    setBusy(false);
    if (error) { setMsg(`Could not save: ${error.message}`); return; }
    setCohorts(cs => cs?.map(c => (c.id === id ? { ...c, kenny } : c)) ?? null);
    setMsg('Saved. Students’ apps pick this up the next time they sign in or reload.');
  }
  if (!s) return msg ? <div className="section"><h2 className="sec-h">Kenny on the course account</h2><p className="hint">{msg}</p></div> : null;
  const daily = Number(draft.daily), budget = Number(draft.budget);
  const valid = Number.isInteger(daily) && daily >= 1 && daily <= 1000 && budget >= 0 && budget <= 500;
  return (
    <div className="section">
      <h2 className="sec-h">Kenny on the course account</h2>
      <label className="toggle-row"><input type="checkbox" checked={s.enabled} disabled={busy} onChange={e => save({ enabled: e.target.checked })} />
        <span><b>{s.enabled ? 'On' : 'Off for all students'}</b>. When off, no student can use the course’s Claude credit; students who have connected their own OpenRouter account can still use Kenny through it.</span></label>
      {cohorts && <fieldset className="kenny-cohorts" disabled={busy || !s.enabled} style={{ border: 0, padding: 0, margin: '10px 0 0' }}>
        <legend className="hint" style={{ padding: 0, marginBottom: 6 }}>Course codes whose students may use it (instructors always can):</legend>
        {cohorts.map(c => <label key={c.id} className="toggle-row"><input type="checkbox" checked={c.kenny} onChange={e => setCohort(c.id, e.target.checked)} />
          <span>{c.name}{!c.active && <span className="hint"> (code closed)</span>}</span></label>)}
      </fieldset>}
      <form className="row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap', gap: 12, marginTop: 8 }} onSubmit={e => { e.preventDefault(); if (valid) save({ daily_limit: daily, monthly_budget: budget }); }}>
        <label>Questions per student per day <input type="number" min={1} max={1000} value={draft.daily} onChange={e => setDraft({ ...draft, daily: e.target.value })} style={{ width: 90 }} /></label>
        <label>Monthly budget, US$ <input type="number" min={0} max={500} step={10} value={draft.budget} onChange={e => setDraft({ ...draft, budget: e.target.value })} style={{ width: 90 }} /></label>
        <button className="btn ghost" disabled={busy || !valid || (daily === s.daily_limit && budget === Number(s.monthly_budget))}>Save limits</button>
      </form>
      <p className="hint">Kenny stops using the course credit for the rest of the month once the budget is reached (the Team plan gives up to US$500 a month, shared with any other use of the THSTI Console organisation).{msg && <> {msg}</>}</p>
    </div>
  );
}

export function AskInsights({ cohort, consented }: { cohort: string; consented: number }) {
  const [rows, setRows] = useState<Ask[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [use, setUse] = useState<{ questions: number; students: number; cost_usd: number } | null>(null);
  useEffect(() => { supabase?.rpc('kenny_month_summary').then(({ data }) => { if (Array.isArray(data) && data[0]) setUse(data[0]); }); }, []);
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
      <h2 className='sec-h'>Where students ask Kenny for help</h2>
      {use && <p className="hint">Kenny on the course account this month: <b>{Number(use.questions).toLocaleString('en-GB')}</b> questions from {use.students} student{Number(use.students) === 1 ? '' : 's'}, costing US${Number(use.cost_usd).toFixed(2)} of the course’s Claude API credit.</p>}
      <p className="hint">Last {DAYS} days, from the {consented} student{consented === 1 ? '' : 's'} who have agreed to share this. Totals only: you do not see who asked, what they typed or what Kenny replied.</p>
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
