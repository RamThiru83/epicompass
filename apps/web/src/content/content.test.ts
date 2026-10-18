/**
 * Content validator. Runs in CI before every deployment so an edit made in the GitHub web editor
 * that breaks a rule fails the build with a readable message instead of shipping.
 */
import { describe, it, expect } from 'vitest';
import { CHAPTERS, concepts, templates } from './index';
import { INTERACTIVE_IDS } from '../interactives/ids';
import { generate } from '../exercises/engine';

const conceptIds = new Set(concepts.map(c => c.id));
const cards = CHAPTERS.flatMap(ch => ch.cards.map(card => ({ ch, card })));

describe('concept graph', () => {
  it('has unique ids and valid prerequisites', () => {
    expect(new Set(concepts.map(c => c.id)).size).toBe(concepts.length);
    for (const c of concepts) {
      for (const p of c.prerequisites) expect(conceptIds.has(p), `${c.id}: unknown prerequisite ${p}`).toBe(true);
      for (const p of c.confusableWith ?? []) expect(conceptIds.has(p), `${c.id}: unknown confusableWith ${p}`).toBe(true);
    }
  });
});

describe('cards', () => {
  it('have unique ids', () => {
    const ids = cards.map(x => x.card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  for (const { ch, card } of cards) {
    describe(`${card.id} (chapter ${ch.number})`, () => {
      it('belongs to its chapter and has text', () => {
        expect(card.chapter).toBe(ch.number);
        expect(card.title.trim().length).toBeGreaterThan(0);
        expect(card.hook.trim().length).toBeGreaterThan(40);
        expect(card.formalise.trim().length).toBeGreaterThan(80);
        expect(card.minutes).toBeGreaterThan(0);
      });
      it('teaches known concepts', () => {
        expect(card.concepts.length).toBeGreaterThan(0);
        for (const c of card.concepts) expect(conceptIds.has(c), `unknown concept ${c}`).toBe(true);
      });
      it('references an existing interactive and template', () => {
        if (card.explore) expect(INTERACTIVE_IDS.includes(card.explore.interactive), `unknown interactive ${card.explore.interactive}`).toBe(true);
        if (card.practise) { expect(templates[card.practise.template], `unknown template ${card.practise.template}`).toBeDefined(); expect(card.practise.count).toBeGreaterThan(0); }
      });
      it('has well-formed checks', () => {
        expect(card.checks.length).toBeGreaterThan(0);
        for (const chk of card.checks) {
          expect(chk.options.length).toBeGreaterThanOrEqual(3);
          expect(chk.options.filter(o => o.correct).length, `${chk.id}: must have exactly one correct option`).toBe(1);
          for (const o of chk.options) expect(o.feedback.trim().length, `${chk.id}: every option needs feedback`).toBeGreaterThan(0);
          expect(card.concepts.includes(chk.concept), `${chk.id}: concept ${chk.concept} is not taught by this card`).toBe(true);
        }
      });
    });
  }
});

describe('exercise templates', () => {
  for (const t of Object.values(templates)) {
    it(`${t.id} generates solvable problems`, () => {
      for (const c of t.concepts) expect(conceptIds.has(c), `unknown concept ${c}`).toBe(true);
      for (let seed = 1; seed <= 50; seed++) {
        const inst = generate(t, seed * 7919);
        if (t.constraints) expect(t.constraints(inst.params), `seed ${seed} violates constraints`).toBe(true);
        for (const f of t.answerFields) expect(Number.isFinite(inst.key[f.key]), `seed ${seed}: ${f.key} is not finite`).toBe(true);
        expect(inst.narrative.length).toBeGreaterThan(40);
      }
    });
  }
});

describe('interactive id list', () => {
  it('matches the registry', async () => {
    const { INTERACTIVES } = await import('../interactives/registry');
    expect(Object.keys(INTERACTIVES).sort()).toEqual([...INTERACTIVE_IDS].sort());
  });
});
