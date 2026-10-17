"""Basic statistical helpers (port of stats.ts)."""
import math

Z = {80: 1.2816, 90: 1.6449, 95: 1.96, 99: 2.5758}


def z_for(level):
    try:
        return Z[level]
    except KeyError:
        raise ValueError(f"Unsupported confidence level {level}") from None


def normal_cdf(x):
    """Standard normal CDF, Phi(x) = 0.5 * erfc(-x / sqrt(2)).

    The TypeScript version uses the Abramowitz & Stegun 26.2.17 approximation
    (|error| < 7.5e-8); this port is exact to double precision.
    """
    return 0.5 * math.erfc(-x / math.sqrt(2))


def two_sided_p(z):
    # 2 * (1 - Phi(|z|)) written as erfc for accuracy in the tails.
    return math.erfc(abs(z) / math.sqrt(2))


def round_half_up(x, dp=4):
    """JavaScript Math.round semantics (half rounds toward +infinity), not Python's banker's rounding."""
    f = 10.0 ** dp
    return math.floor(x * f + 0.5) / f


# Division / sqrt with IEEE semantics, mirroring JavaScript (x/0 -> inf or nan; sqrt(<0) -> nan).
def div(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        if a == 0 or a != a:
            return math.nan
        neg = (a < 0) != (math.copysign(1.0, b) < 0)
        return -math.inf if neg else math.inf


def sqrt(x):
    return math.sqrt(x) if x >= 0 else math.nan
