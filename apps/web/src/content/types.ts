/**
 * Content schema. All text is the instructor's own; the textbook is cited as reading, never reproduced.
 * Markdown fields support $inline$ and $$display$$ maths (KaTeX).
 */

export type UnitId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface Unit {
  id: UnitId;
  title: string;
  chapters: number[];
  outcome: string; // what the learner can do at the end
}

export interface Concept {
  id: string;              // e.g. "confounding", "incidence_rate"
  chapter: number;
  title: string;
  prerequisites: string[]; // concept ids
  confusableWith?: string[];
}

export interface CheckOption { text: string; correct: boolean; feedback: string }

export interface CheckItem {
  id: string;
  concept: string;         // concept id this item evidences
  prompt: string;          // markdown
  options: CheckOption[];  // 3–4 options, exactly one correct (multi-select not in v0.1)
}

export interface ExploreStep {
  interactive: string;     // key in the interactives registry
  prompt: string;          // what to try, markdown
  props?: Record<string, unknown>;
}

export interface Card {
  id: string;              // "ch04-risk-vs-rate"
  chapter: number;
  order: number;
  title: string;
  concepts: string[];      // concept ids taught
  minutes: number;         // expected time
  hook: string;            // markdown: a short clinical or historical vignette
  explore?: ExploreStep;
  formalise: string;       // markdown: the explanation with formulas
  practise?: { template: string; count: number }; // exercise template id and how many instances to pass
  checks: CheckItem[];
  /** Optional light-hearted wrap-up: a video with no steps, checks or concepts; excluded from progress counts. */
  bonus?: { youtubeId: string; channel: string; videoTitle: string };
}

/** Cards that count towards progress and mastery (bonus cards are optional extras). */
export const coreCards = (ch: { cards: Card[] }) => ch.cards.filter(c => !c.bonus);

export interface Chapter {
  number: number;
  title: string;
  unit: UnitId;
  reading: string;         // e.g. "Rothman, Huybrechts & Murray, 3rd ed., Chapter 4"
  summary: string;         // markdown, 2–4 sentences in the instructor's words
  cards: Card[];
}

/** A deterministic exercise template: parameters are drawn, a solver computes the key, narrative is slot-filled. */
export interface ExerciseTemplate {
  id: string;
  concepts: string[];
  difficulty: 1 | 2 | 3;
  /** Integer or float ranges; draw uniformly. */
  params: Record<string, { min: number; max: number; integer?: boolean }>;
  /** Reject draws that fail (e.g. a/N1 > b/N0). */
  constraints?: (p: Record<string, number>) => boolean;
  /** Markdown scenario built from the drawn parameters. Vary wording using the seed. */
  narrative: (p: Record<string, number>, pick: <T>(arr: T[]) => T) => string;
  /** Deterministic solver using epi-core. */
  solve: (p: Record<string, number>) => Record<string, number>;
  answerFields: { key: string; label: string; tolerance: number; format: 'dec2' | 'dec3' | 'pct' | 'int' | 'sci' }[];
  hints: string[];
  /** Worked solution shown after the attempt, markdown with {key} placeholders filled from the solution. */
  solution: string;
}

export interface ExerciseInstance {
  templateId: string;
  seed: number;
  params: Record<string, number>;
  narrative: string;
  key: Record<string, number>;
}
