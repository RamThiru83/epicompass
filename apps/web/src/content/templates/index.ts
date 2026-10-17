import type { ExerciseTemplate } from '../types';
import {
  risk, rate, rateRatio, riskFromRate, prevalenceFromIncidence,
  riskRatio, riskDifference, oddsRatio,
  attributableFractionExposed, populationAttributableFraction,
} from '@epicompass/epi-core';

/**
 * Exercise templates for chapters 2, 4 and 5. All scenarios and numbers are synthetic.
 * Solutions are markdown; {param} and {key} placeholders are filled at display time.
 * Placeholder names are lower camelCase so they never collide with \mathrm{...} labels in the maths.
 */
const md = String.raw;

export const TEMPLATES: ExerciseTemplate[] = [
  // ---------------------------------------------------------------- ch02
  {
    id: 'ch02-snow-rate-ratio',
    concepts: ['counts_vs_rates', 'natural_experiment'],
    difficulty: 1,
    params: {
      deathsA: { min: 600, max: 1400, integer: true },
      housesA: { min: 30000, max: 50000, integer: true },
      deathsB: { min: 40, max: 160, integer: true },
      housesB: { min: 15000, max: 30000, integer: true },
    },
    constraints: p => (p.deathsA / p.housesA) > 3 * (p.deathsB / p.housesB),
    narrative: (p, pick) => {
      const city = pick(['a crowded river port', 'an industrial mill town', 'a fast-growing market city', 'a harbour city']);
      const inspector = pick(['a district medical officer', 'a sanitary inspector', 'a parish physician', 'a registrar of deaths']);
      const sources = pick([
        ['the Upstream Water Company', 'the Downstream Water Company'],
        ['the Hillside Supply', 'the Riverside Supply'],
        ['the New Reservoir Company', 'the Old Basin Company'],
      ]);
      return `During a cholera season in ${city} in the 1850s (a fictional setting), ${inspector} recorded deaths by the water company supplying each household. ` +
        `Houses supplied by ${sources[1]}, which drew water from the polluted stretch of river, numbered ${p.housesA.toLocaleString('en-GB')} and recorded ${p.deathsA} cholera deaths. ` +
        `Houses supplied by ${sources[0]}, which drew cleaner water, numbered ${p.housesB.toLocaleString('en-GB')} and recorded ${p.deathsB} deaths. ` +
        `The two companies' pipes ran down the same streets, so neighbouring houses often had different suppliers. ` +
        `Calculate the death rate per 10,000 houses for each supplier and the ratio of the two rates (polluted over cleaner).`;
    },
    solve: p => {
      const t = { a: p.deathsA, b: p.deathsB, pt1: p.housesA, pt0: p.housesB };
      return {
        rateA: rate(p.deathsA, p.housesA).estimate * 10000,
        rateB: rate(p.deathsB, p.housesB).estimate * 10000,
        ratio: rateRatio(t).estimate,
      };
    },
    answerFields: [
      { key: 'rateA', label: 'Deaths per 10,000 houses, polluted supply', tolerance: 0.02, format: 'dec2' },
      { key: 'rateB', label: 'Deaths per 10,000 houses, cleaner supply', tolerance: 0.02, format: 'dec2' },
      { key: 'ratio', label: 'Ratio of rates (polluted / cleaner)', tolerance: 0.02, format: 'dec2' },
    ],
    hints: [
      'Divide each death count by the number of houses served, then scale to 10,000 houses.',
      'The ratio compares the two scaled rates; the scaling factor cancels, so you can use the unscaled values too.',
    ],
    solution: md`**Polluted supply:** $\dfrac{{deathsA}}{{housesA}} \times 10{,}000 = {rateA}$ deaths per 10,000 houses.

**Cleaner supply:** $\dfrac{{deathsB}}{{housesB}} \times 10{,}000 = {rateB}$ deaths per 10,000 houses.

**Ratio:** $\dfrac{{rateA}}{{rateB}} = {ratio}$.

Comparing raw death counts would mislead because the suppliers served different numbers of houses. Because the pipes were interleaved street by street, households on each supply were otherwise alike, which is what makes this a natural experiment.`,
  },

  // ---------------------------------------------------------------- ch04 risk
  {
    id: 'ch04-risk',
    concepts: ['risk'],
    difficulty: 1,
    params: {
      cases: { min: 5, max: 120, integer: true },
      n: { min: 200, max: 2000, integer: true },
    },
    constraints: p => p.cases < 0.25 * p.n,
    narrative: (p, pick) => {
      const s = pick([
        { who: 'women delivering at a district hospital in Rajasthan', what: 'postpartum haemorrhage within 24 hours of birth', when: 'over the 24 hours after delivery' },
        { who: 'adults started on first-line anti-tubercular treatment in a Pune clinic', what: 'drug-induced hepatitis', when: 'during the first two months of treatment' },
        { who: 'children admitted to a Chennai paediatric ward', what: 'a hospital-acquired infection', when: 'during their admission' },
        { who: 'patients undergoing elective caesarean section at a Delhi teaching hospital', what: 'surgical-site infection', when: 'within 30 days of surgery' },
      ]);
      return `A quality-improvement team followed ${p.n} ${s.who}. Nobody had the outcome at the start, and every person was followed for the whole period. ` +
        `${p.cases} developed ${s.what} ${s.when}. What is the risk (incidence proportion) of ${s.what} over this period? Give it as a percentage.`;
    },
    solve: p => ({ riskP: risk(p.cases, p.n).estimate }),
    answerFields: [{ key: 'riskP', label: 'Risk (%)', tolerance: 0.02, format: 'pct' }],
    hints: [
      'Risk = new cases divided by the number of people at risk at the start.',
      'State the period: a risk without a time window is incomplete.',
    ],
    solution: md`$$R = \frac{\text{new cases}}{\text{people at risk at start}} = \frac{{cases}}{{n}} = {riskP}$$

Multiply by 100 to express it as a percentage. Report it with its time window, for example "the 30-day risk was …". Because everyone was followed for the full period, the simple proportion is a valid estimate of risk.`,
  },

  // ---------------------------------------------------------------- ch04 rate
  {
    id: 'ch04-rate',
    concepts: ['incidence_rate', 'person_time'],
    difficulty: 1,
    params: {
      cases: { min: 5, max: 150, integer: true },
      py: { min: 1000, max: 40000, integer: true },
    },
    constraints: p => p.cases / p.py < 0.1,
    narrative: (p, pick) => {
      const s = pick([
        { who: 'people living with HIV attending an ART centre in Manipur', what: 'incident tuberculosis' },
        { who: 'adults with type 2 diabetes in a Kerala primary-care registry', what: 'first foot ulcer' },
        { who: 'workers in a stone-quarrying cooperative in Rajasthan', what: 'newly diagnosed silicosis' },
        { who: 'older adults enrolled in a community falls programme in Mysuru', what: 'hip fracture' },
      ]);
      return `A dynamic cohort of ${s.who} was followed; people joined and left at different times. ` +
        `Across all participants, the total follow-up was ${p.py.toLocaleString('en-GB')} person-years, during which ${p.cases} cases of ${s.what} were recorded. ` +
        `Calculate the incidence rate per 1,000 person-years.`;
    },
    solve: p => ({ rate1000: rate(p.cases, p.py).estimate * 1000 }),
    answerFields: [{ key: 'rate1000', label: 'Rate per 1,000 person-years', tolerance: 0.02, format: 'dec2' }],
    hints: [
      'The denominator is person-time, not the number of people.',
      'Divide cases by person-years, then multiply by 1,000.',
    ],
    solution: md`$$I = \frac{\text{cases}}{\text{person-time}} = \frac{{cases}}{{py}\ \mathrm{PY}} \times 1000 = {rate1000} \text{ per 1,000 PY}$$

A rate has units of $1/\text{time}$; it is not a proportion and can, in principle, exceed 1. Saying "{rate1000} per 1,000 person-years" keeps the units explicit.`,
  },

  // ---------------------------------------------------------------- ch04 risk from rate
  {
    id: 'ch04-risk-from-rate',
    concepts: ['risk_rate_relation'],
    difficulty: 2,
    params: {
      ratePer1000: { min: 5, max: 120 },
      years: { min: 1, max: 10, integer: true },
    },
    constraints: p => p.ratePer1000 * p.years / 1000 > 0.05,
    narrative: (p, pick) => {
      const s = pick([
        'progression from gestational diabetes to type 2 diabetes among women in a Hyderabad postpartum clinic',
        'end-stage kidney disease among patients with stage 4 chronic kidney disease in a Lucknow nephrology unit',
        'first stroke among adults with uncontrolled hypertension in a Bhubaneswar screening cohort',
        'death among patients on long-term haemodialysis in a Kolkata unit',
      ]);
      return `The incidence rate of ${s} is assumed constant at ${p.ratePer1000.toFixed(1)} per 1,000 person-years, and there are no competing risks. ` +
        `(a) Calculate the "naive" product of rate and time for ${p.years} years. ` +
        `(b) Calculate the ${p.years}-year risk using the exponential formula.`;
    },
    solve: p => {
      const r = p.ratePer1000 / 1000;
      return { naive: r * p.years, riskT: riskFromRate(r, p.years) };
    },
    answerFields: [
      { key: 'naive', label: '(a) Rate × time (%)', tolerance: 0.02, format: 'pct' },
      { key: 'riskT', label: '(b) Risk, 1 − exp(−rate × time) (%)', tolerance: 0.02, format: 'pct' },
    ],
    hints: [
      'Convert the rate to per person-year first (divide by 1,000).',
      'Risk = 1 − exp(−rate × time). It is always smaller than rate × time.',
    ],
    solution: md`Rate per person-year $= {ratePer1000}/1000$.

**(a)** $I \times t = {naive}$.

**(b)** $R(t) = 1 - e^{-I t} = {riskT}$.

The product $I \times t$ is a good approximation only when it is small (below about 0.1). As people develop the outcome they leave the pool at risk, so the true risk grows more slowly than $I \times t$ and can never exceed 1.`,
  },

  // ---------------------------------------------------------------- ch04 prevalence
  {
    id: 'ch04-prevalence-incidence',
    concepts: ['prevalence'],
    difficulty: 2,
    params: {
      incPer1000: { min: 2, max: 40 },
      duration: { min: 0.5, max: 15 },
    },
    constraints: p => {
      const o = (p.incPer1000 / 1000) * p.duration;
      return o > 0.02 && o < 0.6;
    },
    narrative: (p, pick) => {
      const s = pick([
        'chronic hepatitis B in a stable district population',
        'type 2 diabetes in a stable urban ward',
        'rheumatoid arthritis in a stable rural block',
        'chronic obstructive pulmonary disease among long-term residents of a peri-urban township',
      ]);
      return `Assume a steady state for ${s}: the incidence rate among people free of the condition is ${p.incPer1000.toFixed(1)} per 1,000 person-years, ` +
        `and the average duration of the condition (until cure, death or migration) is ${p.duration.toFixed(1)} years. ` +
        `Calculate (a) the prevalence odds and (b) the prevalence proportion.`;
    },
    solve: p => {
      const i = p.incPer1000 / 1000;
      const prev = prevalenceFromIncidence(i, p.duration);
      return { prevOdds: prev / (1 - prev), prev };
    },
    answerFields: [
      { key: 'prevOdds', label: '(a) Prevalence odds', tolerance: 0.02, format: 'dec3' },
      { key: 'prev', label: '(b) Prevalence (%)', tolerance: 0.02, format: 'pct' },
    ],
    hints: [
      'In a steady state, prevalence odds = incidence rate × average duration (rate per person-year).',
      'Convert odds to a proportion: P = odds / (1 + odds).',
    ],
    solution: md`**(a)** $\dfrac{P}{1-P} = I \times \bar{D} = \dfrac{{incPer1000}}{1000} \times {duration} = {prevOdds}$

**(b)** $P = \dfrac{{prevOdds}}{1 + {prevOdds}} = {prev}$

When prevalence is low, $P \approx I \times \bar{D}$. The relation reminds us that a condition can be common because many people develop it, or because it lasts a long time; better survival with a chronic disease raises prevalence even if incidence is unchanged.`,
  },

  // ---------------------------------------------------------------- ch04 RR and RD
  {
    id: 'ch04-risk-ratio-difference',
    concepts: ['risk_ratio', 'risk_difference'],
    difficulty: 2,
    params: {
      a: { min: 10, max: 80, integer: true },
      n1: { min: 120, max: 600, integer: true },
      b: { min: 5, max: 60, integer: true },
      n0: { min: 120, max: 600, integer: true },
    },
    constraints: p => {
      if (p.n1 - p.a < 5 || p.n0 - p.b < 5) return false;
      if (p.a / p.n1 > 0.35) return false;
      if (p.a / p.n1 < 1.2 * (p.b / p.n0)) return false;
      const rd = riskDifference({ a: p.a, b: p.b, c: p.n1 - p.a, d: p.n0 - p.b });
      return Math.abs(rd.ci.lower) > 0.01;
    },
    narrative: (p, pick) => {
      const s = pick([
        { exp: 'were severely anaemic (haemoglobin below 7 g/dL) at booking', unexp: 'were not', out: 'a preterm birth', setting: 'pregnant women in a Faridabad antenatal cohort' },
        { exp: 'smoked bidis', unexp: 'did not smoke', out: 'a surgical wound infection', setting: 'men undergoing hernia repair at a Jaipur hospital' },
        { exp: 'had diabetes', unexp: 'did not', out: 'treatment failure', setting: 'adults treated for pulmonary tuberculosis in a Nagpur programme' },
        { exp: 'were born below 2,000 g', unexp: 'were born at 2,000 g or more', out: 'neonatal sepsis', setting: 'newborns in a Puducherry special newborn care unit' },
      ]);
      return `In a cohort of ${s.setting}, ${p.n1} ${s.exp} and ${p.n0} ${s.unexp}. ` +
        `Over follow-up, ${p.a} of the exposed and ${p.b} of the unexposed had ${s.out}. Everyone was followed to the end of the risk period. ` +
        `Estimate the risk ratio and the risk difference, each with a 95% confidence interval.`;
    },
    solve: p => {
      const t = { a: p.a, b: p.b, c: p.n1 - p.a, d: p.n0 - p.b };
      const rr = riskRatio(t), rd = riskDifference(t);
      return {
        r1: p.a / p.n1, r0: p.b / p.n0,
        rr: rr.estimate, rrLo: rr.ci.lower, rrHi: rr.ci.upper,
        rd: rd.estimate, rdLo: rd.ci.lower, rdHi: rd.ci.upper,
      };
    },
    answerFields: [
      { key: 'rr', label: 'Risk ratio', tolerance: 0.02, format: 'dec2' },
      { key: 'rrLo', label: 'RR lower 95% limit', tolerance: 0.03, format: 'dec2' },
      { key: 'rrHi', label: 'RR upper 95% limit', tolerance: 0.03, format: 'dec2' },
      { key: 'rd', label: 'Risk difference (%)', tolerance: 0.02, format: 'pct' },
      { key: 'rdLo', label: 'RD lower 95% limit (%)', tolerance: 0.03, format: 'pct' },
      { key: 'rdHi', label: 'RD upper 95% limit (%)', tolerance: 0.03, format: 'pct' },
    ],
    hints: [
      'Compute R1 = a/N1 and R0 = b/N0 first. RR = R1/R0; RD = R1 − R0.',
      'For the RR, build the interval on the log scale: SE = √(1/a − 1/N1 + 1/b − 1/N0). For the RD, SE = √(R1(1−R1)/N1 + R0(1−R0)/N0).',
    ],
    solution: md`$R_1 = {a}/{n1} = {r1}$, $\;R_0 = {b}/{n0} = {r0}$.

**Risk ratio:** $\mathrm{RR} = R_1/R_0 = {rr}$, with
$$\mathrm{SE}(\ln \mathrm{RR}) = \sqrt{1/a - 1/N_1 + 1/b - 1/N_0}, \qquad \mathrm{RR}\, e^{\pm 1.96\,\mathrm{SE}}$$
giving 95% CI {rrLo} to {rrHi}.

**Risk difference:** $\mathrm{RD} = R_1 - R_0 = {rd}$, with
$$\mathrm{SE} = \sqrt{\tfrac{R_1(1-R_1)}{N_1} + \tfrac{R_0(1-R_0)}{N_0}}, \qquad \mathrm{RD} \pm 1.96\,\mathrm{SE}$$
giving 95% CI {rdLo} to {rdHi} (multiply by 100 for percentage points).

Read the interval as the range of effect sizes reasonably compatible with the data: its width tells you how precise the estimate is.`,
  },

  // ---------------------------------------------------------------- ch04 attributable fraction
  {
    id: 'ch04-attributable-fraction',
    concepts: ['attributable_fraction'],
    difficulty: 2,
    params: {
      rr: { min: 1.3, max: 6 },
      pc: { min: 0.1, max: 0.8 },
    },
    narrative: (p, pick) => {
      const s = pick([
        { exp: 'household solid-fuel use', out: 'childhood pneumonia', setting: 'a hill district' },
        { exp: 'tobacco chewing', out: 'oral cancer', setting: 'a coastal district cancer registry area' },
        { exp: 'obesity', out: 'gestational diabetes', setting: 'an urban maternity network' },
        { exp: 'unsafe drinking water', out: 'acute diarrhoeal disease', setting: 'a peri-urban block' },
      ]);
      return `In ${s.setting}, the causal risk ratio for ${s.out} associated with ${s.exp} is estimated at ${p.rr.toFixed(2)}, assuming no confounding. ` +
        `Among all cases of ${s.out} in the area, ${(p.pc * 100).toFixed(0)}% were exposed. ` +
        `Calculate (a) the attributable fraction among the exposed and (b) the population attributable fraction.`;
    },
    solve: p => {
      const pcR = Math.round(p.pc * 100) / 100; // match the rounded figure shown in the narrative
      return { afe: attributableFractionExposed(p.rr), paf: populationAttributableFraction(p.rr, pcR), pcR };
    },
    answerFields: [
      { key: 'afe', label: '(a) AF among exposed (%)', tolerance: 0.02, format: 'pct' },
      { key: 'paf', label: '(b) Population AF (%)', tolerance: 0.02, format: 'pct' },
    ],
    hints: [
      'AF among the exposed = (RR − 1)/RR.',
      'Population AF = proportion of cases exposed × (RR − 1)/RR.',
    ],
    solution: md`**(a)** $\mathrm{AF}_e = \dfrac{\mathrm{RR}-1}{\mathrm{RR}} = \dfrac{{rr} - 1}{{rr}} = {afe}$

**(b)** $\mathrm{AF}_p = p_c \times \mathrm{AF}_e = {pcR} \times {afe} = {paf}$

Interpretation: among exposed cases, this fraction would not have occurred had the exposure been absent; across all cases, the population fraction would have been prevented by removing the exposure entirely. Fractions for different causes can add to more than 100%, because one case can be prevented by removing any of several component causes.`,
  },

  // ---------------------------------------------------------------- ch05 odds ratio
  {
    id: 'ch05-odds-ratio',
    concepts: ['odds_ratio', 'case_control_study'],
    difficulty: 2,
    params: {
      a: { min: 10, max: 120, integer: true },
      b: { min: 10, max: 150, integer: true },
      c: { min: 10, max: 150, integer: true },
      d: { min: 20, max: 300, integer: true },
    },
    constraints: p => {
      const or = (p.a * p.d) / (p.b * p.c);
      return (or > 1.3 && or < 8) || (or > 0.15 && or < 0.75);
    },
    narrative: (p, pick) => {
      const s = pick([
        { cases: 'women with newly diagnosed cervical cancer at a Mumbai oncology centre', controls: 'women sampled from the same catchment population', exp: 'long-term use of combined oral contraceptives' },
        { cases: 'children admitted with severe dengue in a Chennai hospital', controls: 'children sampled from the neighbourhoods the cases came from', exp: 'living in a house with uncovered water containers' },
        { cases: 'adults with newly diagnosed oesophageal cancer in an Assam referral hospital', controls: 'adults sampled from the districts served by the hospital', exp: 'habitual drinking of very hot tea' },
        { cases: 'infants with newly diagnosed rickets at a Lucknow paediatric clinic', controls: 'infants sampled from immunisation sessions in the same wards', exp: 'exclusive breastfeeding without vitamin D supplementation' },
      ]);
      return `A case-control study enrolled ${p.a + p.b} ${s.cases} and ${p.c + p.d} ${s.controls}. ` +
        `Among cases, ${p.a} reported ${s.exp}; among controls, ${p.c} did. ` +
        `Estimate the odds ratio with its 95% confidence interval.`;
    },
    solve: p => {
      const o = oddsRatio({ a: p.a, b: p.b, c: p.c, d: p.d });
      return { or: o.estimate, orLo: o.ci.lower, orHi: o.ci.upper };
    },
    answerFields: [
      { key: 'or', label: 'Odds ratio', tolerance: 0.02, format: 'dec2' },
      { key: 'orLo', label: 'OR lower 95% limit', tolerance: 0.03, format: 'dec2' },
      { key: 'orHi', label: 'OR upper 95% limit', tolerance: 0.03, format: 'dec2' },
    ],
    hints: [
      'Lay out the table: exposed cases (a), unexposed cases (b), exposed controls (c), unexposed controls (d). Remember to subtract to get b and d.',
      'OR = ad/bc. For the interval, SE(ln OR) = √(1/a + 1/b + 1/c + 1/d); take OR × exp(±1.96 SE).',
    ],
    solution: md`|  | Exposed | Unexposed |
|---|---|---|
| Cases | {a} | {b} |
| Controls | {c} | {d} |

$$\mathrm{OR} = \frac{a \cdot d}{b \cdot c} = \frac{{a} \times {d}}{{b} \times {c}} = {or}$$

$$\mathrm{SE}(\ln \mathrm{OR}) = \sqrt{1/a + 1/b + 1/c + 1/d}$$

95% CI: {orLo} to {orHi}.

The OR here is the ratio of exposure odds in cases to exposure odds in controls. What it estimates in the source population (a risk ratio, a rate ratio or a risk odds ratio) depends on how controls were sampled.`,
  },
];
