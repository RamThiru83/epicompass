import type { InteractiveMeta } from '../types';
import { SimpsonExplorer } from './SimpsonExplorer';
import { PopulationAtRisk } from './PopulationAtRisk';
import { ScreeningPreview } from './ScreeningPreview';
import { SnowRates } from './SnowRates';
import { CausalPies } from './CausalPies';
import { InductionTimeline } from './InductionTimeline';

export const UNIT_A: InteractiveMeta[] = [
  { id: 'simpson-explorer', title: 'Confounding by age', chapter: 1, component: SimpsonExplorer },
  { id: 'population-at-risk', title: 'Who belongs in the denominator?', chapter: 1, component: PopulationAtRisk },
  { id: 'screening-preview', title: 'Screening and predictive values', chapter: 1, component: ScreeningPreview },
  { id: 'snow-rates', title: 'Snow’s natural experiment', chapter: 2, component: SnowRates },
  { id: 'causal-pies', title: 'Causal pies', chapter: 3, component: CausalPies },
  { id: 'induction-timeline', title: 'Induction and latent periods', chapter: 3, component: InductionTimeline },
];
