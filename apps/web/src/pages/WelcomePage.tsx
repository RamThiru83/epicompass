import { WELCOME } from '../content/welcome';
import { CHAPTERS, UNITS, concepts, conceptById, cardLabel } from '../content';
import { coreCards } from '../content/types';
import { EditableMd } from '../components/EditableMd';
import { Path, STEP_LABEL, stepsOf } from '../components/Path';
import { useProgress, dueConcepts, isMastered } from '../store/progress';
import { useAccount } from '../store/account';
import { useEditing } from '../store/overrides';
import { go } from '../App';

function partOfDay(d = new Date()) {
  const h = d.getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}
/** First name for the greeting, skipping titles ("Dr Ramachandran …" greets "Ramachandran"). */
function firstName(full?: string | null) {
  const parts = (full ?? '').trim().split(/\s+/).filter(w => !/^(dr|prof|professor|mr|mrs|ms|miss|mx|sir)\.?$/i.test(w));
  return parts[0] ?? '';
}

const HOW = [
  ['Hook', 'A short case from a ward, a clinic or history. Form a view before you read on.'],
  ['Explore', 'An interactive model. Move the sliders until you reach the target.'],
  ['Formalise', 'My explanation, with the formula, once you have felt the idea.'],
  ['Practise', 'Fresh problems with your own numbers, hints and worked solutions.'],
  ['Check', 'A few questions. Your first answer to each one updates your mastery.'],
] as const;

/** Home. A first visit gets one clear start, the opening of the letter and how a card works.
 *  A returning visit leads with the exact place to resume and anything due for a revisit. */
