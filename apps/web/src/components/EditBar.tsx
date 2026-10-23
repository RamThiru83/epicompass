/** Fixed bar shown while the instructor is editing course text (same pattern as CliPr). */
import { cardById } from '../content';
import { useEditing, useEditState, saveDrafts, discardDrafts, setEditMode, revertKeys, pageOriginals, useOverrides } from '../store/overrides';

export function EditBar() {
  const editing = useEditing();
  const { dirty, saving, msg } = useEditState();
  const over = useOverrides();
  if (!editing) return null;
  const n = Object.keys(dirty).length;
  // Everything on the current card (all steps), or whatever is shown on other pages.
  const card = cardById(decodeURIComponent((location.hash.match(/^#\/card\/([^/?#]+)/) ?? [])[1] ?? ''));
  const prefixes = card ? [`card.${card.id}.`, ...card.checks.map(c => `chk.${c.id}.`)] : [];
  const shown = new Set(Object.keys(pageOriginals()));
  const onPage = Object.keys(over).filter(k => shown.has(k) || prefixes.some(p => k.startsWith(p)));
  return (
    <div className="edbar" role="region" aria-label="Editing course text">
      <span className="ed-t"><b>Editing course text.</b> Click any paragraph, question, option or feedback to edit it. Changes publish to all learners when you save.</span>
      <span className="ed-c">{msg ?? (n ? `${n} unsaved` : '')}</span>
      <button type="button" className="btn" disabled={!n || saving} onClick={() => saveDrafts(pageOriginals())}>{saving ? 'Saving…' : 'Save changes'}</button>
      <button type="button" className="btn ghost" disabled={!n || saving} onClick={discardDrafts}>Discard</button>
      <button type="button" className="btn ghost" disabled={!onPage.length || saving} title="Remove all published edits on this page"
        onClick={() => { if (window.confirm(`Revert ${onPage.length} published edit${onPage.length === 1 ? '' : 's'} on this page to the original text?`)) revertKeys(onPage); }}>Revert this page to original</button>
      <button type="button" className="btn ghost" onClick={() => { if (!n || window.confirm('Leave editing and discard unsaved changes?')) setEditMode(false); }}>Exit editing</button>
    </div>
  );
}
