import type { Concept } from './types';
/** Concept graph for chapters 1–5. Agents extend this; ids are stable and referenced by cards, checks and templates. */
export const CONCEPTS: Concept[] = [
  // ---------- Chapter 1: epidemiologic thinking ----------
  { id: 'confounding', chapter: 1, title: 'Confounding: mixing of effects', prerequisites: [], confusableWith: ['causal_interaction'] },
  { id: 'population_at_risk', chapter: 1, title: 'Population at risk (the denominator)', prerequisites: [], confusableWith: ['source_population'] },
  { id: 'sensitivity_specificity', chapter: 1, title: 'Sensitivity and specificity of a test', prerequisites: [], confusableWith: ['predictive_value'] },
  { id: 'predictive_value', chapter: 1, title: 'Predictive values and the role of prevalence', prerequisites: ['sensitivity_specificity'], confusableWith: ['sensitivity_specificity', 'prevalence'] },

  // ---------- Chapter 2: pioneers ----------
  { id: 'counts_vs_rates', chapter: 2, title: 'Counts versus rates: why denominators matter', prerequisites: ['population_at_risk'], confusableWith: ['incidence_rate'] },
  { id: 'natural_experiment', chapter: 2, title: 'Natural experiment', prerequisites: ['counts_vs_rates', 'confounding'], confusableWith: ['cohort_study'] },
  { id: 'comparison_group', chapter: 2, title: 'The systematic comparison group', prerequisites: ['confounding'], confusableWith: ['source_population'] },
  { id: 'social_determinants', chapter: 2, title: 'Social determinants of health', prerequisites: ['comparison_group'] },

  // ---------- Chapter 3: causation ----------
  { id: 'sufficient_cause', chapter: 3, title: 'Sufficient cause (the causal pie)', prerequisites: [], confusableWith: ['component_cause'] },
  { id: 'component_cause', chapter: 3, title: 'Component cause and necessary cause', prerequisites: ['sufficient_cause'], confusableWith: ['sufficient_cause'] },
  { id: 'multicausality', chapter: 3, title: 'Multicausality; genes and environment', prerequisites: ['component_cause'], confusableWith: ['attributable_fraction'] },
  { id: 'strength_of_cause', chapter: 3, title: 'Strength of a cause depends on prevalence of complements', prerequisites: ['component_cause'], confusableWith: ['risk_ratio'] },
  { id: 'causal_interaction', chapter: 3, title: 'Interaction between causes', prerequisites: ['component_cause'], confusableWith: ['confounding'] },
  { id: 'induction_time', chapter: 3, title: 'Induction time and latent period', prerequisites: ['sufficient_cause'] },
  { id: 'scientific_inference', chapter: 3, title: 'Scientific inference and generalising results', prerequisites: ['sufficient_cause'] },

  // ---------- Chapter 4: measures ----------
  { id: 'risk', chapter: 4, title: 'Risk (incidence proportion), attack rate, case fatality', prerequisites: ['population_at_risk'], confusableWith: ['incidence_rate', 'prevalence'] },
  { id: 'person_time', chapter: 4, title: 'Person-time at risk', prerequisites: ['population_at_risk'], confusableWith: ['closed_open_cohort'] },
  { id: 'incidence_rate', chapter: 4, title: 'Incidence rate', prerequisites: ['person_time'], confusableWith: ['risk'] },
  { id: 'risk_rate_relation', chapter: 4, title: 'Relation between risk and rate', prerequisites: ['risk', 'incidence_rate'] },
  { id: 'prevalence', chapter: 4, title: 'Prevalence and its relation to incidence and duration', prerequisites: ['incidence_rate'], confusableWith: ['risk'] },
  { id: 'risk_ratio', chapter: 4, title: 'Risk ratio', prerequisites: ['risk'], confusableWith: ['odds_ratio', 'rate_ratio'] },
  { id: 'rate_ratio', chapter: 4, title: 'Rate ratio', prerequisites: ['incidence_rate'], confusableWith: ['risk_ratio'] },
  { id: 'risk_difference', chapter: 4, title: 'Risk difference (absolute effect)', prerequisites: ['risk'], confusableWith: ['risk_ratio', 'attributable_fraction'] },
  { id: 'odds_ratio', chapter: 4, title: 'Odds ratio', prerequisites: ['risk'], confusableWith: ['risk_ratio'] },
  { id: 'counterfactual', chapter: 4, title: 'Counterfactual definition of a causal effect', prerequisites: ['risk_ratio', 'confounding'] },
  { id: 'attributable_fraction', chapter: 4, title: 'Attributable fraction (exposed and population)', prerequisites: ['risk_ratio'], confusableWith: ['risk_difference', 'multicausality'] },

  // ---------- Chapter 5: study types ----------
  { id: 'cohort_study', chapter: 5, title: 'Cohort study (including experiments)', prerequisites: ['risk', 'incidence_rate'], confusableWith: ['natural_experiment', 'case_control_study'] },
  { id: 'closed_open_cohort', chapter: 5, title: 'Closed and open cohorts; prospective and retrospective timing', prerequisites: ['cohort_study', 'person_time'], confusableWith: ['person_time'] },
  { id: 'case_control_study', chapter: 5, title: 'Case-control study', prerequisites: ['cohort_study', 'odds_ratio'], confusableWith: ['cohort_study', 'cross_sectional'] },
  { id: 'source_population', chapter: 5, title: 'Source population (study base)', prerequisites: ['case_control_study', 'population_at_risk'], confusableWith: ['population_at_risk', 'comparison_group'] },
  { id: 'control_sampling', chapter: 5, title: 'Control sampling: cumulative, density, case-cohort', prerequisites: ['source_population', 'risk_rate_relation'] },
  { id: 'nested_case_control', chapter: 5, title: 'Nested case-control study', prerequisites: ['control_sampling'], confusableWith: ['case_crossover'] },
  { id: 'case_crossover', chapter: 5, title: 'Case-crossover design', prerequisites: ['case_control_study', 'induction_time'], confusableWith: ['nested_case_control'] },
  { id: 'cross_sectional', chapter: 5, title: 'Cross-sectional versus longitudinal studies', prerequisites: ['prevalence', 'cohort_study'], confusableWith: ['case_control_study'] },
  { id: 'response_rate', chapter: 5, title: 'Response rates and what they do (and do not) imply', prerequisites: ['source_population'] },
];
