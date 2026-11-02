/**
 * The study assistant's instructions and the course material it is given. Small models make mistakes, so
 * every request carries the card's own text and the assistant is told to answer from it, to explain rather
 * than compute, to coach rather than give answers, and never to touch the Check questions.
 */
import type { PageContext } from './context';
import { STEP_LABEL } from '../components/Path';

export type Action = 'explain' | 'example' | 'why' | 'quiz' | 'question';

export const ACTION_LABEL: Record<Exclude<Action, 'question'>, string> = {
  explain: 'Explain this',
  example: 'Give an example',
  why: 'Why does it matter?',
  quiz: 'Quiz me on this',
};

const RULES = `You are the study assistant in EpiCompass, a self-paced Epidemiology 101 course for MSc Clinical Research students and young investigators in India. The course follows Rothman, Huybrechts and Murray, "Epidemiology: An Introduction" (3rd edition). The course instructor is Dr Ramachandran Thiruvengadam.

How to answer:
- Base your answer on the COURSE MATERIAL below. If it does not cover the question, say so in one line, then answer briefly from standard epidemiology and say that this goes beyond the card.
- Be accurate. If you are not sure, say so plainly and suggest the student use "Ask your instructor". Never invent references, studies, statistics or quotations.
- Make examples hypothetical and say so ("Imagine a district where…"). Do not state facts about real programmes, studies, institutions or people unless the course material states them.
- Be brief: at most about 180 words unless the student asks for more. Use short paragraphs or a short list. Use British spelling.
- Teach rather than tell: where it helps, end with one short question that makes the student think.
- Do not carry out numerical calculations beyond what the card itself shows. Explain the formula and what goes into it, and let the student calculate.
- For a practice problem, give a hint or the next step, never the final numerical answer (the card has a worked solution for that).
- Never answer or discuss the card's Check questions.
- Write mathematics with $...$ for inline and $$...$$ for display formulas.
- Stay on epidemiology, research methods and this course. Politely decline anything else (essays, assignments for other courses, unrelated topics).
- Do not ask for or repeat personal information about the student or anyone else.`;

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n) + ' …' : s);

/** Course material for the system message: the card's formal explanation plus what is on screen now. */
export function systemPrompt(ctx: PageContext | null, visibleText: string): string {
  if (!ctx) return `${RULES}\n\nCOURSE MATERIAL (the page the student is on):\n${clip(visibleText, 5000)}`;
  const { card, chapter, step } = ctx;
  return `${RULES}

COURSE MATERIAL
Chapter ${chapter.number}: ${chapter.title}. Card: "${card.title}". The student is on the ${STEP_LABEL[step]} step.

The card's explanation (Formalise step):
${clip(card.formalise, 6000)}

What the student can see now (${STEP_LABEL[step]} step):
${clip(visibleText, 5000)}`;
}

/** The user message for a quick action on a selected passage. */
export function actionPrompt(action: Exclude<Action, 'question'>, excerpt: string): string {
  const q = `"${clip(excerpt.trim(), 1200)}"`;
  switch (action) {
    case 'explain': return `Explain this passage in plain words, then state its key idea in one sentence:\n${q}`;
    case 'example': return `Give one short, concrete, hypothetical example set in clinical or public-health practice in India that illustrates this passage. Say that it is hypothetical, and that any numbers are made up:\n${q}`;
    case 'why': return `Why does the idea in this passage matter for someone doing clinical research? Give two or three points:\n${q}`;
    case 'quiz': return `Ask me one question that tests whether I have understood this passage. Wait for my answer before giving feedback, and do not reuse the card's Check questions:\n${q}`;
  }
}

export function questionPrompt(question: string, excerpt?: string): string {
  return excerpt ? `About this passage: "${clip(excerpt.trim(), 1200)}"\n\n${question.trim()}` : question.trim();
}
