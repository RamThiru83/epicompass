"""Shared-vector tests, mirroring packages/epi-core/test/vectors.test.ts."""
import json
import math
from pathlib import Path

import pytest

import epi_core as core

VEC = json.loads((Path(__file__).resolve().parents[2] / ".." / "tests" / "vectors" / "epi-core.json").resolve().read_text())
CASES = VEC["cases"]
TOL = 1e-6


def close(got, exp):
    assert abs(got - exp) <= TOL * max(1, abs(exp)), f"{got} != {exp}"


def run(c):
    i, e, fn = c["input"], c["expected"], c["fn"]
    if fn in ("riskRatio", "oddsRatio", "rateRatio", "mhRiskRatio", "mhOddsRatio", "mhRateRatio", "smr"):
        if fn == "smr":
            r = core.smr(i["observed"], i["expected"])
        elif fn.startswith("mh"):
            r = getattr(core, "mh_" + fn[2:].lower().replace("ratio", "_ratio"))(i["strata"])
        else:
            r = getattr(core, {"riskRatio": "risk_ratio", "oddsRatio": "odds_ratio", "rateRatio": "rate_ratio"}[fn])(i)
        close(r.estimate, e["estimate"])
        if "seLog" in e:
            close(r.se_log, e["seLog"])
        close(r.ci.lower, e["ci"][0])
        close(r.ci.upper, e["ci"][1])
    elif fn in ("riskDifference", "rateDifference"):
        r = getattr(core, {"riskDifference": "risk_difference", "rateDifference": "rate_difference"}[fn])(i)
        close(r.estimate, e["estimate"])
        close(r.se, e["se"])
        close(r.ci.lower, e["ci"][0])
        close(r.ci.upper, e["ci"][1])
    elif fn in ("chi2x2", "chiRate"):
        r = {"chi2x2": core.chi2x2, "chiRate": core.chi_rate}[fn](i)
        close(r.chi, e["chi"])
        close(r.p, e["p"])
    elif fn == "risk":
        r = core.risk(i["cases"], i["n"])
        close(r.estimate, e["estimate"]); close(r.ci.lower, e["ci"][0]); close(r.ci.upper, e["ci"][1])
    elif fn == "rate":
        r = core.rate(i["cases"], i["personTime"])
        close(r.estimate, e["estimate"]); close(r.ci.lower, e["ci"][0]); close(r.ci.upper, e["ci"][1])
    elif fn == "riskFromRate":
        close(core.risk_from_rate(i["rate"], i["time"]), e["value"])
    elif fn == "prevalenceFromIncidence":
        close(core.prevalence_from_incidence(i["rate"], i["duration"]), e["value"])
    elif fn == "attributableFractionExposed":
        close(core.attributable_fraction_exposed(i["rr"]), e["value"])
    elif fn == "populationAttributableFraction":
        close(core.population_attributable_fraction(i["rr"], i["pc"]), e["value"])
    elif fn == "populationAttributableFractionLevin":
        close(core.population_attributable_fraction_levin(i["rr"], i["pe"]), e["value"])
    elif fn == "directStandardisedRate":
        close(core.direct_standardised_rate(i["rates"], i["weights"]), e["value"])
    elif fn == "predictiveValues":
        r = core.predictive_values(i["sens"], i["spec"], i["prev"])
        close(r.ppv, e["ppv"]); close(r.npv, e["npv"])
    elif fn == "bktUpdate":
        close(core.bkt_update(i["pKnown"], i["correct"]), e["value"])
    elif fn == "twoSidedP":
        close(core.two_sided_p(i["z"]), e["value"])
    else:
        raise AssertionError("no runner for " + fn)


@pytest.mark.parametrize("c", CASES, ids=[f"{k}-{c['fn']}" for k, c in enumerate(CASES)])
def test_vector(c):
    run(c)


# First five outputs of Mulberry32(42) in the TypeScript implementation (computed with node).
TS_RNG_42 = [0.6011037519201636, 0.44829055899754167, 0.8524657934904099, 0.6697340414393693, 0.17481389874592423]


def test_rng_matches_typescript():
    r = core.rng(42)
    assert [r() for _ in range(5)] == TS_RNG_42


def test_rate_zero_cases():
    r = core.rate(0, 100)
    assert r.estimate == 0 and r.ci.lower == 0 and math.isnan(r.ci.upper)


def test_simulation_sanity():
    cohort = core.generate_cohort(core.CohortSpec(n=20000, p_confounder=0.5, p_exposed=(0.3, 0.3),
                                                  baseline_risk=(0.05, 0.05), true_rr=2, follow_up=5, seed=7))
    t = core.tabulate(cohort)
    irr = core.rate_ratio({"a": t.a, "b": t.b, "pt1": t.pt1, "pt0": t.pt0}).estimate
    cc = core.sample_case_control(cohort, 2, "density", 11)
    assert abs(math.log(core.odds_ratio(cc).estimate / irr)) < 0.2


def test_reed_frost_shape():
    expected = core.reed_frost(500, 2, 0.004, 0, 1, 3)["expected"]
    peak = expected.index(max(expected))
    assert peak > 0 and expected[-1] < expected[peak]


def test_cohort_matches_typescript():
    # Values produced by the TypeScript generateCohort/tabulate/sampleCaseControl with the same inputs.
    people = core.generate_cohort(core.CohortSpec(n=2000, p_confounder=0.5, p_exposed=(0.3, 0.6),
                                                  baseline_risk=(0.05, 0.1), true_rr=2, follow_up=5, seed=7))
    t = core.tabulate(people)
    assert (t.a, t.b, t.c, t.d) == (167, 82, 735, 1016)
    assert core.sample_case_control(people, 2, "density", 11) == {"a": 167, "b": 82, "c": 220, "d": 278}
