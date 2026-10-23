import { WELCOME } from '../content/welcome';
import { CHAPTERS, UNITS, concepts } from '../content';
import { coreCards } from '../content/types';
import { EditableMd } from '../components/EditableMd';
import { Path, cardState } from '../components/Path';
import { useProgress, dueConcepts, isMastered } from '../store/progress';
import { useAccount } from '../store/account';
import { chapterCompletion } from '../store/gates';
import { go } from '../App';

const TOTAL_CHAPTERS = 15;

function partOfDay(d = new Date()) {
  const h = d.getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

/** Home: the greeting states today's one fact (what is next), then counts, the next cards, the course map and the letter. */
export function WelcomePage() {
  const p = useProgress();
  const acc = useAccount();
  const open = CHAPTERS.filter(c => c.cards.length);
  const all = open.flatMap(c => coreCards(c));
  const doneCards = all.filter(k => p.cards[k.id]?.completedAt).length;
  const taught = concepts.filter(c => open.some(ch => ch.number === c.chapter));
  const mastered = taught.filter(c => isMastered(p, c.id)).length;
  const due = dueConcepts(p).length;
  const next = open.find(c => chapterCompletion(p, c) < 1);
  const started = Object.keys(p.cards).length > 0;
  const upNext = open.flatMap(c => c.cards).filter(k => !k.bonus && !p.cards[k.id]?.completedAt).slice(0, 4);
  const first = acc.profile?.full_name?.trim().split(/\s+/)[0];

  const greeting = `${partOfDay()}${first ? `, ${first}` : ''}.`;
  const fact = !next ? 'Every open chapter is complete. Chapters 6 to 15 arrive over the coming weeks.'
    : !started ? `Start with Chapter 1, ${next.title.toLowerCase()}, after the note below.`
    : `Chapter ${next.number}, ${next.title.toLowerCase()}, is next.`;

  return (
    <div className="welcome">
      <div className="title-row">
        <div>
          <h1 className="greeting">{greeting}</h1>
          <p className="sub">{fact}{due > 0 && ` ${due} concept${due === 1 ? ' is' : 's are'} due for a revisit first.`}</p>
        </div>
        {next && <button className="btn" onClick={() => go(`#/ch/${next.number}`)}>{started ? `Continue Chapter ${next.number}` : 'Start Chapter 1'}</button>}
      </div>

      <div className="grid">
        <div className="tiles s12">
          <div className="tile"><span className="k">Cards completed</span><span className="v">{doneCards} <small>of {all.length}</small></span><span className="c">{doneCards === 0 ? 'Ready when you are' : `${all.length - doneCards} to go in chapters 1 to ${open.length}`}</span></div>
          <div className="tile"><span className="k">Concepts mastered</span><span className="v">{mastered} <small>of {taught.length}</small></span><span className="c">At 85% estimated mastery</span></div>
          <div className="tile"><span className="k">Revisits due</span><span className="v">{due}</span><span className="c">{due ? 'Spaced checks, before new material' : 'Nothing due today'}</span></div>
          <div className="tile"><span className="k">Chapters open</span><span className="v">{open.length} <small>of {TOTAL_CHAPTERS}</small></span><span className="c">The rest arrive over the coming weeks</span></div>
        </div>

        <section className="panel s9 stretch" aria-labelledby="h-next">
          <div className="panel-head">
            <h2 id="h-next">Up next</h2>
            <span className="aside">{upNext.length} of {all.length - doneCards} cards left</span>
          </div>
          <div className="rows">
            {upNext.map(k => {
              const st = cardState(k, p);
              return (
                <button key={k.id} className="rowcard" onClick={() => go(`#/card/${k.id}`)}>
                  <span><div className="title">{k.title}</div><div className="meta">Card {k.chapter}.{CHAPTERS.find(c => c.number === k.chapter)!.cards.indexOf(k) + 1} · {k.minutes} min · {k.concepts.length} concept{k.concepts.length > 1 ? 's' : ''}{k.explore ? ' · interactive' : ''}</div></span>
                  <span style={{ display: 'flex', gap: 14, alignItems: 'center' }}>{!k.bonus && <Path card={k} p={p} />}<span className="go">{st === 'started' ? 'Resume' : 'Open'}</span></span>
                </button>
              );
            })}
            {!next && <p className="hint">All open cards are complete. Revisit any chapter from the menu.</p>}
          </div>
          {next && <div className="foot"><button className="btn ghost small" onClick={() => go(`#/ch/${next.number}`)}>All cards in Chapter {next.number}</button></div>}
        </section>

        <section className="panel s3" aria-labelledby="h-map">
          <div className="panel-head"><h2 id="h-map">The course</h2><a className="aside" href="#/progress">Progress</a></div>
          <div className="kv">
            {UNITS.map(u => {
              const chs = CHAPTERS.filter(c => u.chapters.includes(c.number));
              const cs = chs.flatMap(c => coreCards(c));
              const d = cs.filter(k => p.cards[k.id]?.completedAt).length;
              return <div key={u.id}><dt>{u.id}. {u.title}<small>Chapters {u.chapters[0]} to {u.chapters[u.chapters.length - 1]}</small></dt><dd className="num">{cs.length ? `${d} / ${cs.length}` : 'Soon'}</dd></div>;
            })}
          </div>
        </section>

        <article className="sheet letter s9" aria-labelledby="h-letter">
          <h2 id="h-letter" style={{ fontSize: 22, lineHeight: '28px', marginBottom: 18 }}>{WELCOME.title}</h2>
          <EditableMd scope="welcome.intro">{WELCOME.intro}</EditableMd>
          <EditableMd scope="welcome.whatisepi">{WELCOME.whatIsEpi}</EditableMd>
          <EditableMd scope="welcome.whyitmatters">{WELCOME.whyItMatters}</EditableMd>
          <EditableMd scope="welcome.thebook">{WELCOME.theBook}</EditableMd>
          <EditableMd scope="welcome.howtouse">{WELCOME.howToUse}</EditableMd>
        </article>

        <aside className="panel s3" aria-labelledby="h-about" style={{ position: 'sticky', top: 24 }}>
          <div className="panel-head"><h2 id="h-about">About this course</h2></div>
          <dl className="kv">
            <div><dt>Module</dt><dd>Epidemiology 101</dd></div>
            <div><dt>Programme</dt><dd>MSc Clinical Research</dd></div>
            <div><dt>Course lead</dt><dd>Dr Ram</dd></div>
            <div><dt>Textbook</dt><dd>Rothman, 3rd ed.</dd></div>
            <div><dt>Mastery line</dt><dd>85%</dd></div>
          </dl>
          <p className="hint" style={{ marginTop: 14 }}>Stuck on a card? Ask your instructor sends your question on WhatsApp with the card's link.</p>
        </aside>
      </div>
    </div>
  );
}
