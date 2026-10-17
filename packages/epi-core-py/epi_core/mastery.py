"""Bayesian knowledge tracing (port of mastery.ts)."""
from dataclasses import dataclass

from .stats import div


@dataclass(frozen=True)
class BktParams:
    p_init: float
    p_transit: float
    p_slip: float
    p_guess: float


DEFAULT_BKT = BktParams(p_init=0.2, p_transit=0.15, p_slip=0.1, p_guess=0.25)
MASTERY_THRESHOLD = 0.85


def bkt_update(p_known, correct, params=DEFAULT_BKT):
    p_correct_known = 1 - params.p_slip
    p_correct_unknown = params.p_guess
    if correct:
        posterior = div(p_known * p_correct_known,
                        p_known * p_correct_known + (1 - p_known) * p_correct_unknown)
    else:
        posterior = div(p_known * params.p_slip,
                        p_known * params.p_slip + (1 - p_known) * (1 - params.p_guess))
    return posterior + (1 - posterior) * params.p_transit


def next_due_days(consecutive_correct):
    ladder = [0, 1, 3, 7, 14, 30]
    return ladder[min(consecutive_correct, len(ladder) - 1)]
