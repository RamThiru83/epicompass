import type { Chapter } from '../types';

const md = String.raw;

export const ch01: Chapter = {
  number: 1,
  title: 'Introduction to epidemiologic thinking',
  unit: 'A',
  reading: 'Rothman, Huybrechts & Murray, 3rd ed., Chapter 1',
  summary: md`Epidemiology is the study of how often disease occurs in populations and why. Before we get into the subject, let's see some case studies where epidemiology applies. Each of these scenarios and concepts will be dealt in detail in the upcoming chapters. For now, treat these as a trailer and enjoy! Before learning any formula, you need three habits of mind: suspect that a comparison may be mixed up with a third factor (confounding), ask who could actually have developed the outcome (the population at risk), and remember that every diagnosis is made by an imperfect test.`,
  cards: [
    // ------------------------------------------------------------------
    {
      id: 'ch01-confounding', chapter: 1, order: 1,
      title: 'When a comparison misleads: confounding',
      concepts: ['confounding'], minutes: 12,
      hook: md`A state health department publishes neonatal mortality for two hospitals. The medical college hospital, which runs a level III neonatal unit, reports 7.4 deaths per 100 births; the nearby district hospital reports 4.3. A newspaper headline asks why the "better" hospital loses more babies. You pull the records and notice that the medical college receives most of the very low birth weight babies referred from across the region, while the district hospital refers its sickest newborns out. Is the medical college really doing worse, or is something else being compared?`,
      explore: {
        interactive: 'simpson-explorer',
        props: { groups: ['Medical college', 'District hospital'], strata: ['1,500 g or more', 'Below 1,500 g'], confounder: 'birth weight', outcome: 'Neonatal mortality', shareHigh: [5, 5], risks: [2.0, 20, 2.9, 30] },
        prompt: md`The tool holds the two hospitals from the story, with the birth-weight-specific death risks from the table below (medical college 2.0% and 20%; district hospital 2.9% and 30%). It starts with both hospitals having only 5% of births below 1,500 g, so the crude risk ratio sits close to the two stratum-specific ratios, both below 1. Now drag the medical college's share of very low birth weight births up to 30% and watch the crude ratio climb past 1 while the two stratum-specific ratios do not move. That is the newspaper's headline being manufactured by referral patterns alone.`,
      },
      formalise: md`**Confounding** is a mixing of effects: the apparent effect of the exposure (here, which hospital) is distorted because it is tangled up with the effect of another factor (birth weight).

Synthetic data for the two hospitals:

| Birth weight | Medical college: deaths / births | District: deaths / births |
|---|---|---|
| Below 1,500 g | 60 / 300 (20%) | 15 / 50 (30%) |
| 1,500 g or more | 14 / 700 (2.0%) | 28 / 950 (2.9%) |
| **All births** | **74 / 1,000 (7.4%)** | **43 / 1,000 (4.3%)** |

Within each birth-weight group the medical college does better, yet overall it looks worse, because 30% of its births are very low birth weight against 5% at the district hospital. A reversal like this is often called Simpson's paradox; it is simply confounding at its most dramatic.

A factor can confound when it:

1. is a risk factor for the outcome (low birth weight raises mortality),
2. is associated with the exposure in the population studied (referral concentrates small babies in one hospital), and
3. is not an effect of the exposure (birth weight is not caused by the choice of hospital after birth).

The simplest remedy is **stratification**: compare like with like within levels of the confounder, then, if the stratum-specific estimates are similar, summarise them. Later chapters show how to pool strata formally.

**Common mistake:** treating the crude comparison as the "real" answer because it uses all the data; using all the data does not protect against mixing of effects.`,
      checks: [
        {
          id: 'ch01-confounding-q1', concept: 'confounding',
          prompt: md`In the hospital example, why does birth weight qualify as a confounder?`,
          options: [
            { text: 'It predicts death and is unevenly distributed between the two hospitals.', correct: true, feedback: 'Yes. A confounder must be a risk factor for the outcome and be associated with the exposure; referral patterns create that association.' },
            { text: 'It is measured more accurately in the medical college.', correct: false, feedback: 'Differences in measurement quality cause information bias, not confounding. Confounding needs the factor to affect the outcome and be linked to the exposure.' },
            { text: 'It is caused by the quality of care in each hospital.', correct: false, feedback: 'If the exposure caused the factor, the factor would be an intermediate step, and adjusting for it would remove part of the effect you want to measure. Birth weight is fixed before admission.' },
            { text: 'It explains most of the deaths in both hospitals.', correct: false, feedback: 'Being a strong risk factor is not enough. If both hospitals had the same birth-weight mix, birth weight could not distort the comparison.' },
          ],
        },
        {
          id: 'ch01-confounding-q2', concept: 'confounding',
          prompt: md`The crude comparison favours the district hospital; both stratum-specific comparisons favour the medical college. Which statement is best?`,
          options: [
            { text: 'The crude result is more trustworthy because it is based on all 2,000 births.', correct: false, feedback: 'Sample size governs random error, not confounding. A large crude comparison can be precisely wrong.' },
            { text: 'The stratum-specific comparisons better reflect the effect of the hospital, because each compares babies of similar birth weight.', correct: true, feedback: 'Right. Stratifying holds the confounder roughly constant, so the remaining difference is closer to the effect of the hospital itself.' },
            { text: 'The two results contradict each other, so no conclusion is possible.', correct: false, feedback: 'They do not contradict each other once you see the mechanism: the crude figure mixes the hospital effect with the birth-weight effect.' },
            { text: 'Average the crude and stratified results to get a balanced answer.', correct: false, feedback: 'Averaging a confounded estimate with an unconfounded one simply reintroduces part of the bias.' },
          ],
        },
        {
          id: 'ch01-confounding-q3', concept: 'confounding',
          prompt: md`A trial shows that a new statin reduces heart attacks. A colleague wants to "adjust for LDL cholesterol measured after treatment" to remove confounding. What is the problem?`,
          options: [
            { text: 'LDL is not associated with heart attacks, so adjustment is pointless.', correct: false, feedback: 'LDL is strongly associated with heart attacks. The issue is where it sits on the causal path.' },
            { text: 'Post-treatment LDL lies on the pathway from statin to heart attack, so adjusting for it removes part of the real effect.', correct: true, feedback: 'Correct. A factor caused by the exposure is an intermediate, not a confounder; conditioning on it hides the mechanism you want to capture.' },
            { text: 'Randomised trials can never be confounded, so nothing needs adjusting.', correct: false, feedback: 'Randomisation makes confounding unlikely but chance imbalance can still occur in small trials. The specific error here is adjusting for an intermediate.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch01-population-at-risk', chapter: 1, order: 2,
      title: 'Who could have become a case? The population at risk',
      concepts: ['population_at_risk'], minutes: 9,
      hook: md`A district cancer registry in Tamil Nadu reports that cervical cancer incidence is 9 per 100,000 population per year in one taluk and 14 per 100,000 in another. A resident points out that the denominator is the total population, men included, and that one taluk has a large migrant male workforce. Another notes that a hospital outreach programme performed many hysterectomies in the first taluk. Which comparison, if any, can you trust?`,
      explore: {
        interactive: 'population-at-risk',
        prompt: md`Think of the 200 dots as a taluk's residents and the outcome as cervical cancer. Under 'Why ineligible' pick 'are men', set the number who cannot develop the outcome to 20 or more, and keep the new cases at a non-zero value. Compare 'Cases ÷ everyone' with the figure that appears when you press 'Show the correct risk'. Then switch the reason to 'have had a hysterectomy' and raise the slider further: the two figures drift apart, which is exactly the argument the two residents were making about their taluks.`
      },
      formalise: md`An occurrence measure is a fraction; the numerator counts new cases, and the denominator should include **only people who could have become a case** during the period. That group is the **population at risk**.

People are not at risk when they:

- lack the organ involved (men for cervical cancer; women after hysterectomy),
- already have the condition, if you are counting first occurrences,
- are immune (for example, after measles infection or effective vaccination).

Writing the measure as
$$\text{incidence} = \frac{\text{new cases}}{\text{people (or person-time) at risk}}$$
makes the requirement explicit. Including people who cannot become cases inflates the denominator and **dilutes** the measure. The dilution is harmless only if it is the same in every group compared; when the proportion of non-susceptible people differs (more migrant men in one taluk, more hysterectomies in another), comparisons become distorted.

The population at risk also changes over time: once someone develops the disease or becomes immune, they stop contributing. Chapter 4 handles this with person-time.

**Common mistake:** using the whole population as a default denominator without asking who was actually able to experience the outcome.`,
      checks: [
        {
          id: 'ch01-population-at-risk-q1', concept: 'population_at_risk',
          prompt: md`You are measuring the incidence of **first** myocardial infarction among adults in a cohort. Who should be excluded from the population at risk at baseline?`,
          options: [
            { text: 'Adults who have already had a myocardial infarction.', correct: true, feedback: 'Yes. They cannot experience a first infarction, so they do not belong in the denominator for this outcome.' },
            { text: 'Adults with diabetes, because they are at high risk.', correct: false, feedback: 'High-risk people are very much at risk; excluding them would underestimate incidence.' },
            { text: 'Adults who smoke, because smoking confounds the result.', correct: false, feedback: 'Confounding concerns comparisons between groups, not who belongs in the denominator.' },
            { text: 'Nobody; the denominator should always be the whole cohort.', correct: false, feedback: 'Including prevalent cases dilutes the measure because they cannot become new cases of first infarction.' },
          ],
        },
        {
          id: 'ch01-population-at-risk-q2', concept: 'population_at_risk',
          prompt: md`Taluk A has a much larger proportion of men than Taluk B. Both report cervical cancer per 100,000 total population. What happens to the comparison?`,
          options: [
            { text: 'Nothing; the men cancel out because they are in both taluks.', correct: false, feedback: 'They cancel only if the proportion of men is the same in both. Here it is not.' },
            { text: "Taluk A's incidence is diluted more, so it looks lower than it would with a correct denominator.", correct: true, feedback: 'Right. A larger share of non-susceptible people in the denominator pulls the measure down more in Taluk A.' },
            { text: "Taluk A's incidence is inflated because men add to the numerator.", correct: false, feedback: 'Men cannot add cervical cancer cases; they only add to the denominator.' },
          ],
        },
        {
          id: 'ch01-population-at-risk-q3', concept: 'population_at_risk',
          prompt: md`In a measles outbreak in a school, which children belong to the population at risk?`,
          options: [
            { text: 'All enrolled children, because everyone was exposed in the school.', correct: false, feedback: 'Exposure to the school is not the same as susceptibility. Immune children cannot become cases.' },
            { text: 'Only children with symptoms.', correct: false, feedback: 'Symptomatic children are cases (the numerator), not the full population at risk.' },
            { text: 'Children without prior measles and without effective vaccination.', correct: true, feedback: 'Correct. Susceptibility, not mere presence, defines who is at risk.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch01-screening-tests', chapter: 1, order: 3,
      title: 'Imperfect tests: sensitivity and specificity',
      concepts: ['sensitivity_specificity'], minutes: 11,
      hook: md`An antenatal clinic in Odisha wants to replace laboratory haemoglobin with a finger-prick meter that gives a result in a minute. The team tests 500 pregnant women with both. The meter labels 120 women anaemic; the laboratory labels 110. The vendor says the meter "agrees with the laboratory more than 90% of the time". Before the programme buys 2,000 meters, you are asked whether that single figure is enough to judge the device.`,
      explore: {
        interactive: 'screening-preview',
        prompt: md`Raise the sensitivity slider from 90% to 100% with specificity at 90%, and watch the false-negative count fall. Now lower specificity and watch the false positives grow and the PPV fall; note that the two sliders are independent here, whereas in a real test a cut-off links them. Finally, hold both at 90% and move the prevalence slider down to 1% or below, and read the PPV.`,
      },
      formalise: md`Compare a test against a reference standard and arrange the results in a $2 \times 2$ table:

|  | Condition present | Condition absent |
|---|---|---|
| Test positive | $a$ (true positive) | $b$ (false positive) |
| Test negative | $c$ (false negative) | $d$ (true negative) |

$$\text{Sensitivity} = \frac{a}{a + c} \qquad \text{Specificity} = \frac{d}{b + d}$$

**Sensitivity** is the proportion of people **with** the condition whom the test detects. **Specificity** is the proportion of people **without** the condition whom the test correctly clears. They answer different questions and are read down the columns.

"Overall agreement", $(a + d)/N$, hides the trade-off: a test can agree 90% of the time while missing half of the true cases if the condition is uncommon.

Most tests measure something continuous (haemoglobin, glucose, an antibody titre), and the **cut-off** decides who is called positive. Moving the cut-off to catch more true cases raises sensitivity and usually lowers specificity. The right balance depends on the cost of each error: missing severe anaemia in pregnancy is serious, while a false positive leads only to a confirmatory laboratory test.

Sensitivity and specificity are properties of the test in a given clinical spectrum; they tend to be more stable across settings than predictive values (next card), though not perfectly so.

**Common mistake:** judging a test by overall agreement, which can look excellent when most people are disease-free.`,
      checks: [
        {
          id: 'ch01-screening-tests-q1', concept: 'sensitivity_specificity',
          prompt: md`Among 110 women anaemic by the laboratory, the meter is positive in 99. Among 390 non-anaemic women, it is positive in 21. What is the sensitivity?`,
          options: [
            { text: '90% (99/110)', correct: true, feedback: 'Correct. Sensitivity uses only those who truly have the condition: 99 of 110.' },
            { text: '82.5% (99/120)', correct: false, feedback: 'That divides by all test positives, which gives the positive predictive value, not sensitivity.' },
            { text: '94.6% (369/390)', correct: false, feedback: 'That is specificity: true negatives among those without the condition.' },
            { text: '93.6% (468/500)', correct: false, feedback: 'That is overall agreement, which blends sensitivity and specificity and hides the trade-off.' },
          ],
        },
        {
          id: 'ch01-screening-tests-q2', concept: 'sensitivity_specificity',
          prompt: md`The programme lowers the meter's haemoglobin threshold for calling a woman "not anaemic" so that fewer anaemic women are missed. What do you expect?`,
          options: [
            { text: 'Sensitivity and specificity both rise.', correct: false, feedback: 'Changing a cut-off on the same test moves the two in opposite directions; improving both needs a better test.' },
            { text: 'Sensitivity rises and specificity falls.', correct: true, feedback: 'Yes. Calling more women positive catches more true cases but also labels more healthy women as anaemic.' },
            { text: 'Specificity rises and sensitivity falls.', correct: false, feedback: 'That would happen if the threshold moved to call fewer women positive.' },
          ],
        },
        {
          id: 'ch01-screening-tests-q3', concept: 'sensitivity_specificity',
          prompt: md`A test for a rare condition (1 in 200) is negative in everyone. Its overall agreement with the reference is 99.5%. What is its sensitivity?`,
          options: [
            { text: '99.5%', correct: false, feedback: 'That is overall agreement. It is high only because almost everyone is disease-free.' },
            { text: '100%', correct: false, feedback: 'A test that is never positive cannot detect any case; that is its specificity, not its sensitivity.' },
            { text: '0%', correct: true, feedback: 'Correct. It misses every true case. This is why agreement alone is a poor summary.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch01-predictive-value', chapter: 1, order: 4,
      title: 'What does a positive result mean? Predictive values',
      concepts: ['predictive_value', 'sensitivity_specificity'], minutes: 12,
      hook: md`A rapid syphilis test with sensitivity 95% and specificity 95% works well in the sexually transmitted infection clinic of a Mumbai teaching hospital, where about one in five attendees is infected: most positives are confirmed. The same test is rolled out for universal antenatal screening in a rural block where about one woman in a hundred is infected. Within a month, the confirmatory laboratory complains that most positive samples it receives are negative. Has the test become worse?`,
      explore: {
        interactive: 'screening-preview',
        prompt: md`Set sensitivity and specificity to 95% each. Move the prevalence slider from 20% down to 1%, watching the false-positive count grow relative to the true-positive count and reading the PPV at each step. At roughly what prevalence do false positives start to outnumber true positives? Keep going below 2% and note how low the PPV falls.`,
      },
      formalise: md`Clinicians start from the test result, not from the true disease status. They want **predictive values**, read across the rows of the $2 \times 2$ table:

$$\text{PPV} = \frac{a}{a + b} \qquad \text{NPV} = \frac{d}{c + d}$$

In terms of sensitivity (Se), specificity (Sp) and prevalence (P):

$$\text{PPV} = \frac{\text{Se} \cdot P}{\text{Se} \cdot P + (1 - \text{Sp})(1 - P)}$$

With Se = Sp = 0.95, per 1,000 people tested:

| Prevalence | True positives | False positives | PPV |
|---|---|---|---|
| 20% | 190 | 40 | 0.83 |
| 1% | 9.5 | 49.5 | 0.16 |

The test is unchanged; the **population** changed. When the condition is rare, even a small false-positive proportion among the many healthy people swamps the few true positives. Negative predictive value moves the other way: it is very high when prevalence is low.

Practical consequences: screening programmes in low-prevalence settings need confirmatory testing, and a positive screen should be communicated as "needs confirmation", not as a diagnosis.

**Common mistake:** quoting a test's sensitivity as if it were the probability that a person who tests positive has the disease.`,
      checks: [
        {
          id: 'ch01-predictive-value-q1', concept: 'predictive_value',
          prompt: md`Why did the positive predictive value fall when the test moved to rural antenatal screening?`,
          options: [
            { text: 'The test kits deteriorated in the field, lowering specificity.', correct: false, feedback: 'Kit quality could matter, but the drop is fully explained even with an unchanged test: prevalence fell twenty-fold.' },
            { text: 'Prevalence was much lower, so false positives from the large healthy group outnumbered true positives.', correct: true, feedback: 'Right. PPV depends on prevalence as well as on sensitivity and specificity.' },
            { text: 'Sensitivity is lower in pregnant women.', correct: false, feedback: 'Lower sensitivity would mainly raise false negatives; it cannot explain the flood of false positives.' },
          ],
        },
        {
          id: 'ch01-predictive-value-q2', concept: 'predictive_value',
          prompt: md`A woman in the rural block tests positive. Using the table on this card, roughly how likely is she to be infected?`,
          options: [
            { text: 'About 95%, the sensitivity.', correct: false, feedback: 'Sensitivity is the chance of a positive test given infection; she wants the reverse, the chance of infection given a positive test.' },
            { text: 'About 16%, the PPV at 1% prevalence.', correct: true, feedback: 'Correct. Only about 1 in 6 positives is a true infection here, which is why confirmation is essential.' },
            { text: 'About 5%, one minus specificity.', correct: false, feedback: 'One minus specificity is the false-positive proportion among uninfected women, not the probability of infection after a positive result.' },
            { text: 'About 1%, the prevalence.', correct: false, feedback: 'That was her probability before testing. The positive result raises it, to about 16%.' },
          ],
        },
        {
          id: 'ch01-predictive-value-q3', concept: 'sensitivity_specificity',
          prompt: md`Which pair of measures would you expect to stay roughly the same when the same test is used in the hospital clinic and in the rural block?`,
          options: [
            { text: 'Positive and negative predictive values', correct: false, feedback: 'Predictive values change with prevalence, which differs twenty-fold between the settings.' },
            { text: 'Sensitivity and specificity', correct: true, feedback: 'Yes. They are conditional on true status, so they do not depend directly on prevalence, although a different spectrum of disease can shift them somewhat.' },
            { text: 'Sensitivity and positive predictive value', correct: false, feedback: 'Sensitivity is fairly stable, but PPV depends heavily on prevalence.' },
          ],
        },
      ],
    },
  ],
};
