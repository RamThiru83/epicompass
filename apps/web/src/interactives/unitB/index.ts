import type { InteractiveMeta } from '../types';
import { RiskVsRate } from './RiskVsRate';
import { PrevalenceBathtub } from './PrevalenceBathtub';
import { MeasuresCalculator } from './MeasuresCalculator';
import { TwoByTwo } from './TwoByTwo';
import { DesignSampler } from './DesignSampler';
import { AttributableFraction } from './AttributableFraction';

export const UNIT_B: InteractiveMeta[] = [
  { id: 'risk-vs-rate', title: 'Risk versus rate in a closed cohort', chapter: 4, component: RiskVsRate },
  { id: 'prevalence-bathtub', title: 'Prevalence, incidence and duration', chapter: 4, component: PrevalenceBathtub },
  { id: 'measures-calculator', title: 'Ratios, differences and attributable fractions', chapter: 4, component: MeasuresCalculator },
  { id: 'two-by-two', title: 'Analysing a 2×2 table', chapter: 4, component: TwoByTwo },
  { id: 'design-sampler', title: 'Cohort and case-control sampling', chapter: 5, component: DesignSampler },
  { id: 'attributable-fraction', title: 'Attributable fraction in 1,000 people', chapter: 4, component: AttributableFraction },
];