export function WelcomePage() {
  const p = useProgress();
  const acc = useAccount();
  const editing = useEditing();
  const open = CHAPTERS.filter(c => c.cards.length);
  const all = open.flatMap(c => coreCards(c));
  const doneCards = all.filter(k => p.cards[k.id]?.completedAt).length;
  const taught = concepts.filter(c => open.some(ch => ch.number === c.chapter));
  const mastered = taught.filter(c => isMastered(p, c.id)).length;
  const due = dueConcepts(p);
  const started = all.some(k => p.cards[k.id] && (p.cards[k.id].completedAt || Object.values(p.cards[k.id].steps).some(Boolean)));
  const inProgress = all.find(k => !p.cards[k.id]?.completedAt && Object.values(p.cards[k.id]?.steps ?? {}).some(Boolean));
  const nextNew = all.find(k => !p.cards[k.id]?.completedAt);
  const resume = inProgress ?? nextNew;
  const resumeStep = resume && stepsOf(resume).find(s => !p.cards[resume.id]?.steps[s]);
  const upNext = all.filter(k => !p.cards[k.id]?.completedAt && k.id !== resume?.id).slice(0, 3);
  const name = firstName(acc.profile?.full_name);
  const greeting = `${partOfDay()}${name ? `, ${name}` : ''}.`;
  const cardFor = (conceptId: string) => all.find(k => k.concepts.includes(conceptId));

  const letterRest = (
    <>
      <EditableMd scope="welcome.whatisepi">{WELCOME.whatIsEpi}</EditableMd>
      <EditableMd scope="welcome.whyitmatters">{WELCOME.whyItMatters}</EditableMd>
      <EditableMd scope="welcome.thebook">{WELCOME.theBook}</EditableMd>
      <EditableMd scope="welcome.howtouse">{WELCOME.howToUse}</EditableMd>
    </>
  );

  // ---------------------------------------------------------------- first visit
  if (!started) return (
    <div className="welcome">
      <div className="title-row">
        <div>
          <h1 className="greeting">{greeting}</h1>
          <p className="sub">Welcome to Epidemiology 101. Read my note, then start with Chapter 1, {open[0]?.title.toLowerCase()}.</p>
        </div>
        {open[0] && <button className="btn" onClick={() => go(`#/card/${coreCards(open[0])[0].id}`)}>Start Chapter 1</button>}
      </div>

      <div className="grid">
        <article className="sheet letter s8" aria-labelledby="h-letter">
          <h2 id="h-letter" className="letter-title">{WELCOME.title}</h2>
          <EditableMd scope="welcome.intro">{WELCOME.intro}</EditableMd>
          {editing ? letterRest : <details className="more"><summary>Read the whole letter</summary>{letterRest}</details>}
        </article>

        <aside className="s4 stack">
          <section className="panel" aria-labelledby="h-how">
            <div className="panel-head"><h2 id="h-how">How a card works</h2><span className="aside">10 to 15 minutes</span></div>
            <ol className="how">{HOW.map(([t, d]) => <li key={t}><span className="nm">{t}</span><span className="ds">{d}</span></li>)}</ol>
          </section>
          <section className="panel" aria-labelledby="h-map">
            <div className="panel-head"><h2 id="h-map">The course</h2></div>
            <div className="kv">
              {UNITS.map(u => {
                const cs = CHAPTERS.filter(c => u.chapters.includes(c.number)).flatMap(c => coreCards(c));
                return <div key={u.id}><dt>{u.id}. {u.title}<small>Chapters {u.chapters[0]} to {u.chapters[u.chapters.length - 1]}</small></dt><dd className="num">{cs.length ? `${cs.length} cards` : 'Coming soon'}</dd></div>;
              })}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );

  // ---------------------------------------------------------------- returning
  const fact = !resume ? 'Every open chapter is complete. Chapters 6 to 15 arrive over the coming weeks.'
    : inProgress ? `You were in the middle of ${cardLabel(resume)}, ${resume.title.toLowerCase()}.`
    : `Next is ${cardLabel(resume)}, ${resume.title.toLowerCase()}.`;
  return (
    <div className="welcome">
      <div className="title-row">
        <div>
          <h1 className="greeting">{greeting}</h1>
          <p className="sub">{fact}{due.length > 0 && ` ${due.length} concept${due.length === 1 ? ' is' : 's are'} due for a revisit; do ${due.length === 1 ? 'it' : 'those'} first.`}</p>
        </div>
        {resume && <button className="btn" onClick={() => go(`#/card/${resume.id}`)}>{inProgress && resumeStep ? `Resume: ${STEP_LABEL[resumeStep]}` : `Open ${cardLabel(resume)}`}</button>}
      </div>

      <div className="grid">
        {due.length > 0 && <section className="panel s12 due" aria-labelledby="h-due">
          <div className="panel-head"><h2 id="h-due">Due for a revisit</h2><span className="aside">A spaced check keeps an idea from fading</span></div>
          <div className="rows">{due.map(d => { const k = cardFor(d); return k && (
            <button key={d} className="rowcard" onClick={() => go(`#/card/${k.id}`)}>
              <span><div className="title">{conceptById(d)?.title ?? d}</div><div className="meta">{cardLabel(k)} · {k.title}</div></span>
              <span className="go">Revisit</span>
            </button>); })}</div>
        </section>}

        <div className="tiles three s12">
          <div className="tile"><span className="k">Cards completed</span><span className="v">{doneCards} <small>of {all.length}</small></span><span className="c">{all.length - doneCards} to go in chapters 1 to {open.length}</span></div>
          <div className="tile"><span className="k">Concepts mastered</span><span className="v">{mastered} <small>of {taught.length}</small></span><span className="c">At 85% estimated mastery</span></div>
          <div className="tile"><span className="k">Revisits due</span><span className="v">{due.length}</span><span className="c">{due.length ? 'Listed above' : 'Nothing due today'}</span></div>
        </div>

        {upNext.length > 0 && <section className="panel s8" aria-labelledby="h-next">
          <div className="panel-head"><h2 id="h-next">After that</h2><span className="aside">{all.length - doneCards} card{all.length - doneCards === 1 ? '' : 's'} to go</span></div>
          <div className="rows">
            {upNext.map(k => (
              <button key={k.id} className="rowcard" onClick={() => go(`#/card/${k.id}`)}>
                <span><div className="title">{k.title}</div><div className="meta">{cardLabel(k)} · {k.minutes} min{k.explore ? ' · interactive' : ''}</div></span>
                <Path card={k} p={p} />
              </button>
            ))}
          </div>
        </section>}

        <section className="panel s4" aria-labelledby="h-map">
          <div className="panel-head"><h2 id="h-map">The course</h2><a className="aside" href="#/progress">My progress</a></div>
          <div className="kv">
            {UNITS.map(u => {
              const cs = CHAPTERS.filter(c => u.chapters.includes(c.number)).flatMap(c => coreCards(c));
              const d = cs.filter(k => p.cards[k.id]?.completedAt).length;
              return <div key={u.id}><dt>{u.id}. {u.title}<small>Chapters {u.chapters[0]} to {u.chapters[u.chapters.length - 1]}</small></dt><dd className="num">{cs.length ? `${d} / ${cs.length}` : 'Coming soon'}</dd></div>;
            })}
          </div>
        </section>

        <article className="sheet letter s8" aria-labelledby="h-letter">
          {editing ? <>
            <h2 id="h-letter" className="letter-title">{WELCOME.title}</h2>
            <EditableMd scope="welcome.intro">{WELCOME.intro}</EditableMd>{letterRest}
          </> : <details className="more"><summary><span id="h-letter" className="letter-title">{WELCOME.title}</span><span className="hint"> · my letter to you, for when you want it again</span></summary>
            <EditableMd scope="welcome.intro">{WELCOME.intro}</EditableMd>{letterRest}
          </details>}
        </article>
      </div>
    </div>
  );
}
