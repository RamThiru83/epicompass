/**
 * Tutor interface. v0.1 ships a local rule-based tutor so the UI and the grounding contract exist from day one.
 * To connect Claude: implement TutorClient in a server-side gateway (never ship API keys to the browser),
 * pass the same TutorContext, and keep the two guardrails below (no numbers from the model; open exercise blocked).
 */
export interface TutorContext {
  cardId: string;
  cardTitle: string;
  concepts: string[];
  openExerciseTemplate?: string;
  masteryVector: Record<string, number>;
  recentWrong: string[];           // item ids answered wrongly recently
}
export interface TutorTurn { role: 'tutor' | 'learner'; text: string; source?: string }
export interface TutorClient {
  name: string;
  opening(ctx: TutorContext): TutorTurn;
  ask(ctx: TutorContext, history: TutorTurn[], question: string): Promise<TutorTurn>;
}

const rules: { test: RegExp; reply: (ctx: TutorContext) => TutorTurn }[] = [
  { test: /answer|solution|key|what is the (rr|rate|risk|odds)/i, reply: ctx => ({ role: 'tutor', source: 'policy: open exercise is blocked',
      text: ctx.openExerciseTemplate ? 'I can\'t give the answer to the open exercise, but I can help you get there. Which quantity goes in the denominator, and why that one?' : 'Which step are you stuck on? Tell me what you have computed so far.' }) },
  { test: /confound/i, reply: () => ({ role: 'tutor', source: 'grounded in: ch06 properties of a confounder', text: 'Before I explain: name the three things that must be true of a variable for it to confound. Which of them can you check from the data in front of you?' }) },
  { test: /rate|person.?time/i, reply: () => ({ role: 'tutor', source: 'grounded in: ch04 risk vs rate', text: 'What is in the denominator of a rate, and how does it differ from the denominator of a risk? Think about someone who leaves the study after one year.' }) },
  { test: /p\s*[<>]|0\.05|significan|no effect/i, reply: () => ({ role: 'tutor', source: 'grounded in: ch07 estimation vs testing', text: 'Look at the confidence interval rather than the P-value. What is the smallest and the largest effect the data are compatible with? Does that range look like "no effect"?' }) },
  { test: /case.?control|odds/i, reply: () => ({ role: 'tutor', source: 'grounded in: ch05 case-control sampling', text: 'How were the controls sampled: from the non-cases at the end, or from the population at risk at each case\'s time? That decides what the odds ratio estimates.' }) },
  { test: /cause|causal|pie/i, reply: () => ({ role: 'tutor', source: 'grounded in: ch03 sufficient-component causes', text: 'In the pie model, what happens to the "strength" of a component cause when its complementary causes become more common in the population?' }) },
];

export const localTutor: TutorClient = {
  name: 'Local tutor (rule-based, no model connected)',
  opening: ctx => ({ role: 'tutor', text: `You have "${ctx.cardTitle}" open. What do you expect to find before you touch the controls?`, source: `grounded in: ${ctx.cardId}` }),
  async ask(ctx, history, q) {
    const learnerTurns = history.filter(h => h.role === 'learner').length + 1;
    const hit = rules.find(r => r.test.test(q));
    if (hit) return hit.reply(ctx);
    if (learnerTurns >= 3) return { role: 'tutor', source: `grounded in: ${ctx.cardId}; numbers come from the calculators, not from me`, text: 'You have had a few goes, so here is the direct version: re-read the Formalise panel on this card, then redo the Explore step with one input changed at a time and watch which output moves.' };
    return { role: 'tutor', source: `grounded in: ${ctx.cardId}`, text: 'Stay with the concept on this card. Can you rephrase your question in terms of one of its key terms: ' + ctx.concepts.join(', ') + '?' };
  },
};
