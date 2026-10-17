/** Diagnostic test measures (Rothman ch. 1 preview, ch. 12). */

export interface DiagnosticResult {
  sensitivity: number; specificity: number; ppv: number; npv: number; lrPos: number; lrNeg: number;
}

/** From test performance and prevalence, the expected predictive values. */
export function predictiveValues(sensitivity: number, specificity: number, prevalence: number): DiagnosticResult {
  const tp = sensitivity * prevalence, fn = (1 - sensitivity) * prevalence;
  const fp = (1 - specificity) * (1 - prevalence), tn = specificity * (1 - prevalence);
  return {
    sensitivity, specificity,
    ppv: tp / (tp + fp), npv: tn / (tn + fn),
    lrPos: sensitivity / (1 - specificity), lrNeg: (1 - sensitivity) / specificity,
  };
}

/** Counts for a 1000-person icon array. */
export function iconArrayCounts(sensitivity: number, specificity: number, prevalence: number, n = 1000) {
  const diseased = Math.round(n * prevalence);
  const tp = Math.round(diseased * sensitivity);
  const tn = Math.round((n - diseased) * specificity);
  return { tp, fn: diseased - tp, tn, fp: n - diseased - tn };
}
