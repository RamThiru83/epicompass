/**
 * Study assistant: a floating button that opens a chat about the page, and a small menu that appears when
 * the student selects text ("Explain this", "Give an example", …). Runs on the student's own OpenRouter
 * account; requests go straight from the browser to OpenRouter.
 */
import { useEffect, useRef, useState } from 'react';
import { Markdown } from '../components/Markdown';
import { openTutor } from '../components/TutorPanel';
import { go } from '../App';
import { usePageContext } from './context';
import { useOpenRouter, connect, chat, keyInfo, AssistantError, type ChatMsg, type KeyInfo } from './openrouter';
import { systemPrompt, actionPrompt, questionPrompt, ACTION_LABEL, type Action } from './prompt';
import { useInsightsOn, logAsk } from './insights';
import { PLAN_LABEL } from './models';

type Turn = { role: 'user' | 'assistant'; content: string; excerpt?: string; label?: string; error?: boolean };
const HISTORY = 8; // turns of conversation sent back to the model

const openEvt = 'epi:assistant';
export const openAssistant = (detail?: { action?: Exclude<Action, 'question'>; excerpt?: string }) => window.dispatchEvent(new CustomEvent(openEvt, { detail }));

function visibleText(): string {
  const el = (document.querySelector('.step-body') ?? document.querySelector('.page')) as HTMLElement | null;
  return (el?.innerText ?? '').replace(/\n{3,}/g, '\n\n').trim();
}

const Sparkle = () => <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden><path d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6z" fill="currentColor" /><path d="M15.5 13l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" fill="currentColor" opacity=".7" /></svg>;

