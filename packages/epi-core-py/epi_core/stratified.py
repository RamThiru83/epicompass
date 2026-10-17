"""Stratified analysis: Mantel-Haenszel pooling and standardisation (port of stratified.ts)."""
import math
from dataclasses import dataclass
from typing import Optional

from .association import RiskTable, RateTable, CaseControlTable, as_table, log_ci, lin_ci
from .occurrence import Interval
from .stats import div, sqrt


@dataclass
class PooledResult:
    estimate: float
    ci: Interval
    se_log: Optional[float] = None
    se: Optional[float] = None


def _pooled_ratio(est, se_log, level):
    return PooledResult(est, log_ci(est, se_log, level), se_log=se_log)


def mh_risk_ratio(strata, level=95):
    num = den = v = 0.0
    for s in strata:
        s = as_table(RiskTable, s)
        n1, n0 = s.a + s.c, s.b + s.d
        T = n1 + n0
        m1 = s.a + s.b
        num += s.a * n0 / T
        den += s.b * n1 / T
        v += m1 * n1 * n0 / (T * T) - s.a * s.b / T
    est = div(num, den)
    se_log = sqrt(div(v, num * den))
    return _pooled_ratio(est, se_log, level)


def mh_risk_difference(strata, level=95):
    num = W = v = 0.0
    for s in strata:
        s = as_table(RiskTable, s)
        n1, n0 = s.a + s.c, s.b + s.d
        T = n1 + n0
        num += (s.a * n0 - s.b * n1) / T
        w = n1 * n0 / T
        W += w
        r1, r0 = s.a / n1, s.b / n0
        v += (r1 * (1 - r1) / n1 + r0 * (1 - r0) / n0) * w * w
    est = num / W
    se = math.sqrt(v) / W
    return PooledResult(est, lin_ci(est, se, level), se=se)


def mh_rate_ratio(strata, level=95):
    num = den = v = 0.0
    for s in strata:
        s = as_table(RateTable, s)
        T = s.pt1 + s.pt0
        M = s.a + s.b
        num += s.a * s.pt0 / T
        den += s.b * s.pt1 / T
        v += M * s.pt1 * s.pt0 / (T * T)
    est = div(num, den)
    se_log = sqrt(div(v, num * den))
    return _pooled_ratio(est, se_log, level)


def mh_odds_ratio(strata, level=95):
    R = S = PR = PSQR = QS = 0.0
    for s in strata:
        s = as_table(CaseControlTable, s)
        T = s.a + s.b + s.c + s.d
        r, q = s.a * s.d / T, s.b * s.c / T
        P, Q = (s.a + s.d) / T, (s.b + s.c) / T
        R += r
        S += q
        PR += P * r
        PSQR += P * q + Q * r
        QS += Q * q
    est = div(R, S)
    var_log = div(PR, 2 * R * R) + div(PSQR, 2 * R * S) + div(QS, 2 * S * S)
    se_log = sqrt(var_log)
    return _pooled_ratio(est, se_log, level)


def direct_standardised_rate(stratum_rates, standard_weights):
    W = sum(standard_weights)
    return div(sum(r * standard_weights[i] for i, r in enumerate(stratum_rates)), W)


def smr(observed, expected, level=95):
    est = div(observed, expected)
    se_log = div(1, sqrt(observed))
    return _pooled_ratio(est, se_log, level)


def confounding_ratio(crude, adjusted):
    """Confounding is material when crude and adjusted differ by more than ~10%."""
    ratio = div(crude, adjusted)
    return {"ratio": ratio, "material": abs(math.log(ratio)) > math.log(1.1)}
