/**
 * "Ask your instructor": opens WhatsApp with the student's name, the card they are on and their question
 * pre-filled. The instructor's number is fetched from Supabase (tutor_contact RPC) and is returned only to
 * signed-in students in a cohort, so it never appears in the public code.
 */
import { useEffect, useState } from 'react';
import type { Card } from '../content/types';
import { supabase, cloudEnabled } from '../lib/supabase';
import { useAccount } from '../store/account';
import { go } from '../App';

let cached: string | null | undefined;

export function TutorPanel({ card }: { card?: Card }) {
  const a = useAccount();
  const [open, setOpen] = useState(false);
  const [num, setNum] = useState<string | null | undefined>(cached);
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!open || !a.session || !supabase || num !== undefined) return;
    supabase.rpc('tutor_contact').then(({ data }) => { cached = (data as string | null) ?? null; setNum(cached); });
  }, [open, a.session, num]);
  useEffect(() => { if (!a.session) { cached = undefined; setNum(undefined); } }, [a.session]);

  if (!open) return <button className="tutor-fab" onClick={() => setOpen(true)}>Ask your instructor</button>;

  const where = card ? `Chapter ${card.chapter}, card "${card.title}"` : 'EpiCompass';
  const message = () => [
    `Hello Dr Ram, this is ${a.profile?.full_name ?? 'a student'}${a.cohortName ? ` (${a.cohortName})` : ''}.`,
    `I'm on ${where}:`, location.href, '', q.trim(),
  ].join('\n');
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!num || !q.trim()) return;
    window.open(`https://wa.me/${num.replace(/\D/g, '')}?text=${encodeURIComponent(message())}`, '_blank', 'noopener');
  };

  let body: JSX.Element;
  if (!cloudEnabled || !a.session) body = <>
    <p>Sign in to send your question to your instructor on WhatsApp.</p>
    <button className="btn" onClick={() => { setOpen(false); go('#/account'); }}>Sign in or join</button>
  </>;
  else if (num === undefined) body = <p className="hint">Loading…</p>;
  else if (num === null) body = <p>Your instructor has not set up messaging yet.</p>;
  else body = <form className="tutor-wa" onSubmit={send}>
    <p className="hint">Your question opens in WhatsApp with your name and this card's link added, so Dr Ram knows where you are. You then carry on the conversation there. Dr Ram will see your WhatsApp number.</p>
    <textarea value={q} onChange={e => setQ(e.target.value)} rows={4} placeholder={card ? `Your question about "${card.title}"…` : 'Your question…'} aria-label="Your question" autoFocus />
    <button className="btn" type="submit" disabled={!q.trim()}>Open in WhatsApp</button>
  </form>;

  return (
    <div className="tutor" role="dialog" aria-label="Ask your instructor">
      <div className="tutor-head"><span>Ask your instructor</span><button className="btn ghost" onClick={() => setOpen(false)}>Close</button></div>
      <div className="tutor-body">{body}</div>
    </div>
  );
}
