/** Study assistant set-up: OpenRouter connection, which models, and the optional insights consent. */
import { useState } from 'react';
import { useOpenRouter, connect, disconnect, pasteKey, setPlan } from './openrouter';
import { PLAN_LABEL, type ModelPlan } from './models';
import { useAccount, setInsightsConsent } from '../store/account';
import { cloudEnabled } from '../lib/supabase';
import { openAssistant } from './Assistant';
import { useCourseKenny, setSource } from './course';

const PLAN_TEXT: Record<ModelPlan, JSX.Element> = {
  'free': <>No payment needed. A free OpenRouter account allows <b>50 questions a day</b> (1,000 a day once the account has ever bought US$10 of credit). The free models are run by providers that may keep questions for a while, so do not type personal information.</>,
  'low-cost': <>Needs a little credit on your OpenRouter account. A question costs about US$0.00005, so US$1 lasts many thousands of questions. Questions to Qwen go only to providers that do not store them. If Qwen is unavailable or your credit runs out, Kenny switches to the free models for that question.</>,
};

export function AssistantSettings() {
  const or = useOpenRouter();
  const a = useAccount();
  const [paste, setPaste] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const consent = !!a.profile?.insights_consent_at;
  const course = useCourseKenny();
  const useOwn = !course.enabled || course.source === 'openrouter';

  return (
    <>
      {course.enabled && <div className="setrow">
        <div className="lbl"><h2 id="h-assistant">Kenny, your study assistant</h2><p>An AI tutor for the card you are on.</p></div>
        <div className="panel">
          <div role="radiogroup" aria-label="Where Kenny runs" className="as-plans">
            <label className={`as-plan ${!useOwn ? 'on' : ''}`}>
              <input type="radio" name="as-source" checked={!useOwn} onChange={() => setSource('course')} />
              <span><b>Course account</b> (recommended)<br /><span className="hint">Free for you, nothing to set up: just be signed in. Claude Haiku answers your questions; if you are still stuck after an answer, Claude Sonnet, a stronger model, explains it another way. Up to {course.daily ?? 150} questions a day.{!a.session && <> <a href="#/account">Sign in</a> to use it.</>}</span></span>
            </label>
            <label className={`as-plan ${useOwn ? 'on' : ''}`}>
              <input type="radio" name="as-source" checked={useOwn} onChange={() => setSource('openrouter')} />
              <span><b>My own OpenRouter account</b><br /><span className="hint">A backup, for example if you reach the daily limit. If you have connected it, Kenny also switches to it on his own when the course account is unavailable.</span></span>
            </label>
          </div>
          <p className="hint" style={{ marginTop: 12 }}>On the course account, your questions pass through EpiCompass’s server to Anthropic, the maker of Claude, and back. EpiCompass records only how many questions you ask each day, to apply the limit; never what you ask or what Kenny replies. Kenny can make mistakes: the card is the authority.</p>
          <div className="actions"><button className="btn" onClick={() => openAssistant()}>Ask Kenny</button></div>
        </div>
      </div>}

      <div className="setrow">
        <div className="lbl">{course.enabled ? <><h2>Backup: your own OpenRouter account</h2><p>Optional. Connect once so Kenny can carry on if the course account is unavailable.</p></> : <><h2 id="h-assistant">Kenny, your study assistant</h2><p>An AI tutor for the card you are on, using your own OpenRouter account.</p></>}</div>
        <div className="panel">
          {or.key ? <>
            <p style={{ marginTop: 0 }}><b>Connected</b> on this device. Open Kenny with the <b>Ask Kenny</b> button, or select a passage on any card.</p>
            <div className="actions">{useOwn && <button className="btn" onClick={() => openAssistant()}>Ask Kenny</button>}<button className="btn ghost" onClick={disconnect}>Disconnect</button></div>
          </> : <>
            <ol className="as-steps">
              <li>Press <b>Connect OpenRouter</b>. On OpenRouter, sign in or create a free account (Google or email), then approve EpiCompass.</li>
              <li>You return here with Kenny ready. No payment or card details are needed for the free models.</li>
              <li>On each new device or browser, connect once more.</li>
            </ol>
            {or.error && <p className="as-err" role="alert">{or.error}</p>}
            <div className="actions"><button className="btn" onClick={() => connect()} disabled={or.connecting}>{or.connecting ? 'Connecting…' : 'Connect OpenRouter'}</button></div>
            <details className="more"><summary>I already have an OpenRouter key</summary>
              <form className="row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }} onSubmit={e => { e.preventDefault(); const err = pasteKey(paste); setMsg(err); if (!err) setPaste(''); }}>
                <input type="password" autoComplete="off" placeholder="sk-or-…" value={paste} onChange={e => setPaste(e.target.value)} aria-label="OpenRouter key" style={{ width: 260 }} />
                <button className="btn ghost">Use this key</button>
              </form>
              {msg && <p className="hint">{msg}</p>}
            </details>
          </>}
          <p className="hint" style={{ marginTop: 12 }}>Your key is kept in this browser only. Your questions go straight from this browser to OpenRouter; EpiCompass never sees the key or the conversation. Kenny can make mistakes: the card is the authority, and your instructor is a WhatsApp message away.</p>
        </div>
      </div>

      {(useOwn || or.key) && <div className="setrow">
        <div className="lbl"><h2 id="h-model">{course.enabled ? 'OpenRouter model' : 'AI model'}</h2><p>Chosen automatically: if your OpenRouter account has credit, Qwen3.5 9B; otherwise the free models. Pick one below to override. A backup takes over if a model is busy.</p></div>
        <div className="panel">
          <div role="radiogroup" aria-labelledby="h-model" className="as-plans">
            {(['free', 'low-cost'] as const).map(p => (
              <label key={p} className={`as-plan ${or.plan === p ? 'on' : ''}`}>
                <input type="radio" name="as-plan" checked={or.plan === p} onChange={() => setPlan(p)} />
                <span><b>{PLAN_LABEL[p]}</b>{p === 'free' && ' (recommended)'}<br /><span className="hint">{PLAN_TEXT[p]}</span></span>
              </label>
            ))}
          </div>
        </div>
      </div>}

      {cloudEnabled && a.session && a.profile && 'insights_consent_at' in a.profile && <div className="setrow">
        <div className="lbl"><h2 id="h-insights">Help your instructor improve the course</h2><p>Optional, and you can change your mind at any time.</p></div>
        <div className="panel">
          <label className="toggle-row"><input type="checkbox" checked={consent} disabled={busy}
            onChange={async e => { setBusy(true); const err = await setInsightsConsent(e.target.checked); setBusy(false); setMsg(err); }} />
            <span>Share which cards and passages I ask Kenny about, so that Dr Ram can see where the course text is unclear.</span></label>
          <p className="hint">Only the card, the step, the button you pressed and the passage of course text you selected are recorded. Your instructor sees totals for each card and passage, not who asked. What you type and Kenny’s answers are never recorded. Unticking deletes everything recorded so far. This is used only to improve the course, not for research or marks.</p>
        </div>
      </div>}
    </>
  );
}
