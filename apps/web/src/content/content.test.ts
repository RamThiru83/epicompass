/**
 * Content validator. Runs in CI before every deployment so an edit made in the GitHub web editor
 * that breaks a rule fails the build with a readable message instead of shipping.
 */
import { describe, it, expect } from 'vitest';
import { CHAPTERS, concepts, templates } from './index';
import { INTERACTIVE_IDS } from '../interactives/ids';
import { generate } from '../exercises/engine';
import { GLOSSARY, stripPreviews, previewKeys, glossaryHas } from './glossary';

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
      if (card.bonus) {
        it('bonus card has a video and no assessed content', () => {
          expect(card.bonus!.youtubeId).toMatch(/^[\w-]{11}$/);
          expect(card.checks.length).toBe(0);
          expect(card.concepts.length).toBe(0);
          expect(card.practise).toBeUndefined();
        });
        return;
      }
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

describe('vocabulary order', () => {
  // A term formally taught in chapter N may appear before chapter N only inside a [[preview]] marker.
  const textsOf = (card: typeof cards[number]['card']) => [
    card.title, card.hook, card.formalise, card.explore?.prompt ?? '',
    ...card.checks.flatMap(c => [c.prompt, ...c.options.flatMap(o => [o.text, o.feedback])]),
  ];
  for (const ch of CHAPTERS) {
    it(`chapter ${ch.number} uses later-chapter terms only as previews`, () => {
      const blocks = [ch.summary, ...ch.cards.flatMap(textsOf)];
      for (const b of blocks) for (const k of previewKeys(b)) expect(glossaryHas(k), `unknown preview term [[${k}]]`).toBe(true);
      const plain = blocks.map(stripPreviews).join('\n');
      for (const [term, g] of Object.entries(GLOSSARY)) {
        if (ch.number >= g.chapter) continue;
        const m = plain.match(g.pattern);
        expect(m, `chapter ${ch.number} uses "${m?.[0]}" (taught in chapter ${g.chapter}) without a [[${term}]] marker`).toBeNull();
      }
    });
  }
});

describe('mastery is reachable', () => {
  // A learner who answers every check and practice problem correctly at the first try must cross the
  // mastery line for every concept taught in an open chapter. With the default BKT settings that takes
  // three correct first answers, so a concept with fewer opportunities would stay below 85% for ever.
  it('every taught concept gets enough first answers for a perfect run to reach mastery', async () => {
    const { DEFAULT_BKT, bktUpdate, MASTERY_THRESHOLD } = await import('@epicompass/epi-core');
    const n: Record<string, number> = {};
    for (const { card } of cards) {
      for (const it of card.checks) n[it.concept] = (n[it.concept] ?? 0) + 1;
      if (card.practise) for (const c of templates[card.practise.template]?.concepts ?? []) n[c] = (n[c] ?? 0) + card.practise.count;
    }
    const taught = new Set(cards.flatMap(({ card }) => card.concepts));
    for (const id of taught) {
      let p = DEFAULT_BKT.pInit;
      for (let i = 0; i < (n[id] ?? 0); i++) p = bktUpdate(p, true);
      expect(p, `${id}: only ${n[id] ?? 0} answers across the course; a perfect run reaches ${Math.round(p * 100)}%. Add check items.`).toBeGreaterThanOrEqual(MASTERY_THRESHOLD);
    }
  });
});
