"""Synthetic-data generators (port of simulate.ts). Deterministic given a seed.

The Mulberry32 generator reproduces the TypeScript stream bit for bit.
"""
import math
from dataclasses import dataclass, field
from typing import Callable, Optional

_M = 0xFFFFFFFF


def _imul(a, b):
    """Math.imul as an unsigned 32-bit result (low 32 bits are identical to the signed form)."""
    return (a * b) & _M


def rng(seed) -> Callable[[], float]:
    a = int(seed) & _M

    def rand():
        nonlocal a
        a = (a + 0x6D2B79F5) & _M
        t = a
        t = _imul(t ^ (t >> 15), t | 1)
        t ^= (t + _imul(t ^ (t >> 7), t | 61)) & _M
        return ((t ^ (t >> 14)) & _M) / 4294967296

    return rand


def binomial(n, p, rand):
    k = 0
    for _ in range(n):
        if rand() < p:
            k += 1
    return k


@dataclass
class Person:
    id: int
    exposed: bool
    confounder: int
    outcome: bool
    time: float


@dataclass
class CohortSpec:
    n: int
    p_confounder: float
    p_exposed: tuple
    baseline_risk: tuple
    true_rr: float
    follow_up: float
    seed: int


def generate_cohort(spec):
    rand = rng(spec.seed)
    people = []
    for i in range(spec.n):
        confounder = 1 if rand() < spec.p_confounder else 0
        exposed = rand() < spec.p_exposed[confounder]
        r = min(0.98, spec.baseline_risk[confounder] * (spec.true_rr if exposed else 1))
        outcome = rand() < r
        time = rand() * spec.follow_up if outcome else spec.follow_up
        people.append(Person(i, exposed, confounder, outcome, time))
    return people


@dataclass
class Tabulation:
    a: int = 0
    b: int = 0
    c: int = 0
    d: int = 0
    pt1: float = 0.0
    pt0: float = 0.0


def tabulate(people, confounder_level: Optional[int] = None):
    t = Tabulation()
    for p in people:
        if confounder_level is not None and p.confounder != confounder_level:
            continue
        if p.exposed:
            if p.outcome:
                t.a += 1
            else:
                t.c += 1
            t.pt1 += p.time
        else:
            if p.outcome:
                t.b += 1
            else:
                t.d += 1
            t.pt0 += p.time
    return t


def sample_case_control(people, controls_per_case, scheme, seed):
    """scheme: 'cumulative' | 'density' | 'caseCohort' (also accepts 'case_cohort')."""
    rand = rng(seed)
    cases = [p for p in people if p.outcome]
    out = {"a": 0, "b": 0, "c": 0, "d": 0}
    for c in cases:
        out["a" if c.exposed else "b"] += 1
    for cs in cases:
        for _ in range(controls_per_case):
            if scheme == "cumulative":
                pool = [p for p in people if not p.outcome]
            elif scheme in ("caseCohort", "case_cohort"):
                pool = people
            else:
                pool = [p for p in people if p.time >= cs.time and p.id != cs.id]
            ctrl = pool[math.floor(rand() * len(pool))]
            out["c" if ctrl.exposed else "d"] += 1
    return out


def reed_frost(N, initial_cases, p, prop_immune, runs, seed, max_gen=60):
    """Returns dict with 'runs' (list of generation lists), 'expected' and 's0'."""
    rand = rng(seed)
    s0 = math.floor(N * (1 - prop_immune) + 0.5) - initial_cases
    out = []
    for _ in range(runs):
        S, C = s0, initial_cases
        g = [C]
        while C > 0 and S > 0 and len(g) < max_gen:
            q = 1 - (1 - p) ** C
            nc = binomial(S, q, rand)
            S -= nc
            C = nc
            g.append(C)
        out.append(g)
    S, C = s0, initial_cases
    expected = [C]
    while C > 0.5 and len(expected) < max_gen:
        nc = S * (1 - (1 - p) ** C)
        S -= nc
        C = nc
        expected.append(C)
    return {"runs": out, "expected": expected, "s0": s0}
