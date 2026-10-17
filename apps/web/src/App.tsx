import { useEffect, useState } from 'react';
import { CHAPTERS, UNITS, cardById } from './content';
import { Sidebar } from './components/Sidebar';
import { ChapterPage } from './pages/ChapterPage';
import { CardPage } from './pages/CardPage';
import { HomePage } from './pages/HomePage';
import { TutorPanel } from './components/TutorPanel';

/** Hash routes: #/ , #/ch/4 , #/card/ch04-risk-vs-rate */
export type Route = { kind: 'home' } | { kind: 'chapter'; n: number } | { kind: 'card'; id: string };
function parse(hash: string): Route {
  const m = hash.replace(/^#\/?/, '').split('/');
  if (m[0] === 'ch' && m[1]) return { kind: 'chapter', n: +m[1] };
  if (m[0] === 'card' && m[1]) return { kind: 'card', id: m[1] };
  return { kind: 'home' };
}
export const go = (path: string) => { location.hash = path; };

export default function App() {
  const [route, setRoute] = useState<Route>(parse(location.hash));
  useEffect(() => { const h = () => { setRoute(parse(location.hash)); window.scrollTo(0, 0); }; addEventListener('hashchange', h); return () => removeEventListener('hashchange', h); }, []);

  const card = route.kind === 'card' ? cardById(route.id) : undefined;
  const chapter = route.kind === 'chapter' ? CHAPTERS.find(c => c.number === route.n) : card ? CHAPTERS.find(c => c.number === card.chapter) : undefined;

  return (
    <div className="app">
      <Sidebar units={UNITS} chapters={CHAPTERS} active={chapter?.number} />
      <main className="main">
        {route.kind === 'home' && <HomePage />}
        {route.kind === 'chapter' && chapter && <ChapterPage chapter={chapter} />}
        {route.kind === 'card' && card && chapter && <CardPage card={card} chapter={chapter} />}
        {route.kind === 'card' && !card && <p>Card not found.</p>}
      </main>
      <TutorPanel card={card} />
    </div>
  );
}
