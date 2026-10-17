"""Diagnostic test measures (port of diagnostic.ts)."""
import math
from dataclasses import dataclass

from .stats import div


@dataclass
class DiagnosticResult:
    sensitivity: float
    specificity: float
    ppv: float
    npv: float
    lr_pos: float
    lr_neg: float


def predictive_values(sensitivity, specificity, prevalence):
    tp = sensitivity * prevalence
    fn = (1 - sensitivity) * prevalence
    fp = (1 - specificity) * (1 - prevalence)
    tn = specificity * (1 - prevalence)
    return DiagnosticResult(
        sensitivity, specificity,
        div(tp, tp + fp), div(tn, tn + fn),
        div(sensitivity, 1 - specificity), div(1 - sensitivity, specificity),
    )


def _round(x):
    return math.floor(x + 0.5)  # JavaScript Math.round


def icon_array_counts(sensitivity, specificity, prevalence, n=1000):
    diseased = _round(n * prevalence)
    tp = _round(diseased * sensitivity)
    tn = _round((n - diseased) * specificity)
    return {"tp": tp, "fn": diseased - tp, "tn": tn, "fp": n - diseased - tn}
