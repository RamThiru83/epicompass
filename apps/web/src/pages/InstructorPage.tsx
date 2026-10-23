/**
 * Class dashboard (instructor only; row-level security returns other students' rows only to the instructor).
 * Everything is computed in the browser from each student's progress document.
 */
import { Fragment, useEffect, useMemo, useState } from 'react';
import { StudentMastery, CohortConcepts, MasteryLegend } from '../components/MasteryViews';
import { supabase } from '../lib/supabase';
import { useAccount } from '../store/account';
import { normalise, dueConcepts, type Progress } from '../store/progress';
import { CHAPTERS, concepts, cardById } from '../content';
import { coreCards } from '../content/types';
import { MASTERY_THRESHOLD } from '@epicompass/epi-core';

interface Row { id: string; full_name: string; email: string; cohort_id: string | null; role: string; created_at: string; progress: Progress; updated_at?: string }
interface Cohort { id: string; name: string; join_code: string; active: boolean }

const ALL_CARDS = CHAPTERS.flatMap(c => coreCards(c));
const TAUGHT = concepts.filter(c => ALL_CARDS.some(k => k.concepts.includes(c.id)));
/** Join codes: upper case, no spaces ("yi - 2026" becomes "YI-2026"). */
const cleanCode = (s: string) => s.toUpperCase().replace(/\s+/g, '');
const ago = (iso?: string) => {
  if (!iso) return 'never';
  const d = (Date.now() - new Date(iso).getTime()) / 86400000;
  return d < 1 / 24 ? 'just now' : d < 1 ? `${Math.round(d * 24)} h ago` : `${Math.round(d)} d ago`;
};

