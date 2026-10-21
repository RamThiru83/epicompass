/** Welcome page text. Written as a personal note from the course lead; edit freely (markdown). */
const md = String.raw;

export const WELCOME = {
  title: 'A note before you begin',
  intro: md`Dear student,

Welcome to EpiCompass. I built this companion for the epidemiology module of our MSc Clinical Research programme because I wanted you to have something between a textbook and a classroom: a place where you can read an idea, then immediately play with and experience the concept. Before you open Chapter 1, I would like to tell you what epidemiology is, why I think it matters so much for the work you are preparing to do, and how to get the most out of this learning companion.`,

  whatIsEpi: md`## What epidemiology is

Epidemiology is the study of how often health events occur in populations, and why. That sounds modest, but almost every question you will ever ask as a clinical researcher is an epidemiologic question in disguise. Does this drug reduce mortality? Is this screening test worth doing? Why do the babies in one unit do worse than those in another? Each of these is a question about the occurrence of an outcome, a comparison between groups, and a judgement about whether the comparison can be trusted.

What makes epidemiology a discipline rather than a collection of formulas is the way it thinks. It is suspicious of comparisons until it has asked who was being compared, what else differed between them, and how the outcome was measured. It treats a study as an exercise in measurement, with error to be understood and reduced, rather than as a hunt for a small P-value. And it is honest about causation: it has a precise model of what a cause is, and it uses that model to say what a study can and cannot show.`,

  whyItMatters: md`## Why it matters for a clinical researcher and a trialist

Over time, I have come to believe that the single biggest catalyst for a clinical researcher's growth is internalising the fundamental principles of epidemiology. Let me give you three such concepts as examples.

First, a randomised trial is an epidemiologic study. Randomisation is a device for dealing with confounding, nothing more and nothing less. If you do not understand confounding, you cannot appreciate what randomisation buys you, when it fails (losses to follow-up, non-adherence, unblinded outcome assessment), or how to read the observational studies that will always outnumber the trials in your field. The trialist who understands bias designs better trials; the one who does not merely follows the template.

Second, measurement is everything. Risk, rate, prevalence, risk ratio, risk difference, attributable fraction: these are not vocabulary to be memorised but tools that answer different questions. Choosing the wrong measure, or the wrong denominator, is a more common and more damaging error than any statistical slip. Chapter 4 will probably be the most useful chapter you read this year.

Third, estimation over significance. Much of what happens in clinical research analysis is an obsession around p-value 0·05. The authors of our textbook have argued for decades, and I agree with them, that the job of a study is to estimate an effect and to say how precisely it has been estimated. Epidemiologists are estimators and not testers. A confidence interval tells you what the data are compatible with; a P-value tells you much less. Learning to think this way will change how you read every paper, and how you write your own.`,

  theBook: md`## The book, our beloved "Baby Rothman!"

The content of this site follows, chapter by chapter, *Epidemiology: An Introduction* by Kenneth J. Rothman, Krista F. Huybrechts and Eleanor J. Murray (third edition, Oxford University Press). Among those of us who teach epidemiology it is known affectionately as "Baby Rothman", to distinguish it from its formidable elder sibling *Modern Epidemiology*. Baby Rothman is short, opinionated and unusually clear, and it has shaped how I think more than any other book in my field. It starts with confounding on page one, builds causation before measurement, and treats error and statistics as servants of inference rather than its masters. If you read only one epidemiology book in your career, read this one, and read it more than once.

**Please read it.** This site does not reproduce the book; it is my own commentary, exercises, and simulations, built so that each chapter's ideas can be worked through rather than only read. The two work together. Read the chapter first, then come here and work the cards.`,

  howToUse: md`## How to use this site

The course is organised into six units of increasing complexity, following the book's chapter order. Each chapter is broken into short cards, and every card follows the same five steps. A few optional video cards sit between them (companions and teach-back examples); they have no questions and do not count towards your progress.

**Hook.** A short clinical or historical story that contains the problem. Read it and form a view before you go on.

**Explore.** An interactive model you can manipulate: sliders, tables, simulations. Try to reach the target state described in the prompt; the card notices when you do. This is where the understanding happens, so do not skip it.

**Formalise.** My short explanation, with the formulas and a worked table. It will make more sense after the Explore step than before it.

**Practise.** For quantitative cards, freshly generated problems with your own numbers each time, a hint if you need one, and a full worked solution once you have attempted it. Every number is computed by the same code that runs the calculators; nothing is invented.

**Check.** A few questions whose wrong options are the mistakes I see most often. Each option explains itself, right or wrong.

Progress is mastery-based, not time-based. The site tracks, per concept, how confident it is that you know it, and it will ask you to revisit a concept a few days later rather than let you move on after one lucky answer. You can work in any order, but I recommend the chapter sequence for the first pass. If you are stuck, try the hints and worked solutions first; if you are still stuck, the *Ask your instructor* button in the corner opens WhatsApp with your question, your name and the card you are on, and we can carry on the discussion there. Sign in with the join code I have given you, and your progress is saved to your account, so you can move between your phone and your laptop; without an account it stays in this browser only.

Chapters 1 to 5 are open now. The remaining chapters will appear over the coming weeks, and I will keep revising the earlier ones as you tell me what confused you. Please do tell me; that feedback is how this site improves.

I hope you enjoy it. Epidemiology changed the way I see medicine, research and science, and I would like it to do the same for you.

Happy Learning!

Thank you,

Ram

*Dr Ramachandran Thiruvengadam, MBBS, MD, DCH, PhD*

*Associate Professor, Maternal and Child Health, BRIC-THSTI, Haryana, India*`,
};
