# EpiCompass

EpiCompass is a self-paced, mastery-based epidemiology course delivered as a web app. It is keyed to Rothman, Huybrechts & Murray, *Epidemiology: An Introduction*, 3rd edition. All teaching content is original; no text from the book is reproduced, and the book is cited as reading only. All data in the app are synthetic.

Learners work through short cards (hook, explore, formalise, practise, check). Each check updates a Bayesian knowledge-tracing estimate per concept, and progress gates what comes next.

## Status

Version 0.1 contains Chapters 1 to 5 (27 core cards, 81 check items, 8 exercise templates and 12 interactives, plus 4 optional video cards that do not count towards progress). Chapters 6 to 15 appear on the course map as placeholders. Student questions go to the instructor on WhatsApp; there is no AI tutor yet.

## Repository layout

- `apps/web`: React 18 + Vite app (`src/content`, `src/interactives`, `src/exercises`, `src/store`, `src/ai`, `src/pages`, `src/components`).
- `packages/epi-core`: TypeScript maths library (occurrence, association, stratified analysis, simulation, mastery, diagnostic measures) with vitest tests.
- `packages/epi-core-py`: Python port of the same library, standard library only, with pytest tests.
- `tests/vectors/epi-core.json`: test vectors shared by both implementations.

## Running

```
npm install
npm run dev        # start the web app
npm test           # epi-core tests (vitest)
npm run test:py    # Python port tests (pytest; pip install pytest first)
npm run build      # type-check and build both packages
```

## Architecture in v0.1

The app is a static site (GitHub Pages) with Supabase for accounts and progress sync.

- Content lives in TypeScript modules (`apps/web/src/content`), typed by `content/types.ts`.
- Progress is cached in `localStorage` (`store/progress.ts`) and, for signed-in students, synced to Supabase (`store/account.ts`).
- Exercises come from a deterministic engine (`exercises/engine.ts`): a seeded generator draws parameters, a solver built on `epi-core` computes the key, and the narrative is slot-filled.
- *Ask your instructor* (`components/TutorPanel.tsx`) hands the question to the instructor on WhatsApp. A rule-based tutor stub (`ai/tutor.ts`) remains in the code for a future AI tutor but is not shown to students.

## Next increments

- A FastAPI gateway to Claude for the Socratic tutor and narrative generation. API keys stay on the server.
- Chapters 6 to 15.

## Numbers are computed, never generated

Every numerical value shown to a learner, whether in an exercise key, a worked solution or a tutor reply, is computed by `epi-core`. A language model may write narrative around a scenario or ask guiding questions, but it never supplies a number. The tutor must also refuse to reveal the answer to an open exercise.

## Extending the content

- **Card**: add a `Card` object to the `cards` array of the relevant chapter in `apps/web/src/content/chapters/chNN.ts`. Concepts it teaches must exist in `content/concepts.ts`.
- **Interactive**: write a component that accepts `InteractiveProps` in `apps/web/src/interactives/unitA` (or `unitB`), add an `InteractiveMeta` entry to that folder's `index.ts`, and reference its `id` from a card's `explore.interactive`. Call `onReached(true)` when the learner reaches the target state.
- **Exercise template**: add an `ExerciseTemplate` (parameter ranges, constraints, narrative, solver, answer fields, hints, solution) to `apps/web/src/content/templates/index.ts`, and reference its `id` from a card's `practise.template`. The solver must use `epi-core`.

## Shared test vectors

`tests/vectors/epi-core.json` holds input and expected-output cases whose expected values were computed independently with scipy. Both test suites read this file and compare to a relative tolerance of 1e-6. When you add or change a function, add a vector so the two implementations stay in agreement. The Python tests also pin the first five outputs of the Mulberry32 generator for seed 42, so simulations are reproducible across languages.

The implementations differ in one respect: the TypeScript normal CDF uses the Abramowitz and Stegun approximation (error below 7.5e-8), whereas the Python port uses `math.erfc` and is exact to double precision. Confidence intervals use the same fixed z table in both.

## Student accounts and the class dashboard

Students can use the app without an account (progress stays in their browser), or create one at **Sign in or join** with the cohort join code, their name, email and a password. Signed-in progress is saved to Supabase and follows them across devices; anything they did as a guest on that device is merged in when they first sign in.

- Backend: Supabase project `odsrftvuceizketmcesy` (Mumbai). Schema, row-level security and the join-code trigger are in `supabase/schema.sql`.
- The publishable key in `apps/web/src/config.ts` is public by design; row-level security means students see only their own rows and only the instructor sees everyone's.
- The instructor's account is promoted once in the SQL editor: `update public.profiles set role = 'instructor' where email = '…';`
- **Ask your instructor** (bottom right) opens WhatsApp to the instructor with the student's name, card link and question pre-filled. The number is set on the Class dashboard, stored in `app_settings` (`supabase/tutor_contact.sql`) and returned only to signed-in cohort members.
- **Inline editing of course text** (instructor only): tick *Edit course text* in the sidebar, click any paragraph, check question, option or feedback, edit it as markdown with a live preview, and *Save changes* to publish to all learners. Edits are stored per paragraph in `epi_overrides` (`supabase/overrides.sql`) with a hash of the original, so if the repository text later changes the edit is flagged *outdated* on the dashboard instead of overwriting new content. Published edits are sanitised before display. Card titles, interactives and exercise templates are still edited in the repository.
- The **Class dashboard** (instructor only) shows the roster, a concept-mastery grid, the questions most often missed at the first attempt, CSV export, temporary-password resets and cohort join codes.
- Student data is for teaching only. Using it for research needs ethics approval and separate consent.