export function InstructorPage() {
  const a = useAccount();
  const [rows, setRows] = useState<Row[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [cohort, setCohort] = useState<string>('all');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reset, setReset] = useState<{ id: string; pw: string; msg?: string } | null>(null);
  const [newCohort, setNewCohort] = useState({ name: '', code: '' });
  const [edit, setEdit] = useState<{ id: string; name: string; code: string; confirmDelete?: boolean } | null>(null);
  const [cohortMsg, setCohortMsg] = useState<string | null>(null);
  const [openStudent, setOpenStudent] = useState<string | null>(null);
  const [wa, setWa] = useState(''); const [waMsg, setWaMsg] = useState<string | null>(null);

  const load = async () => {
    if (!supabase) return;
    setLoading(true);
    const [{ data: profs, error: e1 }, { data: prog, error: e2 }, { data: cs, error: e3 }] = await Promise.all([
      supabase.from('profiles').select('id, full_name, email, cohort_id, role, created_at'),
      supabase.from('progress').select('user_id, data, updated_at'),
      supabase.from('cohorts').select('id, name, join_code, active').order('created_at'),
    ]);
    const e = e1 || e2 || e3;
    if (e) { setErr(e.message); setLoading(false); return; }
    const byId = new Map((prog ?? []).map(p => [p.user_id as string, p]));
    setRows((profs ?? []).filter(p => p.role === 'student').map(p => ({ ...(p as Row), progress: normalise(byId.get(p.id)?.data), updated_at: byId.get(p.id)?.updated_at })));
    setCohorts((cs ?? []) as Cohort[]);
    const { data: w } = await supabase.from('app_settings').select('value').eq('key', 'whatsapp').maybeSingle();
    setWa((w?.value as string) ?? '');
    setLoading(false);
  };
  useEffect(() => { if (a.profile?.role === 'instructor') load(); }, [a.profile?.role]);

  const shown = useMemo(() => rows.filter(r => cohort === 'all' || r.cohort_id === cohort).sort((x, y) => x.full_name.localeCompare(y.full_name)), [rows, cohort]);
  // Students grouped by cohort, each cohort shown separately (empty cohorts are listed only when selected).
  const groups = useMemo(() => {
    const list = cohort === 'all' ? cohorts : cohorts.filter(c => c.id === cohort);
    const gs = list.map(c => ({ id: c.id, name: c.name, code: c.join_code, students: shown.filter(r => r.cohort_id === c.id) }))
      .filter(g => g.students.length || cohort !== 'all');
    const orphans = shown.filter(r => !cohorts.some(c => c.id === r.cohort_id));
    if (orphans.length && cohort === 'all') gs.push({ id: 'none', name: 'No cohort', code: '', students: orphans });
    return gs;
  }, [shown, cohorts, cohort]);
  const stats = (p: Progress) => ({
    cards: ALL_CARDS.filter(c => p.cards[c.id]?.completedAt).length,
    mastered: TAUGHT.filter(c => (p.mastery[c.id]?.pKnown ?? 0) >= MASTERY_THRESHOLD).length,
    due: dueConcepts(p).length,
    lastActive: Math.max(0, ...p.attempts.map(t => t.t), ...Object.values(p.cards).map(c => c.completedAt ?? 0)),
  });

  // Items most often answered wrongly at the first attempt (per student, first attempt only).
  const hardest = useMemo(() => {
    const agg = new Map<string, { n: number; wrong: number; cardId: string }>();
    for (const r of shown) {
      const first = new Map<string, boolean>();
      for (const t of r.progress.attempts) if (!first.has(t.itemId) && !t.itemId.includes(':')) first.set(t.itemId, t.correct);
      for (const [id, ok] of first) {
        const card = r.progress.attempts.find(t => t.itemId === id)!.cardId;
        const g = agg.get(id) ?? { n: 0, wrong: 0, cardId: card };
        g.n++; if (!ok) g.wrong++; agg.set(id, g);
      }
    }
    return [...agg.entries()].filter(([, g]) => g.n >= 2).map(([id, g]) => ({ id, ...g, rate: g.wrong / g.n })).sort((x, y) => y.rate - x.rate).slice(0, 8);
  }, [shown]);

  const questionText = (itemId: string, cardId: string) => cardById(cardId)?.checks.find(c => c.id === itemId)?.prompt.replace(/[*$`\[\]]/g, '').slice(0, 140) ?? itemId;

  const csv = () => {
    const head = ['name', 'email', 'cohort', 'joined', 'last_saved', 'cards_completed', 'cards_total', 'concepts_mastered', 'concepts_total', 'revisits_due', ...TAUGHT.map(c => `p_known_${c.id}`)];
    const lines = shown.map(r => {
      const s = stats(r.progress);
      return [r.full_name, r.email, cohorts.find(c => c.id === r.cohort_id)?.name ?? '', r.created_at.slice(0, 10), r.updated_at?.slice(0, 16) ?? '', s.cards, ALL_CARDS.length, s.mastered, TAUGHT.length, s.due,
        ...TAUGHT.map(c => (r.progress.mastery[c.id]?.pKnown ?? '').toString().slice(0, 5))];
    });
    const body = [head, ...lines].map(l => l.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([body], { type: 'text/csv' }));
    const el = document.createElement('a'); el.href = url; el.download = `epicompass-progress-${new Date().toISOString().slice(0, 10)}.csv`; el.click(); URL.revokeObjectURL(url);
  };

  if (!a.ready) return <p className="hint">Loading…</p>;
  if (a.profile?.role !== 'instructor') return <div><div className="title-row"><h1>Class dashboard</h1></div><p className="reading">This page is for the course instructor.</p></div>;

  return (
    <div>
      <div className="title-row"><div><div className="crumbs">Instructor</div>
      <h1>Class dashboard</h1></div>
      <div className="actions" style={{ marginTop: 0 }}>
        <select id="ins-cohort" aria-label="Cohort" style={{ height: 36 }} value={cohort} onChange={e => setCohort(e.target.value)}>
          <option value="all">All cohorts</option>
          {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn ghost" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
        <button className="btn ghost" onClick={csv} disabled={!shown.length}>Download CSV</button>
      </div></div>
      {err && <p className="fb" style={{ color: 'var(--negative)' }}>{err}</p>}

      {!shown.length && <div className="section"><p className="hint">No students yet. Share a join code (below); students appear here once they create an account.</p></div>}

      {groups.map(g => {
        const cards = g.students.map(r => stats(r.progress).cards).sort((x, y) => x - y);
        return (
        <div key={g.id} className="section table-wrap">
          <h3>{g.name} <span className="hint" style={{ fontWeight: 400 }}>{g.code && <>· code <span className="mono">{g.code}</span> </>}· {g.students.length} student{g.students.length === 1 ? '' : 's'}</span></h3>
          <div className="stats" style={{ marginTop: 6 }}>
            <div className="stat ok"><div className="k">Active in the last 7 days</div><div className="v">{g.students.filter(r => r.updated_at && Date.now() - new Date(r.updated_at).getTime() < 7 * 86400000).length}</div></div>
            <div className="stat"><div className="k">Median cards completed</div><div className="v">{cards.length ? cards[Math.floor((cards.length - 1) / 2)] : 0} / {ALL_CARDS.length}</div></div>
          </div>
          <p className="hint">Click a student's name to see their concept mastery.</p>
          <table className="roster">
            <thead><tr><th style={{ textAlign: 'left' }}>Name</th><th style={{ textAlign: 'left' }}>Email</th><th>Cards</th><th>Mastered</th><th>Revisits due</th><th>Last saved</th><th></th></tr></thead>
            <tbody>{g.students.map(r => { const s = stats(r.progress); const open = openStudent === r.id; return (<Fragment key={r.id}>
              <tr className={open ? 'open' : ''}>
                <td style={{ textAlign: 'left' }}><button className="linkish" aria-expanded={open} onClick={() => setOpenStudent(open ? null : r.id)}>{open ? '▾' : '▸'} {r.full_name}</button></td>
                <td style={{ textAlign: 'left' }}>{r.email}</td>
                <td><span className="bar" style={{ display: 'inline-block', width: 60, marginRight: 6 }}><i style={{ width: `${100 * s.cards / ALL_CARDS.length}%` }} /></span>{s.cards}</td>
                <td>{s.mastered} / {TAUGHT.length}</td><td>{s.due}</td><td>{ago(r.updated_at)}</td>
                <td>{reset?.id === r.id
                  ? <form onSubmit={async e => { e.preventDefault(); const { error } = await supabase!.rpc('instructor_set_password', { target: r.id, new_password: reset.pw }); setReset({ ...reset, msg: error ? error.message : `Done. Give ${r.full_name.split(' ')[0]} this temporary password and ask them to change it under Account.` }); }} style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <input aria-label="Temporary password" type="text" value={reset.pw} onChange={e => setReset({ ...reset, pw: e.target.value })} style={{ width: 130 }} />
                      <button className="btn ghost">Set</button><button type="button" className="btn ghost" onClick={() => setReset(null)}>Cancel</button>
                      {reset.msg && <span className="hint" style={{ flexBasis: '100%' }}>{reset.msg}</span>}
                    </form>
                  : <button className="btn ghost" onClick={() => setReset({ id: r.id, pw: `epi-${Math.random().toString(36).slice(2, 8)}` })}>Reset password</button>}</td>
              </tr>
              {open && <tr className="detail"><td colSpan={7} style={{ textAlign: 'left' }}>
                <MasteryLegend />
                <StudentMastery name={r.full_name} progress={r.progress} concepts={TAUGHT} />
              </td></tr>}
            </Fragment>); })}</tbody>
          </table>
          <details className="mv-details">
            <summary>Concept mastery across {g.name}</summary>
            <p className="hint">For each concept, how many students have mastered it, are still learning it, or have not started it.</p>
            <CohortConcepts students={g.students} concepts={TAUGHT} />
          </details>
        </div>);
      })}

      {hardest.length > 0 && <div className="section">
        <h3>Questions the class finds hardest</h3>
        <p className="hint">Share of students who got each check question wrong at their first attempt (questions answered by at least two students).</p>
        <table className="t2"><thead><tr><th style={{ textAlign: 'left' }}>Question</th><th>Card</th><th>Wrong first time</th></tr></thead>
          <tbody>{hardest.map(h => <tr key={h.id}><td style={{ textAlign: 'left' }}>{questionText(h.id, h.cardId)}</td><td>{cardById(h.cardId)?.title ?? h.cardId}</td><td>{h.wrong} of {h.n} ({Math.round(100 * h.rate)}%)</td></tr>)}</tbody></table>
      </div>}

      <div className="section">
        <h3>WhatsApp for student questions</h3>
        <p className="hint">The "Ask your instructor" button opens WhatsApp to this number with the student's name, card and question filled in. Only signed-in students see it; it is not in the public code. Include the country code, e.g. +91 98xxx xxxxx. Leave empty to switch the button off.</p>
        <form className="actions" onSubmit={async e => {
          e.preventDefault(); setWaMsg(null);
          const digits = wa.replace(/\D/g, '');
          if (digits && (digits.length < 10 || digits.length > 15)) { setWaMsg('Enter the full number with country code.'); return; }
          const { error } = digits
            ? await supabase!.from('app_settings').upsert({ key: 'whatsapp', value: '+' + digits, updated_at: new Date().toISOString() })
            : await supabase!.from('app_settings').delete().eq('key', 'whatsapp');
          setWaMsg(error ? error.message : digits ? 'Saved. Students will see the button on their next visit.' : 'Removed.');
          if (!error && digits) setWa('+' + digits);
        }}>
          <input id="ins-wa" type="tel" aria-label="WhatsApp number" placeholder="+91 …" value={wa} onChange={e => setWa(e.target.value)} style={{ width: 200 }} />
          <button className="btn ghost">Save</button>
          {wa.replace(/\D/g, '').length >= 10 && <a className="btn ghost" href={`https://wa.me/${wa.replace(/\D/g, '')}`} target="_blank" rel="noopener">Test link</a>}
        </form>
        {waMsg && <p className="hint">{waMsg}</p>}
      </div>

      <div className="section">
        <h3>Cohorts and join codes</h3>
        <table className="t2"><thead><tr><th style={{ textAlign: 'left' }}>Cohort</th><th>Join code</th><th>Students</th><th>Accepting sign-ups</th><th></th></tr></thead>
          <tbody>{cohorts.map(c => {
            const members = rows.filter(r => r.cohort_id === c.id).length;
            const editing = edit?.id === c.id;
            return <tr key={c.id}>
              {editing ? <>
                <td style={{ textAlign: 'left' }}><input aria-label="Cohort name" value={edit!.name} onChange={e => setEdit({ ...edit!, name: e.target.value })} style={{ width: 230 }} /></td>
                <td><input aria-label="Join code" value={edit!.code} onChange={e => setEdit({ ...edit!, code: e.target.value })} style={{ width: 120 }} /></td>
              </> : <>
                <td style={{ textAlign: 'left' }}>{c.name}</td><td className="mono">{c.join_code}</td>
              </>}
              <td>{members}</td>
              <td><label><input type="checkbox" checked={c.active} onChange={async e => { await supabase!.from('cohorts').update({ active: e.target.checked }).eq('id', c.id); load(); }} /> {c.active ? 'open' : 'closed'}</label></td>
              <td style={{ whiteSpace: 'nowrap' }}>{editing ? <>
                  <button className="btn ghost" onClick={async () => {
                    const name = edit!.name.trim(), code = cleanCode(edit!.code);
                    if (!name || !code) { setCohortMsg('Name and join code are both needed.'); return; }
                    const { error } = await supabase!.from('cohorts').update({ name, join_code: code }).eq('id', c.id);
                    if (error) setCohortMsg(error.code === '23505' ? `Another cohort already uses ${code}.` : error.message);
                    else { setEdit(null); setCohortMsg(code !== c.join_code ? `Saved. The old code ${c.join_code} no longer works; students who already joined are unaffected.` : 'Saved.'); load(); }
                  }}>Save</button>{' '}
                  <button className="btn ghost" onClick={() => setEdit(null)}>Cancel</button>
                </> : edit?.confirmDelete === undefined || edit.id !== c.id ? <>
                  <button className="btn ghost" onClick={() => { setCohortMsg(null); setEdit({ id: c.id, name: c.name, code: c.join_code }); }}>Edit</button>{' '}
                  {members === 0 && <button className="btn ghost" onClick={() => setEdit({ id: c.id, name: c.name, code: c.join_code, confirmDelete: true })}>Delete</button>}
                </> : null}
                {edit?.id === c.id && edit.confirmDelete && <span>
                  Delete {c.name}?{' '}
                  <button className="btn ghost" onClick={async () => { const { error } = await supabase!.from('cohorts').delete().eq('id', c.id); setEdit(null); setCohortMsg(error ? error.message : 'Cohort deleted.'); load(); }}>Yes, delete</button>{' '}
                  <button className="btn ghost" onClick={() => setEdit(null)}>Cancel</button>
                </span>}
              </td>
            </tr>;
          })}</tbody></table>
        {cohortMsg && <p className="hint">{cohortMsg}</p>}
        <form className="actions" onSubmit={async e => { e.preventDefault(); const name = newCohort.name.trim(), code = cleanCode(newCohort.code); if (!name || !code) return; const { error } = await supabase!.from('cohorts').insert({ name, join_code: code }); if (error) setCohortMsg(error.code === '23505' ? `Another cohort already uses ${code}.` : error.message); else { setNewCohort({ name: '', code: '' }); setCohortMsg(`Added. Students can join with ${code}.`); load(); } }}>
          <input aria-label="New cohort name" placeholder="New cohort name" value={newCohort.name} onChange={e => setNewCohort({ ...newCohort, name: e.target.value })} style={{ width: 240 }} />
          <input aria-label="Join code" placeholder="Join code, e.g. YI-2026" value={newCohort.code} onChange={e => setNewCohort({ ...newCohort, code: e.target.value })} style={{ width: 170 }} />
          <button className="btn ghost">Add cohort</button>
        </form>
        <p className="hint">Join codes are saved in capitals without spaces. Close a cohort's code once everyone has joined, so it cannot be passed on. A cohort can be deleted only while it has no students.</p>
      </div>
    </div>
  );
}
