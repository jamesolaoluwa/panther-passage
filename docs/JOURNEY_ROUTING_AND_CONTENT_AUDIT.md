# Journey routing and content audit

Superseded for résumé and interview content by `docs/PRODUCT_FIDELITY_AUDIT.md`. M04 is no longer Build Your Resume, and the résumé reviewer was removed. The routing notes below remain as history of how the app used to prefer that step.

Date: 2026-10-24. This audit records where Panther Passage was behaving like a résumé app, what the approved catalog actually requires, and what the code now does. The five chapters, fifteen milestones, forty-five tasks, and dependency graph were not rewritten.

## What was wrong

| Source | Current destination before this correction | Intended destination | Cause |
| --- | --- | --- | --- |
| Home “Guides for this stretch”, `src/screens/HomeScreen.tsx` | First two catalog resources, which start with R01 Resume quality checklist, whenever the next milestone had no associated guide | Guides associated with the focused step, otherwise guides in the student’s pathway and priorities | Empty association fell through to `catalog.resources.slice(0, 2)`. R01 is the first record. |
| Those guide cards | `/resources`, which then opened R01 | `/resources?open={id}` for the guide that was actually recommended | The card link ignored the resource id. |
| Explore, `src/screens/ResourcesScreen.tsx` | Detail pane opened R01 as soon as the page loaded | No guide selected until the student chooses one, unless `?open=` names a real id | Initial state used `catalog.resources[0]`. |
| Home hero, `recommendNextMilestone` in `src/domain/journeyPath.ts` | Highest score, with required steps worth more than a pathway match, and priority matched by substring (`career-readiness`.includes(`career`)) | The open step that matches the pathway or priorities. The résumé milestone is not the fallback. | Scoring treated “required” as a reason to prefer M04 over an open non-career step. |
| Home events | Mock Interview Studio always listed first | Career events first only when the student chose career or career readiness | The array order in `events.json` was used as the ranking. |
| Chapter dots, `ChapterRail` in `src/screens/JourneyScreen.tsx` | A milestone inside that chapter: the active one, else the first unlocked, else the first. Build Your Toolkit’s first milestone is M04. | The chapter overview for that chapter | There was no chapter route, so the toolkit chapter opened Build Your Resume. |
| Chapter jump controls | Scrolled the long list | Same chapter overview | They were buttons, not destinations. |
| Milestone “Open the next step”, `MilestoneScreen.tsx` | The next milestone by sequence that was active, available, or in progress. After M03 that is often M04. | The goal match, or the next non-résumé passage step, or the chapter overview when M04 is only a catalog gate | Sequence order was used as a universal Continue target. |
| My Chapter, `NextChapterScreen.tsx` | One page with a goal form, a working note, and hardcoded links to M10, M11, and M13 | Seven planning pages. Connected steps follow the pathway. Career steps appear when career was chosen. | The screen was a single form, and the connected list was a fixed id array. |
| Faith | Not present. An earlier reference screenshot mentioned a faith resource that is not in the dataset. | Optional scripture and prayer, plus the existing nonreligious reflections. Neither blocks readiness. | No route existed. Adding it as a required milestone or a fake catalog resource would have changed the approved journey. |
| Journey artwork medallions | Decorative. Not controls. | Stay decorative | The painted marks are not the fifteen catalog milestones. Giving them hit targets would map the wrong ids. |
| Invalid ids | Milestone fallback returned to `/journey`. Chapter ids had no page, so `/journey/chapter` could have been read as a bad milestone id. | Same fallback, now also for unknown chapters. A task id from another milestone stays on the current step. | `?task=` was ignored, and there was no chapter route. |

## Catalog facts that were not routing bugs

These records are résumé-heavy or career-gated. They were not deleted.

- M04 Build Your Resume is required. M05 depends on M04. M07 depends on M05. Money, wellness, launch, and legacy therefore sit behind a résumé milestone even for students who did not choose career.
- M05 Introduce Your Future Self and M08 Practice the Interview are also required career milestones.
- M03, M06, M09, and M12 remain the four optional milestones.
- Six simulated guides exist. Only R01 is a résumé guide, and it is correctly associated with M04 only.
- No approved resource covers identity, entrepreneurship as its own category, graduate applications, housing, or faith.
- Events are a mock interview and a community circle. Both are simulated.
- Purpose lines in `milestones.json` repeat “Grow practical confidence through {category} preparation.” That is dataset copy, not a route.

## Proposed content revisions (not applied)

These would need a new approval before the JSON changes:

1. Let M07 depend on M02, or make M04 optional, so entrepreneurship, graduate school, money, and wellness are not locked behind a résumé.
2. Add simulated guides for a graduate-school plan, a first business sketch, a housing comparison, and a nonreligious purpose prompt. Do not invent a university office as the provider.
3. Add simulated events for budgeting, relocation, and community that are not interviews.
4. Rewrite the repeated purpose sentences so each milestone says what the student actually does.

## What the correction does

- `selectJourney` recommends an open milestone only when its category matches the pathway or an exact priority mapping.
- M04 scores as a recommendation only when the pathway is career or the priorities include career readiness.
- If another eligible step exists, Continue will not use M04 as the unlabeled destination. If M04 is the only remaining eligible step, the hero goes to that chapter overview and says later steps have a required stop.
- An in-progress step is resumed, including M04 if the student already started it.
- Changing the onboarding profile does not clear `completedMilestoneIds`.
- Chapter dots and chapter chips go to `/journey/chapter/:chapterId`. Each milestone link on that page uses that milestone’s id.
- `/journey/:milestoneId` still opens that milestone. `?task=` opens that task only when it belongs to the milestone.
- Unknown milestone and chapter ids return to My Passage or My Chapter. They do not go to M04.
- Home guides use `recommendResources`. R01 is used when the focus is M04 for a student with career intent, or when the focused category is career and no closer guide exists. It is not the empty-state filler.
- Explore does not preselect R01.
- My Chapter is an overview plus `/next-chapter/direction`, `goals`, `support`, `circle`, `prepare`, `wellness`, and `first-90`.
- `/reflections` stays the nonreligious practice. `/reflections/faith` is optional King James prompts and a private prayer. Saving either does not change readiness.
- The campus artwork, welcome image, type, and colors were left in place. Painted medallions were not given hit targets.

## Header correction, same day

The shared header no longer prints the student name, countdown, preparation count, or readiness count. Those calculations remain. Home still shows the countdown from the student’s graduation date, and it is set larger during the final 100 days. `/readiness` states the required-step count separately from the calendar. The header now previews a public-domain King James verse, with Read Today’s Prayer at `/reflections/prayer` and Reflect on This at `/reflections/today`. A nonreligious reflection is on that page and at `/reflections`. None of these routes change milestone progress.

A second pass of the résumé routing found no new fallback. Continue, chapter links, home recommendations, guides, and My Chapter still follow the rules above. M04 and M08 remain available when a student is actually on those steps. They are not the destination for an unrelated action.
