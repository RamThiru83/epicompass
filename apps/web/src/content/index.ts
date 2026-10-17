import type { Chapter, Concept, ExerciseTemplate } from './types';
import { CONCEPTS } from './concepts';
import { ch01 } from './chapters/ch01';
import { ch02 } from './chapters/ch02';
import { ch03 } from './chapters/ch03';
import { ch04 } from './chapters/ch04';
import { ch05 } from './chapters/ch05';
import { TEMPLATES } from './templates';
export { UNITS } from './units';

/** Chapters 6–15 are listed (so the map is complete) but have no cards in v0.1. */
const placeholder = (n: number, title: string, unit: Chapter['unit']): Chapter => ({
  number: n, title, unit, reading: `Rothman, Huybrechts & Murray, 3rd ed., Chapter ${n}`, summary: 'Coming in the next release.', cards: [],
});

export const CHAPTERS: Chapter[] = [
  ch01, ch02, ch03, ch04, ch05,
  placeholder(6, 'Dealing with biases', 'C'), placeholder(7, 'Random error and the role of statistics', 'C'),
  placeholder(8, 'Analyzing simple epidemiologic data', 'D'), placeholder(9, 'Stratified analysis', 'D'),
  placeholder(10, 'Using regression models', 'E'), placeholder(11, 'Measuring interactions', 'E'),
  placeholder(12, 'Epidemiology in clinical settings', 'F'), placeholder(13, 'Infectious disease epidemiology', 'F'),
  placeholder(14, 'Field epidemiology', 'F'), placeholder(15, 'An introduction to some advanced topics', 'F'),
];
export const concepts: Concept[] = CONCEPTS;
export const templates: Record<string, ExerciseTemplate> = Object.fromEntries(TEMPLATES.map(t => [t.id, t]));
export const conceptById = (id: string) => CONCEPTS.find(c => c.id === id);
export const cardById = (id: string) => CHAPTERS.flatMap(c => c.cards).find(c => c.id === id);
