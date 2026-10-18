import type { Chapter } from '../types';

const md = String.raw;

export const ch04: Chapter = {
  number: 4,
  title: 'Measures of disease occurrence, association and causal effects',
  unit: 'B',
  reading: 'Rothman, Huybrechts & Murray, 3rd ed., Chapter 4',
  summary: md`This chapter gives you the vocabulary for every quantitative claim in epidemiology. You will measure how often disease occurs (risk, rate, prevalence), compare occurrence between groups (ratios and differences), and link those comparisons to causal effects through the counterfactual idea. Throughout, the aim is to estimate the size of an effect and its precision, not to label it significant or not.`,
  cards: [
    // ------------------------------------------------------------------
    {
      id: 'ch04-risk', chapter: 4, order: 1,
      title: 'Risk: the probability of becoming a case',
      concepts: ['risk'], minutes: 10,
      hook: md`On a Saturday in a Haryana village, 240 guests eat lunch at a wedding. By Monday, 72 of them have watery diarrhoea and vomiting; 3 of those die despite treatment at the community health centre. The block medical officer must report the outbreak to the district surveillance unit by evening. The form asks for an "attack rate" and a "case fatality rate". Neither, it turns out, is actually a rate.`,
      formalise: md`**Risk** (also called incidence proportion or cumulative incidence) is the proportion of people at risk at the start of a period who develop the outcome during that period:

$$R = \frac{\text{new cases during the period}}{\text{people at risk at the start}}$$

- Risk is a probability: it has no units and lies between 0 and 1.
- It is meaningless without a **time window**: "the 30-day risk of surgical-site infection", "the lifetime risk of breast cancer".
- Calculating it directly requires that everyone is followed for the whole period (a closed population with no losses). If people drop out or die of other causes, you need person-time methods (next cards).

Two outbreak measures are really risks:

| Measure | Calculation (wedding) | Value |
|---|---|---|
| Attack rate | 72 ill / 240 who ate | 0.30 (30%) |
| Case fatality "rate" | 3 deaths / 72 cases | 0.042 (4.2%) |

The names are historical; both are proportions over the duration of the outbreak or illness. Notice too that everyday speech uses "risk" loosely, for example "risk factor" or "at risk"; in this course **risk** always means this proportion.

**Rounding.** Report two or three significant digits (0.042, not 0.04166667). Extra digits imply a precision the data do not have; round only at the end of a calculation.

**Common mistake:** quoting a risk without stating the period over which it applies.`,
      practise: { template: 'ch04-risk', count: 2 },
      checks: [
        {
          id: 'ch04-risk-q1', concept: 'risk',
          prompt: md`At the wedding, which number is the denominator of the attack rate?`,
          options: [
            { text: '240, the guests who ate the lunch', correct: true, feedback: 'Correct. Everyone who ate was at risk of becoming ill during the outbreak.' },
            { text: '72, the guests who fell ill', correct: false, feedback: 'The ill guests form the numerator. Using them as the denominator gives a proportion of 1.' },
            { text: 'The total village population', correct: false, feedback: 'Villagers who did not eat the lunch were not exposed to this source; including them dilutes the measure.' },
          ],
        },
        {
          id: 'ch04-risk-q2', concept: 'risk',
          prompt: md`Why is the case fatality "rate" better described as a risk?`,
          options: [
            { text: 'It counts deaths among cases, a proportion with no time units.', correct: true, feedback: 'Yes. A rate has person-time in the denominator; case fatality divides by the number of cases.' },
            { text: 'Because deaths are rare events.', correct: false, feedback: 'Rarity does not determine whether a measure is a risk or a rate.' },
            { text: 'Because it is calculated per 100 people.', correct: false, feedback: 'Scaling to 100 or 1,000 does not change what kind of measure it is.' },
          ],
        },
        {
          id: 'ch04-risk-q3', concept: 'risk',
          prompt: md`A trial reports a "risk of stroke of 4%" without further detail. What is missing?`,
          options: [
            { text: 'The number of people in the trial.', correct: false, feedback: 'Sample size affects how precise the figure is, but even a precise 4% is uninterpretable without knowing over how long.' },
            { text: 'The time period to which the risk applies.', correct: true, feedback: 'Correct. A 4% risk over one year and over ten years are very different statements.' },
            { text: 'The units, such as per person-year.', correct: false, feedback: 'Risk has no units; person-years belong to rates.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch04-incidence-rate', chapter: 4, order: 2,
      title: 'Incidence rate and person-time',
      concepts: ['incidence_rate', 'person_time'], minutes: 12,
      hook: md`An ART centre in Manipur wants to know how often people living with HIV develop tuberculosis. Patients register throughout the year, some transfer out after a few months, some die of other causes, and a few are lost to follow-up. Over three years, 1,800 people have passed through the programme, but no two were watched for the same length of time. A nurse suggests dividing the TB cases by 1,800. The data manager suggests adding up how long each person was actually observed.`,
      formalise: md`When people are observed for different lengths of time, count the **person-time** each contributes while at risk, and divide cases by the total:

$$I = \frac{\text{new cases}}{\text{total person-time at risk}}$$

Five synthetic patients:

| Patient | Time observed at risk | Outcome |
|---|---|---|
| P1 | 2.0 years | Completed follow-up, no TB |
| P2 | 0.5 years | TB |
| P3 | 3.0 years | Transferred out, no TB |
| P4 | 1.5 years | TB |
| P5 | 3.0 years | Completed follow-up, no TB |
| **Total** | **10.0 person-years** | **2 cases** |

$$I = \frac{2}{10.0\ \text{PY}} = 0.20\ \text{per person-year} = 200 \text{ per 1,000 PY}$$

Key points:

- A person stops contributing person-time once they become a case (for a first-occurrence outcome), leave, or die.
- A rate has units of $1/\text{time}$. It is not a probability and can exceed 1 (for example 1.5 colds per person-year).
- Person-time can come from many people observed briefly or a few observed for long; a rate assumes these are interchangeable, which is reasonable only if the rate is roughly constant over the period.
- The **rate ratio** compares two rates, $\text{IR} = I_1/I_0$; it is the natural measure in open cohorts.

**Common mistake:** dividing cases by the number of people ever enrolled, which ignores how long each person was actually at risk.`,
      practise: { template: 'ch04-rate', count: 2 },
      checks: [
        {
          id: 'ch04-incidence-rate-q1', concept: 'person_time',
          prompt: md`A patient is observed for 1.2 years, develops TB, and is then followed for another 2 years during treatment. How much person-time does she contribute to the TB incidence rate?`,
          options: [
            { text: '3.2 years', correct: false, feedback: 'After she developed TB she was no longer at risk of a first TB episode, so later time does not count.' },
            { text: '1.2 years', correct: true, feedback: 'Correct. Person-time stops at the event for a first-occurrence outcome.' },
            { text: '1 person', correct: false, feedback: 'Counting people rather than time gives a risk denominator, which is not valid when follow-up varies.' },
          ],
        },
        {
          id: 'ch04-incidence-rate-q2', concept: 'incidence_rate',
          prompt: md`A rate of 1.5 respiratory infections per child-year is reported. A colleague says this must be an error because the value exceeds 1. Who is right?`,
          options: [
            { text: 'The colleague; all incidence measures lie between 0 and 1.', correct: false, feedback: 'Risks are bounded by 1; rates are not, because their denominator is time.' },
            { text: 'The report; a rate is events per unit of person-time and can exceed 1.', correct: true, feedback: 'Yes. Children can have several infections a year, and the rate reflects that.' },
            { text: 'Neither; it should have been expressed as a percentage.', correct: false, feedback: 'Rates have units of inverse time; a percentage would wrongly imply a proportion.' },
          ],
        },
        {
          id: 'ch04-incidence-rate-q3', concept: 'incidence_rate',
          prompt: md`In the ART centre, 54 TB cases occurred during 3,600 person-years. What is the incidence rate?`,
          options: [
            { text: '15 per 1,000 person-years', correct: true, feedback: 'Correct: 54 / 3,600 = 0.015 per person-year.' },
            { text: '3.0% (54 / 1,800)', correct: false, feedback: 'That divides by people rather than person-time, which is invalid when follow-up varies.' },
            { text: '1.5 per person-year', correct: false, feedback: 'Check the arithmetic: 54/3,600 is 0.015, not 1.5.' },
            { text: '66.7 per 1,000 person-years', correct: false, feedback: 'That is the inverse (3,600/54 per 1,000). The rate is cases over person-time.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch04-risk-from-rate', chapter: 4, order: 3,
      title: 'From rate to risk',
      concepts: ['risk_rate_relation'], minutes: 11,
      hook: md`A woman who had gestational diabetes asks her obstetrician in Hyderabad, "What are my chances of getting diabetes in the next ten years?" The best local study reports an incidence rate of 50 per 1,000 person-years in women like her. The registrar multiplies: 50 per 1,000 for 10 years makes 50%. The consultant says the true figure is lower, and that the gap would be even bigger over 25 years. Why?`,
      explore: {
        interactive: 'risk-vs-rate',
        prompt: md`Set the hazard per year to 0.2 or more and the follow-up to at least 5 years, then press Play, or Step 1 year, until the clock reaches year 5. At each year compare 'Rate × t (naive)' with the observed risk and with '1 − exp(−rate × t)'. Then lower the hazard to 0.05 and repeat; for how many years does the naive product stay close to the risk?`,
      },
      formalise: md`If the incidence rate $I$ is constant and nothing else removes people from the population at risk, the risk over time $t$ is

$$R(t) = 1 - e^{-I t}$$

When $I t$ is small (below about 0.1), $R(t) \approx I \times t$. As $I t$ grows, the approximation overestimates, because people who have already become cases leave the pool at risk; the risk curve bends and can never exceed 1.

| Rate (per person-year) | Years | $I \times t$ | $1 - e^{-It}$ |
|---|---|---|---|
| 0.005 | 10 | 0.050 | 0.049 |
| 0.05 | 10 | 0.50 | 0.39 |
| 0.05 | 25 | 1.25 | 0.71 |

So the woman's ten-year risk is about 39%, not 50%.

If the rate changes over time, add up rate × duration for each interval and use the sum:

$$R = 1 - \exp\Big(-\sum_k I_k \Delta t_k\Big)$$

Both formulas assume **no competing risks**: nobody is removed by death from other causes. Over long horizons in older people, competing deaths make the true risk of a specific disease lower still.

**Common mistake:** multiplying a rate by a long time span and reporting the product as a risk, sometimes getting values above 100%.`,
      practise: { template: 'ch04-risk-from-rate', count: 2 },
      checks: [
        {
          id: 'ch04-risk-from-rate-q1', concept: 'risk_rate_relation',
          prompt: md`Why is $1 - e^{-It}$ smaller than $I \times t$?`,
          options: [
            { text: 'Because the rate falls over time as people age.', correct: false, feedback: 'The formula assumes a constant rate; the gap arises even when the rate is fixed.' },
            { text: 'Because people who have become cases are no longer at risk, so fewer remain to become new cases.', correct: true, feedback: 'Correct. The shrinking pool at risk makes risk accumulate more slowly than the simple product.' },
            { text: 'Because the exponential formula adjusts for confounding.', correct: false, feedback: 'The formula has nothing to do with confounding; it converts a rate into a risk.' },
          ],
        },
        {
          id: 'ch04-risk-from-rate-q2', concept: 'risk_rate_relation',
          prompt: md`The rate of a disease is 2 per 1,000 person-years. What is the approximate 5-year risk?`,
          options: [
            { text: 'About 1%', correct: true, feedback: 'Yes. I × t = 0.010 is small, so the simple product is an excellent approximation (exact value 0.00995).' },
            { text: 'About 10%', correct: false, feedback: 'Check units: 2 per 1,000 per year for 5 years is 10 per 1,000, i.e. 1%.' },
            { text: 'It cannot be calculated without knowing the number of people.', correct: false, feedback: 'Under a constant rate, the risk depends only on the rate and the time.' },
          ],
        },
        {
          id: 'ch04-risk-from-rate-q3', concept: 'risk_rate_relation',
          prompt: md`A colleague converts a 40-year rate of lung cancer among smokers into a risk but ignores deaths from other causes. What happens?`,
          options: [
            { text: 'The risk is underestimated.', correct: false, feedback: 'Ignoring competing deaths assumes everyone survives to be at risk, which inflates the risk.' },
            { text: 'The risk is overestimated, because many smokers die of other causes before lung cancer could occur.', correct: true, feedback: 'Correct. Competing risks remove people from the pool, so the real risk is lower.' },
            { text: 'It makes no difference over such a long period.', correct: false, feedback: 'The longer the period, the more competing deaths matter.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch04-prevalence', chapter: 4, order: 4,
      title: 'Prevalence: the stock of existing cases',
      concepts: ['prevalence'], minutes: 11,
      hook: md`Two household surveys of a Chennai ward, ten years apart, find that the proportion of adults living with diabetes has risen substantially. A city councillor announces that "diabetes is spreading faster than ever". Yet the city's diabetes registry shows the rate of new diagnoses has barely changed. Meanwhile, the ward's new community clinic has made insulin and kidney care far more accessible, and fewer people with diabetes are dying early. Can both observations be true?`,
      explore: {
        interactive: 'prevalence-bathtub',
        prompt: md`Keep the incidence rate fixed, increase the mean duration, and press Play to watch the prevalence rise towards the steady-state level. Then tick 'A treatment shortens duration' and watch the level fall to a new steady state. Finally, find two quite different pairs of incidence and duration that give the same steady-state prevalence.`,
      },
      formalise: md`**Prevalence** is the proportion of a population that has the condition at a point in time (point prevalence) or during a short interval (period prevalence):

$$P = \frac{\text{existing cases}}{\text{total population}}$$

Unlike risk and rate, prevalence counts **existing**, not new, cases. It is set by two flows: how fast new cases arrive (incidence) and how long they stay (duration, which ends with cure, death or migration).

In a **steady state** (stable population, constant incidence and duration):

$$\frac{P}{1 - P} = I \times \bar{D}$$

where $I$ is the incidence rate among people free of the condition and $\bar{D}$ is the mean duration. When prevalence is low, $P \approx I \times \bar{D}$.

| Incidence (per 1,000 PY) | Mean duration (years) | $I \bar{D}$ (prevalence odds) | Prevalence |
|---|---|---|---|
| 10 | 5 | 0.05 | 4.8% |
| 10 | 15 | 0.15 | 13% |
| 30 | 5 | 0.15 | 13% |

Better treatment that prolongs survival raises prevalence without any change in incidence. Prevalence is ideal for planning services (how many people need insulin today?) but awkward for studying causes: a factor associated with prevalence might cause the disease, or might simply prolong it.

**Common mistake:** reading a rise in prevalence as a rise in incidence, without asking whether duration has changed.`,
      practise: { template: 'ch04-prevalence-incidence', count: 2 },
      checks: [
        {
          id: 'ch04-prevalence-q1', concept: 'prevalence',
          prompt: md`In the Chennai ward, prevalence rose while incidence was stable. What is the most likely explanation?`,
          options: [
            { text: 'The registry undercounted new cases.', correct: false, feedback: 'Possible, but the scenario offers a simpler explanation consistent with both observations.' },
            { text: 'People with diabetes are living longer, so average duration increased.', correct: true, feedback: 'Correct. With incidence fixed, longer duration raises prevalence.' },
            { text: 'Prevalence and incidence are unrelated measures.', correct: false, feedback: 'They are linked through duration: prevalence odds ≈ incidence × duration in a steady state.' },
          ],
        },
        {
          id: 'ch04-prevalence-q2', concept: 'prevalence',
          prompt: md`A survey finds that people with chronic hepatitis B more often have a particular gene variant. Why is this weak evidence that the variant causes infection to become chronic?`,
          options: [
            { text: 'Because the variant might instead affect survival with the condition, raising its prevalence among cases.', correct: true, feedback: 'Yes. Prevalence studies mix factors that cause disease with factors that prolong it.' },
            { text: 'Because surveys can never measure genes.', correct: false, feedback: 'Genes can be measured in surveys; the issue is interpreting prevalent cases.' },
            { text: 'Because prevalence is always lower than incidence.', correct: false, feedback: 'Prevalence can be much higher than annual incidence for long-lasting conditions.' },
          ],
        },
        {
          id: 'ch04-prevalence-q3', concept: 'prevalence',
          prompt: md`Incidence of a condition is 20 per 1,000 person-years and mean duration is 2 years, in a steady state. What is the approximate prevalence?`,
          options: [
            { text: 'About 4%', correct: true, feedback: 'Correct: I × D = 0.02 × 2 = 0.04; the exact value is 0.04/1.04 = 3.8%.' },
            { text: 'About 2%', correct: false, feedback: 'That ignores duration; each case lasts two years, so the stock is about double the annual inflow.' },
            { text: 'About 40%', correct: false, feedback: 'Check the units: 20 per 1,000 is 0.02 per person-year.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch04-ratios-differences', chapter: 4, order: 5,
      title: 'Comparing groups: ratios and differences',
      concepts: ['risk_ratio', 'risk_difference', 'rate_ratio'], minutes: 14,
      hook: md`In a Faridabad antenatal cohort, 400 women with moderate-to-severe anaemia at booking and 500 women without anaemia are followed to delivery. Postpartum haemorrhage occurs in 40 anaemic and 25 non-anaemic women. The obstetrics department wants a single number to put on a poster for the anaemia programme; the programme manager wants to know how many haemorrhages could be avoided per 1,000 women treated. They are asking for different measures.`,
      explore: {
        interactive: 'measures-calculator',
        prompt: md`Press 'Rare but strong vs common but weak' to load two scenarios, and compare the risk ratio, risk difference, attributable fraction among the exposed and population attributable fraction between them. Switch 'Chart scale' between ratio and difference. Then use 'Editing' to pick one scenario and lower the risk in the unexposed while keeping the risk in the exposed at twice that value, and watch the risk difference shrink while the risk ratio stays at 2.`,
      },
      formalise: md`With risks $R_1$ (exposed) and $R_0$ (unexposed):

$$\mathrm{RR} = \frac{R_1}{R_0} \qquad \mathrm{RD} = R_1 - R_0$$

With incidence rates, the same logic gives the **rate ratio** $\mathrm{IR} = I_1/I_0$ and the **rate difference** $\mathrm{ID} = I_1 - I_0$.

For the Faridabad cohort: $R_1 = 40/400 = 0.10$ and $R_0 = 25/500 = 0.050$.

| Measure | Value | Reading |
|---|---|---|
| RR | 2.0 | Anaemic women had twice the risk |
| RD | 0.050 | 5 extra haemorrhages per 100 anaemic women |

**Relative measures** (ratios) describe the strength of an association and are the usual currency of causal research. A ratio of 1 means no association; RR = 1.6 means 60% higher risk; RR = 0.7 means 30% lower.

**Absolute measures** (differences) describe the public-health impact: how many cases are added or avoided. The same RR of 2 implies an RD of 0.05 when $R_0 = 0.05$ but only 0.0005 when $R_0 = 0.0005$.

Every estimate from a study also carries uncertainty. Chapters 7 and 8 show how to express it with a [[confidence interval]]; for now, concentrate on choosing and computing the right measure.

Report two or three significant digits (RR 2.0, not 2.000).

**Common mistake:** reporting only a relative measure, which can make a tiny absolute benefit look impressive.`,
      practise: { template: 'ch04-risk-ratio-difference', count: 2 },
      checks: [
        {
          id: 'ch04-ratios-differences-q1', concept: 'risk_difference',
          prompt: md`The programme manager wants to know how many haemorrhages per 1,000 women would be avoided if anaemia were eliminated (assuming the association is causal). Which measure answers this?`,
          options: [
            { text: 'The risk ratio, 2.0', correct: false, feedback: 'The ratio tells you the strength of association, not the number of cases involved.' },
            { text: 'The risk difference, 0.05, i.e. 50 per 1,000 anaemic women', correct: true, feedback: 'Correct. Differences translate directly into cases added or avoided.' },
            { text: 'The odds ratio', correct: false, feedback: 'Odds ratios are relative measures and do not give absolute numbers of cases.' },
          ],
        },
        {
          id: 'ch04-ratios-differences-q2', concept: 'risk_ratio',
          prompt: md`A drug reduces stroke risk from 2.0% to 1.4% over five years. Which description is correct?`,
          options: [
            { text: 'RR = 0.7, a 30% relative reduction; RD = −0.6 percentage points.', correct: true, feedback: 'Yes. Reporting both helps readers judge strength and impact.' },
            { text: 'RR = 0.6, a 60% reduction.', correct: false, feedback: '0.6 is the absolute difference in percentage points, not the ratio. The ratio is 1.4/2.0 = 0.7.' },
            { text: 'RR = 1.43, so the drug increases stroke.', correct: false, feedback: 'You divided the unexposed risk by the exposed risk. Put the treated group in the numerator.' },
          ],
        },
        {
          id: 'ch04-ratios-differences-q3', concept: 'risk_ratio',
          prompt: md`Two drugs each halve the five-year risk of stroke (RR = 0.5). Drug A is used in people whose risk without it is 20%; drug B in people whose risk without it is 0.4%. Which statement is correct?`,
          options: [
            { text: 'Both drugs prevent the same number of strokes, because their risk ratios are equal.', correct: false, feedback: 'Equal ratios can hide very different absolute effects. Work out the risk difference in each group.' },
            { text: 'Drug A prevents 10 strokes per 100 people treated; drug B prevents 0.2 per 100, so the same relative effect gives a 50-fold difference in impact.', correct: true, feedback: 'Correct. 20% − 10% = 10 per 100; 0.4% − 0.2% = 0.2 per 100. The risk difference carries the public-health impact.' },
            { text: 'Drug B is more effective because it works in lower-risk people.', correct: false, feedback: 'Both have the same relative effect; drug B simply has much less risk to remove.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch04-odds-ratio', chapter: 4, order: 6,
      title: 'The odds ratio and when it resembles the risk ratio',
      concepts: ['odds_ratio', 'risk_ratio'], minutes: 11,
      hook: md`A surgical audit at a Jaipur hospital reports that obese patients undergoing open abdominal surgery had "2.7 times the odds" of wound infection compared with non-obese patients. The infection risk was 40% in obese patients and 20% in others. A resident tells the ward round that obese patients are "2.7 times as likely" to get infected. The infection-control nurse frowns: the risks she sees do not look 2.7-fold apart.`,
      explore: {
        interactive: 'two-by-two',
        props: { dataType: 'risk', basic: true },
        prompt: md`With 'Cohort: risk data' selected, enter 40 exposed cases and 960 exposed non-cases, and 20 unexposed cases and 980 unexposed non-cases, and note the risk ratio. Switch 'Data type' to 'Case-control data' (the cells reset), re-enter the same four numbers and read the odds ratio; then repeat both steps with 4 and 996, and 2 and 998. Watch the odds ratio converge on the risk ratio as the outcome becomes rare.`,
      },
      formalise: md`The **odds** of an outcome are the probability it happens divided by the probability it does not:

$$\text{odds} = \frac{R}{1 - R}$$

The **odds ratio** compares the odds in two groups:

$$\mathrm{OR} = \frac{R_1/(1 - R_1)}{R_0/(1 - R_0)} = \frac{a\,d}{b\,c}$$

where $a, b$ are cases and $c, d$ non-cases in the exposed and unexposed respectively.

For the surgical audit:

| Risk exposed | Risk unexposed | RR | OR |
|---|---|---|---|
| 0.40 | 0.20 | 2.0 | 2.7 |
| 0.04 | 0.02 | 2.0 | 2.04 |
| 0.004 | 0.002 | 2.0 | 2.004 |

Two properties:

1. The OR is always **further from 1** than the RR (unless both equal 1).
2. When the outcome is **rare** in both groups (risk below about 10%), $1 - R$ is close to 1 and the OR approximates the RR.

Why bother with odds? In a case-control study (Chapter 5), you can estimate an odds ratio but not risks, and with appropriate control sampling the OR estimates a risk ratio or rate ratio directly. Logistic regression (Chapter 10) also produces odds ratios.

**Common mistake:** describing an odds ratio as "times as likely" when the outcome is common, which exaggerates the effect.`,
      checks: [
        {
          id: 'ch04-odds-ratio-q1', concept: 'odds_ratio',
          prompt: md`Risks are 0.40 and 0.20. What is the odds ratio?`,
          options: [
            { text: '2.0', correct: false, feedback: 'That is the risk ratio. Odds are 0.40/0.60 = 0.67 and 0.20/0.80 = 0.25.' },
            { text: '2.7', correct: true, feedback: 'Correct: 0.667 / 0.25 = 2.67.' },
            { text: '0.20', correct: false, feedback: 'That is the risk difference, an absolute measure.' },
          ],
        },
        {
          id: 'ch04-odds-ratio-q2', concept: 'odds_ratio',
          prompt: md`When does an odds ratio from a cohort study closely approximate the risk ratio?`,
          options: [
            { text: 'When the sample size is large.', correct: false, feedback: 'Sample size affects precision, not the gap between OR and RR.' },
            { text: 'When the outcome is rare in both groups.', correct: true, feedback: 'Yes. With small risks, odds and risks are nearly equal.' },
            { text: 'When the exposure is rare.', correct: false, feedback: 'It is the rarity of the outcome, not the exposure, that matters.' },
          ],
        },
        {
          id: 'ch04-odds-ratio-q3', concept: 'risk_ratio',
          prompt: md`An outcome occurs in 60% of exposed and 30% of unexposed people. A press release says exposure makes the outcome "3.5 times as likely". What is wrong?`,
          options: [
            { text: 'Nothing; 3.5 is the correct risk ratio.', correct: false, feedback: 'The risk ratio is 0.60/0.30 = 2.0.' },
            { text: 'They quoted the odds ratio (3.5) as if it were a risk ratio; the outcome is common, so the two differ greatly.', correct: true, feedback: 'Correct. "Times as likely" describes a risk ratio, which here is 2.0.' },
            { text: 'Ratios cannot be calculated when risks exceed 50%.', correct: false, feedback: 'Both ratios can be calculated; they simply diverge when risks are high.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch04-counterfactual', chapter: 4, order: 7,
      title: 'Causal effects and the counterfactual ideal',
      concepts: ['counterfactual'], minutes: 11,
      hook: md`A woman with severe pre-eclampsia at a Kolkata teaching hospital receives magnesium sulfate and does not have a seizure. Her family thanks the doctors for preventing the fit. A medical student asks the registrar whether the drug really made the difference for this woman. The registrar answers honestly: "We'll never know for her. We would need to see what would have happened to the same woman, on the same day, without the drug."`,
      formalise: md`The **causal effect** of an exposure on a person is the difference between the outcome they experience with the exposure and the outcome they **would have** experienced, at the same time and under the same conditions, without it. One of those outcomes is always unobserved: it is **counterfactual**.

For a population, the causal risk ratio compares:

$$\mathrm{RR}_{\text{causal}} = \frac{\text{risk in the exposed}}{\text{risk the same exposed people would have had if unexposed}}$$

We can never see the denominator. Every study therefore uses a **substitute**: an unexposed group whose risk stands in for the counterfactual risk of the exposed.

| What we want | What we observe |
|---|---|
| Exposed people, unexposed (impossible) | A different group, unexposed |

The observed **measure of association** equals the **causal effect** only if the substitute's risk equals the counterfactual risk. When it does not, the difference is **confounding**: the substitute group differs from the exposed in other causes of the outcome. Randomisation makes good substitutes likely; observational studies must argue for them.

Interpreting relative measures follows from this. An RR of 3 for a causal exposure means that, among the exposed, risk is three times what it would otherwise have been; it does not mean that every exposed person had their risk tripled, because effects can vary between individuals.

**Common mistake:** treating an observed association as a causal effect without asking whether the comparison group is a fair substitute for the exposed group's counterfactual experience.`,
      checks: [
        {
          id: 'ch04-counterfactual-q1', concept: 'counterfactual',
          prompt: md`Why can we never measure the causal effect of magnesium sulfate in this particular woman?`,
          options: [
            { text: 'Because the sample size of one is too small for a significance test.', correct: false, feedback: 'The problem is not statistical power; even with perfect measurement, one outcome is unobservable.' },
            { text: 'Because we cannot observe what would have happened to her, at the same time, without the drug.', correct: true, feedback: 'Correct. The counterfactual outcome is missing by definition.' },
            { text: 'Because seizures in pre-eclampsia are unpredictable.', correct: false, feedback: 'Unpredictability makes the question interesting, but the fundamental barrier is the missing counterfactual.' },
          ],
        },
        {
          id: 'ch04-counterfactual-q2', concept: 'counterfactual',
          prompt: md`In counterfactual terms, what is confounding?`,
          options: [
            { text: 'Random variation in the estimated effect.', correct: false, feedback: 'Random error is a separate issue; confounding persists however large the study.' },
            { text: "A difference between the substitute group's risk and the exposed group's counterfactual risk.", correct: true, feedback: 'Yes. Confounding arises when the unexposed group is not a fair stand-in.' },
            { text: 'Misclassification of exposure.', correct: false, feedback: 'That is information bias, which distorts measurement rather than the comparison of groups.' },
          ],
        },
        {
          id: 'ch04-counterfactual-q3', concept: 'counterfactual',
          prompt: md`A causal RR of 3 is estimated for an exposure. Which interpretation is correct?`,
          options: [
            { text: 'Every exposed person has exactly three times their unexposed risk.', correct: false, feedback: 'The RR is an average over a group; individual effects can vary widely.' },
            { text: 'Among the exposed, the risk is three times what it would have been without exposure.', correct: true, feedback: 'Correct. It describes the group as a whole.' },
            { text: 'Exposure causes three cases for every unexposed case.', correct: false, feedback: 'That confuses a ratio with counts of cases; numbers of cases depend on the absolute risks.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch04-bonus-kids', chapter: 4, order: 8,
      title: 'Teach-back: explaining the counterfactual',
      concepts: [], minutes: 6,
      bonus: { youtubeId: 'bmoZPf17dCE', channel: 'Little Scientists Club', videoTitle: 'How do we know what made something happen? (Ep 19)' },
      hook: md`You have just met the counterfactual ideal: the effect of an exposure is the difference between what happened and what would have happened to the same people without it. Could you explain that to someone with no science background? Below is one worked example: an episode from my children's science channel, made for five- and six-year-olds, in which Curie wins a race in new spotty socks and is sure the socks did it.

*Why a children's video in an MSc course? Explaining a method in plain words is part of a clinical researcher's job: participant information sheets, informed consent, community meetings and talking to families. If you can explain an idea simply and correctly, you have understood it.*`,
      formalise: md`**What the explanation keeps, in simpler words.**

- "Did the socks make me win?" is a causal question about **one** person: Curie.
- The perfect answer would need the **same** Curie, in the **same** race, at the **same** time, once in spotty socks and once in plain ones. One of those two races can never be seen. That unseen race is the **counterfactual**.
- Because we cannot rerun the race, scientists use a **substitute**: another group that is as alike as possible in every way except the socks.
- Picking names out of a hat, with many runners, makes the two groups alike. That is **randomisation**, and it is how doctors test new medicines.
- The paper-plane activity is a tiny experiment: same plane, same throw, only the sticker changes.

**What a simple version has to leave out.** Picking names from a hat makes groups alike only on average and only when there are enough people; with a handful of runners, chance alone can make the groups differ.

**Your turn.** In two or three sentences, explain to a prospective trial participant why the trial needs a comparison group and why a computer, not the doctor, decides who gets the new treatment. The video's catchphrase may help: *ask what would happen without it.*`,
      checks: [],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch04-attributable-fraction', chapter: 4, order: 9,
      title: 'Attributable fraction: how much could be prevented?',
      concepts: ['attributable_fraction'], minutes: 13,
      hook: md`A hill district in Uttarakhand plans to expand a clean-cooking-gas scheme. A study suggests that children in homes using wood or dung for cooking have 2.5 times the risk of pneumonia of children in homes using gas, and half of all childhood pneumonia cases in the district occur in homes using solid fuel. The district collector asks a simple question: if every home switched to gas, what share of childhood pneumonia would disappear?`,
      explore: {
        interactive: 'attributable-fraction',
        prompt: md`Set the risk ratio to 2.5 and the exposure prevalence to 50%, and read the attributable fraction among the exposed and the population attributable fraction. Vary each of the three sliders in turn: which one changes the fraction among the exposed, and which changes only the population fraction? Then push the risk ratio above 3 and watch the attributable cases in the icon array grow; note that the slider cannot go below 1.`,
      },
      formalise: md`If an exposure is a cause and the RR is unconfounded, the **attributable fraction among the exposed** is the share of exposed cases that would not have occurred without the exposure:

$$\mathrm{AF}_e = \frac{R_1 - R_0}{R_1} = \frac{\mathrm{RR} - 1}{\mathrm{RR}}$$

The **population attributable fraction** is the share of **all** cases that would not have occurred without the exposure. With $p_c$ the proportion of cases who are exposed:

$$\mathrm{AF}_p = p_c \times \frac{\mathrm{RR} - 1}{\mathrm{RR}}$$

For the district: $\mathrm{AF}_e = (2.5 - 1)/2.5 = 0.60$, and $\mathrm{AF}_p = 0.50 \times 0.60 = 0.30$. Switching every home to gas would be expected to prevent about 30% of childhood pneumonia, and 60% of cases among children in solid-fuel homes.

Things to keep in mind:

- The fractions are causal claims; they assume the RR is unbiased. A confounded RR gives a misleading fraction.
- Fractions for different causes of the same disease can **add to more than 100%**, because each case has several component causes and removing any one prevents it (Chapter 3).
- For a **preventive** exposure (RR below 1), use the **prevented fraction**, $1 - \mathrm{RR}$, among the exposed.
- When you know the exposure prevalence in the population ($p_e$) rather than among cases, an equivalent formula is $\mathrm{AF}_p = \frac{p_e(\mathrm{RR}-1)}{p_e(\mathrm{RR}-1) + 1}$.

**Common mistake:** plugging the proportion of the **population** that is exposed into the formula that needs the proportion of **cases** that are exposed.`,
      practise: { template: 'ch04-attributable-fraction', count: 2 },
      checks: [
        {
          id: 'ch04-attributable-fraction-q1', concept: 'attributable_fraction',
          prompt: md`An exposure has RR = 4. What fraction of cases among the exposed is attributable to it?`,
          options: [
            { text: '75%', correct: true, feedback: 'Correct: (4 − 1)/4 = 0.75.' },
            { text: '25%', correct: false, feedback: 'That is 1/RR, the fraction of exposed cases that would have occurred anyway.' },
            { text: '300%', correct: false, feedback: '(RR − 1) × 100 is the percentage increase in risk, not a fraction of cases.' },
          ],
        },
        {
          id: 'ch04-attributable-fraction-q2', concept: 'attributable_fraction',
          prompt: md`Studies estimate population attributable fractions for coronary disease of 40% for smoking, 50% for hypertension and 45% for high LDL cholesterol. They add up to 135%. What does this indicate?`,
          options: [
            { text: 'At least one estimate must be wrong.', correct: false, feedback: 'Not necessarily. Several causes can share the same pies, so each can be responsible for overlapping cases.' },
            { text: 'Causes act together in the same sufficient causes, so the fractions can legitimately overlap.', correct: true, feedback: 'Yes. Removing any component of a pie prevents the case, so attributable fractions need not sum to 100%.' },
            { text: 'The fractions should be rescaled to sum to 100%.', correct: false, feedback: 'Rescaling would understate how many cases each intervention could prevent.' },
          ],
        },
        {
          id: 'ch04-attributable-fraction-q3', concept: 'attributable_fraction',
          prompt: md`A student computes the population attributable fraction using RR = 2.5 and the proportion of all **households** that use solid fuel (70%) in the formula $p_c \times (\mathrm{RR} - 1)/\mathrm{RR}$. What is the error?`,
          options: [
            { text: 'None; any measure of exposure prevalence can be used.', correct: false, feedback: 'This formula requires the proportion of cases who are exposed, which is higher than the population prevalence when RR > 1.' },
            { text: 'The formula needs the proportion of cases exposed; with population prevalence, use the formula based on exposure prevalence instead.', correct: true, feedback: 'Correct. Mixing the two inputs gives a wrong answer.' },
            { text: 'The RR should be inverted before use.', correct: false, feedback: 'RR > 1 for a harmful exposure is correct as it is.' },
          ],
        },
      ],
    },
  ],
};
