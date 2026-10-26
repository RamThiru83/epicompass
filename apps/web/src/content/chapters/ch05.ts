import type { Chapter } from '../types';

const md = String.raw;

export const ch05: Chapter = {
  number: 5,
  title: 'Types of epidemiologic studies',
  unit: 'B',
  reading: 'Rothman, Huybrechts & Murray, 3rd ed., Chapter 5',
  summary: md`Almost every epidemiologic study is either a cohort study, which follows people forward from exposure to outcome, or a case-control study, which samples that same experience more efficiently. Once you see a case-control study as a cohort viewed through a sampling lens, the questions of who should be a control and what the odds ratio estimates answer themselves. The chapter ends with cross-sectional studies, response rates and a side-by-side comparison of designs.`,
  cards: [
    // ------------------------------------------------------------------
    {
      id: 'ch05-cohort-studies', chapter: 5, order: 1,
      title: 'Cohort studies, including experiments',
      concepts: ['cohort_study'], minutes: 13,
      hook: md`A district in Assam wants to know whether tea-garden workers who receive weekly iron-folic acid tablets at work have fewer episodes of severe anaemia than those who do not. One team proposes to randomise garden divisions to the programme; another proposes to follow workers in gardens that already run it and compare them with workers in gardens that do not. Both teams would enrol workers, record exposure, and count new cases over two years. Are these two different study designs?`,
      explore: {
        interactive: 'two-by-two',
        props: { dataType: 'rate', basic: true },
        prompt: md`With 'Cohort: person-time data' selected, enter 30 exposed cases in 2,000 person-years and 60 unexposed cases in 2,200 person-years. Read the rates, the rate ratio and the rate difference. Then halve both person-time cells while keeping the cases fixed, and watch what changes and what stays the same.`,
      },
      formalise: md`In a **cohort study**, people are classified by exposure and followed over time to see who develops the outcome. Occurrence (risk or rate) is measured in each exposure group and compared.

A **randomised trial** is a cohort study in which the investigator assigns exposure. Randomisation makes the groups comparable in both known and unknown causes of the outcome, on average. A **natural experiment** sits in between: circumstance assigns exposure in a way that may resemble randomisation. In a non-experimental cohort, people's own circumstances determine exposure, so confounding must be addressed in design or analysis.

Design steps that matter in every cohort:

1. **Define the study population and who is at risk at entry.** Exclude people who already have the outcome (for first occurrence) or who cannot develop it.
2. **Define exposure and when it counts.** If an exposure needs an induction time, the person-time immediately after exposure may not yet be "exposed" person-time in a meaningful sense; set a lag in advance.
3. **Count events consistently.** Decide whether you count first events only, and use the same diagnostic criteria in all groups.
4. **Choose the measure.** If everyone is followed for the whole period, risks can be measured; otherwise use person-time and rates.
5. **Trace everyone.** Losses to follow-up that differ by exposure and outcome bias the comparison.

$$\mathrm{IR} = \frac{a / \mathrm{PT}_1}{b / \mathrm{PT}_0}$$

The two Assam proposals are both cohort studies; one is experimental. Their key difference is how exposure is assigned, and therefore how well confounding is controlled.

**Common mistake:** thinking "cohort study" means only observational studies; a trial is a cohort study with assigned exposure.`,
      checks: [
        {
          id: 'ch05-cohort-studies-q1', concept: 'cohort_study',
          prompt: md`What distinguishes a randomised trial from a non-experimental cohort study?`,
          options: [
            { text: 'Trials follow people forward in time; cohort studies look back.', correct: false, feedback: 'Both follow people from exposure to outcome. Timing relative to the investigator is a separate issue.' },
            { text: 'In a trial the investigator assigns exposure, which makes confounding much less likely.', correct: true, feedback: 'Correct. Assignment, not direction of follow-up, is the defining difference.' },
            { text: 'Trials measure risks; cohort studies measure rates.', correct: false, feedback: 'Either design can measure either quantity, depending on follow-up.' },
          ],
        },
        {
          id: 'ch05-cohort-studies-q2', concept: 'cohort_study',
          prompt: md`In a cohort study of an occupational solvent and leukaemia, the team believes at least five years must pass before the solvent could cause disease. How should person-time in the first five years after first exposure be handled?`,
          options: [
            { text: 'Count it as exposed person-time from day one.', correct: false, feedback: 'Cases arising in that window cannot have been caused by the exposure, so counting the time as exposed dilutes the effect.' },
            { text: 'Treat it separately or as not yet exposed, by lagging exposure by five years.', correct: true, feedback: 'Yes. Lagging exposure reflects the induction time and avoids diluting the estimate.' },
            { text: 'Exclude the whole cohort from analysis.', correct: false, feedback: 'Only the irrelevant window needs special handling; the later person-time is informative.' },
          ],
        },
        {
          id: 'ch05-cohort-studies-q3', concept: 'cohort_study',
          prompt: md`In a two-year cohort, 15% of workers in programme gardens and 3% in comparison gardens are lost to follow-up, mostly because they were too ill to keep working. What is the concern?`,
          options: [
            { text: 'Only precision is reduced; the estimate remains unbiased.', correct: false, feedback: 'Losses related to both exposure group and illness can distort the comparison, not just widen intervals.' },
            { text: 'Losses differ by exposure group and are related to the outcome, so the comparison may be biased.', correct: true, feedback: 'Correct. Complete tracing, or at least losses unrelated to outcome, is essential in cohort studies.' },
            { text: 'There is no concern because losses occurred in both groups.', correct: false, feedback: 'Losses in both groups are less worrying only if they are similar and unrelated to the outcome.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch05-closed-open-cohorts', chapter: 5, order: 2,
      title: 'Closed and open cohorts; prospective and retrospective timing',
      concepts: ['closed_open_cohort'], minutes: 11,
      hook: md`Two studies of kidney disease are planned in Andhra Pradesh. One enrols all 1,200 farm workers in a village in January and follows them for three years. The other uses the employment records of a pesticide plant from 1995 to 2020, in which workers joined and left throughout, and links them to the state dialysis registry; all the follow-up has already happened by the time the investigators open the files. A reviewer calls the first "prospective and closed" and the second "retrospective and open".`,
      formalise: md`**Closed versus open** describes who belongs to the cohort.

| | Closed (fixed) cohort | Open (dynamic) cohort |
|---|---|---|
| Membership | Defined at one starting event; nobody joins later | People enter and leave over time |
| Typical example | A birth cohort; trial participants | Residents of a district; employees over decades |
| Natural measure | Risk, if follow-up is complete | Incidence rate, using person-time |

Even a closed cohort becomes "open at the exit" when people are lost or die of other causes; then person-time and rates are the safer approach.

**Prospective versus retrospective** describes timing relative to the investigator, not the direction of reasoning. In a **prospective** cohort, the outcomes have not yet occurred when the study begins. In a **retrospective** (historical) cohort, exposure and outcome have already happened and are reconstructed from records. Both follow people from exposure to outcome; a retrospective cohort is not a case-control study.

Retrospective cohorts are fast and cheap when good records exist; their weakness is that exposure data were collected for other purposes and may be incomplete. Prospective cohorts can measure exposure exactly as needed, but take time.

**Eligibility over time.** In open cohorts, a person can move between exposure categories (a worker moves from office to factory floor) or become eligible only after a qualifying event. Person-time is assigned to the category the person is in at each moment, so one person can contribute time to several categories.

**Common mistake:** labelling any study that uses past records as "case-control"; the design is defined by how subjects are selected, not when the data were collected.`,
      checks: [
        {
          id: 'ch05-closed-open-cohorts-q1', concept: 'closed_open_cohort',
          prompt: md`The pesticide-plant study follows workers from hiring to the present using old records. What design is it?`,
          options: [
            { text: 'A case-control study, because the data are historical.', correct: false, feedback: 'Subjects are selected by exposure (employment) and followed for outcomes, which makes it a cohort.' },
            { text: 'A retrospective cohort study.', correct: true, feedback: 'Correct. It follows people from exposure to outcome, but the follow-up happened before the study began.' },
            { text: 'A cross-sectional study.', correct: false, feedback: 'It follows people over 25 years rather than measuring them at a single time.' },
          ],
        },
        {
          id: 'ch05-closed-open-cohorts-q2', concept: 'closed_open_cohort',
          prompt: md`Which measure is most natural for an open cohort in which people enter and leave continuously?`,
          options: [
            { text: 'Incidence rate based on person-time', correct: true, feedback: 'Yes. Person-time accommodates varying entry and exit.' },
            { text: 'Risk based on the number enrolled', correct: false, feedback: 'With varying follow-up, the number of people enrolled is not a valid risk denominator.' },
            { text: 'Prevalence at the end of follow-up', correct: false, feedback: 'Prevalence counts existing cases and does not measure new occurrence.' },
          ],
        },
        {
          id: 'ch05-closed-open-cohorts-q3', concept: 'closed_open_cohort',
          prompt: md`A worker spends 4 years in the office and then 6 years on the factory floor exposed to solvent. In an analysis by job type, how is her person-time assigned?`,
          options: [
            { text: 'All 10 years to the exposed category, because she was eventually exposed.', correct: false, feedback: 'Classifying all time by later exposure misattributes unexposed time and can bias the rate ratio.' },
            { text: '4 years to unexposed and 6 years to exposed person-time.', correct: true, feedback: 'Correct. Person-time follows the exposure status at each moment.' },
            { text: 'She should be excluded because her exposure changed.', correct: false, feedback: 'Changing exposure is common; person-time methods handle it directly.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch05-case-control-logic', chapter: 5, order: 3,
      title: 'Case-control studies and the source population',
      concepts: ['case_control_study', 'source_population'], minutes: 17,
      hook: md`A cancer hospital in Guwahati sees many patients with oesophageal cancer from surrounding districts. An investigator wants to test whether drinking very hot tea is a cause. A cohort study would need tens of thousands of people followed for decades. Instead, she plans to interview the cases and a comparison group. A colleague suggests using hospital visitors as controls because "they are convenient and healthy". Another asks a sharper question: "Who would have come to this hospital if they had developed this cancer?"`,
      explore: {
        interactive: 'two-by-two',
        props: { dataType: 'cc', basic: true },
        prompt: md`With 'Case-control data' selected, enter 120 exposed and 80 unexposed cases, and 150 exposed and 250 unexposed controls. Note the odds ratio. Double both control cells and see that the estimate does not change, then change only the exposed-controls cell and see how strongly the odds ratio depends on the controls.`,
      },
      formalise: md`A **case-control study** is an efficient way to study the experience of a population without following all of it. Think of it as a cohort study with sampling:

1. Identify the **source population** (study base): the people, over a period of time, in whom the cases arose.
2. Take all (or a random sample of) the **cases** arising from it.
3. Take **controls** as a sample of the same source population, to estimate how exposure is distributed in it.

The **exposure odds** among controls estimate the ratio of exposed to unexposed person-time (or people) in the source population. Comparing cases with controls gives

$$\mathrm{OR} = \frac{a/b}{c/d} = \frac{a\,d}{b\,c}$$

which, depending on how controls were sampled (next card), estimates a rate ratio or risk ratio in the source population.

**Defining the source population.** Sometimes it is a defined population, such as all residents of three districts, and cases are all its new diagnoses. When cases come from a hospital, the source population is harder to define: it is the people who **would have come to that hospital had they developed the disease**. Controls must be drawn from that hypothetical group.

The test for any proposed control: *if this person had developed the disease, would they have been a case in my study?* Hospital visitors may come from different districts and have different tea habits; patients admitted for conditions unrelated to tea may be better, provided their referral patterns match.

Controls are **not** meant to be "healthy" or "typical"; they are meant to represent the exposure distribution of the source population.

**Common mistake:** choosing controls for convenience or health, rather than for membership of the population that gave rise to the cases.`,
      practise: { template: 'ch05-odds-ratio', count: 2 },
      checks: [
        {
          id: 'ch05-case-control-logic-q1', concept: 'source_population',
          prompt: md`Which criterion best identifies appropriate controls for the hospital-based oesophageal cancer study?`,
          options: [
            { text: 'They should be free of all chronic disease.', correct: false, feedback: 'Health is not the criterion. Requiring perfect health can distort the exposure distribution.' },
            { text: 'They should be people who would have been admitted to this hospital as cases had they developed oesophageal cancer.', correct: true, feedback: 'Correct. Controls must represent the source population that produced the cases.' },
            { text: 'They should be matched to cases on tea drinking.', correct: false, feedback: 'Matching on the exposure would make the OR equal 1 by design.' },
            { text: 'They should be a random sample of India.', correct: false, feedback: 'A national sample would not represent the population served by this hospital.' },
          ],
        },
        {
          id: 'ch05-case-control-logic-q2', concept: 'case_control_study',
          prompt: md`What do controls in a case-control study estimate?`,
          options: [
            { text: 'The risk of disease among unexposed people.', correct: false, feedback: 'Controls are sampled without regard to risk; the study cannot estimate risks directly unless the sampling fraction is known.' },
            { text: 'The distribution of exposure in the source population that gave rise to the cases.', correct: true, feedback: 'Yes. That is their only job.' },
            { text: 'The outcome that would have occurred without exposure.', correct: false, feedback: 'That is the counterfactual for the exposed, which is a different idea.' },
          ],
        },
        {
          id: 'ch05-case-control-logic-q3', concept: 'case_control_study',
          prompt: md`A student says, "A case-control study is a backward cohort study, so it can measure the risk of disease in the exposed." What is wrong?`,
          options: [
            { text: 'Nothing; risks can be computed from the case and control counts.', correct: false, feedback: 'The number of controls is set by the investigator, so risks calculated from the table are meaningless.' },
            { text: 'Because controls are a sample of unknown size relative to the source population, only ratio measures (via the odds ratio) can be estimated, not risks.', correct: true, feedback: 'Correct. The ratio of controls to source population cancels in the OR but not in a risk.' },
            { text: 'Case-control studies can estimate risks but not ratios.', correct: false, feedback: 'The reverse: they estimate ratios, not absolute risks.' },
          ],
        },
        {
          id: 'ch05-case-control-logic-q4', concept: 'source_population',
          prompt: md`A study takes as cases all new hip fractures among residents of one district during 2025, found through every hospital in the district. Which control group fits the source population?`,
          options: [
            { text: 'A random sample of people living in the district during 2025.', correct: true, feedback: 'Correct. The cases are all the district residents who fractured a hip, so the district population over that year is the source population.' },
            { text: 'Patients attending the orthopaedic outpatient clinic of the largest hospital.', correct: false, feedback: 'They come from a narrower, selected group and may differ in exposures linked to bone health.' },
            { text: 'Residents of a neighbouring district with a similar age structure.', correct: false, feedback: 'They did not give rise to the cases. Similar age structure does not make them part of the source population.' },
          ],
        },
        {
          id: 'ch05-case-control-logic-q5', concept: 'source_population',
          prompt: md`A proposed control would not have become a case in your study even if they had developed the disease. What follows?`,
          options: [
            { text: 'They are a good control, because they are unlikely to share the exposures of the cases.', correct: false, feedback: 'Controls are not meant to differ from cases; they are meant to show how exposure is distributed in the source population.' },
            { text: 'They lie outside the source population and should not be used as a control.', correct: true, feedback: 'Correct. Anyone who could not have been a case is not part of the population the cases came from.' },
            { text: 'It does not matter, provided they do not have the disease.', correct: false, feedback: 'Being free of the disease is not enough. Controls must come from the same population as the cases.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch05-control-sampling', chapter: 5, order: 4,
      title: 'Ways to sample controls and what the odds ratio then estimates',
      concepts: ['control_sampling'], minutes: 14,
      hook: md`A pregnancy cohort of 8,000 women in a Haryana district has stored serum from early pregnancy. Measuring a new biomarker costs too much to run on every sample. The team will measure it in all 300 women who deliver preterm, plus a sample of others. One statistician wants to pick controls from women who delivered at term; a second wants to pick, for each preterm birth, women still pregnant at that same gestational age; a third wants a random sample of the whole cohort taken at enrolment. All three are defensible. They just estimate different things.`,
      explore: {
        interactive: 'design-sampler',
        prompt: md`Press 'Run cohort study' and note the true risk ratio, the cohort risk ratio and the cohort rate ratio. Set control sampling to 'Density (risk sets)', press 'Sample case-control', then 'Repeat 20 times' to see how the odds ratio scatters around the cohort rate ratio. Repeat with 'Cumulative' and 'Case-cohort', comparing each with the cohort estimates, and change the controls per case to see how the spread responds.`,
      },
      formalise: md`The odds ratio from a case-control study estimates different source-population measures depending on how controls are drawn.

| Sampling scheme | Controls are drawn from | OR estimates | Rare-disease assumption needed? |
|---|---|---|---|
| **Cumulative** | People still free of disease at the end of the risk period | Risk odds ratio | Yes, to approximate the RR |
| **Density (risk-set)** | People at risk at the moment each case occurs | Rate ratio | No |
| **Case-cohort** | The whole cohort at baseline, regardless of later status | Risk ratio | No |

Why density sampling works: sampling controls in proportion to person-time means the control series estimates the ratio of exposed to unexposed person-time, so

$$\frac{a/b}{c/d} \approx \frac{a/\mathrm{PT}_1}{b/\mathrm{PT}_0} = \mathrm{IR}$$

Two consequences surprise people:

- In density sampling, a person selected as a control early can **later become a case**, and should be kept in both roles.
- In case-cohort sampling, some members of the baseline sample will become cases; again, they are kept. A single subcohort can serve as controls for several different outcomes.

When the outcome is rare, all three designs give similar odds ratios. When it is common (preterm birth affects perhaps 10–15% of pregnancies), the choice matters: cumulative sampling produces an OR further from 1 than the risk ratio.

**Common mistake:** insisting that controls must never develop the disease; under density and case-cohort sampling, excluding future cases biases the estimate.`,
      checks: [
        {
          id: 'ch05-control-sampling-q1', concept: 'control_sampling',
          prompt: md`Controls are selected, for each preterm birth, from women still pregnant at the same gestational age. What does the odds ratio estimate?`,
          options: [
            { text: 'The risk odds ratio, which approximates the risk ratio only if preterm birth is rare', correct: false, feedback: 'That describes cumulative sampling at the end of follow-up.' },
            { text: 'The rate ratio, without any rare-disease assumption', correct: true, feedback: 'Correct. This is density (risk-set) sampling.' },
            { text: 'The prevalence odds ratio', correct: false, feedback: 'Prevalence odds ratios come from cross-sectional data, not from sampling incident cases.' },
          ],
        },
        {
          id: 'ch05-control-sampling-q2', concept: 'control_sampling',
          prompt: md`A woman chosen as a control at 30 weeks later delivers preterm at 34 weeks. What should happen to her?`,
          options: [
            { text: 'Remove her from the control series, because controls must not be cases.', correct: false, feedback: 'Under density sampling she was correctly at risk when selected; removing her biases the estimate.' },
            { text: 'Keep her as a control for the earlier case and include her as a case too.', correct: true, feedback: 'Yes. Her two roles refer to different moments in time.' },
            { text: 'Exclude her from the study altogether.', correct: false, feedback: 'Excluding her loses valid information and can bias the result.' },
          ],
        },
        {
          id: 'ch05-control-sampling-q3', concept: 'control_sampling',
          prompt: md`The team wants to study the biomarker in relation to preterm birth, pre-eclampsia and stillbirth using one control group. Which design suits this best?`,
          options: [
            { text: 'Cumulative sampling from women with term births', correct: false, feedback: 'Term births are non-cases for preterm birth only; they would not be valid for every outcome.' },
            { text: 'A case-cohort design with a random subcohort drawn at enrolment', correct: true, feedback: 'Correct. A baseline subcohort represents the whole cohort and can serve as the comparison for several outcomes.' },
            { text: 'Density sampling matched on gestational age at preterm birth', correct: false, feedback: 'Risk sets are tied to the timing of one outcome and would need to be rebuilt for each.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch05-nested-case-crossover', chapter: 5, order: 5,
      title: 'Nested case-control and case-crossover designs',
      concepts: ['nested_case_control', 'case_crossover'], minutes: 15,
      hook: md`Two questions arrive at a research unit in Bengaluru on the same morning. A cardiologist asks whether an episode of heavy physical exertion can trigger a heart attack within the following hour. A neurologist with a large epilepsy cohort and stored blood samples asks whether a genetic marker predicts sudden unexpected death. Both want a case-control approach, but the right comparison is very different for each.`,
      formalise: md`**Nested case-control study.** When a cohort already exists, with exposure information or stored samples, cases are all those who develop the outcome during follow-up, and controls are sampled from the cohort (usually by risk-set sampling). It keeps the validity of the cohort, because the source population is fully defined and exposure was recorded before the outcome, while measuring expensive exposures only in a fraction of members. The epilepsy question suits this design: analyse stored samples from all deaths and from a few matched members at risk at each death.

**Case-crossover study.** Each case serves as their **own control**. For a brief exposure with a short induction time, compare exposure in a **hazard window** just before the event with exposure in one or more **control windows** at earlier times in the same person:

| Window | Heavy exertion in that hour? |
|---|---|
| Hazard window (hour before the heart attack) | Yes / No |
| Control windows (same hour on previous days) | Yes / No |

Because each person is compared with themselves, fixed characteristics such as sex, genes and chronic disease cannot confound. The design suits **transient exposures** with **immediate effects**: exertion and myocardial infarction, alcohol and injury, mobile-phone use and road crashes.

Requirements: the exposure must vary over time within a person, its effect must be short-lived, and the control windows must represent the person's usual exposure pattern (trends over time can bias the comparison).

**Common mistake:** applying a case-crossover design to an exposure that is constant or that acts only after a long induction time, where self-comparison cannot work.`,
      checks: [
        {
          id: 'ch05-nested-case-crossover-q1', concept: 'case_crossover',
          prompt: md`For which question is a case-crossover design most suitable?`,
          options: [
            { text: 'Whether a gene variant increases the risk of epilepsy', correct: false, feedback: 'A gene does not change over time within a person, so there is nothing to compare across windows.' },
            { text: 'Whether binge drinking triggers injuries within the next six hours', correct: true, feedback: 'Correct. A transient exposure with an immediate effect is ideal.' },
            { text: 'Whether childhood undernutrition causes adult diabetes', correct: false, feedback: 'The induction time is decades long; hazard and control windows cannot capture it.' },
          ],
        },
        {
          id: 'ch05-nested-case-crossover-q2', concept: 'nested_case_control',
          prompt: md`What is the main advantage of a nested case-control study over analysing the full cohort?`,
          options: [
            { text: 'It removes all confounding.', correct: false, feedback: 'Nesting does not by itself control confounding; it is an efficiency device.' },
            { text: 'It gives nearly the same information while measuring costly exposures in only a fraction of cohort members.', correct: true, feedback: 'Yes. Efficiency with little loss of validity is the point.' },
            { text: 'It can estimate absolute risks without knowing cohort size.', correct: false, feedback: 'Absolute risks need the full cohort; the nested sample gives ratio measures.' },
          ],
        },
        {
          id: 'ch05-nested-case-crossover-q3', concept: 'case_crossover',
          prompt: md`Why can fixed characteristics such as sex or genotype not confound a case-crossover comparison?`,
          options: [
            { text: 'Because the design uses a very large sample.', correct: false, feedback: 'Sample size does not remove confounding.' },
            { text: 'Because each person is compared with themselves, so fixed characteristics are identical in hazard and control windows.', correct: true, feedback: 'Correct. Self-matching removes confounding by anything that does not change between windows.' },
            { text: 'Because those characteristics are adjusted for in regression.', correct: false, feedback: 'No adjustment is needed; the design itself controls them.' },
          ],
        },
        {
          id: 'ch05-nested-case-crossover-q4', concept: 'nested_case_control',
          prompt: md`In the nested case-control study within the epilepsy cohort, where should the controls for each death come from?`,
          options: [
            { text: 'Cohort members still alive and in follow-up at the time of that death.', correct: true, feedback: 'Correct. Risk-set sampling draws controls from those at risk when each case occurs.' },
            { text: 'Healthy blood donors from the same city.', correct: false, feedback: 'They are outside the cohort, so the advantage of a fully defined source population is lost.' },
            { text: 'Cohort members who survived to the end of follow-up.', correct: false, feedback: 'Choosing only survivors excludes people who were at risk when each case occurred but died or left later, and can bias the comparison.' },
          ],
        },
        {
          id: 'ch05-nested-case-crossover-q5', concept: 'nested_case_control',
          prompt: md`Why is exposure information in a nested case-control study protected from recall bias?`,
          options: [
            { text: 'Because cases and controls are interviewed by the same person.', correct: false, feedback: 'A single interviewer does not stop cases remembering differently from controls.' },
            { text: 'Because the exposure was recorded, or the samples stored, before the outcome occurred.', correct: true, feedback: 'Correct. Nobody is asked to remember anything after the outcome, so the outcome cannot colour the exposure data.' },
            { text: 'Because the cohort is very large.', correct: false, feedback: 'Size improves precision, not the way exposure was measured.' },
          ],
        },
        {
          id: 'ch05-nested-case-crossover-q6', concept: 'case_crossover',
          prompt: md`In a case-crossover study of heavy exertion and heart attack, which control window is most appropriate?`,
          options: [
            { text: 'The same hour of the day on several previous days for the same person.', correct: true, feedback: 'Correct. These windows reflect the person’s usual pattern of exertion at that time of day.' },
            { text: 'The hour after the heart attack.', correct: false, feedback: 'Exertion after the event cannot have caused it, and is changed by the event itself.' },
            { text: 'The hour before a heart attack in a different person.', correct: false, feedback: 'The design compares each person with themselves; using someone else loses the self-matching.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch05-cross-sectional', chapter: 5, order: 6,
      title: 'Cross-sectional versus longitudinal studies',
      concepts: ['cross_sectional'], minutes: 10,
      hook: md`A state nutrition survey visits 6,000 households in a single season. It measures haemoglobin in women aged 15 to 49 and asks about diet, including tea with meals. Anaemia is more common among women who drink tea with meals. A health officer drafts a circular telling women to stop drinking tea at lunch. A faculty member asks two questions: which came first, and would anaemic women be more likely to change how much tea they drink?`,
      formalise: md`A **cross-sectional study** measures exposure and outcome at the **same time** in a population. It estimates **prevalence**, and associations are usually summarised as a prevalence ratio or prevalence odds ratio.

A **longitudinal study** (cohort or case-control) has a time dimension: it relates exposure at one time to the occurrence of new cases later.

Cross-sectional studies are valuable for:

- describing burden and planning services (how many women need iron supplementation now?),
- estimating exposure prevalence,
- studying exposures that cannot change after disease onset, such as blood group or sex.

They are weak for causal questions for two reasons:

1. **Temporality is unclear.** Did tea habits lead to anaemia, or did anaemia (or advice given because of it) change tea habits?
2. **Prevalence mixes incidence and duration** (Chapter 4). A factor linked to prevalence may cause the disease or merely prolong it.

| | Cross-sectional | Longitudinal |
|---|---|---|
| Measures | Prevalence | Risk or rate of new cases |
| Time order of exposure and outcome | Often unclear | Built into design |
| Speed and cost | Fast, cheap | Slower, costlier |

A case-control study is not cross-sectional: it samples on outcome and asks about past exposure, ideally among **new** cases. Using prevalent cases in a case-control study reintroduces the duration problem.

**Common mistake:** drawing causal conclusions from a cross-sectional association when the outcome could have altered the exposure.`,
      checks: [
        {
          id: 'ch05-cross-sectional-q1', concept: 'cross_sectional',
          prompt: md`What is the main reason the tea-anaemia association is weak evidence for a causal effect?`,
          options: [
            { text: 'The sample size of 6,000 households is too small.', correct: false, feedback: 'The sample is large; precision is not the issue.' },
            { text: 'Exposure and outcome were measured at the same time, so we cannot tell which came first.', correct: true, feedback: 'Correct. Temporality is the core weakness of cross-sectional data.' },
            { text: 'Haemoglobin is not a valid measure of anaemia.', correct: false, feedback: 'Haemoglobin is the standard measure; the problem lies in the design.' },
          ],
        },
        {
          id: 'ch05-cross-sectional-q2', concept: 'cross_sectional',
          prompt: md`For which question is a cross-sectional study well suited?`,
          options: [
            { text: 'Whether a new vaccine prevents typhoid', correct: false, feedback: 'Prevention requires following people to see new cases; a trial or cohort is needed.' },
            { text: 'How many adults in a district currently have uncontrolled hypertension', correct: true, feedback: 'Yes. Estimating current burden is exactly what prevalence surveys do.' },
            { text: 'Whether air pollution causes new-onset asthma', correct: false, feedback: 'New-onset asthma is an incidence question; cross-sectional data mix incidence and duration.' },
          ],
        },
        {
          id: 'ch05-cross-sectional-q3', concept: 'cross_sectional',
          prompt: md`A study recruits people currently living with Parkinson disease and a comparison group, and asks about past pesticide exposure. Why might using prevalent rather than newly diagnosed cases mislead?`,
          options: [
            { text: 'Prevalent cases over-represent people who survive longer, so factors affecting survival can appear to cause the disease.', correct: true, feedback: 'Correct. Prevalent cases reflect both incidence and duration.' },
            { text: 'Prevalent cases make the study cross-sectional instead of case-control.', correct: false, feedback: 'The design is still case-control; the issue is what prevalent cases represent.' },
            { text: 'There is no problem; prevalent and incident cases are interchangeable.', correct: false, feedback: 'They differ whenever exposure affects disease duration.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch05-response-comparison', chapter: 5, order: 7,
      title: 'Response rates, and choosing between cohort and case-control',
      concepts: ['response_rate', 'case_control_study', 'cohort_study'], minutes: 15,
      hook: md`A thesis committee in Puducherry reviews two proposals. The first is a cohort of 5,000 adults to study salt intake and stroke; a pilot achieved only a 45% response to the baseline invitation, and one member says the study is therefore worthless. The second is a case-control study of a rare childhood leukaemia and parental occupational exposures. A second member asks why the leukaemia study is not a cohort study, since cohorts are "always better".`,
      formalise: md`**Response rates.** A low response rate is a warning, not a verdict. What matters is whether non-response distorts the **comparison**:

- In a **cohort study**, people who decline at baseline are not compared at all. A low response affects mainly how far the results generalise to other people, which (Chapter 3) is a scientific judgement. Validity is threatened mainly if participation depends on both exposure and future outcome, which is hard because outcomes have not yet occurred. **Losses after enrolment** are a bigger threat.
- In a **case-control study**, both exposure and outcome have already occurred when people are asked to take part. If exposed controls respond less than unexposed controls, the odds ratio is biased. Response rates here deserve close scrutiny.
- In a **prevalence survey**, non-response directly distorts the estimate if responders differ in the outcome.

**Choosing a design.**

| Feature | Cohort | Case-control |
|---|---|---|
| Rare outcome | Inefficient; huge numbers needed | Efficient |
| Rare exposure | Efficient (enrol by exposure) | Inefficient |
| Long induction time | Long follow-up (unless retrospective) | Fast |
| Several outcomes | Natural | One outcome per study (except case-cohort) |
| Several exposures | Possible | Natural |
| Absolute risks or rates | Yes | Not without extra information |
| Time order of exposure and outcome | Clear | Must be reconstructed |

Neither design is inherently "better". A well-chosen case-control study is a cohort study sampled efficiently; a badly run cohort study is no more valid than a badly run case-control study.

**Common mistake:** rejecting a study solely for its response rate, or assuming a cohort design is always more valid than a case-control design.`,
      checks: [
        {
          id: 'ch05-response-comparison-q1', concept: 'response_rate',
          prompt: md`In which situation does a low response rate most directly threaten the validity of the comparison?`,
          options: [
            { text: 'A cohort study where people decline before any outcome has occurred.', correct: false, feedback: 'Participation at baseline cannot depend on outcomes that have not happened, so the comparison is relatively protected.' },
            { text: 'A case-control study where controls who were exposed are less willing to participate than unexposed controls.', correct: true, feedback: 'Correct. Differential participation by exposure among controls biases the odds ratio.' },
            { text: 'A randomised trial where 50% of those invited decline before randomisation.', correct: false, feedback: 'Randomisation happens among those who agreed, so the comparison remains valid; generalisability is the question.' },
          ],
        },
        {
          id: 'ch05-response-comparison-q2', concept: 'case_control_study',
          prompt: md`Why is a case-control design sensible for a rare childhood leukaemia?`,
          options: [
            { text: 'Because case-control studies are always unbiased for rare diseases.', correct: false, feedback: 'They still need good control selection and exposure measurement.' },
            { text: 'Because a cohort would need to follow enormous numbers of children to observe enough cases, whereas a case-control study starts from the cases.', correct: true, feedback: 'Yes. Efficiency for rare outcomes is the main strength of case-control designs.' },
            { text: 'Because cohort studies cannot study occupational exposures.', correct: false, feedback: 'Occupational cohorts are common; the issue is the rarity of the outcome.' },
          ],
        },
        {
          id: 'ch05-response-comparison-q3', concept: 'cohort_study',
          prompt: md`A researcher wants to study the effects of a rare occupational exposure (handled by a few hundred workers) on several outcomes. Which design fits best?`,
          options: [
            { text: 'A cohort study enrolling exposed workers and a comparison group', correct: true, feedback: 'Correct. Selecting on a rare exposure and following several outcomes is a natural cohort strength.' },
            { text: 'A case-control study for each outcome', correct: false, feedback: 'With a rare exposure, very few cases or controls would be exposed, so the studies would be imprecise.' },
            { text: 'A cross-sectional survey of the general population', correct: false, feedback: 'Almost nobody in the general population would be exposed, and temporality would be unclear.' },
          ],
        },
        {
          id: 'ch05-response-comparison-q4', concept: 'response_rate',
          prompt: md`The salt and stroke cohort achieved a 45% response at baseline. What does this mainly affect?`,
          options: [
            { text: 'The validity of comparing high-salt and low-salt groups among participants.', correct: false, feedback: 'Participation was decided before any stroke occurred, so the comparison among participants is relatively protected.' },
            { text: 'How far the results can be generalised to other people.', correct: true, feedback: 'Correct. Low baseline response in a cohort mainly raises a question of generalisation, which is a scientific judgement.' },
            { text: 'It makes the study worthless.', correct: false, feedback: 'A low response rate is a warning to examine, not a verdict.' },
          ],
        },
        {
          id: 'ch05-response-comparison-q5', concept: 'response_rate',
          prompt: md`In a survey of hypertension prevalence, only half the sample responds, and people who know they have high blood pressure are more willing to take part. What happens to the prevalence estimate?`,
          options: [
            { text: 'It is unaffected, because the sample was chosen at random.', correct: false, feedback: 'Random selection is undone if participation then depends on the outcome.' },
            { text: 'It is likely to be too high, because people with hypertension are over-represented among responders.', correct: true, feedback: 'Correct. In a prevalence survey, non-response related to the outcome directly biases the estimate.' },
            { text: 'It is only less precise, not biased.', correct: false, feedback: 'Fewer responders reduce precision, but responders who differ in the outcome also bias the estimate.' },
          ],
        },
      ],
    },
  ],
};
