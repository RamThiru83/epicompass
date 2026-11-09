import type { Chapter } from '../types';

const md = String.raw;

export const ch02: Chapter = {
  number: 2,
  title: 'Pioneers in epidemiology and public health',
  unit: 'A',
  reading: 'Rothman, Huybrechts & Murray, 3rd ed., Chapter 2',
  summary: md`The methods in epidemiology were invented by people trying to answer urgent practical questions. Follow three threads through that history: turning counts into rates, finding comparisons that nature or circumstance has set up for us, and building deliberate comparison groups, which became the cohort and case-control designs. Each of these inventions is still part of everyday practice in epidemiology.`,
  cards: [
    // ------------------------------------------------------------------
    {
      id: 'ch02-counting-and-comparing', chapter: 2, order: 1,
      title: 'From counting the dead to comparing rates',
      concepts: ['counts_vs_rates'], minutes: 9,
      hook: md`The Crimean War, 1854. At the request of Britain's Secretary of War, Florence Nightingale travels to the front with a team of trained volunteer nurses. In the military hospitals she finds that poor food and hygiene, a shortage of medicines and plain neglect are killing more soldiers than battle wounds. She brings in better sewage and ventilation, and death rates fall. Then she does something unusual for a nurse of her time: she sets out to prove, with carefully collected numbers and a diagram of her own invention, what had been killing the army.`,
      formalise: md`Two centuries earlier, John Graunt, a London haberdasher, saw how much could be learnt by compiling data that already existed: the weekly **Bills of Mortality**, parish lists of christenings and deaths by cause. Using already-collected data in this way is still a large part of epidemiology.

A count of deaths says little until you know **how many people could have died**, and for how long. Dividing by the time people spent at risk turns a count into a rate:

$$\text{mortality rate} = \frac{\text{deaths in a period}}{\text{total time at risk, summed over people}}$$

[[Person-time]] adds up the time each person spent at risk (Chapter 4). When the number of people is fairly steady, it is close to the average number at risk multiplied by the length of the period, which is how this example is worked. With synthetic numbers: a hospital ward averages 2,000 men in January with 120 deaths, and 500 men in June with 45 deaths. January has more deaths, but expressed per 1,000 men per month the figures are 60 and 90; June is worse.

Nightingale understood that numbers persuade only if they are presented clearly: her diagrams showed at a glance that preventable disease, not wounds, killed most soldiers.

The lesson for us: before comparing any two groups, ask what the denominators are and whether they cover the same span of time.

<details class="going-further"><summary>Going further</summary>
<ul>
<li><b>Graunt</b> (the book calls him the world's first epidemiologist and demographer) found, among other things, that more boys than girls are born; that London's population grew through migration rather than births; how diseases trended over time, allowing for the size of the population; and he built the first actuarial (life) table. He estimated that about a fifth of plague deaths had been recorded under other causes, and corrected for it.</li>
<li><b>Nightingale's</b> polar-area diagram (the "coxcomb") showed each month's deaths by cause, with area proportional to deaths: deaths from preventable or mitigable infectious ("zymotic") diseases far outnumbered those from wounds. Her later reports reformed the medical care of soldiers, and she went on to campaign for sanitation in rural India.</li>
<li>Earlier still, writings attributed to <b>Hippocrates</b> had urged physicians to consider the air, water and way of life of a place; counting and rates allowed such ideas to be tested.</li>
</ul>
</details>

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
          prompt: md`Which of these describes Graunt's contribution?`,
          options: [
            { text: 'He predicted which individual Londoners would die from plague.', correct: false, feedback: 'Graunt worked with totals for the population, not predictions for individuals.' },
            { text: 'He showed how much could be learnt by compiling and analysing data that had already been collected for another purpose.', correct: true, feedback: 'Yes. The Bills of Mortality were kept to monitor plague; Graunt turned them into findings about births, deaths and population, a tradition epidemiologists still follow.' },
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
      id: 'ch02-bonus-nightingale', chapter: 2, order: 2,
      title: 'Companion video: Florence Nightingale and the joy of statistics',
      concepts: [], minutes: 6,
      bonus: { youtubeId: 'yhX0OR1_Vfc', channel: 'OpenLearn from The Open University', videoTitle: 'Florence Nightingale: Joy of Stats (3/6)' },
      hook: md`A companion to card 2.1, where you saw Nightingale turn a ledger of burials into rates. In this short clip from the BBC series *The Joy of Stats*, the late Hans Rosling tells the same story with his trademark energy, and argues that her statistics, and the way she drew them, saved more lives than her nursing.`,
      formalise: md`**Spot the epidemiology while you watch.**

- Nightingale's question was not "how many soldiers died?" but "how many died **out of how many** who were there?" That is the step from a count to a **rate**, as in card 2.1.
- She sorted deaths by **cause**, separating those from wounds from those from disease that better sanitation could have prevented.
- Her polar-area diagram ("coxcomb") is an early piece of **data visualisation** built to persuade decision-makers, not just to describe.
- Notice that the evidence changed policy. Epidemiology has always been an applied science: the point of measuring is to act.

As you watch, ask what Nightingale's denominators were and whether the months she compared covered the same length of time.`,
      checks: [],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch02-snow-natural-experiment', chapter: 2, order: 3,
      title: 'Snow and the natural experiment',
      concepts: ['natural_experiment', 'counts_vs_rates'], minutes: 14,
      hook: md`South London, 1854. Cholera is back. John Snow, an anaesthetist, believes the disease spreads through water fouled with sewage, not through bad air as most of his colleagues think. He learns that two private companies pipe water to the same districts: one draws from the Thames downstream of the city's sewage outflows, the other has recently moved its intake upstream. Their mains run side by side down the same streets, and a household's supplier was often chosen by a landlord years earlier. Snow and his colleagues visit every house where a cholera death has been reported, asking one question: which company supplies this house? The number of houses each company supplies comes from records the companies have returned to Parliament.`,
      explore: {
        interactive: 'snow-rates',
        prompt: md`The table opens with Snow's own figures for the first four weeks of the epidemic. Compare the raw death counts for Company S and Company L with the deaths per 10,000 houses, and note how the number of houses supplied changes the picture. Edit any cell, for example by giving Company L the same number of houses as Company S, and watch the risks respond, along with the two comparison tiles: how many times higher Company S's risk is, and how many extra deaths per 10,000 houses it carries; use 'Reset to Snow's figures' to return. Finally, ask yourself what else might differ between houses served by the two companies, such as poverty or district.`,
      },
      formalise: md`Snow could not assign water supplies, but circumstance had done it for him. A **natural experiment** is not really an experiment, because the investigator assigns nothing: it is a **cohort study** in which circumstance has allocated the exposure in a way that imitates an experiment, ideally independently of the other causes of the outcome. The closer the groups are to what random assignment would have produced, the more convincing it is.

What made the water-company comparison persuasive:

- **Intermixed exposure.** Houses on both supplies stood side by side, shared the same air, the same streets, and similar levels of poverty, so many potential confounders were balanced.
- **Exposure not chosen for health reasons.** The supplier had often been fixed long before, sometimes without the occupants knowing which company served them.
- **A proportion, not a count.** Snow divided deaths by the number of houses served, a practical stand-in for the population at risk.

With deaths $D$ and houses $H$ for each supplier:

$$\text{risk}_j = \frac{D_j}{H_j} \times 10{,}000 \qquad \text{times higher} = \frac{\text{risk}_{\text{polluted}}}{\text{risk}_{\text{clean}}}$$

Each figure is the proportion of houses (or, later, people) with a fatal attack over the period, so the book calls it a **risk** of fatal cholera, and the comparison a [[risk ratio]] (Chapter 4).

In the first four weeks of the epidemic, Snow found about 71 deaths per 10,000 houses supplied by the Southwark and Vauxhall Company against 5 per 10,000 supplied by the Lambeth Company. A ratio well above 1 in a comparison where other differences are small points to the water as a cause.

<details class="going-further"><summary>Going further</summary>
<ul>
<li><b>Snow's figures:</b> 286 deaths in 40,046 houses against 14 in 26,107 houses, which he reported as fourteen times higher. For the whole 1854 outbreak, using the population served as the denominator, the risks were 0.0161 against 0.0027, about six times higher.</li>
<li><b>A flaw he corrected:</b> his first analysis included all houses supplied by each company, not only those in the districts where both companies competed; he corrected this in a later publication (Chapter 5).</li>
<li><b>What followed:</b> Snow's reasoning later shaped Wade Hampton Frost, the first professor of epidemiology (at Johns Hopkins), whose tuberculosis studies showed how analysing death rates by birth cohort clarifies trends, a method the Norwegian physician Kristian Andvord had introduced about ten years before.</li>
</ul>
</details>

**Common mistake:** assuming that any "before and after" or "here and there" comparison is a natural experiment, or that a natural experiment is a true experiment. It is a cohort study, and it is convincing only if exposure was allocated independently of other causes of the outcome.`,
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
      id: 'ch02-bonus-kids', chapter: 2, order: 4,
      title: 'Teach-back: explaining John Snow’s detective work',
      concepts: [], minutes: 6,
      bonus: { youtubeId: 'FarAYzAzNa0', channel: 'Little Scientists Club', videoTitle: 'How John Snow found the cause of cholera (Ep 20)' },
      hook: md`You have just followed Snow's comparison of the two water companies. Could you explain what he did to someone with no science background, without losing what made it good science? Below is one worked example: an episode from my children's science channel, made for five- and six-year-olds, in which Curie follows Dr Snow's clues through 1854 London.

*Why a children's video in an MSc course? Explaining a method in plain words is part of a clinical researcher's job: participant information sheets, informed consent, community meetings and talking to families. If you can explain an idea simply and correctly, you have understood it.*`,
      formalise: md`**What the explanation keeps, in simpler words.**

- Snow suspected the **water**, not the "bad air" most people blamed. A clear hypothesis tells you which clues to look for.
- Counting where the sick people lived pointed to one pump on Broad Street: counting cases by **place**.
- Waste from a leaky pit seeping into the pump's well is the **mechanism** that made the water idea believable.
- Neighbouring houses supplied by two water companies, one dirtier and one cleaner, gave a **natural experiment**: two groups alike in most ways except the water they drank, set up by circumstance rather than by the investigator.

**What a simple version has to leave out.** The outbreak was already fading when the pump handle was removed. Acting on the evidence was right, but the falling case count alone could not prove that removing the handle stopped it. Notice where simplifying would tip into overclaiming.

The video's catchphrase sums it up: *follow the clues to find the cause.*`,
      checks: [],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch02-comparison-groups', chapter: 2, order: 5,
      title: 'Inventing the comparison group: cohorts, cases, controls and society',
      concepts: ['comparison_group', 'social_determinants'], minutes: 14,
      hook: md`London, 1926. Janet Lane-Claypon, a public-health leader, is studying what raises the risk of breast cancer. She interviews 500 women with the disease, from hospitals in London and Glasgow, about their reproductive histories. On its own that would tell her little: how would she know whether those histories were unusual? So she interviews an equal number of women without breast cancer and compares the two. In 1950, research teams on either side of the Atlantic will use the same logic to ask whether people with lung cancer smoked more than people without it.`,
      formalise: md`Every causal question is a comparison: what happened to people with a characteristic, **compared with** what would have happened without it. The twentieth century turned that idea into two study designs.

| Design | Starting point | Early example |
|---|---|---|
| **Cohort** | People grouped by exposure, followed for outcomes | Lane-Claypon's earlier comparison of weight gain in breastfed and bottle-fed infants; later, large cohorts of doctors and volunteers followed for smoking-related deaths |
| **Case-control** | People with the disease and a comparison group without it, compared for past exposure | Lane-Claypon's 1926 breast cancer study; in 1950, the smoking and lung cancer studies of Wynder and Graham in the United States and Doll and Hill in Britain |

The 1950 case-control studies on smoking were followed by cohort studies: Doll and Hill among British doctors, and Hammond and Horn among American men. Case-control methods were then less widely understood than following people forward, so the cohort studies were undertaken partly to give stronger evidence; Hammond and Horn found an association with lung cancer about as strong as the case-control studies had. Even so, critics went on arguing for years that confounding could explain the findings, and in the United States the debate was settled only by the Surgeon General's advisory committee report of 1964.

Choosing the comparison group is the central design decision. In a cohort study, the unexposed group should show what the exposed group's experience would have been without the exposure. In a case-control study, the controls do a different job: they show how the exposure is distributed in the population that gave rise to the cases, so they must be sampled independently of exposure (Chapter 5).

**Social epidemiology** studies how factors such as poverty, education, discrimination, segregation, inequalities and particular social policies affect health and social justice. These factors are causes in their own right, and they can also confound other comparisons.

<details class="going-further"><summary>Going further</summary>
<ul>
<li><b>Lane-Claypon's 1926 study</b> linked age at first pregnancy, age at menopause, number of children and surgically induced menopause to the risk of breast cancer.</li>
<li><b>A long social strand:</b> Farr pressed for sanitary reform, Nightingale worked to improve care for the poor, and Lane-Claypon worried in 1912 that social class might confound her comparison of infant feeding methods.</li>
</ul>
</details>

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
          prompt: md`After their 1950 case-control study, why did Doll and Hill set up a cohort study of British doctors?`,
          options: [
            { text: 'Case-control methods were less widely understood at the time, so following people from smoking to disease could give evidence that more people would accept.', correct: true, feedback: 'Yes. The cohort study was undertaken to give stronger evidence, and the American cohort of Hammond and Horn found an association about as strong as the case-control studies.' },
            { text: 'Cohort studies cannot be confounded, so they settled the question at once.', correct: false, feedback: 'Cohort studies can be confounded too. Critics went on arguing that confounding explained the findings until the 1964 Surgeon General’s report.' },
            { text: 'Case-control studies cannot produce any measure of association between smoking and lung cancer.', correct: false, feedback: 'They can (Chapters 4 and 5 show how). The issue in 1950 was how familiar and trusted the method was.' },
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
        {
          id: 'ch02-comparison-groups-q4', concept: 'comparison_group',
          prompt: md`A case-control study of mobile phone use and brain tumours recruits its cases from a regional neurosurgery unit. Which control group best does the job of the comparison group?`,
          options: [
            { text: 'Healthy volunteers who reply to a newspaper advertisement for the study.', correct: false, feedback: 'Volunteers tend to differ from the general population (for example, in health awareness and habits), so they may not show what phone use among the cases would have looked like otherwise.' },
            { text: 'People without brain tumours drawn from the same population the cases arose from, selected without regard to their phone use.', correct: true, feedback: 'Correct. Controls should represent the exposure experience of the population that gave rise to the cases.' },
            { text: 'Close friends nominated by each case.', correct: false, feedback: 'Friends often share habits, including phone use, which would push the comparison towards finding no difference.' },
          ],
        },
        {
          id: 'ch02-comparison-groups-q5', concept: 'social_determinants',
          prompt: md`In a city, infant mortality in the poorest fifth of wards is three times that in the richest fifth. How would a social epidemiologist read this gradient?`,
          options: [
            { text: 'As a sign that income, housing, education and access to care shape health, so the gradient itself is worth explaining and acting on.', correct: true, feedback: 'Correct. Social conditions can be causes in their own right, often sitting upstream of many individual risk factors.' },
            { text: 'As irrelevant to epidemiology, because only individual behaviours cause disease.', correct: false, feedback: 'Social epidemiology studies exactly these population patterns; they are not reducible to individual choices.' },
            { text: 'As probably due to chance, because ward boundaries are arbitrary.', correct: false, feedback: 'A threefold gradient across a whole city is unlikely to be chance. Large social gaps in health are well documented: the chair of the WHO Commission on Social Determinants of Health pointed to decades of difference in life expectancy between countries and within them.' },
          ],
        },
        {
          id: 'ch02-comparison-groups-q6', concept: 'social_determinants',
          prompt: md`Two villages have similar smoking rates, but tuberculosis is twice as common in the poorer village. Which explanation fits a social-determinants view?`,
          options: [
            { text: 'Tuberculosis is mainly genetic, so the villages must differ in ancestry.', correct: false, feedback: 'Tuberculosis, like nearly all disease, has both genetic and environmental component causes, so asking what share is "genetic" is misleading (Chapter 3). Ancestry is unlikely to differ much between neighbouring villages; living conditions linked to poverty plainly do.' },
            { text: 'The difference cannot be real, because smoking rates are the same.', correct: false, feedback: 'Smoking is only one of many causes. Equal smoking rates say nothing about the other component causes.' },
            { text: 'Crowded housing and poor nutrition, both linked to poverty, increase exposure to infection and susceptibility to disease.', correct: true, feedback: 'Correct. Poverty acts through living conditions that raise both exposure and vulnerability.' },
          ],
        },
      ],
    },
  ],
};
