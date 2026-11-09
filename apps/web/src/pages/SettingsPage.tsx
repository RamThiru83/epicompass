/** Settings: text size, appearance, Kenny, unit locks and where progress is kept. */
import { useState } from 'react';
import { useTextSize } from '../store/textSize';
import { useTheme } from '../store/theme';
import { AssistantSettings } from '../assistant/Settings';
import { useProgress, setSettings, resetProgress } from '../store/progress';
import { useAccount } from '../store/account';
import { cloudEnabled } from '../lib/supabase';

export function SettingsPage() {
  const p = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const [textSize, setTextSize] = useTextSize();
  const th = useTheme();
  const acc = useAccount();
  return (
    <div>
      <div className="title-row"><div><h1>Settings</h1><p className="sub">For this device, unless it says otherwise.</p></div></div>
      <section aria-label="Settings">
        <div className="setrow">
          <div className="lbl"><h2 id="h-textsize">Text size</h2><p>Applies on this device. Your browser’s own text-size setting also works.</p></div>
          <div className="panel">
            <div className="seg" role="radiogroup" aria-labelledby="h-textsize">
              {(['standard', 'large'] as const).map(v => (
                <button key={v} type="button" role="radio" aria-checked={textSize === v} className={`btn ${textSize === v ? '' : 'ghost'}`} onClick={() => setTextSize(v)}>
                  {v === 'standard' ? 'Standard' : 'Large'}
                </button>))}
            </div>
          </div>
        </div>
        <div className="setrow">
          <div className="lbl"><h2 id="h-theme">Appearance</h2><p>Light or dark, on this device. <i>Automatic</i> follows your phone’s or computer’s setting. The button beside the course name switches too.</p></div>
          <div className="panel">
            <div className="seg" role="radiogroup" aria-labelledby="h-theme">
              {(['system', 'light', 'dark'] as const).map(v => (
                <button key={v} type="button" role="radio" aria-checked={th.theme === v} className={`btn ${th.theme === v ? '' : 'ghost'}`} onClick={() => th.set(v)}>
                  {v === 'system' ? 'Automatic' : v === 'light' ? 'Light' : 'Dark'}
                </button>))}
            </div>
          </div>
        </div>
        <AssistantSettings />
        <div className="setrow">
          <div className="lbl"><h2>Unit locks</h2><p>Keep yourself to the course order.</p></div>
          <div className="panel">
            <label className="toggle-row"><input type="checkbox" checked={p.settings.hardGates} onChange={e => setSettings({ hardGates: e.target.checked })} />
              <span>Lock later units until the previous unit's concepts are mastered</span></label>
          </div>
        </div>
        <div className="setrow">
          <div className="lbl"><h2>Where your progress is kept</h2><p>{acc.session ? 'Saved to your account and on this device.' : 'In this browser only.'}</p></div>
          <div className="panel">
            <p style={{ margin: 0 }}>{acc.session ? 'Sign in with the same email on any device to continue where you left off.' : cloudEnabled ? <>Progress is stored in this browser only. <a href="#/account">Sign in or join</a> to save it across devices.</> : 'Progress is stored in this browser only.'}</p>
            <div className="actions" style={{ marginTop: 16 }}>
              <button className="btn ghost" style={{ color: 'var(--negative)' }} onClick={() => { if (confirmReset) { resetProgress(); setConfirmReset(false); } else { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 4000); } }}>{confirmReset ? 'Click again to erase all progress' : 'Reset my progress'}</button>
              <span className="hint">Erases every card, answer and mastery estimate.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
