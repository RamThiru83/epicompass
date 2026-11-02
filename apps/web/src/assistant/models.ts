/**
 * Models the study assistant uses, in order of preference. OpenRouter tries each in turn if one is busy or
 * withdrawn, so a student never has to choose a model. Edit these lists when OpenRouter's catalogue changes
 * (free models come and go every few weeks): https://openrouter.ai/models?max_price=0
 *
 * Checked against OpenRouter's catalogue in November 2026. Qwen3.5 9B has no free version at present.
 */
export const FREE_MODELS = [
  'google/gemma-4-26b-a4b-it:free',
  'google/gemma-4-31b-it:free',
  'openrouter/free', // OpenRouter picks any available free model
];

export const LOW_COST_MODELS = [
  'qwen/qwen3.5-9b',
];

export type ModelPlan = 'free' | 'low-cost';

export const PLAN_LABEL: Record<ModelPlan, string> = {
  'free': 'Free models (Google Gemma 4)',
  'low-cost': 'Low-cost model (Qwen3.5 9B)',
};
