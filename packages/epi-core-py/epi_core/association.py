"""Measures of association for a single 2x2 or person-time table (port of association.ts).

Tables may be passed as dataclasses or as dicts with the same keys.
Ratio results expose `se_log`; difference results expose `se`.
"""
import math
from dataclasses import dataclass

from .occurrence import Interval
from .stats import z_for, two_sided_p, div, sqrt


@dataclass
class RiskTable:
    a: float
    b: float
    c: float
    d: float


# Same shape; a,b cases, c,d controls in case-control data. Exposed first.
CaseControlTable = RiskTable


@dataclass
class RateTable:
    a: float
    b: float
    pt1: float
    pt0: float


@dataclass
class RatioResult:
    estimate: float
    se_log: float
    ci: Interval


@dataclass
class DiffResult:
    estimate: float
    se: float
    ci: Interval


@dataclass
class ChiResult:
    chi: float
    p: float


def as_table(cls, t):
    if isinstance(t, cls):
        return t
    if isinstance(t, dict):
        return cls(**{k: t[k] for k in cls.__dataclass_fields__})
    return cls(**{k: getattr(t, k) for k in cls.__dataclass_fields__})


def log_ci(est, se_log, level):
    z = z_for(level)
    return Interval(est * math.exp(-z * se_log), est * math.exp(z * se_log), level)


def lin_ci(est, se, level):
    z = z_for(level)
    return Interval(est - z * se, est + z * se, level)


# ---- Risk data ----
def risk_ratio(t, level=95):
    t = as_table(RiskTable, t)
    n1, n0 = t.a + t.c, t.b + t.d
    est = div(div(t.a, n1), div(t.b, n0))
    se_log = sqrt(div(1, t.a) - 1 / n1 + div(1, t.b) - 1 / n0)
    return RatioResult(est, se_log, log_ci(est, se_log, level))


def risk_difference(t, level=95):
    t = as_table(RiskTable, t)
    n1, n0 = t.a + t.c, t.b + t.d
    r1, r0 = t.a / n1, t.b / n0
    est = r1 - r0
    se = math.sqrt(r1 * (1 - r1) / n1 + r0 * (1 - r0) / n0)
    return DiffResult(est, se, lin_ci(est, se, level))


def chi2x2(t):
    """Large-sample chi statistic (a - E[a]) / sqrt(V), hypergeometric variance."""
    t = as_table(RiskTable, t)
    n1, n0, m1, m0 = t.a + t.c, t.b + t.d, t.a + t.b, t.c + t.d
    T = n1 + n0
    E = n1 * m1 / T
    V = n1 * n0 * m1 * m0 / (T * T * (T - 1))
    chi = div(t.a - E, sqrt(V))
    return ChiResult(chi, two_sided_p(chi))


# ---- Rate data ----
def rate_ratio(t, level=95):
    t = as_table(RateTable, t)
    est = div(div(t.a, t.pt1), div(t.b, t.pt0))
    se_log = sqrt(div(1, t.a) + div(1, t.b))
    return RatioResult(est, se_log, log_ci(est, se_log, level))


def rate_difference(t, level=95):
    t = as_table(RateTable, t)
    est = t.a / t.pt1 - t.b / t.pt0
    se = math.sqrt(t.a / (t.pt1 * t.pt1) + t.b / (t.pt0 * t.pt0))
    return DiffResult(est, se, lin_ci(est, se, level))


def chi_rate(t):
    t = as_table(RateTable, t)
    M, T = t.a + t.b, t.pt1 + t.pt0
    E = M * t.pt1 / T
    V = M * t.pt1 * t.pt0 / (T * T)
    chi = div(t.a - E, sqrt(V))
    return ChiResult(chi, two_sided_p(chi))


# ---- Case-control data ----
def odds_ratio(t, level=95):
    t = as_table(CaseControlTable, t)
    est = div(t.a * t.d, t.b * t.c)
    se_log = sqrt(div(1, t.a) + div(1, t.b) + div(1, t.c) + div(1, t.d))
    return RatioResult(est, se_log, log_ci(est, se_log, level))


# ---- Attributable fractions ----
def attributable_fraction_exposed(rr):
    return div(rr - 1, rr)


def population_attributable_fraction(rr, proportion_of_cases_exposed):
    return div(proportion_of_cases_exposed * (rr - 1), rr)


def population_attributable_fraction_levin(rr, prevalence_exposed):
    p = prevalence_exposed
    return div(p * (rr - 1), p * (rr - 1) + 1)


# ---- P-value function ----
def p_value_function(estimate, se_log, points=201, span=3.5):
    ln = math.log(estimate)
    lo = min(ln - span * se_log, -0.2)
    hi = max(ln + span * se_log, 0.2)
    out = []
    for i in range(points):
        v = lo + (hi - lo) * i / (points - 1)
        out.append({"x": math.exp(v), "p": two_sided_p(div(ln - v, se_log))})
    return out
