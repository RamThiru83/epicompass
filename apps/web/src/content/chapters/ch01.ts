import type { Chapter } from '../types';

const md = String.raw;

export const ch01: Chapter = {
  number: 1,
  title: 'Introduction to epidemiologic thinking',
  unit: 'A',
  reading: 'Rothman, Huybrechts & Murray, 3rd ed., Chapter 1',
  summary: md`Epidemiology is the study of how often disease occurs in populations and why. Before learning any formula, you need three habits of mind: suspect that a comparison may be mixed up with a third factor (confounding), ask who could actually have developed the outcome (the population at risk), and remember that every diagnosis is made by an imperfect test.`,
  cards: [
    // ------------------------------------------------------------------
    {
      id: 'ch01-confounding', chapter: 1, order: 1,
      title: 'When a comparison misleads: confounding',
      concepts: ['confounding'], minutes: 12,
      hook: md`A state health department publishes neonatal mortality for two hospitals. The medical college hospital, which runs a level III neonatal unit, reports 7.4 deaths per 100 births; the nearby district hospital reports 4.3. A newspaper headline asks why the "better" hospital loses more babies. You pull the records and notice that the medical college receives most of the very low birth weight babies referred from across the region, while the district hospital refers its sickest newborns out. Is the medical college really doing worse, or is something else being compared?`,
      explore: {
        interactive: 'simpson-explorer',
        props: { groups: ['Medical college', 'District hospital'], strata: ['1,500 g or more', 'Below 1,500 g'], confounder: 'birth weight', outcome: 'Neonatal mortality', unit: 'Deaths per 100 births', shareHigh: [5, 5], risks: [2.0, 20, 2.9, 30] },
        prompt: md`The tool shows the two hospitals from the story, with the death risks from the table below: in babies of 1,500 g or more, 2.0 per 100 at the medical college and 2.9 at the district hospital; in babies below 1,500 g, 20 and 30 per 100. If both hospitals have only 5% of their births below 1,500 g, then the medical college does better on every bar. Now drag the medical college's share of very low birth weight births up to 30%. This is reflective of the fact that the medical college is a tertiary care institution handling high-risk cases. Watch the 'All births' bars, where the medical college shows apparent poor performance, while the bars within each birth-weight group do not move. This shows that the newspaper's headline is being manufactured by referral patterns alone.`,
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
      hook: md`A district cancer registry in Tamil Nadu reports that cervical cancer [[incidence]] is 9 per 100,000 population per year in one taluk and 14 per 100,000 in another. A resident points out that the denominator is the total population, men included, and that one taluk has a large migrant male workforce. Another notes that a hospital outreach programme performed many hysterectomies in the first taluk. Which comparison, if any, can you trust?`,
      explore: {
        interactive: 'population-at-risk',
        prompt: md`Think of the 200 dots as a taluk's residents and the outcome as cervical cancer. Under 'Why ineligible ', pick 'Other sex', set the number who cannot develop the outcome to 20 or more, and keep the new cases at a non-zero value. Compare 'Cases ÷ everyone' with the figure that appears when you press 'Show the correct risk'. Then switch the reason to 'have had a hysterectomy' and raise the slider further: the two figures drift apart, which is exactly the argument the two residents were making about their taluks.`
      },
      formalise: md`An occurrence measure is a fraction; the numerator counts new cases, and the denominator should include **only people who could have become a case** during the period. That group is the **population at risk**.

People are not at risk when they:

- lack the organ involved (men for cervical cancer; women after hysterectomy),
- already have the condition, if you are counting first occurrences,
- are immune (for example, after measles infection or effective vaccination).

Writing the measure as
$$\text{risk} = \frac{\text{new cases}}{\text{people at risk}}$$
makes the requirement explicit. Including people who cannot become cases inflates the denominator and **dilutes** the measure. The dilution is harmless only if it is the same in every group compared; when the proportion of non-susceptible people differs (more migrant men in one taluk, more hysterectomies in another), comparisons become distorted.

The population at risk also changes over time: once someone develops the disease or becomes immune, they stop contributing. Chapter 4 handles this with [[person-time]].

**Common mistake:** using the whole population as a default denominator without asking who was actually able to experience the outcome.`,
      checks: [
        {
          id: 'ch01-population-at-risk-q1', concept: 'population_at_risk',
          prompt: md`You are measuring the [[incidence]] of **first** myocardial infarction among adults in a cohort. Who should be excluded from the population at risk at baseline?`,
          options: [
            { text: 'Adults who have already had a myocardial infarction.', correct: true, feedback: 'Yes. They cannot experience a first infarction, so they do not belong in the denominator for this outcome.' },
            { text: 'Adults with diabetes, because they are at high risk.', correct: false, feedback: 'High-risk people are very much at risk; excluding them would make the disease look rarer than it is.' },
            { text: 'Adults who smoke, because smoking confounds the result.', correct: false, feedback: 'Confounding concerns comparisons between groups, not who belongs in the denominator.' },
            { text: 'Nobody; the denominator should always be the whole cohort.', correct: false, feedback: 'Including prevalent cases dilutes the measure because they cannot become new cases of first infarction.' },
          ],
        },
        {
          id: 'ch01-population-at-risk-q2', concept: 'population_at_risk',
          prompt: md`Taluk A has a much larger proportion of men than Taluk B. Both report cervical cancer per 100,000 total population. What happens to the comparison?`,
          options: [
            { text: 'Nothing; the men cancel out because they are in both taluks.', correct: false, feedback: 'They cancel only if the proportion of men is the same in both. Here it is not.' },
            { text: "Taluk A's figure is diluted more, so it looks lower than it would with a correct denominator.", correct: true, feedback: 'Right. A larger share of non-susceptible people in the denominator pulls the measure down more in Taluk A.' },
            { text: "Taluk A's figure is inflated because men add to the numerator.", correct: false, feedback: 'Men cannot add cervical cancer cases; they only add to the denominator.' },
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
      title: 'No test is perfect: a first look at sensitivity and specificity',
      concepts: ['sensitivity_specificity'], minutes: 10,
      hook: md`An antenatal clinic in Odisha wants to replace laboratory haemoglobin with a finger-prick meter that gives a result in a minute. The team tests 500 pregnant women with both. The meter labels 120 women anaemic; the laboratory labels 110. The vendor says the meter "agrees with the laboratory more than 90% of the time". Before the programme buys 2,000 meters, you are asked whether that single figure is enough to judge the device.`,
      explore: {
        interactive: 'screening-preview',
        props: { target: 'accuracy', sens: 90, spec: 90, prev: 20 },
        prompt: md`Think of the dots as 1,000 pregnant women, 20% of whom are truly anaemic. Solid dots are women the meter calls anaemic; hollow dots are women it calls normal. Drag **sensitivity** down and watch hollow teal dots appear: anaemic women the meter misses. Put it back, then drag **specificity** down and watch solid orange dots appear: women wrongly called anaemic. Notice that each slider controls a different kind of mistake.`,
      },
      formalise: md`This chapter only introduces the concepts of testing; Chapter 12 teaches it properly. For now, just understand the three ideas.

**1. A test makes two different kinds of mistake.** It can miss someone who has the condition, or it can raise a false alarm in someone who does not. These have different consequences, so we describe them separately.

**2. Two numbers describe how good a test is**, each asked of a different group of people:

- **Sensitivity**: of the people who *have* the condition, what share does the test catch?
- **Specificity**: of the people who *do not have* the condition, what share does the test correctly clear?

Put the clinic's results into counts:

|  | Truly anaemic (laboratory) | Not anaemic (laboratory) |
|---|---|---|
| Meter says anaemic | 99 | 21 |
| Meter says normal | 11 | 369 |
| **Total** | **110** | **390** |

The meter catches 99 of the 110 anaemic women, a sensitivity of 90%. It correctly clears 369 of the 390 women who are not anaemic, a specificity of about 95%. Each figure is read down its own column.

**3. "Agreement" hides the mistakes.** The meter agrees with the laboratory for 99 + 369 = 468 of 500 women, which is 94%. That sounds excellent, but it blends the two kinds of mistake, and it is dominated by the large group of women who are not anaemic. A test that called *everyone* normal would still "agree" with the laboratory for 390 of 500 women (78%) while catching no anaemia at all.

The book also notes a trade-off, which Chapter 12 explains: adjusting a test to catch more true cases usually means more false alarms, and vice versa.

**Common mistake:** judging a test by a single "accuracy" or "agreement" figure, which can look impressive simply because most people are healthy.`,
      checks: [
        {
          id: 'ch01-screening-tests-q1', concept: 'sensitivity_specificity',
          prompt: md`Of 110 women who are truly anaemic, the meter calls 99 anaemic. Of 390 women who are not anaemic, it calls 21 anaemic. What is the meter's sensitivity?`,
          options: [
            { text: '90% (99 of 110)', correct: true, feedback: 'Correct. Sensitivity looks only at the women who truly have the condition and asks how many the test caught.' },
            { text: '82.5% (99 of 120)', correct: false, feedback: 'That divides by everyone the meter called anaemic. It answers a different question, which the next card takes up.' },
            { text: '94.6% (369 of 390)', correct: false, feedback: 'That is the specificity: women without anaemia whom the meter correctly cleared.' },
            { text: '93.6% (468 of 500)', correct: false, feedback: 'That is overall agreement, which blends both kinds of mistake together.' },
          ],
        },
        {
          id: 'ch01-screening-tests-q2', concept: 'sensitivity_specificity',
          prompt: md`A meter with low **specificity** will mainly cause which problem in the clinic?`,
          options: [
            { text: 'Many anaemic women will be sent home as normal.', correct: false, feedback: 'Missing true cases is a problem of low sensitivity.' },
            { text: 'Many women who are not anaemic will be told they are, and sent for unnecessary tests or treatment.', correct: true, feedback: 'Yes. Specificity is about the people without the condition; low specificity means many false alarms among them.' },
            { text: 'The meter will give different readings for the same woman on different days.', correct: false, feedback: 'That is a problem of reliability (repeatability), a separate property from sensitivity and specificity.' },
          ],
        },
        {
          id: 'ch01-screening-tests-q3', concept: 'sensitivity_specificity',
          prompt: md`A test for a rare condition (1 person in 200 has it) gives a negative result for everyone. It agrees with the reference standard for 99.5% of people. What is its sensitivity?`,
          options: [
            { text: '99.5%', correct: false, feedback: 'That is overall agreement. It is high only because almost everyone is healthy.' },
            { text: '100%', correct: false, feedback: 'It correctly clears every healthy person, so its specificity is 100%. But it catches no one who has the condition.' },
            { text: '0%', correct: true, feedback: 'Correct. It misses every true case. This is why agreement alone is a poor way to judge a test.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch01-predictive-value', chapter: 1, order: 4,
      title: 'What does a positive result mean?',
      concepts: ['predictive_value', 'sensitivity_specificity'], minutes: 11,
      hook: md`A rapid syphilis test with sensitivity 95% and specificity 95% works well in the sexually transmitted infection clinic of a Mumbai teaching hospital, where about one in five attendees is infected: most positives are confirmed. The same test is rolled out for universal antenatal screening in a rural block where about one woman in a hundred is infected. Within a month, many patients complain that they were wrongly flagged as having the disease, only to be found negative by the confirmatory laboratory. The confirmatory laboratory also complained that most positive samples it receives are negative. Has the test become worse?`,
      explore: {
        interactive: 'screening-preview',
        props: { target: 'prevalence', sens: 95, spec: 95, prev: 20 },
        prompt: md`The test is set to 95% sensitivity and 95% specificity, and 20% of people are infected, as in the hospital clinic. Look at the block of solid dots (everyone who tested positive): most are teal, true infections. Now move **have the condition** down towards 1%, as in the rural block, without touching the test. Watch the solid block fill with orange false alarms, and read how many of the positives truly have the infection.`,
      },
      formalise: md`A patient with a positive result does not ask "what is the sensitivity?" She asks: **now that my test is positive, how likely is it that I really have the condition?** That share, among everyone who tests positive, is called the **positive predictive value**.

The easiest way to work it out is to imagine 1,000 people and count. The test is identical in both settings (95% sensitivity, 95% specificity):

| | Hospital clinic (20% infected) | Rural block (1% infected) |
|---|---|---|
| People infected | 200 | 10 |
| … of whom test positive | 190 | about 10 |
| People not infected | 800 | 990 |
| … of whom test positive (false alarms) | 40 | about 50 |
| **Everyone testing positive** | **230** | **about 60** |
| **Share of positives truly infected** | **190 of 230 = 83%** | **10 of 60 = 16%** |

Nothing about the test changed. What changed is the **population**: when an infection is rare, the 5% of false alarms comes from a very large group of uninfected people, and those false alarms swamp the handful of true cases.

This is exactly the trap the book describes in its first chapter: common sense says a test that is "95% right" gives positive results you can trust, and common sense is wrong when the condition is uncommon.

Practical consequence: a positive screening result in a low-prevalence setting should be presented as "needs confirmation", not as a diagnosis. Chapter 12 returns to this with the full toolkit: the [[negative predictive value]], how cut-offs are chosen, and how a test should be evaluated.

**Common mistake:** treating the sensitivity of a test as the probability that someone who tests positive has the condition.`,
      checks: [
        {
          id: 'ch01-predictive-value-q1', concept: 'predictive_value',
          prompt: md`Why did the confirmatory laboratory start receiving mostly negative samples after the test moved to rural antenatal screening?`,
          options: [
            { text: 'The test kits deteriorated in the field and became less accurate.', correct: false, feedback: 'Kit quality could matter, but the change is fully explained even with an unchanged test: infection was twenty times rarer.' },
            { text: 'Infection was much rarer, so false alarms from the large uninfected group outnumbered the true cases.', correct: true, feedback: 'Right. How far a positive result can be trusted depends on how common the condition is, not only on the test.' },
            { text: 'Pregnant women are harder to test.', correct: false, feedback: 'If the test missed more infections, that would reduce positives, not flood the laboratory with false ones.' },
          ],
        },
        {
          id: 'ch01-predictive-value-q2', concept: 'predictive_value',
          prompt: md`A woman in the rural block tests positive. Using the table on this card, roughly how likely is she to be infected?`,
          options: [
            { text: 'About 95%, the sensitivity.', correct: false, feedback: 'Sensitivity tells you how many infected people test positive. She wants the reverse: how many people who test positive are infected.' },
            { text: 'About 16%: roughly 10 of the 60 positives are true infections.', correct: true, feedback: 'Correct. Only about 1 positive in 6 is a true infection here, which is why confirmation is essential.' },
            { text: 'About 1%, the share infected.', correct: false, feedback: 'That was her chance before testing. The positive result raises it, but only to about 16%.' },
          ],
        },
        {
          id: 'ch01-predictive-value-q3', concept: 'sensitivity_specificity',
          prompt: md`Which figures would you expect to stay roughly the same when the same test is used in the hospital clinic and in the rural block?`,
          options: [
            { text: 'The share of positive results that are true infections', correct: false, feedback: 'That fell from 83% to 16% between the two settings.' },
            { text: 'Sensitivity and specificity', correct: true, feedback: 'Yes. They describe the test among people who do and do not have the infection, so they do not depend directly on how common it is.' },
            { text: 'The number of positive results per 1,000 people tested', correct: false, feedback: 'That fell from about 230 to about 60, because far fewer people were infected.' },
          ],
        },
      ],
    },
  ],
};
