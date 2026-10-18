import type { Chapter, Unit } from '../content/types';
import { useProgress } from '../store/progress';
import { unitUnlocked, chapterCompletion } from '../store/gates';
import { go } from '../App';
import logoUrl from '../assets/bric-thsti-logo.png';
import markUrl from '../assets/epicompass-mark.svg';

export function Sidebar({ units, chapters, active, route }: { units: Unit[]; chapters: Chapter[]; active?: number; route?: string }) {
  const p = useProgress();
  return (
    <aside className="sidebar">
      <a className="inst-logo" href="https://thsti.res.in" target="_blank" rel="noreferrer" title="BRIC-Translational Health Science and Technology Institute">
        <img src={logoUrl} alt="BRIC, a DBT organisation, and THSTI, Translational Health Science and Technology Institute" />
      </a>
      <button className="brand" onClick={() => go('#/')} style={{ background: 'none', border: 0, padding: 0, color: 'inherit' }}>
        <img className="mark" src={markUrl} alt="" width={28} height={28} /><h1>EpiCompass</h1><small>v0.1</small>
      </button>
      <div className="unit">
        <button className={`chap ${route === 'home' ? 'active' : ''}`} onClick={() => go('#/')}><span className="n">·</span><span className="t">Welcome: a note before you begin</span></button>
        <button className={`chap ${route === 'progress' ? 'active' : ''}`} onClick={() => go('#/progress')}><span className="n">·</span><span className="t">My progress and settings</span></button>
      </div>
      {units.map(u => {
        const unlocked = unitUnlocked(p, u, chapters);
        return (
          <div className="unit" key={u.id}>
            <div className="unit-head"><span>Unit {u.id} · {u.title}</span>{!unlocked && p.settings.hardGates && <span className="lock" title="Complete the previous unit's concepts to unlock">locked</span>}</div>
            {u.chapters.map(n => {
              const ch = chapters.find(c => c.number === n)!;
              const done = chapterCompletion(p, ch);
              const locked = !unlocked && p.settings.hardGates;
              return (
                <button key={n} className={`chap ${active === n ? 'active' : ''} ${locked ? 'locked' : ''}`} disabled={locked} onClick={() => go(`#/ch/${n}`)}>
                  <span className="n">{n}</span><span className="t">{ch.title}</span>
                  {ch.cards.length > 0 && <span className="bar" title={`${Math.round(done * 100)}% of cards complete`}><i style={{ width: `${done * 100}%` }} /></span>}
                </button>
              );
            })}
          </div>
        );
      })}
    </aside>
  );
}
