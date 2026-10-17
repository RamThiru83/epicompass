import { useMemo } from 'react';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/** Render trusted instructor markdown with $inline$ and $$display$$ maths. Content is authored in-repo, so no sanitiser. */
function renderMath(src: string): string {
  // display first, then inline; protect code spans
  const codes: string[] = [];
  let s = src.replace(/`[^`]*`/g, m => { codes.push(m); return `\u0000${codes.length - 1}\u0000`; });
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => katex.renderToString(tex.trim().replace(/(?<!\\)%/g, '\\%'), { displayMode: true, throwOnError: false }));
  s = s.replace(/\$([^\n$]+?)\$/g, (_, tex) => katex.renderToString(tex.trim().replace(/(?<!\\)%/g, '\\%'), { throwOnError: false }));
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[+i]);
  return s;
}

export function Markdown({ children, className = 'prose' }: { children: string; className?: string }) {
  const html = useMemo(() => marked.parse(renderMath(children), { async: false }) as string, [children]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Fill {key} placeholders from a record, formatting numbers to 3 significant decimals where needed. */
export function fill(template: string, values: Record<string, number | string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => {
    const v = values[k];
    if (v === undefined) return `{${k}}`;
    return typeof v === 'number' ? (Number.isInteger(v) ? String(v) : v.toPrecision(3)) : v;
  });
}
