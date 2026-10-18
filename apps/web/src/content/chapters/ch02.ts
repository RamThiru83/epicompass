import type { Chapter } from '../types';

const md = String.raw;

export const ch02: Chapter = {
  number: 2,
  title: 'Pioneers in epidemiology and public health',
  unit: 'A',
  reading: 'Rothman, Huybrechts & Murray, 3rd ed., Chapter 2',
  summary: md`The methods in this course were not handed down complete; they were invented by people trying to answer urgent practical questions. Follow three threads through that history: turning counts into rates, finding comparisons that nature or circumstance has set up for us, and building deliberate comparison groups, which became the cohort and case-control designs. Each thread is still part of everyday practice.`,
  cards: [
    // ------------------------------------------------------------------
    {
      id: 'ch02-counting-and-comparing', chapter: 2, order: 1,
      title: 'From counting the dead to comparing rates',
      concepts: ['counts_vs_rates'], minutes: 9,
      hook: md`Scutari Barrack Hospital, near Istanbul, in the winter of 1855. In the barrack hospital, Florence Nightingale sits with ledgers of admissions and burials. Army officials point out that more soldiers die in the hospital in winter simply because more soldiers are sent there. She is not satisfied with totals. She divides each month's deaths by the average number of men in the hospital that month and converts the result to an annual figure, then sorts the deaths by cause: wounds, or diseases such as cholera and dysentery that clean water and drains could prevent. The pattern she finds will reshape military hospitals.`,
      formalise: md`Two centuries earlier, a London shopkeeper, John Graunt, had shown that the weekly lists of burials kept by parishes could be tabulated to reveal regularities: more boys than girls born each year, heavy mortality in early childhood, and seasonal surges of plague. His insight was that individual deaths are unpredictable, but **populations** behave with regularity that can be measured.

Nightingale took the next step. A count of deaths says little until you know **how many people could have died**. Dividing by the population at risk turns a count into a rate:

$$\text{mortality rate} = \frac{\text{deaths in a period}}{\text{average population at risk} \times \text{length of period}}$$

With synthetic numbers: a hospital ward averages 2,000 men in January with 120 deaths, and 500 men in June with 45 deaths. January has more deaths, but expressed per 1,000 men per month the figures are 60 and 90; June is worse.

Nightingale also understood that a rate is persuasive only if it is presented clearly. Her polar-area diagrams showed, at a glance, that preventable infection killed far more soldiers than battle wounds.

The lesson for us: before comparing any two groups, ask what the denominators are and whether they cover the same span of time. Earlier still, writings attributed to Hippocrates had urged physicians to consider the air, water and way of life of a place; counting and rates allowed such ideas to be tested.

**Common mistake:** comparing raw numbers of cases between groups of different size or observed for different lengths of time.`,
      checks: [
        {
          id: 'ch02-counting-and-comparing-q1', concept: 'counts_vs_rates',
          prompt: md`District A recorded 300 dengue cases and District B recorded 150 in the same season. What do you need before saying dengue was more common in District A?`,
          options: [
            { text: 'Nothing; twice the cases means twice the problem.', correct: false, feedback: 'If District A has four times the population, its rate is actually lower. Counts ignore the denominator.' },
            { text: 'The population at risk in each district over the same period.', correct: true, feedback: 'Correct. Only by dividing by the people at risk (and the time) can you compare occurrence.' },
            { text: 'The number of deaths from dengue in each district.', correct: false, feedback: 'Deaths tell you about severity or case fatality, not about how common dengue was.' },
          ],
        },
        {
          id: 'ch02-counting-and-comparing-q2', concept: 'counts_vs_rates',
          prompt: md`What was the main insight that made Graunt's tables useful?`,
          options: [
            { text: 'He could predict which individual Londoner would die next.', correct: false, feedback: 'The opposite: individual deaths are unpredictable. The regularity appears only in aggregate.' },
            { text: 'Deaths aggregated over a population show stable, measurable patterns.', correct: true, feedback: 'Yes. Regularity at the population level is the foundation of epidemiology.' },
            { text: 'He proved that plague was spread by contaminated water.', correct: false, feedback: 'Graunt described patterns of mortality; he did not establish the mode of transmission of plague.' },
          ],
        },
        {
          id: 'ch02-counting-and-comparing-q3', concept: 'counts_vs_rates',
          prompt: md`A ward had 120 deaths among an average of 2,000 men in one month, and 45 deaths among 500 men in another month. Which month had the higher mortality?`,
          options: [
            { text: 'The first month, because it had more deaths.', correct: false, feedback: 'More deaths among many more men: 60 per 1,000 against 90 per 1,000.' },
            { text: 'The second month: 90 per 1,000 men against 60 per 1,000.', correct: true, feedback: 'Correct. Once you divide by the population at risk, the smaller month turns out to be the deadlier.' },
            { text: 'They cannot be compared without knowing the causes of death.', correct: false, feedback: 'Causes help explain differences, but overall mortality can be compared once rates are calculated.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch02-snow-natural-experiment', chapter: 2, order: 2,
      title: 'Snow and the natural experiment',
      concepts: ['natural_experiment', 'counts_vs_rates'], minutes: 14,
      hook: md`South London, 1854. Cholera is back. John Snow, an anaesthetist, believes the disease spreads through water fouled with sewage, not through bad air as most of his colleagues think. He learns that two private companies pipe water to the same districts: one draws from the Thames downstream of the city's sewage outflows, the other has recently moved its intake upstream. Their mains run side by side down the same streets, and a household's supplier was often chosen by a landlord years earlier. Snow walks door to door asking one question: which company supplies this house?`,
      explore: {
        interactive: 'snow-rates',
        prompt: md`Compare the raw death counts for Company S and Company L with the rates per 10,000 houses, and note how the number of houses supplied changes the picture. Edit any cell, for example by giving Company L the same number of houses as Company S, and watch the death rates respond, along with the two comparison tiles: how many times higher Company S's rate is, and how many extra deaths per 10,000 houses it carries; use 'Reset to cited figures' to return. Finally, ask yourself what else might differ between houses served by the two companies, such as poverty or district.`,
      },
      formalise: md`Snow could not assign water supplies, but circumstance had done it for him. A **natural experiment** is a situation in which exposure is allocated by events that are unrelated to the other causes of the outcome, so the comparison resembles a randomised trial.

What made the water-company comparison persuasive:

- **Intermixed exposure.** Houses on both supplies stood side by side, shared the same air, the same streets, and similar levels of poverty, so many potential confounders were balanced.
- **Exposure not chosen for health reasons.** The supplier had often been fixed long before, sometimes without the occupants knowing which company served them.
- **A rate, not a count.** Snow divided deaths by the number of houses served, a practical stand-in for the population at risk.

With deaths $D$ and houses $H$ for each supplier:

$$\text{rate}_j = \frac{D_j}{H_j} \times 10{,}000 \qquad \text{times higher} = \frac{\text{rate}_{\text{polluted}}}{\text{rate}_{\text{clean}}}$$

Chapter 4 gives this second quantity its proper name, the [[rate ratio]].

A ratio well above 1 in a comparison where other differences are small points to the water as a cause. Snow's estimate was imprecise in places (houses are not people, and some households were misclassified) but the size and consistency of the contrast made chance and confounding implausible explanations.

Later, Wade Hampton Frost in the United States would champion Snow's reasoning and show how following groups over time (for example, by birth cohort) clarifies trends that cross-sectional snapshots obscure.

**Common mistake:** assuming that any "before and after" or "here and there" comparison is a natural experiment; it qualifies only if exposure was allocated independently of other causes of the outcome.`,
      practise: { template: 'ch02-snow-rate-ratio', count: 2 },
      checks: [
        {
          id: 'ch02-snow-natural-experiment-q1', concept: 'natural_experiment',
          prompt: md`What feature most strengthened Snow's comparison of the two water companies?`,
          options: [
            { text: 'The large number of deaths he recorded.', correct: false, feedback: 'Large numbers reduce random error, but they do not protect against confounding.' },
            { text: 'Customers of both companies lived intermixed in the same streets, so other risk factors were similar.', correct: true, feedback: 'Correct. Exposure was allocated almost independently of poverty, air and neighbourhood, much as randomisation would do.' },
            { text: 'He used microscopy to identify the cholera organism in the water.', correct: false, feedback: 'The causative organism was not identified in his investigation; the argument rested on the population comparison.' },
            { text: 'Doctors agreed with his theory, which reduced bias.', correct: false, feedback: 'Most did not agree at the time, and agreement among experts is not evidence of an unbiased comparison.' },
          ],
        },
        {
          id: 'ch02-snow-natural-experiment-q2', concept: 'counts_vs_rates',
          prompt: md`Why did Snow divide deaths by the number of houses supplied?`,
          options: [
            { text: 'Because the two companies served different numbers of households, so counts alone could mislead.', correct: true, feedback: 'Yes. A larger company would record more deaths even if its water were no worse.' },
            { text: 'Because each house had exactly one death.', correct: false, feedback: 'Houses were a convenient proxy for population size; deaths per house varied.' },
            { text: 'To make the numbers smaller and easier to interpret.', correct: false, feedback: 'Scaling is cosmetic; the point is to put both companies on a common denominator.' },
          ],
        },
        {
          id: 'ch02-snow-natural-experiment-q3', concept: 'natural_experiment',
          prompt: md`A city switches a quarter of its wards to fluoridated water because those wards are near the new treatment plant. Dental caries is then compared between wards. When would this count as a natural experiment?`,
          options: [
            { text: 'Always, because the government, not the residents, chose the wards.', correct: false, feedback: 'Who chose is less important than whether the choice was linked to other determinants of caries.' },
            { text: 'Only if proximity to the plant is unrelated to other determinants of caries, such as income and access to dentists.', correct: true, feedback: 'Correct. A natural experiment needs allocation that is independent of the other causes of the outcome.' },
            { text: 'Only if the study is large enough to reach statistical significance.', correct: false, feedback: 'Size affects precision, not whether the allocation mimics randomisation.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch02-comparison-groups', chapter: 2, order: 3,
      title: 'Inventing the comparison group: cohorts, cases, controls and society',
      concepts: ['comparison_group', 'social_determinants'], minutes: 12,
      hook: md`London, 1926. Janet Lane-Claypon, a physician and statistician, is studying breast cancer. Interviewing women with the disease about their pregnancies and breastfeeding would tell her little on its own: how would she know whether those histories were unusual? So she also interviews a comparable group of women without breast cancer and compares the two. Twenty-five years later, two research teams on either side of the Atlantic will use the same logic to ask whether people with lung cancer smoked more than people without it.`,
      formalise: md`Every causal question is a comparison: what happened to people with a characteristic, **compared with** what would have happened without it. The twentieth century turned that idea into two study designs.

| Design | Starting point | Early example |
|---|---|---|
| **Cohort** | People grouped by exposure, followed for outcomes | Lane-Claypon's earlier comparison of weight gain in breastfed and bottle-fed infants; later, large cohorts of doctors and volunteers followed for smoking-related deaths |
| **Case-control** | People with the disease and a comparison group without it, compared for past exposure | Lane-Claypon's breast cancer study; around 1950, the smoking and lung cancer studies of Wynder and Graham in the United States and Doll and Hill in Britain |

Around 1950, case-control studies on smoking were followed by cohort studies (Doll and Hill among British doctors; Hammond and Horn among American volunteers). Agreement between designs with **different weaknesses** was a large part of why the evidence became convincing.

The comparison group is only useful if it represents what the cases' or exposed group's experience would have been otherwise; choosing it is the central design decision in both designs (Chapter 5).

Epidemiology has also always had a social strand. Mortality has been tied to poverty, housing and working conditions since the earliest tabulations, and **social epidemiology** studies how factors such as income, education, occupation, gender and social discrimination shape health. These factors can be causes in their own right, and they are often powerful confounders of other comparisons.

**Common mistake:** describing a series of patients with a disease and their exposures without any comparison group, and then drawing causal conclusions.`,
      checks: [
        {
          id: 'ch02-comparison-groups-q1', concept: 'comparison_group',
          prompt: md`A surgeon reports that 70% of her patients with gallstones ate a high-fat diet. Why is this weak evidence that diet causes gallstones?`,
          options: [
            { text: 'Seventy per cent is not high enough to be meaningful.', correct: false, feedback: 'No threshold makes a proportion meaningful on its own. The problem is the missing comparison.' },
            { text: 'Without knowing how common a high-fat diet is among comparable people without gallstones, there is nothing to compare against.', correct: true, feedback: 'Correct. If 70% of similar people without gallstones also eat that diet, there is no association at all.' },
            { text: 'The study should have been a randomised trial.', correct: false, feedback: 'A trial would help, but a well-designed case-control study can also be informative. What is missing here is any comparison group.' },
          ],
        },
        {
          id: 'ch02-comparison-groups-q2', concept: 'comparison_group',
          prompt: md`Why did agreement between the early case-control and cohort studies of smoking strengthen the conclusion?`,
          options: [
            { text: 'Because the two designs have different potential biases, so a shared result is less likely to be explained by any single bias.', correct: true, feedback: 'Yes. Consistency across designs with different weaknesses is more informative than repetition of one design.' },
            { text: 'Because cohort studies are always unbiased, and they confirmed the case-control results.', correct: false, feedback: 'Cohort studies have their own biases, such as loss to follow-up and confounding.' },
            { text: 'Because combining two designs doubles the sample size, making the result significant.', correct: false, feedback: 'Precision helps, but the key gain was robustness to different sources of bias.' },
          ],
        },
        {
          id: 'ch02-comparison-groups-q3', concept: 'social_determinants',
          prompt: md`A study finds that children in slum households have higher rates of diarrhoea and also lower vaccination coverage. In a study of vaccination and diarrhoea, how should household poverty be considered?`,
          options: [
            { text: 'As irrelevant, because poverty is not a biological cause.', correct: false, feedback: 'Social conditions shape exposures, access to care and outcomes; they can be causes and confounders.' },
            { text: 'As a likely confounder, because it is linked both to vaccination and to diarrhoea risk.', correct: true, feedback: 'Correct. Social factors often sit behind many exposures at once and must be addressed in the design or analysis.' },
            { text: 'As the outcome, because poverty is the real problem.', correct: false, feedback: 'Poverty may be an important cause, but in this study the outcome is diarrhoea.' },
          ],
        },
      ],
    },
  ],
};
