import { useState } from 'react';
import { useAccount, signIn, signUp, signOut, changePassword, checkJoinCode } from '../store/account';
import { cloudEnabled } from '../lib/supabase';
import { go } from '../App';

const PRIVACY = `EpiCompass stores your name, email address, the cohort you joined and your learning progress (which cards you have completed, your answers to check questions and practice problems, and the app's estimate of which concepts you have mastered). It is used to save your work across devices and to let your course instructor follow the class's progress and help where needed. It is kept in a database in Mumbai, visible only to you and your instructor, and is not used for research or shared with anyone else. You can ask your instructor to delete your account at any time.`;

export function AccountPage() {
  const a = useAccount();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [f, setF] = useState({ joinCode: '', fullName: '', email: '', password: '', consent: false });
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cohortHint, setCohortHint] = useState<string | null>(null);
  const [newPw, setNewPw] = useState('');
  const upd = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(s => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  if (!cloudEnabled) return <div><div className="title-row"><h1>Accounts</h1></div><p className="reading">Accounts are not switched on for this copy of the app; progress is saved in this browser only.</p></div>;
  if (!a.ready) return <div><div className="title-row"><h1>Account</h1></div><p className="hint">Checking your sign-in…</p></div>;

  if (a.session) {
    return (
      <div>
        <div className="title-row"><div><div className="crumbs">Account</div>
        <h1>{a.profile?.full_name ?? a.session.user.email}</h1></div></div>
        <div className="grid"><div className="s8">
        <div className="section">
          <h3>Your account</h3>
          <div className="prose">
            <p>Signed in as <b>{a.session.user.email}</b>{a.cohortName && <> · cohort <b>{a.cohortName}</b></>}{a.profile?.role === 'instructor' && <> · <b>instructor</b></>}.</p>
            <p>Your progress is saved to your account{a.sync === 'saved' && a.lastSaved ? <> (last saved {new Date(a.lastSaved).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })})</> : null}{a.sync === 'error' && <>; <b>the last save failed</b>, and the app will retry with your next answer</>}. Sign in with the same email and password on any device to continue where you left off.</p>
          </div>
          <div className="actions">
            {a.profile?.role === 'instructor' && <button className="btn" onClick={() => go('#/instructor')}>Open the class dashboard</button>}
            <button className="btn ghost" onClick={() => go('#/progress')}>My progress</button>
            <button className="btn ghost" onClick={() => signOut()}>Sign out</button>
          </div>
        </div>
        <div className="section">
          <h3>Change password</h3>
          <form className="row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }} onSubmit={async e => { e.preventDefault(); setBusy(true); const err = await changePassword(newPw); setBusy(false); setMsg(err ?? 'Password changed.'); if (!err) setNewPw(''); }}>
            <input id="acc-newpw" type="password" autoComplete="new-password" placeholder="New password (8+ characters)" value={newPw} onChange={e => setNewPw(e.target.value)} style={{ width: 260 }} aria-label="New password" />
            <button className="btn ghost" disabled={busy}>Change password</button>
          </form>
          {msg && <p className="hint">{msg}</p>}
        </div>
        </div></div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    const err = mode === 'in' ? await signIn(f.email, f.password) : await signUp(f);
    setBusy(false);
    if (err) setMsg(err); else go('#/');
  };

  return (
    <div className="grid"><div className="s6" style={{ maxWidth: 560 }}>
      <div className="title-row" style={{ marginBottom: 20 }}><div><div className="crumbs">Account</div>
      <h1>{mode === 'in' ? 'Sign in' : 'Create your account'}</h1>
      <p className="sub">{mode === 'in'
        ? 'Sign in to save your progress across devices.'
        : 'You need the join code your instructor gave the class. Use an email address you check, and a password you will remember.'}</p></div></div>
      <div className="segctl" role="tablist">
        <button className={mode === 'in' ? 'now' : ''} onClick={() => { setMode('in'); setMsg(null); }}>I have an account</button>
        <button className={mode === 'up' ? 'now' : ''} onClick={() => { setMode('up'); setMsg(null); }}>I'm new: join with a code</button>
      </div>
      <form className="section account-form" onSubmit={submit}>
        {mode === 'up' && <>
          <label htmlFor="acc-code">Join code</label>
          <input id="acc-code" type="text" autoCapitalize="characters" value={f.joinCode} onChange={upd('joinCode')}
            onBlur={async () => setCohortHint(f.joinCode.trim() ? (await checkJoinCode(f.joinCode)) ?? 'not recognised' : null)} required />
          {cohortHint && <p className="hint">{cohortHint === 'not recognised' ? 'This code was not recognised.' : `Cohort: ${cohortHint}`}</p>}
          <label htmlFor="acc-name">Full name</label>
          <input id="acc-name" type="text" autoComplete="name" value={f.fullName} onChange={upd('fullName')} required />
        </>}
        <label htmlFor="acc-email">Email</label>
        <input id="acc-email" type="email" autoComplete="email" value={f.email} onChange={upd('email')} required />
        <label htmlFor="acc-pw">Password{mode === 'up' && ' (8 or more characters)'}</label>
        <input id="acc-pw" type="password" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} value={f.password} onChange={upd('password')} required />
        {mode === 'up' && <>
          <p className="hint" style={{ marginTop: 10 }}>{PRIVACY}</p>
          <label className="row" style={{ justifyContent: 'flex-start' }}>
            <input id="acc-consent" type="checkbox" checked={f.consent} onChange={upd('consent')} /> I have read this and agree.
          </label>
        </>}
        <div className="actions">
          <button className="btn" disabled={busy}>{busy ? 'Please wait…' : mode === 'in' ? 'Sign in' : 'Create account'}</button>
          {mode === 'in' && <span className="hint">Forgotten your password? Ask your instructor to set a temporary one.</span>}
        </div>
        {msg && <p className="fb" role="alert" style={{ color: 'var(--negative)' }}>{msg}</p>}
      </form>
      <p className="hint">You can also use EpiCompass without an account; your progress then stays in this browser only and your instructor will not see it.</p>
    </div>
    <aside className="panel s6" style={{ marginTop: 92 }} aria-labelledby="h-why">
      <div className="panel-head"><h2 id="h-why">What an account does</h2></div>
      <dl className="kv">
        <div><dt>Progress</dt><dd>Saved across your devices</dd></div>
        <div><dt>Your instructor</dt><dd>Sees your class progress</dd></div>
        <div><dt>Questions</dt><dd>Ask on WhatsApp from any card</dd></div>
        <div><dt>Data held</dt><dd>Name, email, cohort, answers</dd></div>
        <div><dt>Stored in</dt><dd>Mumbai, India</dd></div>
      </dl>
    </aside>
    </div>
  );
}
