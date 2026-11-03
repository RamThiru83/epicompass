/** Loaded on demand (the notes are large), so they do not slow the first page load. */
import { COMPANION } from '../content/companion';
import { conceptById } from '../content';

/**
 * Book notes for the card's concepts. The re-teaching material and the reading pointer are included only once
 * Kenny has already answered in this conversation, so a first explanation comes from the card.
 */
export function bookNotes(conceptIds: string[], followUp: boolean): string {
  const parts = conceptIds.flatMap(id => {
    const n = COMPANION[id];
    if (!n) return [];
    const title = conceptById(id)?.title ?? id;
    const lines = [`## ${title}`, `Key terms: ${n.terms.join(' | ')}`, `The book's account: ${n.core}`,
      `The book's emphases: ${n.positions.join(' | ')}`];
    if (n.notation) lines.push(`Notation: ${n.notation}`);
    lines.push(`Common misreadings and corrections: ${n.misreadings.join(' | ')}`);
    if (followUp) lines.push(`Another way to explain it: ${n.reteach}`, `Where to read in the book: ${n.where}`);
    return [lines.join('\n')];
  });
  return parts.length ? `\n\nBOOK NOTES (paraphrased from Rothman, Huybrechts and Murray, 3rd edition; background for accuracy)\n${parts.join('\n\n')}` : '';
}

