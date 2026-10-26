import type { Chapter } from '../types';

const md = String.raw;

export const ch03: Chapter = {
  number: 3,
  title: 'What is causation?',
  unit: 'A',
  reading: 'Rothman, Huybrechts & Murray, 3rd ed., Chapter 3',
  summary: md`A disease occurs when a set of conditions comes together, and no single factor acts alone. The sufficient-component cause model (the "causal pie") gives you a way to reason about necessary causes, interaction, induction time and why the apparent strength of a cause changes from one population to another. The chapter closes with how causal claims are tested and when results from one population can be applied to another.`,
  cards: [
    // ------------------------------------------------------------------
    {
      id: 'ch03-causal-pies', chapter: 3, order: 1,
      title: 'The causal pie: sufficient and component causes',
      concepts: ['sufficient_cause', 'component_cause'], minutes: 16,
      hook: md`In a slum resettlement colony in Delhi, a TB programme officer notices that almost every adult has been exposed to *Mycobacterium tuberculosis* at some point, yet only a small fraction ever develop active disease. Those who do are more often undernourished, living with HIV, or have poorly controlled diabetes; a few have none of these. A student asks: "So what is the cause of TB here: the bacillus, malnutrition, HIV or diabetes?" The officer replies that the question has more than one right answer.`,
      explore: {
        interactive: 'causal-pies',
        prompt: md`Select a pie and toggle components A to E and U to build at least two different pies that each complete a case, treating A as the cause of interest and the rest as its partners. Move the 'Prevalence of B' slider to 0% and see which pies can no longer be completed, then raise it again. Watch the case count, the risks with and without A, and the strength of A (the risk with A divided by the risk without A).`,
      },
      formalise: md`A **sufficient cause** is a complete set of minimal conditions that, together, inevitably produce the disease. Draw it as a pie; each slice is a **component cause**.

- Most components are neither necessary nor sufficient alone; they matter only alongside the other slices of the same pie.
- A disease can have **several different sufficient causes**: TB in one person may come from the pie {bacillus, HIV, unknown factors U₁}; in another from {bacillus, undernutrition, U₂}.
- A component that appears in **every** pie is a **necessary cause**. Exposure to the bacillus is necessary for TB; that follows partly from how the disease is defined.
- Most pies include **unknown components**, which is why some people with every known risk factor stay well and some with none fall ill.

The model has a direct public-health message: **blocking any one component prevents every case that would have arisen from pies containing it**. Treating HIV prevents the TB cases that needed HIV, even though HIV is not necessary for TB and even though the bacillus is still present.

The model is conceptual: we rarely know the full content of any pie. Its value is in disciplining how we talk about causes, not in drawing exact diagrams for real diseases.

**Common mistake:** asking for *the* cause of a disease, as if one factor could be singled out; every case has several component causes acting together.`,
      checks: [
        {
          id: 'ch03-causal-pies-q1', concept: 'component_cause',
          prompt: md`Exposure to *M. tuberculosis* appears in every sufficient cause of TB. What does that make it?`,
          options: [
            { text: 'A sufficient cause', correct: false, feedback: 'Exposure alone does not produce TB in most people, so it is not sufficient by itself.' },
            { text: 'A necessary cause', correct: true, feedback: 'Correct. A component present in every pie is necessary: no case can occur without it.' },
            { text: 'The only real cause; the others are risk factors', correct: false, feedback: 'All slices of a completed pie are causes. HIV and undernutrition are causes of the cases they help complete.' },
          ],
        },
        {
          id: 'ch03-causal-pies-q2', concept: 'sufficient_cause',
          prompt: md`A colony introduces nutrition support that removes undernutrition entirely. What happens to TB cases?`,
          options: [
            { text: 'All TB cases are prevented, because undernutrition causes TB.', correct: false, feedback: 'Only cases arising from pies that contain undernutrition are prevented. Pies with HIV or diabetes can still be completed.' },
            { text: 'Cases from pies that include undernutrition are prevented; cases from other pies still occur.', correct: true, feedback: 'Right. Removing one component disables only the pies that need it.' },
            { text: 'No cases are prevented, because undernutrition is not a necessary cause.', correct: false, feedback: 'A component need not be necessary to be preventable. Every pie that contains it is blocked.' },
          ],
        },
        {
          id: 'ch03-causal-pies-q3', concept: 'sufficient_cause',
          prompt: md`A man with HIV, diabetes and heavy exposure to TB never develops active disease. What does the causal pie model say?`,
          options: [
            { text: 'HIV and diabetes cannot be causes of TB.', correct: false, feedback: 'One counterexample does not refute a component cause; it is not sufficient on its own.' },
            { text: 'At least one other component needed to complete any of his pies was missing.', correct: true, feedback: 'Correct. Unknown components are usually part of each pie, so having every known risk factor does not guarantee disease.' },
            { text: 'He must have been misdiagnosed.', correct: false, feedback: 'Not necessary: the model expects people with known risk factors to remain well if a pie is incomplete.' },
          ],
        },
        {
          id: 'ch03-causal-pies-q4', concept: 'component_cause',
          prompt: md`In the causal pie model, what is a component cause?`,
          options: [
            { text: 'A factor that produces the disease on its own whenever it is present.', correct: false, feedback: 'That would be a sufficient cause. Few single factors are.' },
            { text: 'One slice of a sufficient cause: it produces disease only together with the other slices of that pie.', correct: true, feedback: 'Correct. Most causes act only in company, which is why exposed people often stay well.' },
            { text: 'A factor that must be present in every case of the disease.', correct: false, feedback: 'That describes a necessary cause, a special kind of component that appears in every pie.' },
          ],
        },
        {
          id: 'ch03-causal-pies-q5', concept: 'component_cause',
          prompt: md`A student argues that HIV cannot be a cause of TB in the colony, because many people with TB do not have HIV. What is wrong with the argument?`,
          options: [
            { text: 'Nothing: a cause has to be present in every case.', correct: false, feedback: 'Only a necessary cause appears in every case. Most causes are not necessary.' },
            { text: 'A component cause need not be present in every case; it causes the cases that arise from pies containing it.', correct: true, feedback: 'Correct. Other cases arise from other pies, such as those that include undernutrition or diabetes.' },
            { text: 'HIV would count as a cause only if everyone with HIV developed TB.', correct: false, feedback: 'That would make HIV sufficient. A component cause needs its partner slices to complete a pie.' },
          ],
        },
        {
          id: 'ch03-causal-pies-q6', concept: 'sufficient_cause',
          prompt: md`Two neighbours in the colony develop TB. One has HIV; the other is undernourished and has no HIV. How does the pie model describe this?`,
          options: [
            { text: 'One of the two diagnoses must be wrong, because a disease has a single cause.', correct: false, feedback: 'The model expects the same disease to arise in different ways in different people.' },
            { text: 'Their cases arose from different sufficient causes that share the bacillus as a component.', correct: true, feedback: 'Correct. A disease can have several sufficient causes; each case is completed by one of them.' },
            { text: 'HIV and undernutrition must be the same component under different names.', correct: false, feedback: 'They are different components that sit in different pies, each completed by other slices.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch03-multicausality', chapter: 3, order: 2,
      title: 'Multicausality: genetic or environmental?',
      concepts: ['multicausality'], minutes: 9,
      hook: md`At a newborn screening clinic in Chandigarh, a mother is told that her baby has phenylketonuria, an inherited inability to break down phenylalanine. The paediatrician explains that, on a carefully restricted diet, her child can grow up with normal intelligence. The mother asks, "Then is it a genetic disease, or is it caused by food?" A junior resident starts to say "mostly genetic", then hesitates.`,
      formalise: md`In the causal pie model, the intellectual disability of untreated phenylketonuria needs at least two components: the **genetic variants** and **dietary phenylalanine**. Remove either and the pie cannot be completed. So every case is caused by the genes **and** by the diet.

This leads to a counterintuitive but important result: it makes no sense to say a disease is "80% genetic and 20% environmental" in the causal sense. If both components are in every pie:

- removing the genetic factor would prevent 100% of cases,
- removing the dietary factor would also prevent 100% of cases.

The fractions of disease **attributable** to each component therefore add up to more than 100%. There is no fixed pool of causation to share out. (Chapter 4 makes this precise with the [[attributable fraction]].)

Two practical consequences:

1. Calling a disease "genetic" does not mean it cannot be prevented by changing the environment, and calling it "environmental" does not mean genes are irrelevant.
2. How large a role a factor seems to play depends on how common its partner components are in the population studied (next card).

Statistical "heritability" estimates answer a different question: how much of the **variation** in a trait in one population tracks genetic variation. That is not the same as the proportion of cases caused by genes.

**Common mistake:** splitting causation into shares that must add to 100%, which leads people to underrate preventable causes of "genetic" diseases.`,
      checks: [
        {
          id: 'ch03-multicausality-q1', concept: 'multicausality',
          prompt: md`Under the causal pie model, what share of untreated PKU disability is caused by dietary phenylalanine?`,
          options: [
            { text: 'A small share, because PKU is a genetic disease.', correct: false, feedback: 'Every case needs dietary phenylalanine. Removing it prevents every case.' },
            { text: '100%, and the same is true of the genetic variants.', correct: true, feedback: 'Correct. Both components appear in every pie; fractions of causation can add to more than 100%.' },
            { text: '50%, with the genes accounting for the other half.', correct: false, feedback: 'There is no fixed total to divide. Each component is responsible for all cases whose pies contain it.' },
          ],
        },
        {
          id: 'ch03-multicausality-q2', concept: 'multicausality',
          prompt: md`A news report says a cancer is "70% genetic, so lifestyle hardly matters". What is the best reply?`,
          options: [
            { text: 'Agree; only 30% of cases can be prevented by lifestyle.', correct: false, feedback: 'Causal fractions do not have to sum to 100%; lifestyle could still be a component of most cases.' },
            { text: 'Genes and environment act together in the same pies, so a large genetic contribution does not limit how many cases changing the environment can prevent.', correct: true, feedback: 'Yes. Preventable components may be present in the same pies as genetic ones.' },
            { text: 'Disagree; the figure should be 50% because both are equally important.', correct: false, feedback: 'Replacing one share with another keeps the same mistaken idea that causation must be divided.' },
          ],
        },
        {
          id: 'ch03-multicausality-q3', concept: 'multicausality',
          prompt: md`What does a high heritability estimate for a trait tell you?`,
          options: [
            { text: 'That the trait cannot be changed by the environment.', correct: false, feedback: 'Height is highly heritable, yet average height rose sharply with better nutrition.' },
            { text: 'That most of the variation in the trait in that population tracks genetic variation, under the conditions studied.', correct: true, feedback: 'Correct. Heritability describes variation in a particular population, not how many cases genes cause.' },
            { text: 'That genes are responsible for most cases in every population.', correct: false, feedback: 'Heritability is population-specific and does not translate into a share of cases caused.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch03-strength-interaction', chapter: 3, order: 3,
      title: 'Strong and weak causes; causes that act together',
      concepts: ['strength_of_cause', 'causal_interaction'], minutes: 16,
      hook: md`G6PD deficiency is common in several communities of central India. For years, a village health worker saw no special problem among G6PD-deficient men. Then a malaria elimination drive started giving primaquine to everyone with vivax malaria, and within weeks several deficient men were admitted with acute haemolysis. A district officer asks whether G6PD deficiency is a "strong" or a "weak" cause of haemolysis. The health worker answers, "It depends on the year you ask me."`,
      explore: {
        interactive: 'causal-pies',
        prompt: md`Select Pie 1 and make it A, B and U, treating A as the susceptibility, B as its partner and U as an unknown component. Move the 'Prevalence of B' slider from low to high, and watch the risk with A, the risk without A and the strength of A (the risk with A divided by the risk without A). Use 'New random sample' to check the pattern is not chance. Notice that the pie itself never changes; only how common the partner component is.`,
      },
      formalise: md`**Strength** is how much a factor raises risk: the risk among people with the factor divided by the risk among people without it, a comparison Chapter 4 calls the [[risk ratio]]. In the pie model, a component looks strong when its **complementary components** (the other slices of its pies) are common, and weak when they are rare.

In the village, the pie {G6PD deficiency, primaquine, U} is identical before and after the campaign. Before, almost nobody took primaquine, so G6PD deficiency rarely completed a pie and seemed a weak cause. During the campaign, the complement became common and G6PD deficiency suddenly seemed strong. Strength is therefore a property of the **population**, not a biological constant of the factor.

Two components in the **same** pie **interact**: each needs the other to produce disease through that pie. Here G6PD deficiency and primaquine interact. Biological interaction in this sense means a joint effect that differs from what the separate effects would predict. With synthetic risks of haemolysis:

|  | No primaquine | Primaquine |
|---|---|---|
| G6PD normal | 0.1% | 0.2% |
| G6PD deficient | 0.2% | 10% |

The joint risk is far above what the two separate effects would suggest. Chapter 11 shows how to measure interaction; for now, the key idea is that interaction describes how components share pies.

**Strength is not importance**: a weak cause that is very common can account for more cases than a strong cause that is rare.

**Common mistake:** quoting a [[risk ratio]] from one population as if it were a fixed biological property of the exposure.`,
      checks: [
        {
          id: 'ch03-strength-interaction-q1', concept: 'strength_of_cause',
          prompt: md`Why did G6PD deficiency appear to become a stronger cause of haemolysis during the campaign?`,
          options: [
            { text: 'The enzyme deficiency became more severe in the population.', correct: false, feedback: 'Nothing about the deficiency changed. What changed was how common its partner component was.' },
            { text: 'Its complementary component, primaquine, became common.', correct: true, feedback: 'Correct. A cause looks strong when its complements are prevalent.' },
            { text: 'More G6PD-deficient men were born into the village.', correct: false, feedback: 'The prevalence of the deficiency affects how many cases it accounts for, not how strong it appears per exposed person.' },
          ],
        },
        {
          id: 'ch03-strength-interaction-q2', concept: 'causal_interaction',
          prompt: md`In the pie model, when do two component causes interact?`,
          options: [
            { text: 'When both are associated with the exposure of interest.', correct: false, feedback: 'That describes potential confounders, not interaction.' },
            { text: 'When they appear together in the same sufficient cause.', correct: true, feedback: 'Yes. Each needs the other to complete that pie, so their joint effect differs from what their separate effects predict.' },
            { text: 'When one causes the other.', correct: false, feedback: 'That makes one an intermediate on the path of the other, which is a different relation.' },
            { text: 'When both are strong causes on their own.', correct: false, feedback: 'Strength alone says nothing about whether they share pies.' },
          ],
        },
        {
          id: 'ch03-strength-interaction-q3', concept: 'strength_of_cause',
          prompt: md`Factor X multiplies risk by 1.3 (a [[risk ratio]] of 1.3) and affects 60% of the population. Factor Y multiplies risk by 8 and affects 0.1%. Which statement is best?`,
          options: [
            { text: 'Y is the more important cause because its effect is stronger.', correct: false, feedback: 'Strength per exposed person is not the same as public-health importance; Y is very rare.' },
            { text: 'X may account for more cases, because a weak but common cause can matter more than a strong but rare one.', correct: true, feedback: 'Correct. The burden of disease depends on both strength and how common the exposure is.' },
            { text: 'X is not a real cause because it raises risk only slightly.', correct: false, feedback: 'A cause that raises risk only slightly can still be genuine; its complementary causes may simply be uncommon.' },
          ],
        },
        {
          id: 'ch03-strength-interaction-q4', concept: 'strength_of_cause',
          prompt: md`Using the synthetic table on this card, how strong a cause of haemolysis is G6PD deficiency among people taking primaquine, and among people not taking it?`,
          options: [
            { text: 'About 50 with primaquine (10% divided by 0.2%) and 2 without it (0.2% divided by 0.1%).', correct: true, feedback: 'Correct. The same deficiency looks weak or strong depending on whether its partner component is present.' },
            { text: '2 in both groups, because the strength of a cause is fixed by its biology.', correct: false, feedback: 'Work out the ratio separately in each column; strength depends on the complementary components present.' },
            { text: '10, the risk of haemolysis in deficient people taking primaquine.', correct: false, feedback: '10% is a risk, not a measure of strength. Strength compares the risk with the factor to the risk without it.' },
          ],
        },
        {
          id: 'ch03-strength-interaction-q5', concept: 'causal_interaction',
          prompt: md`Which feature of the synthetic table shows that G6PD deficiency and primaquine interact?`,
          options: [
            { text: 'Each factor on its own raises the risk from 0.1% to 0.2%.', correct: false, feedback: 'Those are the separate effects. Interaction is about how the joint effect compares with them.' },
            { text: 'The risk with both factors, 10%, is far higher than their separate effects would predict.', correct: true, feedback: 'Correct. A joint effect that departs from what the separate effects predict is the signature of interaction.' },
            { text: 'The risk with neither factor is only 0.1%.', correct: false, feedback: 'The baseline risk is the reference point, not evidence of interaction.' },
          ],
        },
        {
          id: 'ch03-strength-interaction-q6', concept: 'causal_interaction',
          prompt: md`G6PD deficiency and primaquine sit in the same pie. If primaquine is replaced by a safer drug, what happens to the cases that pie would have produced?`,
          options: [
            { text: 'All of them are prevented, even though G6PD deficiency is still present.', correct: true, feedback: 'Correct. Removing any one component disables the pie, so every case it would have produced is prevented.' },
            { text: 'Half are prevented, because each component is responsible for half of those cases.', correct: false, feedback: 'Each case from that pie needs both components, so each is fully responsible. Shares of causation do not add up to 100%.' },
            { text: 'None are prevented unless G6PD deficiency is also corrected.', correct: false, feedback: 'One missing slice is enough to stop the pie from being completed.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch03-induction-time', chapter: 3, order: 4,
      title: 'Induction time: when does a cause act?',
      concepts: ['induction_time'], minutes: 11,
      hook: md`An occupational physician in Gujarat sees a 58-year-old former ship-breaking worker with pleural mesothelioma. He cut asbestos insulation from old vessels for six years in his twenties and has worked as a shopkeeper ever since. His family is puzzled: he has not been near a ship in three decades. The physician is now designing a study of asbestos-related cancer among ship-breaking workers and has to decide which years of exposure history to collect.`,
      explore: {
        interactive: 'induction-timeline',
        prompt: md`Set the induction period to 8 years and the latent period to 2 years, and note where exposure, the end of induction and detection fall on the one-person timeline. Under 'Cohort analysis', drag the exposure window below the induction period and read 'Wrongly called unexposed'. Then widen the window beyond the induction period and watch that count fall. Which slider moves the end of induction, and which moves only detection?`,
      },
      formalise: md`Each component cause acts at some point in time. The disease process starts only when the **last** component is in place and the pie is complete.

- The **induction time** for a component is the interval from when it acts to when the disease process begins (pie completion). Each component in a pie has its own induction time; for the final component it is zero.
- The **latent period** runs from disease initiation to its detection. Better screening shortens it; it says nothing about causation.
- What we can observe is the **empirical induction period**: from exposure to diagnosis, the sum of the two.

$$\text{exposure} \xrightarrow{\text{induction}} \text{initiation} \xrightarrow{\text{latency}} \text{detection}$$

Induction time is not a property of a disease alone; it belongs to a component **within** a particular pie. Asbestos may act decades before mesothelioma begins; a final trigger may act days before.

Why it matters for study design:

- Exposures that occurred too recently to have caused the disease should not be counted as relevant. Including them dilutes any effect.
- A study that follows workers for only five years after exposure would miss most cancers and could wrongly conclude there is no effect.
- When the induction time is unknown, try several lag windows (for example, exposure 10, 20 and 30 years before diagnosis) and see where the association lies.

**Common mistake:** treating the time from exposure to diagnosis as if it were all induction time, ignoring the latent period that detection methods determine.`,
      checks: [
        {
          id: 'ch03-induction-time-q1', concept: 'induction_time',
          prompt: md`Which component in a sufficient cause has an induction time of zero?`,
          options: [
            { text: 'The first component to act.', correct: false, feedback: 'The first component has the longest wait until the pie is complete.' },
            { text: 'The last component to act, which completes the pie.', correct: true, feedback: 'Correct. Once it acts, the disease process begins immediately.' },
            { text: 'The necessary cause.', correct: false, feedback: 'A necessary cause can act at any time relative to the other components.' },
          ],
        },
        {
          id: 'ch03-induction-time-q2', concept: 'induction_time',
          prompt: md`A cohort of ship-breaking workers is followed for four years after first exposure and shows no excess of mesothelioma. What is the most likely explanation?`,
          options: [
            { text: 'Asbestos does not cause mesothelioma in this population.', correct: false, feedback: 'The follow-up was far shorter than the plausible induction time, so the study could not see an effect.' },
            { text: 'Follow-up was too short for the induction time involved.', correct: true, feedback: 'Yes. Studying an exposure with a long induction period requires follow-up, or exposure history, that spans that period.' },
            { text: 'The workers were not exposed long enough to be at risk.', correct: false, feedback: 'Duration of exposure matters, but the main problem is the short observation after exposure.' },
          ],
        },
        {
          id: 'ch03-induction-time-q3', concept: 'induction_time',
          prompt: md`A new imaging test detects mesothelioma two years earlier than before. What changes?`,
          options: [
            { text: 'The induction time becomes two years shorter.', correct: false, feedback: 'Induction ends at disease initiation, which the test does not affect.' },
            { text: 'The latent period becomes shorter; the induction time is unchanged.', correct: true, feedback: 'Correct. Earlier detection trims the interval from initiation to diagnosis.' },
            { text: 'Both the induction time and the latent period become shorter.', correct: false, feedback: 'Detection technology cannot change when the causal process began.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch03-scientific-inference', chapter: 3, order: 5,
      title: 'Testing causal ideas and generalising results',
      concepts: ['scientific_inference'], minutes: 10,
      hook: md`A randomised trial in three Delhi hospitals shows that a new antihypertensive regimen reduces strokes in urban adults aged 40 to 70. At a district meeting in Bihar, a physician objects: "The trial had no rural patients and no one over 70. It isn't representative, so it doesn't apply to us." Another replies that the trial was never meant to be a sample of India. Who is right, and how should the evidence be used?`,
      formalise: md`**How causal claims are tested.** We can never prove a causal hypothesis by piling up observations that agree with it; a single well-made observation that contradicts it can be more informative. Good inference proposes a hypothesis, works out what it predicts, and seeks evidence that could show it to be wrong. Hypotheses that survive serious attempts at refutation earn provisional acceptance.

Lists of causal considerations (strength, consistency, temporality, dose-response and others) are useful prompts for thought, but they are **not a checklist** that can certify causation. Only temporality is required: the cause must precede the effect. Each of the others has exceptions; weak associations can be causal, and strong ones can be confounded.

**Generalising results.** A study population is chosen to give a **valid** answer: comparable groups, accurate measurement, good follow-up. Statistical representativeness of a wider population is not the goal. A trial restricted to adults aged 40 to 70 may give a cleaner answer than one including everyone.

Generalisation is a **scientific** judgement, not a sampling exercise. Ask whether the biology and the conditions that determine the effect differ in the new setting:

- Is there reason to think the drug acts differently in rural patients? (Diet, salt intake and adherence might matter.)
- Is there reason to expect a different effect in people over 70? (Altered drug handling, more comorbidity.)

If the answer is no, the result can reasonably be applied; if yes, the specific difference should be studied.

**Common mistake:** rejecting a valid study because its participants are "not representative", rather than asking whether the factors that modify the effect differ.`,
      checks: [
        {
          id: 'ch03-scientific-inference-q1', concept: 'scientific_inference',
          prompt: md`Which of the usual causal considerations is necessary for a causal relation?`,
          options: [
            { text: 'A strong association', correct: false, feedback: 'Many real causes have modest associations, for example passive smoking and heart disease.' },
            { text: 'A dose-response relation', correct: false, feedback: 'Some causes have thresholds or non-monotonic effects; absence of a gradient does not rule out causation.' },
            { text: 'The cause preceding the effect', correct: true, feedback: 'Correct. Temporality is the only consideration without exceptions.' },
            { text: 'Consistency across studies', correct: false, feedback: 'Effects can differ across populations because complementary causes differ, so inconsistency does not rule out causation.' },
          ],
        },
        {
          id: 'ch03-scientific-inference-q2', concept: 'scientific_inference',
          prompt: md`What is the strongest response to the Bihar physician's objection?`,
          options: [
            { text: 'The trial should be repeated with a nationally representative sample before anyone uses it.', correct: false, feedback: 'Representativeness does not guarantee validity and is not required for generalising. The relevant question is whether effect modifiers differ.' },
            { text: 'Consider whether there are biological or contextual reasons the drug would act differently in rural or older patients; if not, apply the result.', correct: true, feedback: 'Yes. Generalisation rests on understanding what modifies the effect, not on sampling.' },
            { text: 'Statistical significance in the trial ensures the result applies everywhere.', correct: false, feedback: 'Significance concerns random error in the study; it says nothing about applying the result elsewhere.' },
          ],
        },
        {
          id: 'ch03-scientific-inference-q3', concept: 'scientific_inference',
          prompt: md`A hypothesis predicts that a vitamin prevents a cancer. Twenty observational studies agree. A large, well-conducted trial finds no effect. What does sound inference suggest?`,
          options: [
            { text: 'Twenty studies outweigh one, so accept the hypothesis.', correct: false, feedback: 'Agreeing observations can share the same bias. A strong test that could have refuted the hypothesis deserves serious weight.' },
            { text: 'Take the trial seriously as a test that could refute the hypothesis, and look for biases shared by the observational studies.', correct: true, feedback: 'Correct. Inference advances by severe tests, not by counting agreeing results.' },
            { text: 'Disregard the trial because it contradicts most of the evidence.', correct: false, feedback: 'Discarding contradicting evidence is the opposite of testing a hypothesis.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'ch03-bonus-kids', chapter: 3, order: 6,
      title: 'Teach-back: explaining sufficient and component causes',
      concepts: [], minutes: 6,
      bonus: { youtubeId: 'xREaUbLIwcA', channel: 'Little Scientists Club', videoTitle: 'What makes things happen? Causes (Ep 6)' },
      hook: md`This chapter covered sufficient causes, component causes, induction time and the limits of causal inference. Could you explain the causal pie to someone with no science background? Below is one worked example: an episode from my children's science channel, made for five- and six-year-olds, in which Curie grows a flower and finds out what it really takes to make something happen.

*Why a children's video in an MSc course? Explaining a method in plain words is part of a clinical researcher's job: participant information sheets, informed consent, community meetings and talking to families. If you can explain an idea simply and correctly, you have understood it.*`,
      formalise: md`**What the explanation keeps, in simpler words.**

- The flower's **cause pie**: soil, seed, water, sunlight and time. Each is a **component cause**; together they form one **sufficient cause**.
- Taking away the water or the sunlight stops the flower: every component is necessary *for that pie*.
- Taking away the teddy bear changes nothing: being present is not the same as being a cause.
- Stopping something needs only one piece removed. That is why handwashing works, and it is the logic behind most prevention.
- "Time" is a piece too: a gentle nod to **induction time**.

**What a simple version has to leave out.** The flower has one pie; most diseases can arise through several different pies, so removing a component prevents only the cases that need it.

The video's catchphrase sums it up: *lots of pieces make it happen.*`,
      checks: [],
    },
  ],
};
