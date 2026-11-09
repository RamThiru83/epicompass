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
import { useTheme } from '../store/theme';

const Sun = () => <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden><circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.6" /><g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M10 1.8v2.1M10 16.1v2.1M1.8 10h2.1M16.1 10h2.1M4.2 4.2l1.5 1.5M14.3 14.3l1.5 1.5M4.2 15.8l1.5-1.5M14.3 5.7l1.5-1.5" /></g></svg>;
const Moon = () => <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden><path d="M16.5 12.6A7 7 0 0 1 7.4 3.5a7 7 0 1 0 9.1 9.1z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;

/** Open-plane sidebar on the page ground. On tablets and phones it is hidden behind the top bar's Menu
 *  button and opens as a full-screen sheet (`open`). */
export function Sidebar({ units, chapters, active, route, open }: { units: Unit[]; chapters: Chapter[]; active?: number; route?: string; open?: boolean }) {
  const p = useProgress();
  const acc = useAccount();
  const ed = useEditState();
  const th = useTheme();
  const next = th.shown === 'dark' ? 'light' : 'dark';
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} id="site-nav" aria-label="Course navigation">
      <div className="brandrow">
        <button className="brand" onClick={() => go('#/')}>
          <img className="mark" src={markUrl} alt="" width={26} height={26} />
          <span><span className="name">EpiCompass</span><small>Epidemiology 101</small></span>
        </button>
        <button type="button" className="theme-toggle" onClick={() => th.set(next)} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}>
          {th.shown === 'dark' ? <Sun /> : <Moon />}
        </button>
      </div>
      <div className="course-by">
        <a className="inst-logo" href="https://thsti.res.in" target="_blank" rel="noreferrer" title="BRIC-Translational Health Science and Technology Institute">
          <img src={logoUrl} alt="BRIC, a DBT organisation, and THSTI, Translational Health Science and Technology Institute" />
        </a>
      </div>
      <nav className="nav-group">
        <button className={`chap plain ${route === 'home' ? 'active' : ''}`} onClick={() => go('#/')} aria-current={route === 'home' ? 'page' : undefined}><span className="t">Home and welcome letter</span></button>
        <button className={`chap plain ${route === 'progress' ? 'active' : ''}`} onClick={() => go('#/progress')} aria-current={route === 'progress' ? 'page' : undefined}><span className="t">My progress</span></button>
        <button className={`chap plain ${route === 'settings' ? 'active' : ''}`} onClick={() => go('#/settings')} aria-current={route === 'settings' ? 'page' : undefined}><span className="t">Settings</span></button>
        <button className="chap plain" onClick={openTutor}><span className="t">Ask your instructor</span></button>
        {cloudEnabled && <button className={`chap plain ${route === 'account' ? 'active' : ''}`} onClick={() => go('#/account')} aria-current={route === 'account' ? 'page' : undefined}>
          <span className="t">{acc.session ? (acc.profile?.full_name ?? 'My account') : 'Sign in or join'}</span>
          {acc.session && <span className={`sync ${acc.sync}`} title={acc.sync === 'error' ? 'Last save failed' : acc.sync === 'saving' ? 'Saving…' : 'Saved to your account'} />}
        </button>}
        {acc.profile?.role === 'instructor' && <button className={`chap plain ${route === 'instructor' ? 'active' : ''}`} onClick={() => go('#/instructor')} aria-current={route === 'instructor' ? 'page' : undefined}><span className="t">Class dashboard</span></button>}
      </nav>
      {acc.profile?.role === 'instructor' && <div className="tools" role="group" aria-label="Instructor tools">
        <label className="toggle-row"><input type="checkbox" checked={ed.edit} onChange={e => setEditMode(e.target.checked)} /><span>Edit course text</span></label>
      </div>}
      {units.filter(u => u.chapters.some(n => chapters.find(c => c.number === n)?.cards.length)).map(u => {
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
