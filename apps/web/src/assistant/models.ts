/**
 * Models the study assistant uses, in order of preference. OpenRouter tries each in turn if one is busy or
 * withdrawn, so a student never has to choose a model. Edit these lists when OpenRouter's catalogue changes
 * (free models come and go every few weeks): https://openrouter.ai/models?max_price=0
 *
 * Checked against OpenRouter's catalogue and chosen by a blinded comparison of ten course requests rated by the
 * instructor (November 2026). Retest each term. Qwen3.5 9B has no free version at present.
 */
export const FREE_MODELS = [
  'nvidia/nemotron-3-ultra-550b-a55b:free', // best in the blinded EpiCompass trial, Nov 2026 (overall 4.74/5, 10 of 10 answered)
  'google/gemma-4-31b-it:free',             // strong benchmarks; often rate-limited upstream (0 of 10 in the trial)
  'google/gemma-4-26b-a4b-it:free',
  'dots-studio/dots-3-note-preview:free',   // last resort: 4.23/5, 9 of 10; once gave a Practise answer away
];

/** For students who add a little credit (US$1 lasts thousands of questions). If Qwen is unavailable or the
 *  credit runs out, the assistant falls back to the free models, so these students are never worse off. */
export const LOW_COST_MODELS = [
  'qwen/qwen3.5-9b',
];

export type ModelPlan = 'free' | 'low-cost';

export const PLAN_LABEL: Record<ModelPlan, string> = {
  'free': 'Free models (NVIDIA Nemotron, Google Gemma)',
  'low-cost': 'Low-cost model (Qwen3.5 9B)',
};