export function Assistant() {
  const or = useOpenRouter();
  const ctx = usePageContext();
  const insights = useInsightsOn();
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState('');
  const [excerpt, setExcerpt] = useState<string | null>(null);
  const [info, setInfo] = useState<KeyInfo | null>(null);
  const [model, setModel] = useState('');
  const [sel, setSel] = useState<{ text: string; x: number; y: number } | null>(null);
  const abort = useRef<AbortController | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const fab = useRef<HTMLButtonElement>(null);
  const onCheck = ctx?.step === 'check';
  const pageKey = ctx ? ctx.card.id : location.hash.split('/').slice(0, 2).join('/');

  // a new card starts a new conversation
  useEffect(() => { abort.current?.abort(); setTurns([]); setExcerpt(null); }, [pageKey]);

  const refreshInfo = () => { keyInfo().then(setInfo); };
  useEffect(() => { if (open && or.key) refreshInfo(); }, [open, or.key]);

  // keep the newest message in view
  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight }); }, [turns]);

  const close = () => { setOpen(false); abort.current?.abort(); requestAnimationFrame(() => fab.current?.focus()); };
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [open]);

  async function send(user: Turn, action: Action) {
    if (busy || !or.key || onCheck) return;
    const history = [...turns, user].filter(t => !t.error);
    setTurns([...turns, user, { role: 'assistant', content: '' }]);
    setBusy(true);
    logAsk(insights, { card_id: ctx?.card.id ?? `page:${pageKey}`, step: ctx?.step, action, excerpt: user.excerpt });
    const followUp = history.some(t => t.role === 'assistant');
    let notes = '';
    if (ctx) try { notes = (await import('./booknotes')).bookNotes(ctx.card.concepts ?? [], followUp); } catch { /* answer from the card alone */ }
    const msgs: ChatMsg[] = [{ role: 'system', content: systemPrompt(ctx, visibleText(), notes) }, ...history.slice(-HISTORY).map(t => ({ role: t.role, content: t.content }))];
    const ac = new AbortController(); abort.current = ac;
    try {
      const r = await chat(msgs, text => setTurns(ts => [...ts.slice(0, -1), { role: 'assistant', content: text }]), ac.signal);
      setModel(r.model);
      if (!r.text.trim()) setTurns(ts => [...ts.slice(0, -1), { role: 'assistant', content: 'No answer came back. Please try again.', error: true }]);
    } catch (e) {
      if ((e as Error).name === 'AbortError') setTurns(ts => { const last = ts[ts.length - 1]; return last?.content ? ts : ts.slice(0, -2); });
      else setTurns(ts => [...ts.slice(0, -1), { role: 'assistant', content: e instanceof AssistantError ? e.message : 'Could not reach OpenRouter. Check your internet connection and try again.', error: true }]);
    } finally { setBusy(false); abort.current = null; refreshInfo(); }
  }

  const runAction = (action: Exclude<Action, 'question'>, text: string) =>
    send({ role: 'user', content: actionPrompt(action, text), excerpt: text, label: ACTION_LABEL[action] }, action);

  // open from elsewhere (the selection menu), optionally with an action
  useEffect(() => {
    const h = (e: Event) => {
      const d = (e as CustomEvent).detail as { action?: Exclude<Action, 'question'>; excerpt?: string } | undefined;
      setOpen(true);
      if (d?.excerpt && d.action) runAction(d.action, d.excerpt);
      else if (d?.excerpt) { setExcerpt(d.excerpt); requestAnimationFrame(() => input.current?.focus()); }
      else requestAnimationFrame(() => (input.current ?? box.current?.querySelector<HTMLElement>('button.btn'))?.focus());
    };
    addEventListener(openEvt, h); return () => removeEventListener(openEvt, h);
  });

  // selection menu: appears over a passage of course text the student has selected
  useEffect(() => {
    let t: number | undefined;
    const update = () => {
      clearTimeout(t);
      t = window.setTimeout(() => {
        const s = getSelection();
        const text = s?.toString().trim() ?? '';
        if (!s || s.isCollapsed || text.length < 3 || text.length > 2000) { setSel(null); return; }
        const node = s.anchorNode instanceof Element ? s.anchorNode : s.anchorNode?.parentElement;
        if (!node?.closest('.page') || node.closest('.assistant, input, textarea, .opt, .check-item, .answers, [contenteditable="true"]')) { setSel(null); return; }
        const r = s.getRangeAt(0).getBoundingClientRect();
        setSel({ text, x: Math.min(Math.max(r.left + r.width / 2, 150), innerWidth - 150), y: r.top > 64 ? r.top - 8 : r.bottom + 52 });
      }, 120);
    };
    document.addEventListener('selectionchange', update);
    const hide = () => setSel(null);
    addEventListener('scroll', hide, true);
    return () => { document.removeEventListener('selectionchange', update); removeEventListener('scroll', hide, true); clearTimeout(t); };
  }, []);

  const pick = (action?: Exclude<Action, 'question'>) => {
    const text = sel?.text; setSel(null); getSelection()?.removeAllRanges();
    if (text) openAssistant({ action, excerpt: text });
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!q.trim()) return;
    send({ role: 'user', content: questionPrompt(q, excerpt ?? undefined), excerpt: excerpt ?? undefined, label: q.trim() }, 'question');
    setQ(''); setExcerpt(null);
  };

  const quota = info && (or.plan === 'free'
    ? info.freeLeft !== null && info.freeLimit !== null ? `${info.freeLeft} of ${info.freeLimit} free questions left today` : null
    : info.creditLeft !== null ? `Credit left on this key: US$${info.creditLeft.toFixed(2)}` : null);

  let body: JSX.Element;
  if (!or.key) body = (
    <div className="as-setup">
      <p>Kenny, your study assistant, answers questions about the card you are on, using an AI model on <b>your own OpenRouter account</b>. A free account is enough: it gives 50 questions a day.</p>
      <ol>
        <li>Press <b>Connect OpenRouter</b>. Sign in, or create a free account, and approve EpiCompass.</li>
        <li>You come straight back here, ready to ask.</li>
      </ol>
      {or.error && <p className="as-err" role="alert">{or.error}</p>}
      <div className="as-actions">
        <button className="btn" onClick={() => connect()} disabled={or.connecting}>{or.connecting ? 'Connecting…' : 'Connect OpenRouter'}</button>
        <button className="textlink" onClick={() => { close(); go('#/progress'); setTimeout(() => document.getElementById('h-assistant')?.scrollIntoView({ block: 'start' }), 300); }}>More about Kenny</button>
      </div>
      <p className="hint">Your key stays in this browser. EpiCompass never sees it or your conversations.</p>
    </div>
  );
  else if (onCheck) body = (
    <div className="as-setup"><p>Kenny is switched off during <b>Check</b>, so that your answers show what you know. He is back on the other steps.</p></div>
  );
  else body = (
    <>
      <div className="as-list" ref={list} aria-live="polite">
        {turns.length === 0 && <div className="as-empty">
          <p>Hello, I’m Kenny. Ask me anything about {ctx ? <>“{ctx.card.title}”</> : 'this page'}. Or select a passage on the page and choose <b>Explain this</b>, <b>Give an example</b>, <b>Why does it matter?</b> or <b>Quiz me on this</b>.</p>
        </div>}
        {turns.map((t, i) => t.role === 'user'
          ? <div key={i} className="as-msg me">{t.excerpt && <blockquote>{t.excerpt.length > 220 ? t.excerpt.slice(0, 220) + '…' : t.excerpt}</blockquote>}<p>{t.label ?? t.content}</p></div>
          : <div key={i} className={`as-msg ai ${t.error ? 'err' : ''}`}>{t.content ? <Markdown sanitize className="prose as-prose">{t.content}</Markdown> : <p className="as-wait">Thinking…</p>}</div>)}
      </div>
      <form className="as-form" onSubmit={submit}>
        {excerpt && <div className="as-chip"><span>About: “{excerpt.length > 90 ? excerpt.slice(0, 90) + '…' : excerpt}”</span><button type="button" aria-label="Remove passage" onClick={() => setExcerpt(null)}>×</button></div>}
        <textarea ref={input} value={q} rows={2} placeholder="Your question…" aria-label="Your question to Kenny"
          onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }} />
        <div className="as-actions">
          {busy ? <button type="button" className="btn ghost" onClick={() => abort.current?.abort()}>Stop</button>
            : <button className="btn" type="submit" disabled={!q.trim()}>Ask</button>}
          {turns.length > 0 && !busy && <button type="button" className="textlink" onClick={() => setTurns([])}>New conversation</button>}
        </div>
      </form>
    </>
  );

  return (
    <>
      {sel && !onCheck && (
        <div className="as-selmenu assistant" role="toolbar" aria-label="Ask Kenny about the selected text" style={{ left: sel.x, top: sel.y }} onMouseDown={e => e.preventDefault()}>
          {(Object.keys(ACTION_LABEL) as Exclude<Action, 'question'>[]).map(a => <button key={a} type="button" onClick={() => pick(a)}>{ACTION_LABEL[a]}</button>)}
          <button type="button" onClick={() => pick()}>Ask…</button>
        </div>
      )}
      {!open && <button ref={fab} className="as-fab" onClick={() => openAssistant()} aria-haspopup="dialog" aria-label="Ask Kenny, your study assistant"><Sparkle /><span className="fab-text"><b>Ask Kenny</b><small>your study assistant</small></span></button>}
      {open && (
        <div className="assistant as-panel" role="dialog" aria-modal="false" aria-labelledby="as-h" ref={box}>
          <div className="as-head">
            <div><h2 id="as-h">Kenny</h2><span className="hint">Your study assistant · AI, can make mistakes · the card is the authority</span></div>
            <button className="btn ghost close" onClick={close} aria-label="Close (Esc)">Close</button>
          </div>
          {body}
          <div className="as-foot">
            <span>{or.key ? <>{quota ?? PLAN_LABEL[or.plan]}{model && <> · {model.replace(/:free$/, '')}</>}</> : null}</span>
            <button className="textlink" onClick={() => { close(); openTutor(); }}>Ask your instructor</button>
          </div>
        </div>
      )}
    </>
  );
}
