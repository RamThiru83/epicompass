import type { Chapter, Unit } from '../content/types';
import { useProgress } from '../store/progress';
import { unitUnlocked, chapterCompletion } from '../store/gates';
import { go } from '../App';
import { useAccount } from '../store/account';
import { cloudEnabled } from '../lib/supabase';
import logoUrl from '../assets/bric-thsti-logo.png';
import markUrl from '../assets/epicompass-mark.svg';
import { openTutor } from './TutorPanel';
import { useEditState, setEditMode } from '../store/overrides';

/** Open-plane sidebar on the page ground. On tablets and phones it is hidden behind the top bar's Menu
 *  button and opens as a full-screen sheet (`open`). */
export function Sidebar({ units, chapters, active, route, open }: { units: Unit[]; chapters: Chapter[]; active?: number; route?: string; open?: boolean }) {
  const p = useProgress();
  const acc = useAccount();
  const ed = useEditState();
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} id="site-nav" aria-label="Course navigation">
      <button className="brand" onClick={() => go('#/')}>
        <img className="mark" src={markUrl} alt="" width={26} height={26} />
        <span><span className="name">EpiCompass</span><small>Epidemiology 101</small></span>
      </button>
      <div className="course-by">
        <a className="inst-logo" href="https://thsti.res.in" target="_blank" rel="noreferrer" title="BRIC-Translational Health Science and Technology Institute">
          <img src={logoUrl} alt="BRIC, a DBT organisation, and THSTI, Translational Health Science and Technology Institute" />
        </a>
        <p className="instructor"><span>Course instructor</span>Dr Ramachandran Thiruvengadam, MD, PhD</p>
        <p className="prog">Maternal and Child Health Programme, BRIC-THSTI, Faridabad</p>
      </div>
      <button className="btn ghost ask" onClick={openTutor}>Ask your instructor</button>
      <nav className="nav-group">
        <button className={`chap plain ${route === 'home' ? 'active' : ''}`} onClick={() => go('#/')} aria-current={route === 'home' ? 'page' : undefined}><span className="t">Home and welcome letter</span></button>
        <button className={`chap plain ${route === 'progress' ? 'active' : ''}`} onClick={() => go('#/progress')} aria-current={route === 'progress' ? 'page' : undefined}><span className="t">My progress and settings</span></button>
        {cloudEnabled && <button className={`chap plain ${route === 'account' ? 'active' : ''}`} onClick={() => go('#/account')} aria-current={route === 'account' ? 'page' : undefined}>
          <span className="t">{acc.session ? (acc.profile?.full_name ?? 'My account') : 'Sign in or join'}</span>
          {acc.session && <span className={`sync ${acc.sync}`} title={acc.sync === 'error' ? 'Last save failed' : acc.sync === 'saving' ? 'Saving…' : 'Saved to your account'} />}
        </button>}
        {acc.profile?.role === 'instructor' && <button className={`chap plain ${route === 'instructor' ? 'active' : ''}`} onClick={() => go('#/instructor')} aria-current={route === 'instructor' ? 'page' : undefined}><span className="t">Class dashboard</span></button>}
      </nav>
      {acc.profile?.role === 'instructor' && <div className="tools" role="group" aria-label="Instructor tools">
        <label className="toggle-row"><input type="checkbox" checked={ed.edit} onChange={e => setEditMode(e.target.checked)} /><span>Edit course text</span></label>
      </div>}
      {units.map(u => {
        const unlocked = unitUnlocked(p, u, chapters);
        return (
          <nav className="nav-group" key={u.id} aria-label={`Unit ${u.id}: ${u.title}`}>
            <div className="unit-head"><span>Unit {u.id}: {u.title}</span>{!unlocked && p.settings.hardGates && <span className="lock" title="Complete the previous unit's concepts to unlock">Locked</span>}</div>
            {u.chapters.map(n => {
              const ch = chapters.find(c => c.number === n)!;
              const done = chapterCompletion(p, ch);
              const locked = !unlocked && p.settings.hardGates;
              return (
                <button key={n} className={`chap ${active === n ? 'active' : ''} ${locked ? 'locked' : ''} ${ch.cards.length ? '' : 'soon'}`} disabled={locked} onClick={() => go(`#/ch/${n}`)} aria-current={active === n ? 'page' : undefined}>
                  <span className="n">{n}</span><span className="t">{ch.title}</span>
                  {ch.cards.length > 0 ? <span className="bar" role="img" aria-label={`${Math.round(done * 100)}% of cards complete`} title={`${Math.round(done * 100)}% of cards complete`}><i style={{ width: `${done * 100}%` }} /></span> : <span className="soon-tag">Soon</span>}
                </button>
              );
            })}
          </nav>
        );
      })}
    </aside>
  );
}
