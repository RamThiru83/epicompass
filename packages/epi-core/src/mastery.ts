/** Bayesian knowledge tracing (Corbett & Anderson): one latent "known" state per concept. */

export interface BktParams {
  /** Prior probability the concept is already known. */
  pInit: number;
  /** Probability of learning the concept on each practice opportunity. */
  pTransit: number;
  /** Probability of a wrong answer despite knowing. */
  pSlip: number;
  /** Probability of a right answer without knowing. */
  pGuess: number;
}

export const DEFAULT_BKT: BktParams = { pInit: 0.2, pTransit: 0.15, pSlip: 0.1, pGuess: 0.25 };

/** Update P(known) after one observed response. */
export function bktUpdate(pKnown: number, correct: boolean, params: BktParams = DEFAULT_BKT): number {
  const { pTransit, pSlip, pGuess } = params;
  const pCorrectGivenKnown = 1 - pSlip;
  const pCorrectGivenUnknown = pGuess;
  const posterior = correct
    ? (pKnown * pCorrectGivenKnown) / (pKnown * pCorrectGivenKnown + (1 - pKnown) * pCorrectGivenUnknown)
    : (pKnown * pSlip) / (pKnown * pSlip + (1 - pKnown) * (1 - pGuess));
  return posterior + (1 - posterior) * pTransit;
}

export const MASTERY_THRESHOLD = 0.85;

/** Spacing: next due time grows with consecutive successes (days). */
export function nextDueDays(consecutiveCorrect: number): number {
  const ladder = [0, 1, 3, 7, 14, 30];
  return ladder[Math.min(consecutiveCorrect, ladder.length - 1)];
}
