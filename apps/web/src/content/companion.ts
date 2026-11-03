/**
 * Companion notes keyed to Rothman, Huybrechts & Murray, "Epidemiology: An Introduction" (3rd edition, OUP 2024).
 * Original paraphrase written for EpiCompass, not text from the book. Kenny is given the notes for the concepts on
 * the current card so that its answers agree with the book; "reteach" and "where" are for students who did not
 * follow the first explanation.
 */
export type CompanionNote = {
  where: string; terms: string[]; core: string; positions: string[]; notation: string | null;
  reteach: string; misreadings: string[];
};

export const COMPANION: Record<string, CompanionNote> = {
  "confounding": {
    "where": "Chapter 1, section \"Confounding\"; Chapter 6, section \"Confounding\" (including the box \"Properties of a Confounding Factor\" and the subsection \"Control of Confounding\")",
    "terms": [
      "confounding: a mixing of effects, in which the apparent effect of an exposure is blended with the effect of another factor, producing bias",
      "confounder (confounding factor): the extra factor whose effect gets mixed in; it must predict the outcome, be linked to the exposure and not be a result of the exposure",
      "crude effect: the association seen when the data are not split by the possible confounder",
      "stratification: examining the exposure-outcome relation separately within categories of the confounder (e.g. age groups) so the confounder is roughly held constant",
      "causal intermediate: a factor produced by the exposure that lies on the route to the disease; it is part of the effect, not a confounder",
      "confounding by indication: bias in drug studies because people given a drug differ from others in the reason (indication, severity) for which it was prescribed",
      "randomization: random allocation of exposure in an experiment, which tends to balance both known and unknown risk factors but cannot guarantee balance",
      "restriction: enrolling only people with the same (or nearly the same) value of a potential confounder so it cannot vary",
      "matching: a design method to prevent confounding; effective in cohort studies but it introduces selection bias in case-control studies"
    ],
    "core": "The book treats confounding as a mixing of effects: what looks like the effect of an exposure is partly the effect of something else. Chapter 1 shows this with two surprises. Sweden loses a larger share of its population each year than Panama, yet at any given age Swedes die at a lower rate; Sweden simply has an older population. In the Whickham survey, women who smoked appeared less likely than non-smokers to die over 20 years, but once the data were split by age, smokers fared worse in the middle-aged group, and the overall figure was distorted because the non-smokers were, on average, older. Chapter 6 sets out what a confounder must be, shows stratification removing the distortion, and stresses that confounding can exaggerate, hide or even reverse an effect.",
    "positions": [
      "Untrained common sense is unreliable: the Sweden-Panama and Whickham results look paradoxical only until the age structure of the groups is examined.",
      "A confounder must have an effect on (or be a marker for a cause of) the outcome AND be unevenly distributed across the exposure groups; a strong risk factor that is equally distributed between groups causes no confounding.",
      "How much confounding occurs depends on both the strength of the confounder-outcome relation and the size of the imbalance across exposure groups.",
      "The exposure need not have any effect of its own for confounding to occur: the apparent rise of Down syndrome with birth order was entirely explained by maternal age.",
      "A confounder need not be a true cause; it may be a proxy. Maternal age is itself presumably confounded by unidentified biological changes that accompany ageing, so peeling away confounding is an open-ended route towards deeper causal understanding.",
      "Causal intermediates are not confounders (example: saturated fat raises LDL, which leads to atherosclerosis; LDL is part of the diet effect).",
      "Confounding can bias in either direction: it overstated harm (tolbutamide, birth order), masked harm (smoking in Whickham) and can reverse an apparent effect (Sweden vs Panama).",
      "Randomization limits confounding, including by unknown factors, but cannot guarantee balance: in the University Group Diabetes Program trial an age imbalance inflated the apparent excess mortality with tolbutamide from about 3.5% (age-stratified) to 4.5% (crude).",
      "Within a randomised experiment, confounding behaves as random error because it shrinks as the trial gets larger; in non-experimental studies it is a systematic error that a bigger study does not remove.",
      "Stratifying into only a few broad categories may leave residual confounding; a summary across strata should ideally weight each stratum by the amount of data in it.",
      "A speculative alternative explanation (e.g. that many Whickham smokers quit and non-smokers started) is not a reasonable criticism without evidence that it happened.",
      "Design methods (randomization, restriction, matching) limit rather than guarantee freedom from confounding; analytic control is by stratification (Chapter 9) and regression (Chapter 10)."
    ],
    "notation": "No special symbols in Chapter 1; risks are deaths divided by total in each group. Whickham crude risks: smokers 139/582 = 0.24, non-smokers 230/732 = 0.31; age 35-64: 92/354 = 0.26 vs 59/320 = 0.18; age 18-34: about 0.03 in both; age 65+: 0.86 vs 0.85. Chapter 6 uses the difference in proportions: crude 0.147 - 0.102 = 0.045; age-stratified 0.076 - 0.042 = 0.034 (under 55) and 0.224 - 0.188 = 0.036 (55 and over), summarised as about 0.035.",
    "reteach": "Rider A is late on 29 of 100 trips, Rider B on 15 of 100. But A gets 80 hilly routes and 20 flat ones, while B gets 20 hilly and 80 flat. On hilly routes A is late 28 times in 80 (35%) and B 9 times in 20 (45%); on flat routes A is late once in 20 (5%) and B 6 times in 80 (7.5%). A is better on both kinds of route. The overall figures mixed the rider's own performance with the effect of the terrain, because terrain both causes lateness and is unevenly shared out. That mixing is confounding; comparing within route type is stratification.",
    "misreadings": [
      "'The crude comparison is the real answer because it uses everyone.' Correction: the crude figure blends the exposure effect with the confounder effect; including more people does not undo the mixing.",
      "'Any strong risk factor is a confounder.' Correction: it must also be imbalanced between the exposure groups; with the same distribution in each group it cannot distort the comparison.",
      "'Confounding means the exposure really has no effect.' Correction: in Whickham smoking was harmful, but the effect was hidden; the exposure might or might not truly have an effect.",
      "'Confounding always makes an exposure look harmful.' Correction: it can exaggerate, mask or reverse an effect.",
      "'Randomised trials cannot be confounded.' Correction: chance imbalance is possible, as with age in the tolbutamide trial, though it becomes less likely as trial size grows.",
      "'Adjust for everything linked to both exposure and outcome.' Correction: factors caused by the exposure (intermediates such as LDL in the diet example) are part of the effect and are not confounders.",
      "'A confounder has to be a direct biological cause.' Correction: a marker or proxy for a cause (e.g. maternal age) can confound.",
      "'After stratifying into a couple of categories, confounding is gone.' Correction: broad strata can leave residual confounding."
    ]
  },
  "population_at_risk": {
    "where": "Chapter 1, section \"Population at Risk\"; Chapter 5, section \"Defining the Study Population\" (subsection \"Population at Risk\" and the box \"Disease-Free Does Not Imply Healthy\"); Chapter 5, section \"Measuring the Outcome\" (subsection \"Counting Disease Events\"); Chapter 4, section \"Risk and Incidence Proportion\"",
    "terms": [
      "population at risk: the people in whom the outcome being measured can still occur during the period studied; often used for the members of a cohort",
      "comparison population: the group against which the group of interest is compared; Chapter 1 warns that failing to choose it properly misleads",
      "anecdotal information: hand-picked examples (e.g. famous long-lived conductors); most epidemiologists would not count it as epidemiologic data",
      "average age at death: a summary of those who died only; it ignores survivors and group size and so does not measure risk",
      "risk (incidence proportion): the proportion of people at risk who develop the outcome within a stated period, A/N",
      "competing risks: removal of people from follow-up by death from other causes before they could experience the outcome being studied",
      "closed cohort / open (dynamic) cohort or dynamic population: a fixed membership versus a membership that changes as people enter and leave",
      "first occurrence vs recurrence: the population at risk differs depending on whether the outcome is the first event, a later event or any event"
    ],
    "core": "Chapter 1 uses this heading for a broad warning: conclusions go wrong when the group at risk and a fair comparison group are not identified. A newspaper inferred that conducting prolongs life because famous conductors lived long; beyond relying on anecdote, conductors only become conductors once they have already survived into adulthood, so they must be compared with people who have reached the same age. When most COVID-19 inpatients were vaccinated, that reflected high vaccine coverage; comparing hospitalisation risk by vaccination status showed the unvaccinated fared far worse. Average age at death (nursery pupils vs firefighters) describes only those who died. Chapter 5 gives the formal rule: each member of the at-risk group has to be living, without the disease under study and capable of developing it, and membership shifts over time.",
    "positions": [
      "Selected examples can be badly misleading; anecdotes are not epidemiologic data.",
      "Studying every conductor still gives the wrong answer if one simply averages their age at death, because the comparison starts at the wrong time: they had a head start of the years lived before becoming conductors. They should be compared with people of the same attained age, ideally also healthy enough to work at that age.",
      "The vaccination statistic begins the comparison at the wrong point: start with vaccination status and compare the risk of hospitalisation, not the share vaccinated among those hospitalised. If everyone were vaccinated, every inpatient would be vaccinated, yet admissions would be far fewer.",
      "Average age at death is not a measure of the risk of dying; it merely characterises the people who died and takes no account of how many deaths occurred relative to population size.",
      "The underlying fallacy is comparing groups on a single characteristic instead of framing the comparison around the question of interest (developed in Chapters 3 and 4).",
      "Who belongs to the population at risk depends on how the outcome is defined (first, repeat or any occurrence).",
      "Being disease-free does not mean healthy: members need only be free of the specific disease being measured.",
      "Immunised people are not at risk only if immunity is complete, which usually cannot be known; outcomes like measles need careful framing of the research question.",
      "For outcomes much rarer in one sex (male breast cancer), one option is to define male and female forms as separate diseases and exclude men when studying female breast cancer.",
      "Membership is dynamic: people leave on developing a once-only outcome (death, appendicitis treated by appendectomy), leave a window of vulnerability (cleft palate after the palate forms), or leave and re-enter for recurrent conditions (urinary tract infection).",
      "If only first occurrences are counted, people must be removed from the at-risk group when the disease first develops.",
      "A risk is uninterpretable without the time period it covers.",
      "End-of-chapter exercises (Chapter 5) ask students to explain why rising hysterectomy rates could hide an endometrial cancer epidemic in registry data, and why using census population as the denominator underestimates the rate in the population at risk; the book poses these as questions rather than stating answers."
    ],
    "notation": "Chapter 1 has no formulas. Chapter 4: average risk (incidence proportion) = A/N, where N people are followed for a specified period and A of them develop the disease; it ranges from 0 to 1, has no units and must be quoted with its time period.",
    "reteach": "Think of a fraction as a club and its waiting room. The numerator is who joined the club (new cases); the denominator must be everyone in the waiting room who could have joined in that period, and nobody else. In a made-up village of 1,000 women, 300 have had a hysterectomy and 7 develop endometrial cancer in a year. 7/1,000 understates the risk; 7/700 uses the real waiting room. Now the Chapter 1 twist: a 'club' that only admits people who have already reached 40 will always show a high average age at death. Ask who entered the waiting room, and from when, before comparing anyone.",
    "misreadings": [
      "'The whole population is a fine default denominator.' Correction: only people who could develop the outcome in the period belong in it.",
      "'Most hospitalised COVID-19 patients were vaccinated, so vaccines fail.' Correction: compare the risk of hospitalisation by vaccination status; when coverage is high, vaccinated people dominate any patient group even if the vaccine works well.",
      "'A group whose members die younger on average is at higher risk.' Correction: average age at death describes decedents only; nursery pupils die young on average without being at higher risk than firefighters.",
      "'Studying all conductors instead of famous ones fixes the problem.' Correction: it removes the anecdote problem but not the head-start problem; the comparison must start at the same attained age.",
      "'Everyone at risk has to be healthy.' Correction: they need only lack the specific disease under study.",
      "'Once in the population at risk, always in it.' Correction: membership changes with death, onset of the outcome, recovery, vulnerability windows and other eligibility criteria.",
      "'A 2% risk is meaningful on its own.' Correction: a risk needs a stated time period."
    ]
  },
  "sensitivity_specificity": {
    "where": "Chapter 1, section \"Diagnostic or Screening Tests\"; Chapter 12, section \"The Gold Standard, Sensitivity, and Specificity\"; Chapter 12, section \"Predictive Value\" (on whether sensitivity and specificity are constant)",
    "terms": [
      "sensitivity: among people who truly have the disease, the proportion the test (sign or symptom) classifies as positive",
      "specificity: among people who truly do not have the disease, the proportion the test classifies as negative",
      "accuracy (of a test): in the book, the test's performance as characterised by its sensitivity and specificity together, not a single percentage",
      "gold standard: the working definition of disease against which a test is judged; necessary, but partly arbitrary and definitive only by definition",
      "false-positive result: a positive result in someone without the disease",
      "false-negative result: a negative result in someone with the disease (it gives false reassurance)",
      "trade-off between sensitivity and specificity: changing a test to raise one usually lowers the other"
    ],
    "core": "The book opens with the point that no test is perfect. How well a test performs is summarised by two proportions, each computed in a different group. Sensitivity is the share of true cases that the test calls positive; specificity is the share of non-cases that the test calls negative. Generally, modifying a test to gain sensitivity costs specificity and the reverse. Chapter 12 adds that both are judged against a gold standard, itself a somewhat arbitrary definition (in the tuberculosis example an expert panel using culture and clinical data). There, a sputum smear had sensitivity 60% and specificity 92%. Combining tests shifts the balance: requiring both to be positive raises specificity and lowers sensitivity, while accepting either positive does the opposite. In theory both properties are fixed for a test, but in practice they can vary between kinds of patient.",
    "positions": [
      "No test perfectly separates those with and without disease.",
      "Both measures are needed: high sensitivity alone is trivially easy to achieve (every patient with a headache has a head, so 'having a head' is 100% sensitive but has essentially zero specificity).",
      "Tests are most useful when sensitivity and specificity are both high.",
      "A gold standard contains an element of arbitrariness but some definition of disease is required to evaluate a test.",
      "There is generally a trade-off; the book illustrates it through rules for combining tests (and the Pap smear, highly sensitive but poorly specific, made more specific by requiring repeated positives, now improved by HPV DNA testing on the same sample).",
      "Sensitivity and specificity are theoretically constant properties of a test but may differ across patient groups in practice (e.g. a skin-cancer test across levels of skin pigmentation); the Chapter 12 questions ask students why.",
      "High sensitivity and specificity do not by themselves mean that test results will be trustworthy in a given population; that depends on prevalence (see predictive value).",
      "In screening, false positives burden people with a disease they do not have and lead to further, sometimes risky, tests or treatment; false negatives give false reassurance."
    ],
    "notation": "Chapter 12, Table 12.3 layout: a = test positive & disease present, b = test positive & disease absent, c = test negative & disease present, d = test negative & disease absent. Sensitivity = a/(a + c); specificity = d/(b + d). TB smear: sensitivity 43/72 = 60%, specificity 244/266 = 92%. Combining two independent tests (each sensitivity 0.8, specificity 0.9): both must be positive -> sensitivity 0.8 x 0.8 = 64%, specificity 0.9 + (0.1 x 0.9) = 99%; either positive -> sensitivity 0.8 + (0.2 x 0.8) = 96%, specificity 0.9 x 0.9 = 81%.",
    "reteach": "Think of a smoke alarm. Sensitivity asks: of all the real fires, how many set the alarm off? Specificity asks: of all the evenings with no fire (only toast), how many did the alarm stay quiet? In a made-up year with 10 real fires and 200 fire-free evenings, an alarm that sounds for 9 fires has sensitivity 90%; if it stays silent on 180 toast evenings, specificity is 90%. Make it twitchier and it will catch the 10th fire but shriek at more toast: higher sensitivity, lower specificity. Each measure is calculated only within its own group, fires or no fires.",
    "misreadings": [
      "'Sensitivity is the chance that a person who tests positive has the disease.' Correction: that is the predictive value positive; sensitivity is calculated among people who have the disease.",
      "'A highly sensitive test is a good test.' Correction: without specificity it can be useless (the head-and-headache example).",
      "'Specificity is the proportion of positive results that are correct.' Correction: specificity is the proportion of disease-free people who test negative.",
      "'You can raise sensitivity and specificity together by tweaking a test.' Correction: generally improving one lowers the other.",
      "'Sensitivity and specificity are exactly the same in every population.' Correction: theoretically constant, but they can differ across types of patient in practice.",
      "'The reference standard is the truth.' Correction: the gold standard is a working definition with some arbitrariness."
    ]
  },
  "predictive_value": {
    "where": "Chapter 1, section \"Diagnostic or Screening Tests\"; Chapter 12, section \"Predictive Value\"; Chapter 12, section \"Screening\"",
    "terms": [
      "predictive value positive (PV+), or predictive value of a positive test: the proportion of people testing positive who truly have the disease",
      "predictive value negative (PV-), or predictive value of a negative test: the proportion of people testing negative who truly do not have the disease",
      "prevalence: how common the disease is in the population being tested; the key driver of predictive values",
      "false-positive result: a positive test in someone without the disease",
      "preclinical phase: the period when disease is detectable by a test before it becomes clinically apparent; screening needs this phase to be long enough for its prevalence to be high"
    ],
    "core": "A patient who tests positive wants to know how likely it is that she really has the disease; that probability is the predictive value positive. Chapter 1 works through screening 10,000 people containing 20 undetected colon cancers with a test of 90% sensitivity and 99% specificity: about 18 cases test positive, but 1% of the 9,980 without cancer (about 100) also do, so only 18 of 118 positives (about 15%) have cancer. Because the disease is uncommon, most positives are false. Chapter 12 explains that sensitivity and specificity describe the test, while predictive values describe how useful it is for classifying people, and they depend on prevalence even in theory. Adding 500 people without TB to the smear data lowered PV+ from 66% to 41% and raised PV- from 89% to 96%.",
    "positions": [
      "Common sense expects a highly sensitive, highly specific test to give reliable results; this fails when the disease is infrequent in the people tested.",
      "Even a nearly perfect test performs poorly where disease is extremely rare; if nobody tested has the disease, every positive is false and PV+ is zero (PV- would then be 100%).",
      "In a population where the disease is common, the same test gives a higher PV+; if everyone had the disease, PV+ would be 100% and PV- zero.",
      "As prevalence falls, PV+ falls and PV- rises.",
      "Predictive value depends on prevalence even theoretically, whereas sensitivity and specificity are theoretically constant properties of the test.",
      "A test with reasonable PV+ among symptomatic clinic patients may have poor PV+ when used to screen an asymptomatic population, so turning diagnostic tests into low-prevalence screening tests may not make sense.",
      "Screening works only if the preclinical phase is long enough for its prevalence to be high; a short preclinical phase means low prevalence and thus low PV+.",
      "Screening carries costs: false positives (further tests, sometimes unnecessary risky treatment, distress), false negatives (false reassurance), and earlier labelling even of true cases; correct negatives bring useful reassurance."
    ],
    "notation": "Chapter 12, Table 12.3 (a = test+/disease+, b = test+/disease-, c = test-/disease+, d = test-/disease-): PV+ = a/(a + b); PV- = d/(c + d). Chapter 1: PV+ = 18/118 = 15%. TB smear: PV+ 43/65 = 66%, PV- 244/273 = 89%; after adding 500 non-TB people (prevalence 72/338 = 21.3% falling to 72/838 = 8.6%): PV+ 43/106 = 41%, PV- 703/732 = 96%.",
    "reteach": "Build it from counts. Take 1,000 imaginary people and a test with 90% sensitivity and 90% specificity. Step 1: if 2% are ill, 20 are ill and 980 are not. Step 2: the test catches 18 of the 20. Step 3: it wrongly flags 10% of the 980, which is 98. Step 4: of 116 positives, only 18 are ill, about 16%. Now repeat with 30% ill: 300 ill give 270 true positives; 700 well give 70 false positives; 270 of 340 positives, about 79%, are ill. Same test, different crowd: false alarms come from the healthy group, so the bigger it is, the more they swamp true cases.",
    "misreadings": [
      "'A positive result on a 90%-sensitive test means a 90% chance of disease.' Correction: that confuses sensitivity with PV+; PV+ also depends on specificity and prevalence (18/118 in the colon cancer example).",
      "'If PV+ is low in a new setting, the test must have got worse.' Correction: with sensitivity and specificity unchanged, a lower prevalence alone lowers PV+.",
      "'Predictive value is a fixed property of the test.' Correction: it changes with the population tested; sensitivity and specificity are the (theoretically) fixed properties.",
      "'A test that works well in the clinic will work equally well for population screening.' Correction: the lower prevalence in screening can make PV+ poor.",
      "'Lower prevalence makes all predictive values worse.' Correction: PV+ falls but PV- rises.",
      "'The prevalence is the probability of disease after a positive test.' Correction: prevalence is the probability before testing; a positive result raises it to the PV+."
    ]
  },
  "counts_vs_rates": {
    "where": "Chapter 2, section \"From Hippocrates to Snow and Frost: Antiquity to the 19th Century\" (subsections on John Graunt, Ignasz Semmelweis, Florence Nightingale and Wade Hampton Frost); Chapter 5, section \"John Snow's Natural Experiment\" (under \"Cohort Studies\"); Chapter 4, sections \"Risk and Incidence Proportion\" and \"Incidence Rate\" (formal definitions)",
    "terms": [
      "Bills of Mortality: weekly parish summaries of christenings and deaths by cause in London (later England), first kept to watch for plague, which Graunt compiled and analysed.",
      "Risk (incidence proportion): the share of a group, A out of N, who develop the outcome over a stated period; read like a probability and meaningless without that period.",
      "Incidence rate: number of new cases divided by the summed time at risk (person-time); has units of 1/time and is not a probability.",
      "Person-time: the total of every individual's time at risk, counted only while that person could still become a case in the numerator.",
      "Mortality rate: an incidence rate whose counted events are deaths.",
      "Case-fatality rate: the proportion of people with a disease who die of it; despite its name, a kind of incidence proportion."
    ],
    "core": "A bare number of cases or deaths cannot be compared between groups until it is related to the size of the group that produced it and the time over which it was counted. The book traces this back to Graunt, who analysed already-collected burial records and reported disease trends while estimating and adjusting for population size. Semmelweis compared the proportion of mothers dying in two clinics (about 10% against under 4%). Snow, in his water-company study, divided cholera deaths by the number of houses each company supplied, and later by the estimated population served. Frost analysed tuberculosis mortality rates by birth cohort. Chapter 4 makes the idea formal: risk is cases over people at the start, tied to a stated period; incidence rate is cases over person-time.",
    "positions": [
      "Using routinely collected data (Graunt, then Farr at the General Register Office) is presented as a lasting tradition in epidemiology, not a second-best option.",
      "Graunt is praised for estimation (quantitative estimates) over a yes/no approach such as testing for statistical significance, and for checking a figure several ways: he reached his estimate of 384,000 for London's population by five different routes.",
      "Graunt also recognised that apparent changes in disease frequency can come from changes in how deaths were classified, and he corrected plague mortality for an estimated 20% of plague deaths recorded under other causes (the first recorded correction for misclassification).",
      "Snow's household denominators came from business records of the water companies, so he had to establish the water supply only for each house with a death, not for every household.",
      "Chapter 4 insists that a risk is uninterpretable unless the time period is stated, and that compared groups must cover the same length of time.",
      "The book does not credit Nightingale with calculating rates; it describes her polar-area (coxcomb) diagram as plotting monthly deaths from preventable and other causes, with deaths shown by area rather than radius."
    ],
    "notation": "Chapter 4: risk (incidence proportion) = A/N over a stated period; incidence rate = A / total person-time, units time^-1 (e.g. cases per person-year). Snow's figures in Chapter 5: first four weeks of the 1854 epidemic, 286 deaths in houses of the Southwark and Vauxhall Company (40,046 houses supplied in 1853) and 14 in houses of the Lambeth Company (26,107 houses), giving 71 against 5 deaths per 10,000 houses, about 14 times higher. Table 5.1 (whole 1854 outbreak, population denominators): 4,282/266,516 = 0.0161 against 462/173,748 = 0.0027, labelled as a risk of death, roughly six times higher.",
    "reteach": "Imagine two school buses. Bus P carries 60 children and 6 are sick by Friday; Bus Q carries 12 children and 3 are sick. Counting alone, Bus P looks worse (6 against 3). Now ask 'out of how many?' Bus P: 6/60 = 10%. Bus Q: 3/12 = 25%. Bus Q is worse. Next, ask 'over how long?' If Bus P's figure covered a week and Bus Q's a month, they are still not comparable; you would need the same period, or divide by child-weeks of riding. Those two questions, how many people and how much time, are exactly what turns a count into a risk or a rate.",
    "misreadings": [
      "Misreading: the group with more deaths has the bigger problem. Correction: a larger group, or one watched for longer, produces more deaths even at the same underlying risk; compare risks or rates.",
      "Misreading: risk and rate are interchangeable words. Correction: in the book, risk is a proportion of people (0 to 1, tied to a period) and an incidence rate is cases per unit of person-time (no upper limit, units 1/time). Snow's Table 5.1 measure is labelled a risk.",
      "Misreading: Snow's 'fourteen times' and 'six times' contradict each other. Correction: they come from different calculations in the book: the epidemic's opening four weeks with houses as the denominator, versus the whole 1854 outbreak with estimated population as the denominator.",
      "Misreading: a 'rate' such as the case-fatality rate must be a true rate. Correction: the book notes that attack rate and case-fatality rate are really proportions (risks), whatever their names."
    ]
  },
  "natural_experiment": {
    "where": "Chapter 2, section \"From Hippocrates to Snow and Frost: Antiquity to the 19th Century\" (subsection \"John Snow (1813–1858)\"); Chapter 5, section \"John Snow's Natural Experiment\" (under \"Cohort Studies\"), including the box \"Natural Experiments Are Not Experiments\"; Chapter 5, section \"Experiments\" (for the contrast with true experiments)",
    "terms": [
      "Natural experiment: a setting in which circumstances, not the investigator, split people into exposed and unexposed groups who are otherwise similar. The book says this is really a cohort study that mimics an experiment.",
      "Quasi-experiment: another name the book mentions for a cohort study whose groups are well matched in other respects; like a natural experiment, it is not an actual experiment.",
      "Experiment (trial): a study in which the investigator assigns exposure solely for the purposes of the study protocol; it is a cohort study, but most cohort studies are not experiments.",
      "Southwark and Vauxhall Company: the water company in Snow's study that drew from the sewage-contaminated lower Thames (the exposed cohort).",
      "Lambeth Company: the water company that moved its intake upstream to Thames Ditton in 1852, giving water free of London sewage (the unexposed cohort).",
      "Miasma theory: the then-dominant belief that bad air spread communicable diseases such as cholera."
    ],
    "core": "In parts of south London the pipes of two water companies ran down the same streets, often serving neighbouring houses. The Southwark and Vauxhall Company took water from the sewage-polluted lower Thames. The Lambeth Company had moved its intake upstream to Thames Ditton in 1852. Which company supplied a house had been settled by owners or landlords when the companies were competing, so many residents did not know their supplier. Both companies served rich and poor alike. Snow saw that this arrangement imitated an experiment: groups alike in other relevant ways differed mainly in their water. He found the supplier for each house with a cholera death and used company records to supply the denominators. The book stresses that the result is still a cohort study, not an experiment, because nobody assigned the exposure.",
    "positions": [
      "The book insists that natural experiments are not experiments. Snow's study is a cohort study that simulates one, and is better described as a cohort study cleverly designed by its investigator.",
      "Running a natural experiment arguably takes more creativity than a real one. The investigator has to spot the opportunity and define study populations that make the most of it.",
      "Part of Snow's genius was choosing where to study. He confined the comparison to districts where the two companies' pipes were intermingled, because comparing whole districts would have mixed in many other differences.",
      "The book reports criticism that Snow's first analysis included all houses supplied by either company, not just those in the jointly supplied districts. Snow accepted the criticism and fixed the analysis in a subsequent publication.",
      "Snow's water-company comparison, not the Broad Street pump episode, is presented as his most important contribution to epidemiology. The pump handle came off when the Golden Square outbreak of 1854 was already waning, so it is unclear that it prevented any cases. The book adds that it may have prevented a second outbreak, since the likely index case's father fell ill on the day the handle was removed.",
      "Snow also used biological and other lines of reasoning. Cholera began as a gut illness, not a respiratory one. Miners, who worked long hours underground with no privies and ate with unwashed hands, had the highest cholera risk of any occupation. Farr's link between low altitude and cholera could reflect water flowing downhill, not bad air.",
      "Wording note: Chapter 2 says Snow judged the arrangement superior to any experiment one could design, and that it later came to be known as a natural experiment. Chapter 5 says Snow himself called the study a natural experiment."
    ],
    "notation": "Chapter 5 summarises Snow's data as a cohort comparison: risk in each cohort = cholera deaths / population served (Table 5.1: Southwark and Vauxhall 4,282/266,516 = 0.0161; Lambeth 462/173,748 = 0.0027), with the exposed-to-unexposed ratio about 6. Snow's own early figures, quoted in the book, are per 10,000 houses: 71 against 5, about 14-fold, for the first four weeks.",
    "reteach": "Suppose a city's school canteens get bread from two bakeries, and each school's bakery was fixed decades ago by a council coin toss. Neighbouring schools often use different bakeries. One bakery later buys flour from a mill found to be contaminated. If children at those schools fall ill far more often, the flour is a credible culprit: the coin toss, not wealth or location, decided the supply, so the schools are otherwise alike. You did not toss the coin; you noticed that it had been tossed. That noticing, plus careful choice of comparable schools, is a natural experiment, which is still an observational cohort study.",
    "misreadings": [
      "Misreading: a natural experiment is a kind of experiment or randomised trial. Correction: the book is explicit that it is a cohort study; exposure was not assigned by anyone, let alone at random, even if comparability is nearly as good.",
      "Misreading: Snow's proof was removing the Broad Street pump handle. Correction: the epidemic was already declining when the handle was removed; his decisive work was the comparison of customers of two water companies.",
      "Misreading: any comparison across districts or across time where exposure differs is a natural experiment. Correction: the strength comes from groups being alike apart from exposure. Snow deliberately avoided whole-district comparisons because districts differed in many ways.",
      "Misreading: Snow's evidence relied on identifying the cholera organism. Correction: germ theory was not yet accepted; his case rested on the population comparison and on clinical and circumstantial reasoning.",
      "Misreading: Farr's altitude finding supported bad air. Correction: Farr first read it that way, but altitude also governs the flow of sewage-laden water; his own data eventually led him to champion Snow's water theory."
    ]
  },
  "comparison_group": {
    "where": "Chapter 2, section \"From Hippocrates to Snow and Frost: Antiquity to the 19th Century\" (subsections \"Ignasz Semmelweis (1818–1865)\" and \"Janet Elizabeth Lane-Claypon (1877–1967)\"); Chapter 2, section \"The Birth of Modern Epidemiology: 20th Century and Beyond\", subsection \"Tobacco Smoking and Health\" (Wynder and Graham; Doll and Hill; Hammond and Horn; Dissenters and the U.S. Surgeon General's Advisory Committee Report); Chapter 4, section \"The Counterfactual Ideal\" (under \"Causal Effect Measures\"); Chapter 5, sections \"Case-Control Studies\" and \"Identifying Controls for Case-Control Studies\"",
    "terms": [
      "Cohort study: following groups defined by exposure (or another shared characteristic) over time and comparing how often the outcome occurs in each.",
      "Retrospective cohort study: a cohort comparison built from past records. The book notes Lane-Claypon's 1912 infant-feeding study has been called the first, while noting that Snow's and Semmelweis's earlier work could arguably qualify.",
      "Case-control study: comparing past exposures of people with the disease (cases) against a control group sampled from the population that gave rise to the cases. The book credits Lane-Claypon's 1926 breast-cancer study as the first modern one.",
      "Control group: in a case-control study, a sample used to estimate how exposure is distributed in the source population. It must be sampled independently of exposure.",
      "Source population: the population from which the cases arose, in which a cohort study could in principle have been run.",
      "Counterfactual: the ideal but impossible comparison of the same people, over the same time, both exposed and unexposed. Real comparison groups stand in for it.",
      "Recall bias: error arising because cases and controls remember or report past exposures differently. Lane-Claypon already discussed it."
    ],
    "core": "Causal inference needs a contrast between what happened to exposed people and what would have happened to them without exposure (Chapter 4). Since the same people cannot be observed both ways, epidemiologists build comparison groups. Chapter 2 shows this developing. Semmelweis compared two maternity clinics that admitted women on alternate days. Lane-Claypon in 1912 compared infant weight gain with breast versus bottle feeding, excluding sick infants to avoid confounding. In 1926 she ran the first modern case-control study: 500 breast-cancer cases and 500 controls, drawn from London and Glasgow hospitals, interviewed with a purpose-made questionnaire. Around 1950 case-control studies linked smoking with lung cancer. Cohort studies followed, including Doll and Hill's British doctors from 1951 and Hammond and Horn's American volunteers, published in 1954.",
    "positions": [
      "Lane-Claypon is presented as an overlooked pioneer who foresaw many design issues decades early. She considered confounding by social class, recall bias, cases being survivors, and the fact that cases and controls all came from a set of hospitals.",
      "Her 1926 study found that number of children, age at first pregnancy, age at menopause and surgically induced menopause related to breast-cancer risk. Her contemporaries did not seem to see its novelty.",
      "Smoking milestones and numbers. Wynder and Graham (May 1950) reported no effect estimates, but their tables imply heavy smokers had over 20 times the frequency of lung cancer seen as in non-smokers. Doll and Hill (1950, BMJ) estimated 50 times. Hammond and Horn followed a volunteer cohort of US men for 20 months and found a 52% higher death rate in regular smokers and 75% higher at a pack a day or more, with a lung-cancer association about as strong as in the case-control studies.",
      "The book explains that in mid-century case-control methods were less widely understood than cohort methods, and that Doll and Hill's doctors' cohort was set up to give stronger evidence.",
      "Acceptance was not smooth. Fisher, Berkson and others resisted, largely over whether observational findings could be trusted like controlled experiments, given confounding. The US Surgeon General's committee was assembled in 1961 and reported in 1964.",
      "Chapter 5's cardinal rule for controls: they estimate how exposure is distributed in the source population, so they must be sampled independently of exposure. Hospital controls with exposure-related diagnoses (for example smoking-related diseases in a smoking study) break this rule."
    ],
    "notation": "No formulas in Chapter 2. Book figures to use: Semmelweis's first clinic about 10% maternal death risk against under 4% in the second (1840–1846); Wynder and Graham more than 20-fold; Doll and Hill 50-fold; Hammond and Horn +52% (regular smokers) and +75% (at least one pack a day) in overall death rate.",
    "reteach": "Build it in three steps. Step 1: a doctor finds that 8 of her 10 patients with a rash used a new soap. Damning? Step 2: ask what share of similar people without the rash use that soap. If 8 in 10 of them do too, the soap tells you nothing. If 2 in 10 do, it is suspicious. Step 3: that second group must come from the same population as the patients and must not be chosen because of their soap use. Do not, for example, recruit from the soap company's mailing list. The comparison group is the yardstick: without it, an exposure count among cases has no meaning.",
    "misreadings": [
      "Misreading: a high proportion of exposed people among cases shows causation. Correction: the proportion means something only against the exposure distribution in a suitable comparison group.",
      "Misreading: controls should be healthy people who are as different from cases as possible, or any convenient group. Correction: controls should come from the cases' source population and be sampled independently of exposure; their job is to represent exposure in that population.",
      "Misreading: cohort studies were invented to confirm case-control studies because case-control studies are inherently invalid. Correction: the book says case-control methods were simply less widely understood then, and that the cohort study was undertaken to strengthen the evidence. It does not call case-control studies invalid.",
      "Misreading: the smoking and lung cancer link was accepted once the 1950 studies appeared. Correction: prominent statisticians disputed it for years, and the Surgeon General's report came only in 1964.",
      "Misreading: Lane-Claypon only ran a case-control study. Correction: she also did the 1912 infant-feeding cohort comparison, which also compared boiled with raw cow's milk within the bottle-fed group."
    ]
  },
  "social_determinants": {
    "where": "Chapter 2, section \"The Birth of Modern Epidemiology: 20th Century and Beyond\", subsection \"Pioneers of Social Epidemiology\"; Chapter 2, section \"From Hippocrates to Snow and Frost: Antiquity to the 19th Century\" (Ramazzini on occupation; Farr as reformer; Nightingale and the Poor Law; Lane-Claypon on confounding by social class); Chapter 3, box \"Genetic versus Environmental Causes\" (in section \"Implications of the Causal Pie Model\")",
    "terms": [
      "Social epidemiology: the scientific study of how poverty, education, discrimination, segregation, inequalities and particular social policies affect public health and undermine social justice.",
      "Social determinants of health: structural, social and cultural conditions that shape health. The book names the term through Marmot's WHO Commission on Social Determinants of Health (CSDH) and Sherman James's work, but gives no separate formal definition.",
      "Community-oriented primary care: the Karks' name for their social-medicine programmes in Pholela and later Durban, South Africa.",
      "Host resistance (social environment): John Cassel's widening of the host element in the agent–host–environment model to include social support or stress.",
      "John Henryism: Sherman James's hypothesis that racism and discrimination directly shorten the lives of African Americans by way of the damage done by chronic stress."
    ],
    "core": "As the 19th century closed, epidemiology concentrated on infectious agents and environmental toxins. During the 20th century it widened to diet, lifestyle and medications, and finally to what the book calls perhaps the broadest exposure of all: structural, social and cultural conditions. Social epidemiology studies how poverty, education, discrimination, segregation, inequality and specific policies affect public health and social justice. Michael Marmot, who chaired the WHO Commission on Social Determinants of Health, pointed to a 48-year spread in life expectancy between countries, and at least 20 years inside individual countries, and argued it is not inevitable. The book traces the field's roots to W. E. B. Du Bois, then to South African émigrés (the Karks, Susser, Stein, Cassel) and to Sherman James.",
    "positions": [
      "Social conditions are treated as exposures in their own right, indeed the broadest class of exposure, not merely background.",
      "Health inequalities between and within countries are presented, through Marmot, as avoidable and rooted in social factors.",
      "Du Bois is credited with applying scientific scrutiny to unfounded claims about race and class. The book suggests he did not call himself an epidemiologist only because the discipline barely existed during much of his career.",
      "South Africa is described as a crucible of early social epidemiology. The Karks' student H. Jack Geiger carried their approach to America; the Tufts-Delta Community Health Center became the first rural clinic built around social-epidemiology prevention principles. Susser and Stein moved to the UK and then Columbia University, working also on prenatal nutrition and HIV/AIDS.",
      "Cassel's 1976 paper, 'The Contribution of the Social Environment to Host Resistance', was praised in 2017 by Sherman James. James's work built on Du Bois by giving a biological and medical basis for long-observed health inequities.",
      "Social concern runs through the earlier pioneers too. Ramazzini asked about patients' occupations. Farr saw the social burden of industrialisation and joined the sanitary reform movement. Nightingale worked to improve care for the poor, including reform of the Poor Law. Lane-Claypon flagged social class as an uncontrolled confounder in her 1912 study.",
      "Chapter 3 adds that privilege or discrimination, wealth or poverty, education and access to healthy environments can be shared within families and passed down. Though not genetic, they can be heritable and hard to tell apart from genetic causes. The book also argues that splitting causes into 'genetic' and 'environmental' is misleading, since nearly every case has both kinds of component cause."
    ],
    "notation": "None. Key figure from the book (quoting Marmot): a 48-year spread of life expectancy between countries and at least 20 years inside individual countries.",
    "reteach": "Picture a river. Doctors downstream pull people out one by one, treating each person's infection, injury or heart attack. Social epidemiology walks upstream to ask why so many people are falling in: unsafe bridges (housing), no railings (policy), a crowd pushing some people nearer the edge (discrimination, poverty). In a made-up town, two neighbourhoods have similar smoking and diet, yet life expectancy differs by ten years. Looking only at individual habits misses the factors that shape everyone's exposures at once. Cassel's idea fits here: stress and social support change how well the 'host' resists whatever comes downstream.",
    "misreadings": [
      "Misreading: social factors are not real causes because they are not biological. Correction: the book treats them as exposures, and Cassel and James describe biological pathways (host resistance, chronic stress).",
      "Misreading: social epidemiology began with the WHO Commission. Correction: the book traces it to Du Bois and to mid-20th-century South African émigrés, and finds social concern in Farr, Nightingale, Ramazzini and Lane-Claypon.",
      "Misreading: health differences between groups that run in families must be genetic. Correction: Chapter 3 notes that experiences of discrimination, poverty and education are shared and heritable without being genetic, and can be mistaken for genetic causes.",
      "Misreading: social epidemiology is advocacy rather than science. Correction: the book defines it as applying scientific methods to social factors, and presents Du Bois as bringing evidence to bear on claims that lacked it."
    ]
  },
  "sufficient_cause": {
    "where": "Chapter 3, opening pages before \"The Causal Pie Model\" (light-switch example and general definition of a cause; no section heading); Chapter 3, section \"The Causal Pie Model\"",
    "terms": [
      "cause: an event or a condition that affects whether some later event happens; put simply, it changes how later events unfold",
      "sufficient cause: one complete causal mechanism for a disease, drawn as a whole pie; once every part of it has acted, the disease occurs",
      "causal pie: the diagram (Figure 3.1) in which each whole pie stands for one theoretical mechanism and each slice for a component",
      "sufficient-component cause model: the book's alternative name for the causal pie model"
    ],
    "core": "The book starts from everyday causation: a lamp lights only if the switch is flipped and there is power, a working bulb and intact wiring. We tend to call the switch 'the' cause because it is usually the last thing to change, while the wiring sits unnoticed. Epidemiologists treat a cause as an event or condition that influences whether a later event occurs, and a cause need not work in every person or setting: not all smokers develop lung cancer. In the causal pie model each pie is a theoretical causal mechanism, also called a sufficient cause. Any disease has several such mechanisms, but each individual case arises through just one of them. A mechanism needs many component causes acting jointly before the disease follows.",
    "positions": [
      "A disease has multiple sufficient causes, yet each single case is produced by exactly one mechanism.",
      "The factor people single out as 'the' cause is often just the final or the most visibly changing one; passive, long-standing components (like wiring) are causes too and are easily overlooked.",
      "A cause does not have to produce its effect in every situation or every person in which it is present.",
      "When the cause is a condition rather than an event, whether it counts as a cause depends on the alternative it is compared with: chewing tobacco causes mouth cancer relative to no tobacco, but is preventive relative to smoking; being a firefighter raises the risk of fatal injury relative to being an accountant, but perhaps not relative to being a test pilot.",
      "The book presents each pie as a theoretical mechanism; it is a way of thinking about causation rather than a diagram one expects to fill in exactly for a real disease."
    ],
    "notation": "No formula. Figure 3.1 shows three pies whose slices are labelled with letters (the text uses 'factor C' in the first pie as, for example, cigarette smoking for lung cancer). Chapter 11 later uses U for unidentified complementary components.",
    "reteach": "Think of a car engine starting. Route 1: fuel in the tank, a charged battery, a working starter motor, key turned. Route 2 (a push start): fuel, ignition on, car rolling in gear, clutch released. Each route is a complete recipe, a sufficient cause, and either one on its own gets the engine running. Each morning's start uses one route only. Turning the key feels like 'the' cause because it comes last, yet with a flat battery it does nothing. Fuel appears in both recipes, so it is needed every time; the battery matters only for Route 1. Diseases work alike, with more routes and unnamed slices.",
    "misreadings": [
      "Thinking a sufficient cause is a single factor that produces disease by itself. Correction: it is the whole pie, the complete set of components acting together; single factors are seldom sufficient.",
      "Thinking one case can arise from several sufficient causes at once. Correction: the book states each case occurs through a single mechanism, even though the disease overall has several.",
      "Concluding a factor is not a cause because some exposed people stay well. Correction: causes act only in some people or circumstances, namely where the rest of the pie is completed.",
      "Treating the last-acting trigger as the only cause. Correction: every component that took part in the mechanism was a cause; the trigger is merely the most noticeable.",
      "Assuming 'X causes Y' needs no reference point when X is a condition. Correction: the claim depends on the alternative condition being compared."
    ]
  },
  "component_cause": {
    "where": "Chapter 3, section \"The Causal Pie Model\"; Chapter 3, opening pages before \"The Causal Pie Model\" (light-switch example)",
    "terms": [
      "component cause: one slice of a pie; an event or condition that is needed, within that mechanism, for some cases of the disease to occur",
      "necessary cause (necessary component): a component cause that appears in every sufficient cause of the disease, so no case occurs without it"
    ],
    "core": "Every causal mechanism needs several component causes acting together. A component cause plays an indispensable part in the cases that arise through its own pie, but not necessarily in other cases. With lung cancer, for instance, smoking might be one slice of a pie whose other slices are genetic traits and other environmental exposures. The same component can turn up in many different pies. If a component is present in every pie for a disease, the book calls it a necessary component or necessary cause. Necessary does not mean sufficient: infection with SARS-CoV-2 is required for COVID, yet many infected people never develop the disease, so infection alone does not complete a pie.",
    "positions": [
      "Necessary and sufficient are different properties; the SARS-CoV-2 and COVID example shows a cause that is necessary but not sufficient.",
      "Some component causes take part in many different mechanisms.",
      "In the light-switch example the switch is only one component among several (power supply, bulb, wiring); the others are just as much causes.",
      "An end-of-chapter question asks students to criticise the claim that infection with the tubercle bacillus is 'the' cause of tuberculosis. The chapter's logic implies the bacillus is necessary but not sufficient, so other components are also causes. The book poses this as a question rather than giving an answer."
    ],
    "notation": "No formula. Components are shown as lettered slices in Figure 3.1.",
    "reteach": "Build it step by step with invented numbers. Suppose disease Q has three pies: {A, B, E}, {A, C, F} and {A, D, G}. Of 100 cases, 50 come from pie 1, 30 from pie 2 and 20 from pie 3. B is a component cause, but only of the 50 cases from pie 1; the other 50 cases never needed it. A sits in all three pies, so it is necessary, and removing it would prevent all 100 cases. Yet a person with A alone, lacking every set of partners, never develops Q, so A is not sufficient. Removing B prevents 50 cases even though B is not necessary.",
    "misreadings": [
      "Believing a cause must be present in every case. Correction: only a necessary cause has to be; most component causes contribute only to the cases from pies that contain them.",
      "Equating a necessary cause with a sufficient one. Correction: SARS-CoV-2 infection is necessary for COVID but does not by itself produce disease.",
      "Ranking the necessary cause as the 'real' cause and the rest as mere risk factors. Correction: every slice of a completed pie was required for the cases it produced.",
      "Thinking a component cause can act alone. Correction: it acts only together with the other slices of its pie."
    ]
  },
  "multicausality": {
    "where": "Chapter 3, section \"Implications of the Causal Pie Model\", subsection \"Multicausality\"; Chapter 3, box \"Genetic versus Environmental Causes\"",
    "terms": [
      "multicausality: the principle that every causal mechanism involves many component causes acting jointly",
      "genetic component cause: an inherited trait that forms one slice of a causal pie",
      "environmental (nongenetic) cause: any component cause that is not genetic",
      "heritable nongenetic factors: influences such as cultural practices, shared experiences of privilege or discrimination, wealth or poverty and education, which pass down families without being genetic"
    ],
    "core": "The book calls multicausality the most important lesson of the pie model: every mechanism involves many components acting jointly. Its example is a broken hip after a fall on ice, involving a head injury years earlier that left the person with poor balance, footwear, a missing handrail, a gust of wind and body weight. Some components are past events with lingering effects; some are genetic (influencing weight, gait, behaviour, recovery); others are environmental. Most mechanisms contain both kinds. The box argues that sorting diseases into genetic or environmental is misleading or futile. Almost any disease can be called entirely genetic (even a drink-driving death, via inherited vulnerability to alcoholism) and entirely environmental (phenylketonuria causes cognitive delay only with dietary phenylalanine). So all of a disease can be attributable to genes and to environment at the same time.",
    "positions": [
      "Multicausality is singled out as the most important principle that follows from the pie model.",
      "Splitting causes into genetic versus environmental is described as misleading or even futile.",
      "100% of a disease can be attributed to genes and, at the same time, 100% to environment; the attributable shares therefore need not sum to 100% (an end-of-chapter question asks students to work out the maximum sum for two causes A and B, and how the answer changes if they never share a mechanism).",
      "Phenylketonuria, often seen as purely genetic, is used to show that a 'genetic' disease is preventable by changing the environment (diet).",
      "Genes are not the only heritable influences: culture, family experiences of privilege or discrimination linked to race or ethnicity and to social power, wealth, education and access to healthy environments can be passed down and are hard to separate from genetic causes.",
      "End-of-chapter questions push students to criticise claims such as a disease being 'neither genetic nor environmental but multicausal', or 'half of cases linked to genes'."
    ],
    "notation": "None in Chapter 3. (Attributable fraction is defined in Chapter 4, but the claim that fractions can sum beyond 100% is made only in Chapter 3's box and questions.)",
    "reteach": "Picture a door with two locks. In an imaginary village, 10 people carry gene variant G, and everyone eats food F; illness occurs only with G plus F. All 10 carriers fall ill. Ask what share of cases is 'due to' G: remove G and all 10 are prevented, so 100%. Ask the same of F: remove F and all 10 are prevented, so again 100%. The total is 200%, and that is fine, because each case needed both keys. Now picture a second village where nobody eats F: there the disease looks 'environmental'; in a third where everyone carries G, it looks purely dietary.",
    "misreadings": [
      "Assuming causation divides into shares summing to 100% (for example '70% genetic, 30% environmental'). Correction: each component is responsible for every case whose pie contains it, so shares can each reach 100%.",
      "Assuming a genetic disease cannot be prevented by changing the environment. Correction: PKU-related cognitive delay is prevented by diet.",
      "Equating heritable with genetic. Correction: culture, wealth, education and experiences of discrimination are also passed down families.",
      "Reading 'multicausal' as 'neither genetic nor environmental'. Correction: it means both kinds of component usually act together in the same mechanism.",
      "Thinking only recent events count. Correction: earlier events with lingering effects (the old head injury) are components too."
    ]
  },
  "strength_of_cause": {
    "where": "Chapter 3, section \"Implications of the Causal Pie Model\", subsection \"Strength of Causes\"; Chapter 3, section \"Hill’s List of Standards for Inference\" and Table 3.1 (the 'strength' standard)",
    "terms": [
      "strength of a causal effect (as usually expressed): how many times higher the risk is in exposed than unexposed people, e.g. smoking multiplies lung cancer risk about tenfold but heart-attack risk only about twofold",
      "strong cause (population definition): a component cause that takes part in a large proportion of the cases of a disease in a population",
      "weak cause: a component cause that takes part in only a small proportion of cases"
    ],
    "core": "People commonly call smoking a strong cause of lung cancer (about ten times the risk) and a weaker cause of heart attack (about twice the risk). For a single case, though, the pie model recognises no strong or weak causes: every component that acted was needed, so a factor either was or was not a cause. Strength only makes sense for the burden of disease in a population, where the book defines a strong cause as one that takes part in a large share of cases. Defined this way, strength depends on how common the other causal factors are, so it is not a fixed or biological property. If smoking were eliminated, radon would account for a larger share of the remaining lung cancers and would appear stronger. Biology lies in which components make up a mechanism and how they interact; strength can shift between populations and over time.",
    "positions": [
      "For an individual case, labels like strong or weak do not apply; a factor was either a cause of that case or it was not.",
      "Strength is a population-level notion: the proportion of cases in which the factor plays a causal role.",
      "Because strength hinges on how common other causes are, it is not a biological constant; it can change across populations and over time.",
      "Radon example: removing smoking would make radon account for more of the remaining lung cancer, so it would seem to become stronger without any change in its biology.",
      "In discussing Hill's standards, the book rejects strength as a criterion: weak associations can be causal (cigarette smoking and coronary heart disease), strong ones can be non-causal (birth order and Down syndrome, fully explained by maternal age), and strength alone does not exclude bias."
    ],
    "notation": "Chapter 3 gives only multiplicative comparisons in words (about 10 times; about twice). The risk ratio, risk in exposed divided by risk in unexposed, is formalised in Chapter 4.",
    "reteach": "Same biology, two towns, invented numbers. Factor A causes disease only through the pie {A, B}. Background risk from other pies is 1% everywhere. In Town 1 only 5% of people have B, so among people with A the risk is about 6% versus 1% without A: roughly six times. In Town 2, 80% have B, so the risk with A is about 81% versus 1%: roughly eighty times. A did not change; its partner became common. Now the population view: if Town 2 later eliminated a different, unrelated cause of the disease, A would account for a bigger share of the cases left, and so would look stronger still.",
    "misreadings": [
      "Treating a factor's strength (e.g. a risk ratio) as a fixed biological property. Correction: it depends on how common the other causes are in that population.",
      "Believing a strong cause played a bigger role in an individual patient's disease. Correction: for one case every participating component was equally necessary.",
      "Concluding a weak association cannot be causal. Correction: smoking and coronary heart disease is a weak but causal association.",
      "Concluding a strong association must be causal. Correction: birth order is strongly linked to Down syndrome only because of maternal age.",
      "Assuming strength changes only if the factor itself changes. Correction: changes in other causes, including those in other pies, alter it."
    ]
  },
  "causal_interaction": {
    "where": "Chapter 3, section \"Implications of the Causal Pie Model\", subsection \"Interaction Between Causes\"; Chapter 11, sections \"Effect-Measure Modification\" and \"A Definition of Biologic Interaction\"",
    "terms": [
      "interaction (biologic or causal interaction): two or more component causes taking part in the same causal mechanism, so that they jointly cause a case",
      "statistical interaction: a departure from additivity on whatever scale a statistical model uses; it depends on the choice of scale or model",
      "effect-measure modification: the epidemiological counterpart of statistical interaction, where an effect measure varies across levels of another variable",
      "biologic independence: two causes act only in separate mechanisms; in risk terms, their risk differences add",
      "susceptibility: possessing one member of a pair of interacting causes, which makes a person prone to the effect of the second (Chapter 11)",
      "background occurrence: cases from mechanisms involving neither of the two factors studied (Chapter 11)"
    ],
    "core": "In the pie model, components act together to produce an effect, but acting together does not require acting at the same time. The head injury that impaired balance years earlier and the icy weather on the day both took part in the hip fracture, so they interacted despite the gap. Every component in a mechanism interacts with every other one, and each pie can be viewed as a set of interacting components. This gives interaction a biological meaning that differs from the usual statistical one. Chapter 11 develops this: biologic interaction either exists or not, whereas statistical interaction depends on the model's scale. Two causes of the same disease that act only in different pies cause different cases and do not interact. Under biologic independence, risk differences add.",
    "positions": [
      "Interacting causes need not act simultaneously; they may be years apart.",
      "All components within one causal mechanism interact with each other.",
      "The pie model offers a biological basis for interaction that differs from the traditional statistical view; the two should not be confused (Chapter 11).",
      "Chapter 11 states that some causal interaction occurs in every case of every disease, because causes act only under particular conditions (even among heavy smokers only about one in ten gets lung cancer).",
      "Two causes of the same disease are independent if they never share a mechanism; then each causes different cases.",
      "Biologic independence corresponds to additivity of risk differences; Chapter 11 notes the converse is not strictly guaranteed, because opposing interactions could cancel out.",
      "Knowing about interaction helps target prevention (Chapter 11 examples: aspirin and Reye's syndrome in children; alcohol and driving)."
    ],
    "notation": "Chapter 11: R_AB (risk with both A and B), R_A (A without B), R_B (B without A), R_U (neither; background). Risk from mechanisms needing both A and B is estimated as R_AB − R_A − R_B + R_U. Biologic independence: R_AB − R_U = (R_A − R_U) + (R_B − R_U). Dividing by R_U gives the risk-ratio form for case-control data: RR_AB − 1 = (RR_A − 1) + (RR_B − 1). These subtractions assume no confounding, low risks and no competing risks.",
    "reteach": "Timing: a seed planted in March and rain in September can both be needed for a plant to appear; they 'work together' despite six months apart. Measuring: with invented risks of 1% with neither factor, 3% with A only and 4% with B only, independence predicts 1% + 2% + 3% = 6% with both. If the observed risk with both is 12%, the extra 6% must come from pies that need A and B together. If the observed joint risk were 6%, the two would look independent on the risk-difference scale, even though a ratio model might report 'interaction'.",
    "misreadings": [
      "Thinking interacting causes must be present at the same moment. Correction: the old head injury interacted with weather on the day of the fall.",
      "Equating interaction with a product term in a regression model. Correction: that is statistical interaction, which depends on the model's scale; biologic interaction is about sharing a mechanism.",
      "Assuming any two causes of a disease interact. Correction: they interact only for cases in which both are in the same pie.",
      "Viewing interaction as a rare curiosity. Correction: the book argues it is present in every case, since every pie has several components.",
      "Judging interaction from a departure from multiplicative risk ratios. Correction: the book links biologic interaction to departure from additivity of risk differences."
    ]
  },
  "induction_time": {
    "where": "Chapter 3, section \"Implications of the Causal Pie Model\", subsection \"Induction Time\"; Chapter 3, box \"Is a Catalyst a Cause?\"; Chapter 5, section \"Exposure and Induction Time\"",
    "terms": [
      "induction period (induction time): the interval from the action of a given component cause to the action of the final component, when the disease occurs",
      "latent period: the interval from the occurrence of disease to its detection, by testing or by symptoms",
      "initiator and promotor (book's spelling): component causes of cancer acting early and late, respectively, in the mechanism",
      "catalyst: an agent that shortens the induction time of other causes; the book counts it as a cause",
      "preventive: an agent that lengthens the induction period of another cause and so postpones onset"
    ],
    "core": "Components of a pie seldom act together, so there is usually a gap between a component's action and the completion of its mechanism. The induction period runs from a component's action until the last component acts, at which point the disease has occurred; for the last component it is zero. In the hip example the head injury had an induction time of years, the choice of shoes minutes or hours, and the gust of wind seconds. Prenatal DES exposure and later vaginal clear cell adenocarcinoma show an induction time of over 15 years. Induction time therefore belongs to a cause-effect pair, not to a disease. After occurrence, disease may go unnoticed for a while: this is the latent period, which better detection can shorten, whereas early detection cannot shorten induction. During induction, prevention is still possible.",
    "positions": [
      "It is wrong to say a disease has a long or short induction time; induction time is defined only for a specific component cause and its effect.",
      "For the final component cause, the induction time is always zero.",
      "Calling cancer a disease with a long induction time is a misconception: late-acting components such as promotors have short induction times.",
      "Earlier detection shortens the latent period, not the induction period, because no disease exists to detect until induction ends.",
      "During the induction period, the disease can still be prevented by stopping the mechanism from being completed.",
      "In practice induction and latent periods can be hard to separate; for slowly growing cancers, a long latent period can make induction look longer than it is.",
      "For an individual case the exact induction time is usually unknowable, but research data can characterise the induction period linking a cause to a disease in general.",
      "A catalyst that speeds the action of other causes is itself a cause: it changes when the disease occurs, and possibly whether it occurs at all (the person might not survive the extra years). Likewise, postponing onset counts as prevention, as when we speak of preventing death.",
      "Chapter 5: in cohort studies, person-time during a hypothesised induction period after exposure should be either ignored or counted with unexposed person-time; when the induction time is unknown, analyses can be repeated under several assumed induction times."
    ],
    "notation": "No formula. Conceptual timeline: component acts → (induction period) → final component acts and disease occurs → (latent period) → detection.",
    "reteach": "A worked timeline with invented ages. Component X acts at age 20, component Y at 45, and the final component Z at 50, completing the pie: disease begins at 50. Induction time is 30 years for X, 5 years for Y and zero for Z, so it is the same disease with three different induction times. The tumour is found at 53, so the latent period is 3 years. A new scan finds it at 51: latency drops to 1 year, but every induction time is unchanged. Had someone removed Z at 49, the disease would never have started; that is prevention during induction.",
    "misreadings": [
      "Assigning an induction time to a disease (e.g. 'cancer has a 20-year induction'). Correction: induction time belongs to a specific cause-effect pair.",
      "Counting the whole time from exposure to diagnosis as induction. Correction: part of it is the latent period after disease has occurred.",
      "Believing screening shortens induction. Correction: it shortens only the latent period.",
      "Thinking nothing can be done once an early component has acted. Correction: prevention is possible until the final component acts.",
      "Arguing a catalyst is not a cause because the disease would have happened anyway. Correction: timing is part of the event, and the later disease might never have occurred.",
      "Treating postponement as different from prevention. Correction: the book equates them."
    ]
  },
  "scientific_inference": {
    "where": "Chapter 3, section \"The Process of Scientific Inference\" (subsections \"Induction\", \"Refutationism\", \"Hill’s List of Standards for Inference\"; Table 3.1); Chapter 3, section \"Generalizing Scientific Results to Epidemiologic Theory\"; Chapter 5, box \"Representativeness of Cases and Controls\"",
    "terms": [
      "induction (logic): reasoning from repeated observations to a general statement; unrelated to the induction period",
      "deduction: reasoning from definitions and axioms by rules of logic, giving certain conclusions, as in mathematics",
      "refutationism: Popper's view that hypotheses can be corroborated but never proved, while they can be refuted by deductive logic",
      "corroboration: support that evidence lends to a hypothesis without proving it",
      "conjecture and refutation: the cycle of proposing a hypothesis and subjecting it to tests that could falsify it",
      "crucial test: a study in which competing hypotheses make opposite predictions",
      "Hill's standards (often mislabelled 'Hill's criteria'): strength, consistency, specificity, temporality, biologic gradient, plausibility, coherence, experimental evidence and analogy",
      "temporality: the cause must come before the effect",
      "scientific generalisation: building a theory, grounded in biological understanding, that explains the evidence and predicts what happens elsewhere",
      "statistical generalisation: inferring the features of a specific target population from a sample of it",
      "applied epidemiology: describing the health of particular populations or applying established knowledge to specific settings"
    ],
    "core": "The book holds that neither checklists nor statistical methods settle whether a relation is causal; this is a question about the scientific method. Induction, championed by Bacon, generalises from observed patterns, but Hume showed it lacks logical force and its defence is circular. Popper replied that hypotheses can be corroborated, never proved, but can be refuted; one contrary observation (water boiling at 94 °C in Denver) outweighs many confirmations. Science thus proceeds by bold conjecture and severe testing, as in the toxic shock study where competing hypotheses made opposite predictions. Refutation is itself fallible, being open to bias, and critics include Kuhn, Feyerabend and Haack. Hill's list is not a set of criteria; only temporality is truly causal. Scientific generalisation rests on biological theory, not statistical representativeness of study participants.",
    "positions": [
      "Whether an association is causal is not answered by checklists or by statistics; it is a matter of applying the scientific method.",
      "Hume: induction assumes the future will resemble the past, and justifying it by its past success is circular.",
      "Popper's asymmetry: confirming observations only corroborate, while a single sound contrary observation can refute; scientists should seek crucial tests rather than repeat initial observations.",
      "All scientific knowledge is tentative, a body of hypotheses not yet refuted that explain current observations; posing competing hypotheses and testing them against each other is recommended.",
      "Toxic shock syndrome: the chemical-toxin hypothesis predicted higher risk with frequent tampon changes, the bacterial-culture hypothesis predicted lower risk; finding higher risk with infrequent changes refuted the chemical theory.",
      "Critics point out that a refutation is never logically guaranteed, since it rests on fallible theories, assumptions and observations (in epidemiology, an unrecognised bias). Kuhn saw truth as scientific consensus, Feyerabend saw science as methodless anarchy, and Haack likened inquiry to solving a crossword. The book nonetheless credits refutationism with encouraging bold, testable theories and healthy scepticism.",
      "Hill called his list 'standards' and resisted the word 'criteria'; he meant them as considerations when reviewing evidence. The list derives from the 1964 US Surgeon General's report, and such lists trace back to J. S. Mill.",
      "Strength fails as a criterion (weak associations can be causal, strong ones confounded); specificity misleads because one cause, like tobacco smoke, can have many effects; biologic gradient can be spurious (birth order and Down syndrome via maternal age) and some causes have thresholds; consistency can be produced by a shared bias; plausibility, coherence and analogy are vague or subjective; experimental evidence is often unobtainable.",
      "Temporality is the only true causal criterion, since a cause preceding its effect is built into what a cause is, though the order can be hard to establish (does stress cause overeating or the reverse?).",
      "Checklists lend a deceptive, mindless authority to a creative process; the book prefers conjecture and refutation. Hill's points can still help in the context of a specific hypothesis (Weiss: sigmoidoscopy's benefit should be specific to cancers within the scope's reach).",
      "Scientific generalisation is not a statistical exercise: a study of radiation and cancer in one city need not be repeated in another, and mouse studies inform human biology despite no statistical representativeness, relying instead on biological representativeness.",
      "Statistical representativeness is appropriate for applied epidemiology that describes a specific population, such as estimating how many people in a country need dialysis.",
      "Chapter 5 adds that cases in a case-control study need not represent all cases, and controls should represent the source population of the cases, not the whole non-diseased population."
    ],
    "notation": "None.",
    "reteach": "A detective has two suspects. A food-poisoning outbreak follows a wedding. Hypothesis 1 blames the salad; hypothesis 2 blames the ice. They make different predictions: if it was the ice, guests who skipped the salad but had iced drinks should fall ill. Fifty ill salad-eaters do not settle it, because most guests ate salad and had ice. One well-chosen comparison that could sink one hypothesis is worth more than many agreeing anecdotes, yet the detective must also ask whether that comparison is itself flawed. For generalising: once the guilty bacterium is known, nobody needs a representative sample of other weddings to expect it to cause illness elsewhere.",
    "misreadings": [
      "Thinking many confirming studies prove a causal hypothesis. Correction: they only corroborate it; a sound contrary result can carry more weight.",
      "Using Hill's list as a checklist that certifies causation. Correction: they are considerations, not criteria, and only temporality is required.",
      "Assuming a strong association or a dose-response gradient proves causation. Correction: both can arise from confounding, as with birth order and Down syndrome.",
      "Assuming specificity is needed. Correction: one cause can have many effects.",
      "Treating a refutation as logically certain. Correction: the refuting study may itself be biased.",
      "Believing results apply only to populations that the study sample statistically represents. Correction: causal generalisation relies on biological understanding, as with animal research.",
      "Confusing induction (the logic) with induction time. Correction: the book explicitly separates them."
    ]
  },
  "risk": {
    "where": "Chapter 4, section \"Risk and Incidence Proportion\" (including the box \"Attack Rate and Case Fatality Rate\"); Chapter 4, section \"The Relation between Risk and Incidence Rate\" (life-table estimation of risk)",
    "terms": [
      "risk: the probability, read on a 0-to-1 scale, that a new case of the outcome arises during a stated period",
      "incidence proportion: the book's name for the average risk of a group, estimated as the share of the group who become cases during the period",
      "competing risks: removal of people from follow-up by death from some other cause, so we cannot know whether they would have developed the outcome",
      "loss to follow-up: people who cannot be traced (they move, or withdraw), leaving their outcome unknown",
      "attack rate: the risk of getting a condition during an epidemic period; the period is usually implied by the disease's biology rather than stated",
      "secondary attack rate: the attack rate in susceptible contacts of the primary (first-wave) cases",
      "case-fatality rate: the proportion of people with a disease who die of it (sometimes all deaths among the patients are counted); the population at risk is the cases",
      "censored: describes a person whose follow-up ends early through loss or death from another cause; their information is used up to that point"
    ],
    "core": "In the book, risk is a probability: the chance that a person develops the disease within a specified period. For one person this is of little use, since they either get the disease or not, so we estimate the average risk of a group as the proportion A/N who become cases; this is the incidence proportion. A risk has no meaning unless the period it covers is stated. Risk is cumulative: it starts at zero, can only rise or stay level as the period lengthens, and cannot exceed 1. Over long follow-up it is rarely directly measurable, because some people die of other causes (competing risks) or are lost, and their outcome is unknown. Short studies (the one-year Salk trial) can ignore this. Otherwise one can estimate rates and convert them to risks, or use a life table. The book therefore treats risk as often a hypothetical quantity.",
    "positions": [
      "A risk figure without its time period cannot be interpreted; the book illustrates this with a percentage risk of cardiovascular death quoted for 60-year-old women with no period attached.",
      "The group proportion is only an estimate of an individual's risk; the individual's actual outcome is 0 or 1.",
      "Risk is easy for non-specialists to understand, which is its main advantage over the incidence rate.",
      "Risk is cumulative and cannot fall during the period; the shape of its rise over time can differ (fast early then flat, e.g. after immunity develops; or slow then accelerating, e.g. long induction time or ageing).",
      "Death from any cause is the only outcome without a competing risk; every other outcome faces the problem.",
      "Because of competing risks and losses, risks are often best thought of as hypothetical rather than directly observed quantities.",
      "Attack rate and case-fatality rate are really risks (proportions), and their usual lack of a stated time frame makes them hard to interpret, especially the case-fatality rate for long-lasting diseases."
    ],
    "notation": "Average risk (incidence proportion) = A/N, where N people are followed and A of them develop the disease during the period. Range [0, 1]; no units (Table 4.1). Attack rate = cases during the epidemic period / population at risk. Case-fatality rate = deaths from the disease / people with the disease. Life-table route (see risk_rate_relation): overall risk = 1 - cumulative survival probability.",
    "reteach": "Think of a weather forecast that says 'a 40% chance of rain' but never says whether it means the next hour or the next month. You cannot act on it. Risk is the same. Made-up example: 200 hostel students, 20 catch chickenpox during a 10-week term. The risk is 20/200 = 0.10 over 10 weeks. Over the first day it would be close to zero; over the whole year it would be higher, never lower, because cases only add up. And if 15 students left mid-term, we would not know whether some of them would have caught it, so 20/200 would understate the true 10-week risk.",
    "misreadings": [
      "'The risk is 2%' is a complete statement. Correction: a risk must state the period it covers; the same population has different risks over a week, a year and a lifetime.",
      "The group proportion is each member's true risk. Correction: it is an average used as an estimate; each person's actual outcome is 0 or 1.",
      "Risk can go down later in follow-up. Correction: it is cumulative over the period, so it can only stay the same or increase.",
      "People who died of other causes can simply stay in the denominator as non-cases. Correction: some of them might have become cases had they survived, so this understates the risk; competing risks need rate-based or life-table methods unless follow-up is short.",
      "Attack rates and case-fatality rates are rates. Correction: despite the names they are proportions (risks) without units."
    ]
  },
  "person_time": {
    "where": "Chapter 4, section \"Incidence Rate\"",
    "terms": [
      "person-time: the total of the follow-up time that each person spends at risk, added across everyone (e.g. person-months, person-years)",
      "time at risk: any time during which, if the event happened, it would be counted in the rate's numerator",
      "mortality rate: an incidence rate where the event counted is death",
      "lost to follow-up: no longer traceable; time stops counting at that point because any later event would go unrecorded"
    ],
    "core": "An incidence rate's denominator counts time, not people: each person's time under observation while at risk is added up across the group. The book gives one unifying rule. Count every moment during which the person could have an event that would be counted in the numerator. So a person stops contributing time when they have a non-recurring event, when they have the first event if only first occurrences are being studied, when they die of a competing cause, when they are lost to follow-up, or when the study ends. For an outcome that can recur and where every episode is counted, such as upper respiratory infections, time keeps accumulating after recovery. The book's five-person diagram for leukaemia deaths shows each of these cases. Rates treat a unit of time the same whether it comes from one person or from many.",
    "positions": [
      "The test for including any stretch of time is whether an event in that stretch would be counted in the numerator.",
      "Time after loss to follow-up is excluded because an event then would never reach the investigator.",
      "Whether time continues after an event depends on whether the event can recur and whether repeat events are counted.",
      "A year of follow-up from one person and a year assembled from several people count the same in the denominator."
    ],
    "notation": "Person-time = sum over all persons of the time each was at risk. Book example: 158 person-months = 158/12 = about 13.17 person-years. (In the supplied text the book's displayed equation for the rate's denominator was an image; it is described as summed time at risk.)",
    "reteach": "Picture a car-park ticket for each person: the clock runs only while they are 'parked' at risk. Made-up cohort, outcome = first heart attack: Asha is followed 3 years, no event (3 years). Ben moves away after 1 year (1 year; stop when lost). Chen has a heart attack at 2 years (2 years; stop at the first event). Dev dies in a road crash at 0.5 years (0.5 years; he can no longer have the outcome). Total = 6.5 person-years with 1 case. If the outcome were colds and every cold counted, Chen-type people would keep their clock running after recovery.",
    "misreadings": [
      "Keep counting a person's time after a non-recurring or first-only event. Correction: once they cannot produce another counted event, their time at risk ends.",
      "Count time after someone is lost to follow-up. Correction: an event then would not be recorded, so that time is not at risk for the numerator.",
      "Always stop time at the first event. Correction: if repeat episodes are counted (e.g. respiratory infections), time continues after recovery.",
      "100 person-years means 100 people each followed for one year. Correction: any combination of people and durations adding to 100 years gives the same denominator."
    ]
  },
  "incidence_rate": {
    "where": "Chapter 4, section \"Incidence Rate\" (and Table 4.1)",
    "terms": [
      "incidence rate: the number of new cases divided by the total person-time at risk; it measures the rate at which cases occur, not a proportion of people",
      "mortality rate: an incidence rate where the event is death",
      "steady state: rates that stay constant over time",
      "waiting time: under a steady state, the mean time before the event happens; equal to the reciprocal of the incidence rate",
      "expectation of life (expected survival time): the waiting time that corresponds to a total mortality rate",
      "annual incidence: the common '50 cases per 100,000' style, which the book reads as 50 per 100,000 person-years"
    ],
    "core": "The book introduces the incidence rate to handle competing causes of death and people lost from follow-up. Its numerator, the number of new cases, is the same as for risk, but its denominator is total person-time at risk. It is therefore not a probability. Its smallest value is zero, it has no upper limit, and its units are 1/time. Its numerical value depends on the time unit chosen, as a speed can be in km/h or m/s. The book compares a rate to speed: it is an instantaneous quantity. A rate expressed per person-year need not have been measured over a year and may describe only a short interval. The rate is harder to grasp than risk. One interpretation works only in a steady state: the reciprocal of the rate is the average waiting time to the event. For example, 3.57 per person-year corresponds to about 0.28 years.",
    "positions": [
      "The speedometer analogy: a rate applies at a moment, and the time unit in the denominator says nothing about how long the measurement took or the period it describes.",
      "'50 cases per 100,000' annual incidence is a clumsy way of writing a rate, like calling a speed an 'hourly distance'; it should be read as 50 per 100,000 person-years.",
      "A rate above 1 is not an error, because a rate is not a proportion of the population.",
      "The waiting-time interpretation needs a steady state; for total mortality it would give expectation of life (1 / 11 per 1,000 per year = 90.9 years), but because real mortality rates change over such long spans, it is not a practical way to estimate life expectancy.",
      "Risk communicates more clearly than rate; hence the interest in converting rates to risks."
    ],
    "notation": "Incidence rate (I) = A / total person-time at risk. Units: time^-1 (written e.g. yr^-1). Range [0, infinity] (Table 4.1). Book example: 47 cases / 158 person-months, about 0.30 per person-month; the same rate is 47 / 13.17 person-years = 3.57 per person-year = 3.57 yr^-1. Waiting time (steady state) = 1/I, e.g. 1/3.57 yr^-1 = 0.28 yr; 1/(11/1,000 yr^-1) = 90.9 yr.",
    "reteach": "Build it up in steps. Step 1: count events (12 falls in a care home). Step 2: add up how long residents were watched (400 resident-months in total). Step 3: divide: 12/400 = 0.03 falls per resident-month. Step 4: change units if you like, just as 60 km/h is 1 km per minute: 0.03 per month x 12 = 0.36 per resident-year. Nothing about the rate changed, only the units. Step 5: if the rate stayed steady, the average wait until a fall would be 1/0.36, about 2.8 years. Notice the rate could exceed 1 if residents fell often; it counts events per unit of time, not people.",
    "misreadings": [
      "A rate above 1 must be a mistake. Correction: rates are not proportions; they have no upper limit.",
      "'Per person-year' means the rate was measured over a year, or applies to a year. Correction: the time unit is arbitrary; the rate is an instantaneous concept, like speed.",
      "The incidence rate is the proportion of people affected. Correction: it is cases divided by person-time.",
      "The reciprocal of any rate gives the average time to the event. Correction: only under steady-state conditions, which often do not hold."
    ]
  },
  "risk_rate_relation": {
    "where": "Chapter 4, section \"The Relation between Risk and Incidence Rate\" (Tables 4.2-4.4, Figure 4.3); Chapter 4, section \"Relation between Risk Ratios and Rate Ratios\"",
    "terms": [
      "Equation 4.1: the simple conversion of a rate to a risk by multiplying the rate by the length of the period",
      "exponential decay: under a constant death rate, the proportion still alive falls along an exponential curve; cumulative deaths are its complement",
      "survival analysis: calculating risk over a period in which the rate changes, by working through short sub-intervals",
      "life table: a table that gives the probability of surviving each successive interval and multiplies them together",
      "effective number at risk: in a life table, the number at risk minus half of those censored in the interval (assuming censoring is spread evenly)",
      "censored: follow-up ended by loss or death from another cause"
    ],
    "core": "Because risk is easier to interpret, the book shows how to turn a rate into a risk. The simplest method (Equation 4.1) multiplies the rate by the length of the period. Two checks: the units work, since 1/time multiplied by time leaves no units. The ranges do not, since the product can exceed 1 while a risk cannot. So Equation 4.1 is only an approximation, adequate while the resulting risk is below about 20%. With 11 deaths per 1,000 person-years for 20 years, it predicts 220 deaths per 1,000. Allowing for the shrinking population gives about 197, because people who have died cannot die again. With a constant rate, the number surviving follows exponential decay. When rates change, survival is calculated interval by interval in a life table: the interval survival probabilities are multiplied, and risk is 1 minus that product. Censoring is handled through an effective number at risk.",
    "positions": [
      "Always check both units and numeric ranges of an equation; the range check reveals that risk = rate x time cannot hold everywhere.",
      "Equation 4.1 works well when the computed risk is below about 20% and deteriorates above that.",
      "Even in the first year the expected deaths are slightly fewer than rate x population, because the population starts shrinking with the first death.",
      "Equation 4.1 assumes the rate is constant over the period; when it changes, split time into intervals short enough for a roughly constant rate, but not so short that the data per interval become too sparse.",
      "A life table that ignores competing causes of death gives a hypothetical risk (as if the cause studied were the only one), which overstates the real proportion dying of that cause; it also assumes that rates taken from a cross-section at one time apply to a cohort across its lifetime.",
      "Converting rates to risks is one of the book's two ways of handling competing risks (the other is life-table analysis)."
    ],
    "notation": "Equation 4.1: Risk ≈ I x t (I = incidence rate, t = length of the period); valid approximately while the result is below about 0.20. Units check: (1/time) x time = no units. Book example: 8/10,000 yr^-1 x 1 yr = 0.0008; for 0.5 yr = 0.0004. 11/1,000 yr^-1 x 20 yr = 0.22 (220 deaths), versus about 197.5 when shrinkage is allowed for (Table 4.2). Life table: risk in interval = deaths in interval / number at risk (or effective number at risk = number at risk - 1/2 x censored); interval survival = 1 - interval risk; cumulative survival = product of interval survivals; overall risk = 1 - cumulative survival (e.g. 1 - 0.98378 = 1.6% for motor-vehicle death to age 85, Table 4.3). Chapter 4 describes the constant-rate curve as exponential decay but does not print an explicit formula of the form 1 - exp(-I t).",
    "reteach": "Picture popcorn. Suppose that each minute, 10% of the kernels still unpopped will pop. The naive sum says 10 minutes x 10% = 100% popped. But each minute there are fewer unpopped kernels left to pop. After minute 1, 90% remain; after minute 2, 90% of 90% = 81%; after 10 minutes about 0.9^10 = 35% remain, so about 65% have popped, not 100%. Over 1 or 2 minutes the naive sum (10%, 20%) is close to the truth (10%, 19%). The error grows as the cumulative proportion grows. This multiply-the-survivals logic is exactly how a life table works.",
    "misreadings": [
      "Risk = rate x time holds for any period. Correction: only while the resulting risk is small (below about 20%); otherwise it overstates risk and can even exceed 1.",
      "The shortfall happens because the rate falls over time. Correction: it happens even at a constant rate, because the population at risk shrinks as cases occur.",
      "A life-table risk is the real-world risk. Correction: if competing causes are ignored, it is a hypothetical risk that overstates the actual one, and it assumes current rates apply across the whole follow-up.",
      "Shorter life-table intervals are always better. Correction: they improve accuracy only while each interval still has enough data to estimate a meaningful rate."
    ]
  },
  "prevalence": {
    "where": "Chapter 4, section \"Prevalence Proportion\" (including the box \"Prevalence of Characteristics\")",
    "terms": [
      "prevalence proportion (prevalence): the proportion of a population currently diseased at a particular moment; it measures status, not onset",
      "prevalence odds: the prevalence divided by one minus the prevalence",
      "odds: in general, a proportion divided by one minus that proportion",
      "steady state: incidence rates and disease duration stable over time",
      "average duration of disease (D-bar): the mean length of time people spend in the diseased state",
      "exposure prevalence: the share of people exposed to a given agent",
      "prevalence at birth: the proportion of live-born infants with a condition (e.g. ventricular septal defect), used in place of incidence for birth defects"
    ],
    "core": "Risk and rate count disease onsets. Prevalence instead describes status: the proportion P/N of a population who have the disease at a particular moment. For example, 1,200 of 10,000 women with hypertension on one date gives 12%. Prevalence depends on how often new cases arise and how long the disease lasts. A condition that resolves quickly, or kills quickly (aortic haemorrhage), can have low prevalence despite high incidence. Chronic but survivable conditions such as diabetes or glaucoma build up high prevalence. In a steady state, the prevalence odds equal the incidence rate times the mean duration. When prevalence is below about 0.1, prevalence itself is roughly that product. Because prevalence mixes incidence and duration, it is less suited to studying causes than to measuring disease burden, for example the need for dialysis. It is still used for birth defects and for conditions with insidious onset.",
    "positions": [
      "Prevalence measures disease status (present/absent at a time), whereas risk and rate measure onsets.",
      "Prevalence is driven by both incidence and duration; duration can be short through quick recovery or quick death.",
      "Prevalence is most useful for administration and planning (disease burden, service needs), less so for causal research.",
      "A factor associated with prevalent cases may cause the condition, or may only lengthen it (e.g. by helping embryos with a heart defect survive to birth).",
      "For birth defects, incidence would require identifying the population of embryos at risk, which is usually impossible, so prevalence at birth is used instead.",
      "For conditions whose onset is hard to date (diabetes, multiple sclerosis), prevalence may be the practical measure.",
      "The steady-state relation does not apply to age-specific prevalence, where the duration term would be the time spent in that age band, not the total duration of disease.",
      "Check units and ranges: I x D-bar has no units, but its range [0, infinity] fits the prevalence odds, not the prevalence proportion, which is why the simple form holds only for small prevalences.",
      "Prevalence also describes non-disease characteristics (smoking, exposure, blood group)."
    ],
    "notation": "Prevalence proportion = P/N (P people with disease in a population of N at a given time). Odds = proportion / (1 - proportion); e.g. 0.75 -> 3; 0.20 -> 0.25. Equation 4.2 (steady state): P/(1 - P) = I x D-bar, where I = incidence rate and D-bar = average duration of disease. Equation 4.3 (steady state, small prevalence, e.g. < 0.1): P ≈ I x D-bar. Equation 4.4: P = (I x D-bar) / (1 + I x D-bar).",
    "reteach": "Use a bathtub. The tap is incidence (new cases flowing in), and the drain is recovery or death (cases flowing out). The water level is prevalence. Made-up numbers: new cases arrive at 2 per 1,000 person-years and each case lasts 10 years on average. Then I x D-bar = 0.002 x 10 = 0.02, so prevalence is about 2% (exactly 0.02/1.02). Now a new drug keeps people alive twice as long without curing them: duration becomes 20 years, the product becomes 0.04, and prevalence is about 4%. Incidence has not changed at all. A cure that halves duration would do the opposite.",
    "misreadings": [
      "Rising prevalence means rising incidence. Correction: longer duration (e.g. better survival) can raise prevalence with no change in incidence.",
      "Prevalence is a kind of incidence. Correction: it counts existing cases (status), not new onsets, and has no units.",
      "P ≈ I x D-bar always. Correction: it needs a steady state and a small prevalence; the exact steady-state relation is for the prevalence odds (Equation 4.2), and Equation 4.4 gives P for any value.",
      "A factor more common among prevalent cases must cause the disease. Correction: it might only prolong the disease or improve survival with it.",
      "The steady-state formula can be applied to age-specific prevalence. Correction: the book says it does not hold there, because the duration would be the time spent in that age group."
    ]
  },
  "risk_ratio": {
    "where": "Chapter 4, section \"Measures of Association\" (Table 4.5); Chapter 4, section \"Relation between Risk Ratios and Rate Ratios\" (Table 4.6); Chapter 4, section \"Measures of Effect\" (including the box \"When Risk Does Not Mean Risk\"); Chapter 4, section \"Interpreting Relative Measures of Effect\"; Chapter 4, section \"Examples\"",
    "terms": [
      "measure of association: a quantity that compares disease occurrence between groups (e.g. exposed and unexposed)",
      "risk ratio (RR): the risk in the exposed divided by the risk in the unexposed",
      "relative measures: ratio-based comparisons (risk ratio, incidence rate ratio, odds ratio)",
      "relative effect: strictly, the risk difference divided by the unexposed risk, which equals RR - 1",
      "relative risk: a loose term used for either a risk ratio or a rate ratio; the book prefers the specific names"
    ],
    "core": "The risk ratio divides the risk among the exposed by the risk among the unexposed. It has no units and runs from 0 to infinity. A value of 1 means equal risks; above 1, higher risk in the exposed; below 1, lower. Its ceiling is 1 divided by the unexposed risk. In the cholera example, the unexposed risk is 0.44, so the RR cannot exceed about 2.3, and the observed value is 1.96. The RR measures association. It becomes an effect measure only when the groups are comparable. The book defines the relative effect strictly as the risk difference divided by the unexposed risk, which equals RR - 1, so 1.96 means 96% greater risk. In practice people quote the RR itself, and readers should remember that 1 means no effect. A large relative effect can still matter little for public health if the disease is rare.",
    "positions": [
      "Strictly, the relative effect equals RR - 1, parallel to the percentage return on an investment, so that no effect corresponds to zero; an RR of 3 is twice the effect of an RR of 2.",
      "A fivefold increase means RR = 5; a 10% increase means RR = 1.1; a 120% increase means RR = 2.2.",
      "Relative effects show how much of the disease among the exposed is a consequence of exposure; public-health impact should be judged with absolute measures.",
      "Do not say 'risk' when you mean 'risk ratio' or 'effect': a smaller RR in older people (asbestos example) does not mean a smaller risk from the exposure, since the risk difference is larger in older adults because baseline lung-cancer risk rises steeply with age.",
      "Prefer the specific terms 'risk ratio' or 'rate ratio' to 'relative risk', though the general term has some justification when risks are small and the two ratios coincide.",
      "Because risk cannot exceed 1, the RR is capped at 1/Risk0, and it diverges from the rate ratio when risks are large."
    ],
    "notation": "RR = Risk1 / Risk0 = (A1/N1) / (A0/N0), subscript 1 = exposed, 0 = unexposed. Range [0, infinity]; no units (Table 4.5). Maximum RR = 1/Risk0. Relative effect = RD / Risk0 = (Risk1 - Risk0)/Risk0 = Risk1/Risk0 - 1 = RR - 1 (Equation 4.5). Book examples: 0.25 vs 0.10 gives RR 2.5, relative effect 1.5 (150%); Table 4.6 RR = 0.86/0.44 = 1.96 over 10 days, relative effect 0.96.",
    "reteach": "Build it from counts. Made-up: 100 exposed people, 30 cases; 100 unexposed, 10 cases. Risks are 0.30 and 0.10. Divide: RR = 3. Read it as 'three times the risk'. The relative effect is 3 - 1 = 2, i.e. 200% more risk, so 'no effect' sits at RR 1. Now see the ceiling. If the unexposed risk had been 0.50, even an exposure that made everyone ill could give at most 1.00/0.50 = 2. So a modest RR can come from a very harmful exposure when the baseline risk is high. And RR = 3 with risks of 3 vs 1 per million adds almost no cases.",
    "misreadings": [
      "A smaller RR in one subgroup means the exposure adds less risk there. Correction: the RD can be larger where baseline risk is high; say 'risk ratio' or 'effect', not 'risk'.",
      "'A 120% increase' means RR = 1.2. Correction: it means RR = 2.2 (relative effect = RR - 1).",
      "A large RR means a big public-health problem. Correction: impact depends on absolute risks; a 10-fold ratio for a very rare disease may matter less than a doubling of a common one.",
      "Any observed RR is a causal effect. Correction: only when the comparison groups are comparable.",
      "RR can be any size whatever the baseline. Correction: it cannot exceed 1/Risk0."
    ]
  },
  "rate_ratio": {
    "where": "Chapter 4, section \"Measures of Association\" (Table 4.5); Chapter 4, section \"Relation between Risk Ratios and Rate Ratios\"; Chapter 4, section \"Examples\" (Table 4.7)",
    "terms": [
      "incidence rate ratio (IRR): the incidence rate in the exposed divided by the incidence rate in the unexposed",
      "instantaneous risk ratio: the book's description of the IRR, the value the risk ratio approaches as the time interval shrinks towards zero",
      "relative risk: a general label sometimes applied to either ratio (risk-based or rate-based)"
    ],
    "core": "The incidence rate ratio divides the rate among the exposed by the rate among the unexposed. Any units cancel, and it ranges from 0 to infinity, with 1 meaning equal rates. Rates and risks are not directly comparable, but their ratios can be. If the rates are constant and the period short enough that risks stay below about 0.2, each risk is roughly rate times time, the time cancels, and the risk ratio is about equal to the rate ratio. As risks grow, they diverge. The risk ratio is capped at 1/Risk0, but the rate ratio is not. In the cholera data the risk ratio is 1.96 and the underlying rate ratio is 3.4. As the interval shrinks towards zero, the risk ratio approaches the rate ratio, so the book calls the IRR an instantaneous risk ratio. Radiation and breast cancer: 14.6 vs 7.9 per 10,000 person-years gives IRR 1.86.",
    "positions": [
      "Risk ratio and rate ratio are nearly equal when risks are small (short periods or low rates); shorter periods and lower rates bring them closer together.",
      "When baseline risk is high, the risk ratio is held down by its ceiling while the rate ratio is not, so the two can differ substantially.",
      "The IRR can be described as an instantaneous risk ratio.",
      "'Relative risk' (and the abbreviation RR) is used loosely for either ratio; the specific terms are preferred because they say what data the ratio comes from.",
      "A high rate ratio does not by itself mean a high risk among the exposed: the disease may still be rare in absolute terms."
    ],
    "notation": "IRR = I1 / I0, where each I = cases / person-time in that group. Range [0, infinity]; no units (Table 4.5). Under constant rates and small risks: Risk1/Risk0 ≈ (I1 x t)/(I0 x t) = I1/I0. Book examples: Table 4.7 IRR = 14.6/7.9 = 1.86 (relative effect 0.86, i.e. 86% greater rate); Table 4.6 RR 1.96 vs underlying IRR 3.4.",
    "reteach": "Two clocks ticking. Made-up: miners develop a lung disease at 3 per 1,000 person-years and clerks at 1 per 1,000 person-years, so IRR = 3. Over one year, the risks are about 0.003 and 0.001: the risk ratio is also about 3, because risks this small are close to rate x time. Now imagine a much commoner outcome where the clerks' risk over the study period is already 0.6. Even if every miner became ill, the risk ratio could not exceed 1/0.6, about 1.7, although the underlying rate ratio could still be 3. Small risks: the ratios agree. Large risks: the risk ratio is squeezed towards 1.",
    "misreadings": [
      "Risk ratio and rate ratio are always interchangeable. Correction: only when risks are small; with large risks the risk ratio is pulled towards 1 compared with the rate ratio.",
      "The rate ratio has units of 1/time. Correction: the units cancel in a ratio; it is the rate difference that carries units.",
      "'Relative risk' is a third, distinct measure. Correction: it is a loose label that can mean either ratio.",
      "A rate ratio of 10 means exposed people have a high risk. Correction: it is a relative comparison; the disease may remain rare among the exposed."
    ]
  },
  "risk_difference": {
    "where": "Chapter 4, section \"Measures of Association\" (Table 4.5); Chapter 4, section \"Measures of Effect\" (including the box \"When Risk Does Not Mean Risk\"); Chapter 4, section \"Examples\"",
    "terms": [
      "risk difference (RD): the risk in the exposed minus the risk in the unexposed, over the same period",
      "incidence rate difference (IRD): the incidence rate in the exposed minus that in the unexposed",
      "absolute measures: difference-based comparisons (RD, IRD)",
      "attributable risk: an older name for the RD, reflecting the extra risk caused by exposure",
      "attributable rate: an older name for the IRD"
    ],
    "core": "The risk difference subtracts the unexposed risk from the exposed risk. Like risk, it has no units, it must be tied to a stated period, and both groups must be compared over the same length of time. It ranges from -1 to +1. The rate-based version, the incidence rate difference, has units of 1/time and ranges from minus to plus infinity. These are absolute measures. When the groups are comparable, they measure the absolute effect of exposure: the extra (or, for a protective exposure, the reduced) amount of disease that the exposure causes. Older texts therefore called them the attributable risk and attributable rate. The book holds that the public-health implications of an exposure should be judged by absolute effects. Examples: RD = 0.86 - 0.44 = 0.42 over 10 days for low versus high antibody titre; IRD = 6.7 per 10,000 person-years for radiation and breast cancer.",
    "positions": [
      "Public-health importance should be assessed with absolute effect measures, because they express the added or prevented disease burden.",
      "Always give the period for an RD, and compare equal periods in the two groups.",
      "The RD is an effect measure only when comparability between groups has been achieved; it then assumes the exposed would have had the unexposed risk had they not been exposed.",
      "Case-control studies usually give only relative measures directly, but these can be turned into absolute ones by using the overall disease risk or rate in the population.",
      "An exposure can have a smaller risk ratio but a larger risk difference in one subgroup than another (asbestos in older vs younger adults)."
    ],
    "notation": "RD = Risk1 - Risk0 = A1/N1 - A0/N0; range [-1, +1]; no units. IRD = I1 - I0; range [-infinity, +infinity]; units 1/time (Table 4.5). Book examples: 0.25 - 0.10 = 0.15; Table 4.6 RD = 0.86 - 0.44 = 0.42 over 10 days; Table 4.7 IRD = (14.6 - 7.9)/10,000 yr^-1 = 6.7/10,000 yr^-1. (The section text describes IRD units loosely as 'person-time'; Table 4.5 gives 1/time, which is correct.)",
    "reteach": "Think about cases, not multiples. Made-up: Disease X has a 1-year risk of 2 per 1,000 in the exposed and 1 per 1,000 in the unexposed. RR = 2, but RD = 0.001, which is 1 extra case per 1,000 exposed people. Disease Y has risks of 0.30 and 0.20. RR = 1.5, smaller, but RD = 0.10, which is 100 extra cases per 1,000. A district health officer planning beds cares about the 100, not the 1. The difference converts directly into cases caused or prevented, provided the groups are comparable so that the gap is due to the exposure.",
    "misreadings": [
      "A bigger risk ratio always means more extra cases. Correction: the RD depends on baseline risk; a smaller ratio on a common disease can mean many more cases.",
      "An RD from groups followed for different lengths of time is fine. Correction: the RD needs a stated period that is the same for both groups.",
      "The IRD has no units. Correction: it keeps the 1/time units of the rates.",
      "Any RD is the 'attributable' risk. Correction: it measures caused risk only if the exposed and unexposed are comparable."
    ]
  },
  "odds_ratio": {
    "where": "Chapter 4, box \"The Odds Ratio\" (within \"Measures of Association\"); Chapter 4, section \"Prevalence Proportion\" (general definition of odds); Chapter 5 (case-control studies; the rare disease assumption)",
    "terms": [
      "odds: a proportion divided by one minus that proportion",
      "risk (incidence) odds: cases divided by non-cases in a group followed for a fixed time, A/B with B = N - A",
      "prevalence odds: prevalence divided by one minus prevalence",
      "odds ratio (OR): the odds in the exposed group divided by the odds in the unexposed group",
      "rare disease assumption (Chapter 5): the requirement that the outcome be rare before an OR from a case-control study with cumulative sampling of controls can be read as a risk ratio"
    ],
    "core": "Odds are a proportion divided by its complement. For a group followed for a fixed time, the risk odds are cases divided by non-cases. The odds ratio compares the odds in the exposed with the odds in the unexposed. Like the RR and IRR, it is unitless, ranging from 0 to infinity. The OR is central to case-control studies, where, depending on how controls are sampled, it can stand in for the RR or the IRR (Chapter 5). In a cohort study, however, risks and rates can be calculated directly, so there is little reason to use the OR. It is often reported only because of the model chosen. Chapter 5 adds that when the outcome is rare (risk below about 10%), the OR, risk ratio and rate ratio are all close. With high risk and cumulative sampling of controls, the OR may far exceed the risk ratio.",
    "positions": [
      "The odds ratio is not a primary measure of interest in its own right; it is reported mainly because of the models used to analyse data.",
      "In cohort studies there is little reason to use an OR, since risks or rates are directly available.",
      "In case-control studies the OR is fundamental and, depending on control sampling, estimates the risk ratio or rate ratio (Chapter 5).",
      "For small proportions, the odds and the proportion are nearly equal because the denominator 1 - p is close to 1.",
      "(Chapter 5) Only cumulative sampling of controls requires the rare disease assumption; it was once mistakenly thought necessary for every case-control study."
    ],
    "notation": "Odds = p/(1 - p) (e.g. prevalence 0.75 -> odds 3; 0.20 -> 0.25). Risk odds = A/B, with B = N - A. OR = (A1/B1)/(A0/B0). Range [0, infinity]; no units. Chapter 5 writes it as ad/bc with a, b = exposed and unexposed cases and c, d = exposed and unexposed non-cases (controls); example odds 40/60 vs 10/90, OR = 6.0, compared with RR = 4.0.",
    "reteach": "Use betting language. If 20 of 100 people fall ill, the risk is 20 in 100 (0.20), but the odds are 20 to 80 (0.25): ill people compared with well people, not with everyone. Made-up comparison: exposed, 50 of 100 ill gives risk 0.5 and odds 1.0; unexposed, 20 of 100 ill gives risk 0.2 and odds 0.25. RR = 2.5, but OR = 4. Make it rare (2 vs 1 per 1,000): odds are about 0.002 and 0.001, so OR is about 2, like the RR. When the outcome is rare, odds and risk are nearly the same; when it is common, they come apart.",
    "misreadings": [
      "Odds and risk are the same thing. Correction: odds compare cases with non-cases; they are close to the risk only when the outcome is uncommon.",
      "An OR can be read as 'times as likely'. Correction: that describes a risk ratio; with a common outcome the OR can be much further from 1.",
      "Every case-control study needs the rare disease assumption. Correction (Chapter 5): only cumulative case-control sampling needs it.",
      "The OR is the preferred effect measure in cohort studies. Correction: the book sees little reason to use it when risks or rates can be calculated directly."
    ]
  },
  "counterfactual": {
    "where": "Chapter 4, section \"Causal Effect Measures\"; Chapter 4, section \"The Counterfactual Ideal\"; Chapter 4, section \"Measures of Effect\"",
    "terms": [
      "counterfactual: the impossible comparison of the same people over the same period, once exposed and once unexposed; it is 'counter to fact' because only one state can happen",
      "comparability: the unexposed comparison group having the same risk for disease that the exposed would have had without exposure",
      "crossover study: an experiment in which each participant spends time in both the exposed and unexposed conditions, one after the other",
      "randomised experiment: participants assigned to exposure groups at random, so that with enough participants other characteristics tend to balance",
      "measure of effect: a measure of association that can be read as causal because comparability has been achieved"
    ],
    "core": "Unlike a court, which asks whether an exposure caused one person's disease, epidemiology does not try to attribute causation in individual cases. It assesses whether an exposure is a cause in general. A person can be exposed and then fall ill without any causal link, so the risk or rate among the exposed alone cannot measure an effect. That needs a contrast with what would have happened to the same people without exposure. The ideal thought experiment follows the same people over the same period, once exposed and once unexposed. Any difference in incidence proportions would be caused by the exposure, e.g. 25/100 versus a counterfactual 10/100, an effect of 0.15. This cannot be done, so a real unexposed group stands in. The central question is whether that group shows what the exposed would have experienced unexposed. Crossover designs, randomisation and careful choice of comparable subjects all pursue this.",
    "positions": [
      "Exposure followed by disease does not show causation in that person (the vaccine and autism example).",
      "The counterfactual requires the same people, the same time period and the same conditions, differing only in exposure.",
      "Crossover studies come close but fall short: a person is in one condition at a time, time order and the passage of time can intrude, and long-lasting effects of the first exposure can be misattributed to the second. They suit only assignable exposures with brief effects.",
      "With a poor substitute, a real effect can be hidden (25 vs 25 cases when the unexposed had higher baseline risk) or a false one created (25 vs 10 when the unexposed had lower baseline risk).",
      "Even matched groups may differ in ways that cannot be seen; randomisation balances other characteristics only given enough participants.",
      "Achieving comparability is the overriding concern of any causal study; when it is achieved, measures of association become measures of effect.",
      "Causal inference remains tentative, subjective, not reducible to checklists and open to revision (linking back to Chapter 3)."
    ],
    "notation": "Ideal (counterfactual) effect = incidence proportion in a group while exposed - incidence proportion in the same group, same period and conditions, while unexposed. Book example: 25/100 - 10/100 = 0.15. With comparability: RD and IRD are absolute effect measures; RR and IRR are relative effect measures.",
    "reteach": "Think of a road not taken. You drive to work by route A and arrive in 40 minutes. Was route A faster? You cannot know, because you cannot also drive route B on the same morning in the same traffic. That missing trip is the counterfactual. Made-up study: 50 workers given new gloves, 5 get dermatitis in a month. The ideal comparison is the same 50 people in the same month without gloves. Instead we borrow 50 workers from another factory. Harsher chemicals there could hide a real benefit; milder ones could exaggerate it. The study is only as good as the stand-in.",
    "misreadings": [
      "If an exposed person developed the disease, the exposure caused it. Correction: exposure and disease can coincide without a causal link; an effect needs a contrast with the unexposed experience.",
      "Equal risks in exposed and unexposed groups prove no effect. Correction: a real effect can be masked if the unexposed group has a different baseline risk.",
      "A crossover study achieves the counterfactual. Correction: it approaches it, but the two periods differ in time, and carry-over effects can distort it.",
      "Matching on known factors guarantees comparability. Correction: matched people can still differ in ways that cannot be seen; randomisation helps only with enough participants.",
      "A well-designed study proves causation. Correction: causal inference is always tentative and revisable."
    ]
  },
  "attributable_fraction": {
    "where": "Chapter 4, section \"Attributable Fraction\" (Tables 4.8 and 4.9); Chapter 4, section \"Interpreting Relative Measures of Effect\" (Equation 4.5, for contrast)",
    "terms": [
      "attributable fraction (among the exposed): the risk difference divided by the risk in the exposed; the share of exposed people's disease caused by the exposure, if the RD is causal and unbiased",
      "population attributable fraction / total attributable fraction: the share of all cases in the whole population caused by the exposure",
      "proportion of cases exposed: exposed cases divided by all cases; the weight used to scale the exposed fraction up to the population",
      "attributable risk percent / attributable risk: older names for the attributable fraction"
    ],
    "core": "Dividing the risk difference by the unexposed risk gives the relative effect (RR - 1). Dividing it by the exposed risk instead gives the attributable fraction. This is the share of exposed people's disease caused by exposure, provided the RD reflects a causal effect free of bias. It also equals (RR - 1)/RR. In Table 4.8, risks of 0.05 and 0.01 give 0.04/0.05 = 80%. For the whole population, multiply the exposed fraction by the proportion of all cases who are exposed: 0.8 x 500/1,400 = 0.286. The logic is that unexposed people's cases cannot be caused by the exposure, so only 400 of 1,400 cases are attributable. With several exposure levels, sum each level's fraction weighted by its share of cases (Table 4.9 gives 0.60). A rate ratio can replace the risk ratio when it approximates it. Mixed harmful and protective levels make net fractions hard to read.",
    "positions": [
      "The attributable fraction is interpretable only if the risk difference reflects an unbiased causal effect.",
      "No case can be caused by an exposure in someone who was not exposed, so unexposed cases contribute zero.",
      "The population fraction is scaled by the proportion of cases (not of the population) who are exposed.",
      "The rate ratio may be used in place of the risk ratio when the conditions for the two to agree are met.",
      "If an exposure increases disease at some levels and decreases it at others, the net fraction mixes caused and prevented cases and may obscure both; the book refers readers to Lash et al. rather than treating this further."
    ],
    "notation": "Equation 4.6: AF = RD / Risk1 = (Risk1 - Risk0)/Risk1 = (RR - 1)/RR. Population (total) AF = AF among exposed x (exposed cases / all cases). Equation 4.7 (several levels): AF_total = sum over i of (AF_i x P_i), where AF_i is the attributable fraction at level i and P_i the proportion of all cases at level i. Book examples: Table 4.8 AF = 0.04/0.05 = (5 - 1)/5 = 0.80; population AF = 0.8 x 0.357 = 0.286 (= 400/1,400). Table 4.9: 0.75 x 0.48 + 0.50 x 0.48 + 0 x 0.04 = 0.60 (= 1,500 attributable cases / 2,500).",
    "reteach": "Count the 'extra' cases. Made-up town: 1,000 workers exposed to a dust; 40 develop asthma in a year. Comparable unexposed people have a 1% risk, so about 10 of the 40 would have happened anyway, and 30 are due to the dust. 30/40 = 75% of exposed cases are attributable; check: RR = 4, (4 - 1)/4 = 0.75. The town has 100 asthma cases in all, 60 of them in unexposed people. None of those 60 can be due to dust. So the population share is 30/100 = 30%, the same as 0.75 x 40/100.",
    "misreadings": [
      "Using the proportion of the population exposed as the weight. Correction: the book's formula uses the proportion of cases who are exposed.",
      "Dividing the RD by the unexposed risk gives the attributable fraction. Correction: that gives the relative effect (RR - 1); the attributable fraction divides by the exposed risk.",
      "Unexposed cases can be partly attributed to the exposure. Correction: their attributable fraction is zero.",
      "An attributable fraction can be computed from any observed association. Correction: it means 'caused by' only if the RD is causal and unbiased.",
      "Fractions for a factor with harmful and protective levels can be read simply. Correction: the net figure mixes caused and prevented cases and can hide both."
    ]
  },
  "cohort_study": {
    "where": "Chapter 5, section \"Cohort Studies\" (including \"John Snow's Natural Experiment\", \"Experiments\", \"Defining the Study Population\", \"Measuring the Outcome\", \"Other Study Design Issues\"); Chapter 5, section \"Comparison of Cohort and Case-Control Studies\"",
    "terms": [
      "cohort: any named group of people who are followed through a stretch of time",
      "cohort study: a study measuring how often disease arises within one or more cohorts; the book treats it as the model for every epidemiologic study",
      "experiment (trial): a cohort study in which the investigator assigns exposure purely to serve the study's aims, as laid down in the protocol",
      "protocol: the rule book by which a study is run",
      "clinical trial: an experiment in patients who already have a disease, where the outcome is some consequence of that disease (progression, recurrence, death, an adverse effect)",
      "field trial: an experiment in people who are not patients, aimed at primary prevention (e.g. vaccine trials such as the 1954 Salk polio trial)",
      "community intervention trial: an experiment in which exposure is assigned to whole groups (e.g. villages, communities) rather than to individuals",
      "randomisation: assigning treatments by chance, which tends to make the compared groups alike on factors that affect the outcome",
      "intent to treat: analysing participants by the group they were assigned to, whatever they actually received",
      "per-protocol (as-treated) effect: the effect that would be seen if everyone had kept to their assigned treatment; more open to bias and needs adjustment for prognostic differences between adherers and non-adherers",
      "natural experiment: a non-experimental cohort study set in circumstances that mimic an experiment; the book also lists quasi-experiment as a similar label",
      "population at risk: the people in whom the disease being studied can still occur; they must be alive and without that disease when their follow-up begins",
      "induction period: the time after exposure before the causal mechanism can be completed; latent period: the time after disease begins but before it is diagnosed",
      "immortal person-time: follow-up time wrongly credited to a category that a person could only have reached by surviving that time; it arises from a time loop",
      "time loop: classifying or selecting people using information that would not yet have been known at the time the classification refers to",
      "special-exposure cohort: a cohort assembled because its members share an uncommon exposure (e.g. an occupational group)",
      "general-population cohort: a cohort drawn from a population without regard to exposure, then classified by common exposures"
    ],
    "core": "A cohort study follows one or more groups through time and counts new cases of disease in each, usually to compare occurrence between exposed and unexposed groups. The book regards it as the archetype of epidemiologic research. Experiments are cohort studies in which the investigator assigns exposure for study purposes only; the main kinds are clinical, field and community intervention trials. Many cohort studies are non-experimental, including 'natural experiments' such as Snow's comparison of two London water companies' customers, which the book insists is a cohort study, not an experiment. Cohort members must be at risk: alive and free of the specific disease at entry. Investigators must decide whether to count only first events, allow for induction time when assigning person-time, avoid time loops, trace members over time, and report the actual risks or rates rather than only ratios.",
    "positions": [
      "Every experiment is a cohort study, but most cohort studies are not experiments.",
      "A 'natural experiment' or 'quasi-experiment' is not an experiment at all; it is a cohort study with good comparability, owing more to the investigator's insight in choosing the setting (Snow picked districts where the two companies' pipes were intermingled).",
      "Randomised trials are an imperfect gold standard: intent-to-treat analysis tends to understate effects, small trials can be badly imbalanced, many questions cannot ethically or practically be randomised, trial treatments may differ from real-world care, small trials give imprecise results, and surrogate end points may not reflect the intended outcome. A disagreement between a trial and a non-experimental study does not automatically mean the trial is right.",
      "Intent to treat preserves the benefits of randomisation and, with complete follow-up, estimates without bias the effect of assigning (offering) a treatment, though it may misclassify actual exposure.",
      "Being free of the disease under study does not mean being healthy; the population at risk need only lack the particular disease under study.",
      "Membership of the population at risk is dynamic: people enter and leave it with changes in health and eligibility, and if only first occurrences are counted a case leaves the population at risk at onset.",
      "Allowing for induction time: the hypothesised induction period after exposure can be ignored or added to unexposed experience; since the induction time is usually unknown, several values can be tried, or estimated statistically. Assuming zero induction time, as many do, may be unreasonable, and a wrong assumption causes nondifferential misclassification of exposure.",
      "Exposure classification may change during follow-up but the change should affect only the person-time after it; classifying people as 'ever' versus 'never' exposed usually misclassifies some unexposed time.",
      "Report the risk or rate in each exposure group, with numerators and denominators; reporting only ratios is a disservice to readers. Odds ratios have little place in cohort studies or trials, where risks are directly available and outcomes are often common enough for the odds ratio to misrepresent the risk ratio.",
      "Studies tracing under about 60% of subjects are usually viewed sceptically, and even 70-80% tracing can be inadequate if losses relate to both exposure and disease.",
      "Cohort studies can examine many outcomes of one exposure at once; uncommon exposures are best studied with special-exposure cohorts, common ones with general-population cohorts.",
      "Cohort studies are usually expensive, unless they rely entirely on existing (secondary) data."
    ],
    "notation": "Risk = new cases / people followed (closed cohort). Incidence rate: I1 = a/PT1 (exposed), I0 = b/PT0 (unexposed), where a and b are case counts and PT1, PT0 person-time at risk; rates written as e.g. 3/59 yr^-1 or 5.1/100 yr^-1. Comparison by ratio (risk ratio RR, incidence rate ratio IRR, the latter abbreviation from Chapter 4) or difference.",
    "reteach": "Picture two blocks of flats, made up for illustration. Block A (500 residents) gets a new water filter; Block B (500) does not. Everyone is free of stomach illness on 1 January. Over a year you record first episodes: 10 in A, 25 in B. Risks are 10/500 = 2% and 25/500 = 5%, so the risk ratio is 0.4. That is a cohort study: start with defined groups, follow forward, count new cases, compare. If you had tossed a coin to decide which block got the filter, it would also be an experiment. If the landlord chose, it is still a cohort study, not an experiment.",
    "misreadings": [
      "Misreading: cohort studies are by definition observational. Correction: trials are cohort studies in which exposure is assigned.",
      "Misreading: a natural experiment is a kind of experiment. Correction: nobody assigned exposure; it is a cohort study that resembles an experiment.",
      "Misreading: a randomised trial is automatically correct and decisive. Correction: the book lists several ways trials fall short and urges examining design and analysis of conflicting studies.",
      "Misreading: the cohort must consist of healthy people. Correction: members need only be free of the particular disease studied (and alive).",
      "Misreading: analysing trial participants by the treatment they actually took is more accurate. Correction: that throws away the protection of randomisation; intent to treat is standard, with per-protocol analysis requiring careful adjustment.",
      "Misreading: all follow-up after exposure counts as exposed time. Correction: time within a plausible induction period is not exposure-related and can be excluded or counted as unexposed.",
      "Misreading: a worker's whole follow-up can be placed in the duration category they eventually reach. Correction: that creates immortal person-time and distorts mortality comparisons.",
      "Misreading: reporting an odds ratio from a cohort study or trial is fine. Correction: the book says risks or rates should be reported and odds ratios generally avoided in cohort studies."
    ]
  },
  "closed_open_cohort": {
    "where": "Chapter 5, section \"Defining the Study Population\" (subsection \"Closed and Open Cohorts\"); Chapter 5, section \"Measuring the Outcome\" (subsections \"Measuring Risks or Incidence Rates\" and \"Prospective versus Retrospective Cohort Studies\"); Chapter 5, section \"Other Study Design Issues\"; Chapter 5, box \"Cohort/Case-Control Studies versus Prospective/Retrospective Studies\"",
    "terms": [
      "closed cohort: a cohort with fixed membership; nobody can join once follow-up starts, and numbers shrink through death, loss or disease",
      "open cohort (dynamic cohort, dynamic population): a cohort that can gain new members over time, and whose members leave when they no longer meet its defining condition (e.g. move out of the area)",
      "prospective cohort study: exposure is recorded at the start of follow-up (and updated if it changes) and the time at risk runs alongside the conduct of the study",
      "retrospective cohort study: the period at risk usually lies before the study begins; either the cohort is built entirely from previously recorded information or exposure information was gathered after outcomes were known",
      "historical cohort study: the book's alternative name for a retrospective cohort assembled entirely from prerecorded records",
      "eligibility criteria: the characteristics that decide who is included in a study"
    ],
    "core": "The book separates two kinds of cohort. A closed cohort has a fixed membership set when follow-up starts; it shrinks as members die, are lost or develop disease, and members stay in it even if they move away, so investigators should try to trace them. Randomised trials and the Framingham Heart Study are examples. An open (dynamic) cohort takes on new members over time and loses those who stop qualifying, such as the residents of Connecticut covered by its cancer registry, a school's pupils, or the sitting US senators. Risk can be estimated directly in a closed cohort if competing risks are small; in a dynamic cohort, incidence rates based on person-time are used, and the same approach also handles competing risks in a closed cohort. Separately, cohort studies are prospective or retrospective according to when data are collected relative to the time at risk.",
    "positions": [
      "Closed versus open concerns membership; prospective versus retrospective concerns the timing of data collection relative to the period at risk. These are distinct axes.",
      "Cohort studies are not necessarily prospective: the Florentine dowry-fund study used centuries-old records to trace plague epidemics.",
      "Retrospective cohort studies rely on existing records, so information may be missing, but they are usually much cheaper and give results sooner because there is no wait for disease to occur.",
      "Experiments are always prospective.",
      "Old usage equated cohort with prospective and case-control with retrospective, implying retrospective studies were less valid; the book rejects both the equation and the implication, reserving prospective/retrospective for timing only.",
      "In retrospective cohort studies, eligibility and exposure decisions must rely only on information available at the time they refer to, as if the study had been run prospectively; otherwise a time loop (e.g. immortal person-time) results.",
      "In a closed cohort, risks can be calculated directly when follow-up is short or competing risks small; with highly variable follow-up (as in the X-ray fluoroscopy cohort) incidence rates, or life-table risks, are needed."
    ],
    "notation": "Risk = new cases / number followed in a closed cohort; incidence rate = new cases / person-time at risk (usable in both closed and dynamic cohorts).",
    "reteach": "Think of transport. A closed cohort is a chartered coach for one tour party: everyone boards at the start, nobody else can get on, and the coach empties as people get off. You can sensibly ask what fraction of the original party had something happen to them (a risk). An open cohort is a city bus: passengers board and alight all day, so counting 'people' makes little sense; instead you add up passenger-minutes and express events per passenger-hour (a rate). Whether you watch the journey live (prospective) or reconstruct it afterwards from ticket records (retrospective) is a separate question from which kind of vehicle it is.",
    "misreadings": [
      "Misreading: open cohorts are those that lose people to follow-up. Correction: what makes a cohort open is that new members can join; closed cohorts also lose members.",
      "Misreading: a closed cohort member who moves away leaves the cohort. Correction: in a closed cohort they remain members and should be traced; leaving the area ends membership only in a geographically defined dynamic population.",
      "Misreading: 'retrospective' means case-control and 'prospective' means cohort. Correction: both designs can be either.",
      "Misreading: retrospective studies are inherently less valid. Correction: well-conducted retrospective studies can meet the highest standards.",
      "Misreading: a retrospective cohort can use anything now known to classify people from the start. Correction: only information that would have been available at the time, to avoid time loops."
    ]
  },
  "case_control_study": {
    "where": "Chapter 5, section \"Case-Control Studies\"; Chapter 5, section \"Defining the Source Population\"; Chapter 5, section \"Prospective and Retrospective Case-Control Studies\" (with boxes \"Representativeness of Cases and Controls\" and \"Cohort/Case-Control Studies versus Prospective/Retrospective Studies\"); Chapter 5, section \"Comparison of Cohort and Case-Control Studies\"",
    "terms": [
      "case-control study: a study that pursues the same aims as a cohort study but samples the source population for its denominators instead of enumerating it fully",
      "cases: everyone in the source population who develops the disease of interest (or a representative sample of them, within a defined area)",
      "control group (control series): a sample of the source population used to estimate how exposure is distributed in it",
      "2 x 2 table: the four-cell table of exposed/unexposed cases and controls",
      "odds ratio (cross-product ratio): ad/bc computed from the case-control table; what it estimates depends on how controls were sampled",
      "control sampling fraction: the proportion of the source population sampled as controls; if known, absolute measures become obtainable",
      "prospective / retrospective case-control study: retrospective if the cases already exist as the study begins; prospective if the investigator waits for new cases to arise"
    ],
    "core": "The case-control study aims to learn what a cohort study would, but more efficiently, because in most populations only a small minority develop the disease. Imagine the cohort study that could have been done in the source population. The case-control study takes the same cases and classifies them by exposure; instead of measuring the full denominators, it samples controls from the whole source population to reveal the relative size of its exposed and unexposed parts. The cardinal rule is that controls must be sampled independently of exposure. The odds ratio from the case and control counts then estimates a ratio measure of the cohort (rate ratio or risk ratio, depending on the sampling). Because the denominators are only sampled, case-control studies yield ratio measures, not risks or rates, unless the sampling fraction is known. The book calls them modified cohort studies.",
    "positions": [
      "A case-control study should be understood as a cohort study with sampled denominators; issues in cohort studies have analogues in case-control studies.",
      "The control group exists only to estimate the exposure distribution of the source population, so controls must be selected independently of exposure.",
      "Cases need not be representative of all people with the disease: any case definition usable as an outcome in a cohort study (e.g. older cases, severe cases, women only) is acceptable.",
      "Controls should not represent the whole non-diseased population; they should represent the source population defined by the case definition (e.g. same age band as the cases).",
      "A study should not be dismissed merely for being case-control or retrospective; validity problems can afflict any design, including trials, and well-done case-control studies can be as valid as any design.",
      "Sampling costs precision compared with a full cohort study of the same population, but the gain from extra controls tails off; little is added beyond about four or five controls per case. Savings can be used to enlarge the source population and gain cases, which may yield more precision than a cohort study for the same money.",
      "Case-control studies are usually far cheaper than cohort studies, except when a cohort study runs wholly on existing secondary data.",
      "Case-control studies are convenient for many exposures in relation to one disease, but the case series can be widened to several diseases, giving parallel case-control studies in one source population; the contrast with cohort studies is not absolute.",
      "Case-control studies can be prospective or retrospective, just as cohort studies can."
    ],
    "notation": "2 x 2 table: a = exposed cases, b = unexposed cases, c = exposed controls, d = unexposed controls. Odds ratio (cross-product ratio) = ad/bc. Example in the book (Table 5.6): (41 x 202)/(15 x 298), approximately 1.85, against a full-cohort rate ratio of 1.86.",
    "reteach": "An invented town of 10,000 has 50 new cases this year: 30 exposed, 20 unexposed. A cohort study would need the exposure of all 10,000. Instead you interview 200 townspeople chosen without regard to exposure: 50 exposed, 150 unexposed, suggesting the town is one-quarter exposed. Odds ratio = (30 x 150)/(20 x 50) = 4.5. Check: if the town truly had 2,500 exposed and 7,500 unexposed, the risks would be 30/2,500 = 1.2% and 20/7,500 = 0.27%, a ratio of 4.5. The 200 controls stood in for the 10,000 denominators; they could not tell you the 1.2% itself, because you chose how many to sample.",
    "misreadings": [
      "Misreading: case-control studies are 'backward' or retrospective cohort studies and inherently weaker. Correction: they are cohort studies with sampled denominators and can be prospective or retrospective; validity depends on conduct.",
      "Misreading: controls should be healthy or representative of everyone without the disease. Correction: they must represent the exposure distribution of the source population that gave rise to the cases.",
      "Misreading: cases must represent all people with the disease. Correction: any well-defined subset is a valid case definition, with the source population and controls defined to match.",
      "Misreading: you can compute the risk of disease in the exposed from a case-control table. Correction: only ratio measures, unless the fraction of the source population taken as controls is known.",
      "Misreading: more controls always buy substantially more precision. Correction: returns diminish sharply beyond four or five per case.",
      "Misreading: the odds ratio always needs the rare disease assumption. Correction: that assumption is needed only with cumulative sampling (see control_sampling)."
    ]
  },
  "source_population": {
    "where": "Chapter 5, section \"Defining the Source Population\"; Chapter 5, section \"Identifying Controls for Case-Control Studies\"; Chapter 5, box \"Representativeness of Cases and Controls\"",
    "terms": [
      "source population: the population, real or hypothetical, that produces the study's cases; the population for an imagined cohort study",
      "population-based study: a case-control study whose source population is defined geographically, with controls sampled from the at-risk residents of that area",
      "referral population: for a clinic- or hospital-based study, the people that clinic or hospital would treat should they develop the disease",
      "proxy sampling / proxy controls: controls drawn from outside the source population who are hoped to share its exposure distribution (e.g. brothers of female breast cancer cases for a study of ABO blood group)",
      "matching factor: when controls are recruited from the same neighbourhood as each case, neighbourhood becomes a matching factor to be handled as such (Chapter 7)"
    ],
    "core": "The book builds case-control logic on the source population: the group from which the study's cases arise, best pictured as the population for an imagined cohort study. All cases arising in it are, by definition, the study's cases, so its definition coincides with the case eligibility criteria. Sometimes it is easy to name (all residents of a city in a given year). When cases come from one clinic, it is everyone who would come to that clinic and receive the diagnosis there should they fall ill, which depends on referral patterns and may be impossible to list, as with severe psoriasis patients travelling to the Mayo Clinic from around the world. It still exists conceptually, and controls should ideally come from it. Without a clearly specified source population it may be hard or impossible to select unbiased controls. The source population excludes current cases and people who cannot become cases.",
    "positions": [
      "Nearly every case-control study can be regarded as sitting inside a source population; describing that population settles who is eligible as a case and as a control.",
      "The conditional 'should they develop that disease' is essential because a clinic serves different populations for different diseases.",
      "Ideal control selection is direct sampling from the source population; a population registry makes this easier, and systematic sampling of residences is an alternative.",
      "In hospital-based studies, controls are typically patients with other conditions at the same hospitals; the danger is that their diagnoses are related to the exposure (e.g. smoking-related illnesses as controls in a smoking and leukaemia study). Exclude diagnoses likely related to exposure, but keep several diagnostic groups rather than a single one, to dilute bias.",
      "Exclusion of control diagnoses should be based only on the current admission, not past ones, because the source population includes people with past exposure-related illness; the aim is to include such people without oversampling them.",
      "The source population excludes those not at risk, e.g. women who have had a hysterectomy cannot become endometrial cancer cases.",
      "Proxy controls depart from the principle of sampling the source population and cannot become cases; they are acceptable only insofar as their exposure distribution matches the source population's. This usually cannot be tested, though sometimes the argument is strong (ABO blood group is unrelated to sex). Dead controls for dead cases are by definition proxies, sometimes used for convenience and comparable information quality.",
      "Controls should be representative of the source population, not of all non-diseased people."
    ],
    "notation": "None specific beyond the 2 x 2 table; the source population's exposed and unexposed person-time (PT1, PT0) or people are what the controls estimate.",
    "reteach": "Use one question as a filter: 'If this person had developed the disease, would they have ended up on my list of cases?' Say your cases are every new patient with a rare eye disease seen at one specialist eye hospital (made-up example). A woman in a distant state who would go to her local hospital fails the test, so she is outside the source population. A man in the hospital's catchment who would be referred there passes it, even though you could never list everyone like him in advance. The controls are a sample of all the people who pass the test, chosen without looking at their exposure.",
    "misreadings": [
      "Misreading: the source population is the general population or the whole country. Correction: it is whatever population gave rise to the particular cases, fixed by the case definition and how cases are found.",
      "Misreading: if the source population cannot be listed, a case-control study is impossible. Correction: it can be imagined and approximated, e.g. with hospital controls chosen with attention to referral patterns, or with proxy controls.",
      "Misreading: any patient at the same hospital is a suitable control. Correction: diagnoses related to the exposure, or with different referral patterns, can distort the exposure distribution.",
      "Misreading: people who were ever hospitalised for an exposure-related disease must be excluded as controls. Correction: exclude only on the reason for the current admission.",
      "Misreading: proxy controls are invalid by definition. Correction: they deviate from the principle but can be valid if their exposure distribution matches the source population's."
    ]
  },
  "control_sampling": {
    "where": "Chapter 5, section \"Case-Control Sampling Methods\" (subsections \"Density Case-Control Studies\", including \"Control Selection\" and \"Illustration of Density-Based Case-Control Data\"; \"Cumulative Case-Control Studies\"; \"Case-Cohort Studies\", including \"Illustration of Case-Cohort Data\")",
    "terms": [
      "density-based sampling (density case-control study): controls sampled so their exposure split mirrors the exposure split of the source population's person-time; named after 'incidence density', a synonym for incidence rate",
      "control sampling rates: c/PT1 and d/PT0, the rates at which exposed and unexposed person-time are sampled as controls; they must be equal",
      "risk set: the members of the source population who could still become a case at the instant a given case is diagnosed",
      "risk-set sampling: one way of carrying out density sampling, drawing controls from each case's risk set",
      "cumulative sampling (cumulative case-control study): controls drawn, after the risk period is over, from those who did not become cases",
      "case-cohort sampling (case-cohort study): controls drawn from the full roster of the source population at baseline, whether or not they later become cases",
      "rare disease assumption: the requirement that disease be uncommon for the cumulative design's odds ratio to approximate the risk ratio"
    ],
    "core": "How controls are sampled determines what the odds ratio estimates. In density-based sampling, each control stands for some person-time; a person's chance of selection is proportional to their time at risk, and they are eligible as a control only while still eligible to become a case. Risk-set sampling achieves this. The odds ratio then estimates the incidence rate ratio, with no rare disease assumption. In cumulative sampling, controls come from those still disease-free at the end of a closed population's risk period; the odds ratio estimates the cohort's odds ratio, which approximates the risk ratio only if disease is rare, and otherwise overstates it. In case-cohort sampling, controls are a sample of everyone in the cohort at baseline; each control represents people, and the odds ratio estimates the risk ratio without the rare disease assumption, even with varying follow-up.",
    "positions": [
      "The rare disease assumption was once wrongly thought necessary for every case-control study; it is needed only for cumulative sampling, because those controls come from non-cases rather than the whole population at risk.",
      "When risk is low (the book suggests below about 10%), the cohort's odds, risk and rate ratios are all similar, so the cumulative odds ratio may also approximate the rate ratio.",
      "Choosing controls only from those who escaped disease (e.g. babies born without defects) has intuitive appeal but omits the cases' share of the source population's experience, and can overestimate the risk ratio.",
      "Under density sampling, a person picked as a control who later becomes a case should be kept in both roles; a person may even be sampled as a control more than once, possibly with different exposure information each time (e.g. raw shellfish in the past six weeks). With an uncommon disease this rarely matters in practice.",
      "In case-cohort studies a sampled control can turn out to be a case; there is no theoretical problem, by analogy with every case in a cohort risk being counted in the denominator. Some epidemiologists go to lengths to avoid controls with undetected disease; the book sees no theoretical need. Refined formulas exist for subjects in both roles.",
      "Case-cohort sampling is more convenient than density sampling: it needs only one sample from the cohort roster, usable for several diseases, whereas risk sets change with each case and each disease needs its own control group; also, data for density sampling may be lacking.",
      "Density studies parallel rate-measuring cohort studies; cumulative and case-cohort studies parallel closed-cohort studies that estimate risks.",
      "Sampling controls independently of exposure is essential; otherwise the estimate is wrong."
    ],
    "notation": "Exposed rate I1 = a/PT1; unexposed rate I0 = b/PT0. Density sampling aims for c/PT1 = d/PT0, equivalently c/d = PT1/PT0, so the incidence rate ratio I1/I0 = (a/PT1)/(b/PT0) is estimated by (a/c)/(b/d) = ad/bc (the odds ratio or cross-product ratio). Cumulative and case-cohort: odds ratio = ad/bc, with a, b exposed/unexposed cases and c, d exposed/unexposed controls. Table 5.7: cohort of 200 (risks 40% vs 10%, RR 4.0, cohort OR 6.0); cumulative controls 20/30 give OR (40 x 30)/(10 x 20) = 6.0; case-cohort controls 25/25 give OR (40 x 25)/(25 x 10) = 4.0.",
    "reteach": "Invented closed cohort: 1,000 exposed, 1,000 unexposed; 300 and 100 fall ill (risks 30% and 10%; risk ratio 3). Case-cohort: sample 200 controls from all 2,000 at the start; on average 100 exposed, 100 unexposed. OR = (300 x 100)/(100 x 100) = 3, the risk ratio. Cumulative: sample 160 controls from the 1,600 who stayed well (700 exposed, 900 unexposed), so about 70 exposed and 90 unexposed. OR = (300 x 90)/(100 x 70), about 3.9, too high, because the exposed non-cases were depleted by the common disease. Sampling in proportion to time at risk (density) would instead estimate the rate ratio.",
    "misreadings": [
      "Misreading: controls must never develop the disease. Correction: under density and case-cohort sampling a control can later be (or already be) a case and is kept in both roles.",
      "Misreading: every case-control odds ratio relies on the rare disease assumption. Correction: only cumulative sampling does.",
      "Misreading: the odds ratio is a measure in its own right that the study aims at. Correction: in a case-control study it is a tool for estimating the cohort's rate ratio or risk ratio; the book notes the odds ratio is often not meaningful in itself.",
      "Misreading: density sampling and risk-set sampling are just different names. Correction: risk-set sampling is one way to implement density sampling (selection in proportion to person-time).",
      "Misreading: anyone with the disease or who has died can still be picked as a density control. Correction: once a person becomes a case or dies they are no longer eligible as a control."
    ]
  },
  "nested_case_control": {
    "where": "Chapter 5, section \"Nested Case-Control Studies\"; Chapter 5, section \"Defining the Source Population\" (the idea that almost every case-control study is nested in a source population)",
    "terms": [
      "nested case-control study: in the book's specific usage, a case-control study whose source population is an existing, well-defined cohort; all cohort cases are included and controls are a sample of the cohort",
      "nested (general sense): the book also finds it useful to regard all case-control studies as nested within exposed and unexposed cohorts"
    ],
    "core": "Conceptually, the book regards every case-control study as nested in the cohorts of its source population. The term 'nested case-control study' is reserved, however, for studies whose source population is an established, well-defined cohort. All cases arising in the cohort are taken, and controls are sampled from the cohort. One benefit is that the selected controls can be checked against the full cohort. Even a large cohort yields few cases of a rare outcome, and when the exposure needs extra work, such as analysing biological samples, measuring it in everyone may be prohibitively costly and burdensome for participants; the nested design studies the same question efficiently. Such designs began mainly in occupational epidemiology and are now widespread. The choice of control-sampling scheme determines whether the result estimates a rate ratio or a risk ratio.",
    "positions": [
      "The point of sampling inside an existing cohort is efficiency for rare outcomes and costly exposures, not a different scientific question.",
      "A distinctive advantage is that controls can be compared with the whole source population, because it is fully known.",
      "Small design choices (especially how controls are sampled) change what the study estimates."
    ],
    "notation": "As for control_sampling: odds ratio ad/bc; density (risk-set) sampling estimates the incidence rate ratio; case-cohort sampling estimates the risk ratio.",
    "reteach": "Imagine a biobank (figures invented) holding frozen blood from 20,000 pregnant women, of whom 150 later develop a rare complication. Testing every sample for a new marker would mean 20,000 assays. Instead, test all 150 cases and, for each, four women from the same biobank who were still at risk when that case occurred: 750 assays in total. Because both groups come from the same, fully documented cohort, you can even check whether your 600 controls look like the whole biobank in age or parity. You get nearly the cohort's answer at a fraction of the cost.",
    "misreadings": [
      "Misreading: once you have a cohort, a case-control analysis within it is pointless. Correction: it saves cost and participant burden when exposure measurement is expensive and the outcome rare.",
      "Misreading: 'nested' describes a special kind of validity unavailable to other case-control studies. Correction: every case-control study is conceptually nested in a source population; the specific term just means the source population is a pre-existing defined cohort.",
      "Misreading: a nested case-control study gives absolute risks because the cohort is known. Correction: the sampled design yields ratio measures; risks need the full cohort data (or the sampling fraction)."
    ]
  },
  "case_crossover": {
    "where": "Chapter 5, section \"Case-Crossover Studies\"",
    "terms": [
      "crossover study: a cohort study, typically experimental, where each person serves as their own match and each participant receives every intervention in turn, in random order, with a gap between them; the effect of each must not carry over into the next period",
      "case-crossover study: a case-control counterpart of the crossover study, first proposed by Maclure, in which every subject is a case and the control information comes from the cases' own experience outside the hypothesised risk window",
      "time window: the hypothesised brief period after an exposure during which it can trigger the disease; a case is 'exposed' if exposure occurred in that window just before the event",
      "self-matching: each case is compared with their own experience beyond the case window, and the analysis uses methods for matched data"
    ],
    "core": "In a case-crossover study there is no separate control group: everyone is a case, and the comparison comes from each case's own experience at other times. The hypothesis must specify a brief time window after exposure during which risk is raised. Each case is classed as exposed if exposure fell within that window just before the event. The case's usual exposure frequency over a longer earlier period (e.g. the past year) then shows how much of their time is normally 'exposed'. In Maclure's example of sexual activity and myocardial infarction with a one-hour window, a person with intercourse once a week has 1 exposed hour and 167 unexposed hours per week. Combining these across cases with matched-data methods estimates the incidence rate ratio. The design suits brief, intermittent exposures with transient effects and abrupt-onset outcomes.",
    "positions": [
      "Three conditions: the exposure's effect is brief, the exposure is intermittent, and the disease begins abruptly so the timing of exposure relative to onset is clear.",
      "The hypothesised time window should be short relative to the usual interval between exposures, so the effect fades before the next exposure.",
      "Control information usually comes from before the event, because people may change their exposure after falling ill (e.g. cutting back caffeine after a heart attack).",
      "Experience after the event can be used when the disease cannot affect the exposure (e.g. ambient air pollution after an asthma attack).",
      "Unsuitable examples: blood type and cancer (blood type is constant and cancer onset is not abrupt). Suitable examples: coffee triggering an asthma attack; phone use while driving and collisions.",
      "The book calls the design compelling in its simplicity and elegance; all the study information comes from a series of cases."
    ],
    "notation": "Exposed time per case = hypothesised window x number of exposure episodes in the reference period; e.g. 1 hour exposed versus 167 hours unexposed per week for one weekly exposure. The estimate is an incidence rate ratio comparing the window after exposure with other times, analysed with matched methods.",
    "reteach": "Build it step by step (numbers invented). Hypothesis: using a phone raises crash risk for the next 10 minutes. Step 1: collect 50 drivers who crashed. Step 2: for each, ask whether they were on the phone in the 10 minutes before the crash: 10 were. Step 3: ask each how much of their usual driving time is spent on the phone: on average about 5%. Step 4: if phones did nothing, about 5% of crashes should follow phone use; we saw 20%. The odds of exposure before the crash (10/40) versus usual odds (5/95) give a ratio of roughly 4.75. Each driver acted as their own control.",
    "misreadings": [
      "Misreading: the design works for any exposure. Correction: the exposure must be intermittent with a brief effect, and the outcome must have an abrupt onset.",
      "Misreading: the control information must always be from before the event. Correction: post-event time can be used when the disease cannot influence the exposure.",
      "Misreading: case-crossover studies need a separate group of people without the disease. Correction: all subjects are cases; their own experience supplies the control information.",
      "Misreading: the outcome measure is a simple proportion of exposed cases. Correction: exposed and unexposed person-time within each case is compared with matched methods to estimate a rate ratio."
    ]
  },
  "cross_sectional": {
    "where": "Chapter 5, section \"Cross-Sectional versus Longitudinal Studies\"",
    "terms": [
      "longitudinal study: a study whose information relates to two or more time points; the other designs in the chapter (every cohort study and the majority of case-control studies) are longitudinal",
      "cross-sectional study: a study in which all information refers to a single point in time, a snapshot of disease and/or exposure status",
      "prevalent cases: people who currently have the disease at a particular moment, as opposed to new (incident) cases"
    ],
    "core": "A longitudinal study relates information from two or more time points, built on the premise that a cause acts before the disease it produces. Every cohort study and the majority of case-control studies are longitudinal. A cross-sectional study, such as a census or survey, captures everything at one moment. It cannot measure incidence, since risks and rates need a period of time, but it can measure prevalence. Cross-sectional data can also feed a case-control study using prevalent cases and current exposure, but such a study tells you about factors that influence prevalence, which mixes occurrence with duration: long-lasting cases are over-represented and people who die quickly are missed. Sometimes current information is a good stand-in for past exposure: accurately measured current vitamin E intake may beat hazy recall of past intake, and blood type never changes. Then cross-sectional data can be as informative as longitudinal data.",
    "positions": [
      "The core limitation is that cross-sectional data cannot give incidence, only prevalence.",
      "A case-control study based on prevalent cases addresses determinants of prevalence, not of disease occurrence, and is weighted towards long-duration cases.",
      "Cross-sectional information can sometimes be a good, even perfect, proxy for past exposure, so cross-sectional studies are not automatically useless for causal questions.",
      "Surveys may be used to measure disease prevalence and even to relate prevalence to possible exposures."
    ],
    "notation": "None specific in this section (prevalence and prevalence odds are defined in Chapter 4).",
    "reteach": "A cross-sectional study is a single photograph of a waiting room: you see who is there now, so you can say what share of people present have a condition (prevalence). You cannot see who arrived today or how long people have been waiting. People who stay a long time are much more likely to be in the photo than those who come and go quickly, so the photo over-represents long stays. A longitudinal study is the film: you watch arrivals over time and can count new events. Only when a characteristic never changes, like blood group, does a photo tell you as much as the film about it.",
    "misreadings": [
      "Misreading: a cross-sectional survey can estimate incidence. Correction: only prevalence; incidence needs a time period.",
      "Misreading: a factor associated with prevalence must cause the disease. Correction: it may instead prolong disease (prevalence reflects occurrence and duration).",
      "Misreading: cross-sectional data are worthless for causation. Correction: when current measurements are good proxies for past exposure (e.g. blood type), they can be as informative as longitudinal data.",
      "Misreading: case-control studies are never cross-sectional. Correction: the book notes a case-control study can be built from cross-sectional data with prevalent cases and concurrent exposure, with the caveat about prevalence."
    ]
  },
  "response_rate": {
    "where": "Chapter 5, section \"Response Rates\"; Chapter 5, section \"Other Study Design Issues\" (subsection \"Tracing of Subjects\")",
    "terms": [
      "response rate: the proportion of subjects with complete information; in a cohort study the 'response' is the disease outcome (i.e. successful tracing), in a case-control study it is the exposure information",
      "recruitment proportion: the share of those approached who volunteer for a cohort study or trial; the book says this should not be regarded as a response rate",
      "selection bias: here, bias from data that are missing selectively (developed in Chapter 6)",
      "external validity (generalisability): whether results apply beyond the study participants"
    ],
    "core": "Missing outcome data in a cohort study, or missing exposure data in a case-control study, can cause selection bias, and the more is missing the greater the potential bias. The proportions with complete data are called response rates. There is no absolute threshold, but below about 70-75% scepticism is common. A low response rate need not bias results: if missingness is unrelated to the study variables (e.g. half of the medical records unavailable, but availability unrelated to transfusion history), the available data can still give an unbiased estimate. Bias arises when the relation between study variables differs between missing and available data. Recruitment of volunteers into cohort studies or trials is not a response rate: since disease has not yet occurred, volunteering seldom biases internal comparisons, and may affect only generalisability. Dropouts after enrolment matter more than initial refusals.",
    "positions": [
      "Selection bias from missing data requires that the exposure-disease relation differ between those with and without data; low response alone is not proof of bias.",
      "Rough benchmarks: tracing below about 60% invites scepticism; a response or tracing proportion below 70-75% may raise doubts; yet even 70-80% or more can be inadequate if losses relate to both exposure and disease.",
      "In a randomised trial, internal validity comes from random assignment among volunteers, however small a fraction of the wider population they are.",
      "In non-experimental cohorts, volunteering causes selection bias only if it is linked both to exposure and to risk of disease; because participants are disease-free at entry, disease cannot drive volunteering, apart from prodromal effects.",
      "Low recruitment may affect generalisability only if participants are a subgroup in which the exposure-disease relation differs from that in non-volunteers.",
      "A gentle recruitment approach may be wiser than a hard sell: reluctant recruits who later drop out harm validity more than if they had never joined. Effort is better spent on complete follow-up than on recruiting more people.",
      "In case-control studies where participants know their exposure, high participation matters because agreeing to take part may depend on exposure; if exposure is unknown to participants (e.g. a laboratory test), low participation is less of a concern."
    ],
    "notation": "None.",
    "reteach": "(1) An invented cohort invites 10,000 adults; 3,000 enrol. All 3,000 are disease-free at entry, so whether they joined cannot depend on future disease. If almost all 3,000 are followed to the end, the comparison of exposed and unexposed among them is sound; the question is only whether it applies to the 7,000 who declined. (2) The same cohort follows 3,000 but loses 900, and those lost are disproportionately exposed people who became ill. Now the comparison itself is distorted. Low recruitment is mostly a generalisability question; incomplete follow-up related to exposure and disease is a validity problem. In case-control studies, watch whether willingness to participate depends on exposure.",
    "misreadings": [
      "Misreading: a low response rate means the study is biased. Correction: bias needs missingness to be related to the study variables in a way that changes the exposure-disease relation.",
      "Misreading: poor recruitment into a cohort or trial is a low response rate that undermines validity. Correction: the book says recruitment is not a response rate; it mainly bears on generalisability.",
      "Misreading: recruiting as many people as possible, even reluctantly, improves validity. Correction: reluctant recruits who drop out can do more harm than refusals.",
      "Misreading: a high response rate guarantees validity. Correction: even 80% follow-up can be too low if losses relate to both exposure and disease.",
      "Misreading: response rates matter equally in all case-control studies. Correction: they matter most when participants know their exposure, since participation may then depend on it."
    ]
  }
};
