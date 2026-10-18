import { WELCOME } from '../content/welcome';
import { CHAPTERS } from '../content';
import { Markdown } from '../components/Markdown';
import { useProgress } from '../store/progress';
import { chapterCompletion } from '../store/gates';
import { editUrl } from '../config';
import { go } from '../App';

export function WelcomePage() {
  const p = useProgress();
  const started = Object.keys(p.cards).length > 0;
  const next = CHAPTERS.find(c => c.cards.length && chapterCompletion(p, c) < 1);
  return (
    <div className="welcome">
      <div className="crumbs">Epidemiology 101 · MSc Clinical Research · BRIC-THSTI</div>
      <h2>{WELCOME.title}</h2>
      {p.settings.editor && <div className="hint" style={{ marginTop: 4 }}>Instructor: <a href={editUrl('apps/web/src/content/welcome.ts')} target="_blank" rel="noreferrer">edit this page on GitHub</a></div>}
      <div className="section letter">
        <Markdown>{WELCOME.intro}</Markdown>
        <Markdown>{WELCOME.whatIsEpi}</Markdown>
        <Markdown>{WELCOME.whyItMatters}</Markdown>
        <Markdown>{WELCOME.theBook}</Markdown>
        <Markdown>{WELCOME.howToUse}</Markdown>
        <div className="actions" style={{ marginTop: 18 }}>
          {next && <button className="btn" onClick={() => go(`#/ch/${next.number}`)}>{started ? `Continue: Chapter ${next.number}` : 'Start with Chapter 1'}</button>}
          <button className="btn ghost" onClick={() => go('#/progress')}>My progress and settings</button>
        </div>
      </div>
    </div>
  );
}
