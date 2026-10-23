/**
 * Course text that the instructor can edit in place. For learners it renders the text (with any published
 * edits applied); in edit mode each paragraph becomes clickable and opens a small markdown editor with a
 * live preview. Edits are held as drafts until Save in the editing bar publishes them.
 */
import { useEffect, useRef, useState } from 'react';
import { Markdown } from './Markdown';
import { splitBlocks, resolveBlock, useOverrides, useEditing, useEditState, setDraft, registerBlock } from '../store/overrides';

function Block({ k, original, inline, className }: { k: string; original: string; inline?: boolean; className?: string }) {
  const over = useOverrides();
  const editing = useEditing();
  const { dirty } = useEditState();
  const [open, setOpen] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);
  useEffect(() => registerBlock(k, original), [k, original]);
  useEffect(() => { if (!editing) setOpen(false); }, [editing]);
  useEffect(() => { if (open && ta.current) { ta.current.style.height = 'auto'; ta.current.style.height = ta.current.scrollHeight + 'px'; } });

  const live = resolveBlock(over, k, original);
  const text = dirty[k]?.md ?? live.md;
  const view = <Markdown inline={inline} className={className} sanitize={live.edited || !!dirty[k]}>{text}</Markdown>;
  if (!editing) return view;

  const cls = `ed ${dirty[k] ? 'ed-dirty' : live.edited ? 'edited' : ''}`;
  const Tag = inline ? 'span' : 'div';
  if (!open) return (
    <Tag className={cls} role="button" tabIndex={0} title="Click to edit"
      onClick={e => { e.stopPropagation(); e.preventDefault(); setOpen(true); }}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setOpen(true); } }}>{view}</Tag>
  );
  return (
    <Tag className="ed-box" onClick={e => e.stopPropagation()}>
      <textarea ref={ta} value={text} autoFocus spellCheck aria-label="Edit text (markdown)"
        onChange={e => setDraft(k, inline ? e.target.value.replace(/\n+/g, ' ') : e.target.value, original)}
        onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }} />
      <span className="ed-help">Markdown: **bold**, *italic*, $maths$, - for a list. Preview below. Esc or Done to close.</span>
      <Tag className="ed-prev">{view}</Tag>
      <span className="ed-actions">
        <button type="button" className="btn ghost" onClick={() => setOpen(false)}>Done</button>
        {dirty[k] && <button type="button" className="btn ghost" onClick={() => setDraft(k, live.md, original)}>Undo changes</button>}
      </span>
    </Tag>
  );
}

/** A markdown field split into independently editable paragraphs. `scope` must be unique per field. */
export function EditableMd({ scope, children, inline = false, className }: { scope: string; children: string; inline?: boolean; className?: string }) {
  if (inline) return <Block k={`${scope}:0`} original={children} inline className={className ?? ''} />;
  return <div className={className ?? 'prose'}>{splitBlocks(children).map((b, i) => <Block key={i} k={`${scope}:${i}`} original={b} className="" />)}</div>;
}
