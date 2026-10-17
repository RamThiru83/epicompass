"""Measures of disease occurrence (port of occurrence.ts)."""
import math
from dataclasses import dataclass

from .stats import z_for, div


@dataclass
class Interval:
    lower: float
    upper: float
    level: int


@dataclass
class Estimate:
    estimate: float
    ci: Interval


def risk(cases, n, level=95):
    """Risk (incidence proportion) with Wald CI on the proportion scale."""
    if n <= 0:
        raise ValueError("n must be positive")
    p = cases / n
    se = math.sqrt(p * (1 - p) / n)
    z = z_for(level)
    return Estimate(p, Interval(max(0, p - z * se), min(1, p + z * se), level))


def rate(cases, person_time, level=95):
    """Incidence rate with log-scale CI (SE[ln rate] = 1/sqrt(cases)).

    Zero cases: estimate 0, CI (0, NaN), as in the TypeScript version.
    """
    if person_time <= 0:
        raise ValueError("person-time must be positive")
    r = cases / person_time
    z = z_for(level)
    if cases == 0:
        return Estimate(0.0, Interval(0.0, math.nan, level))
    se = 1 / math.sqrt(cases)
    return Estimate(r, Interval(r * math.exp(-z * se), r * math.exp(z * se), level))


prevalence = risk


def risk_from_rate(rate_per_unit, time):
    return 1 - math.exp(-rate_per_unit * time)


def prevalence_from_incidence(rate_per_unit, mean_duration):
    odds = rate_per_unit * mean_duration
    return div(odds, 1 + odds)


def prevalence_trajectory(rate_per_unit, mean_duration, steps, dt=0.1):
    out = []
    p = 0.0
    for _ in range(steps):
        out.append(p)
        dp = rate_per_unit * (1 - p) - div(p, mean_duration)
        p = max(0.0, min(1.0, p + dp * dt))
    return out
