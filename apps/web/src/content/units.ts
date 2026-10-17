import type { Unit } from './types';
export const UNITS: Unit[] = [
  { id: 'A', title: 'Thinking', chapters: [1, 2, 3], outcome: 'Recognise confounding in a story; build a sufficient-cause pie; explain induction time and why the "strength" of a cause depends on the population.' },
  { id: 'B', title: 'Measuring', chapters: [4, 5], outcome: 'Compute risk, rate, prevalence, ratios, differences and attributable fractions; choose and critique a cohort or case-control design.' },
  { id: 'C', title: 'Error', chapters: [6, 7], outcome: 'Classify a bias and predict its direction; read a confidence interval and a P-value function; argue estimation over significance.' },
  { id: 'D', title: 'Analysis', chapters: [8, 9], outcome: 'Produce CI and P-value for a 2 × 2 table; stratify, pool and standardise; quantify confounding.' },
  { id: 'E', title: 'Models', chapters: [10, 11], outcome: 'Read a regression table; explain log and logit transforms; distinguish effect-measure modification from biologic interaction.' },
  { id: 'F', title: 'Applications', chapters: [12, 13, 14, 15], outcome: 'Apply the toolkit to diagnosis, prognosis, trials, infectious-disease dynamics, outbreaks, and the advanced on-ramps.' },
];
