# Product fidelity audit

Date: 2026-10-24. This records what had drifted from the approved Panther Passage vision and what this repair changed. The application was not restarted. The catalog still has five chapters, fifteen milestones (M01–M15), forty-five tasks, and eleven required milestones.

## Source files actually read

Read in this repair and the work it continues: product overview, journey framework, personalization logic, journey map screen spec, asset registry, milestone and task datasets, student scenarios, progression, journey routing, painted-medallion coordinates, and the running screens. `04_Journey_Content/Complete_Milestone_Catalog.md` still describes the old résumé and interview milestones. It was not rewritten. Treat the JSON datasets and this audit as the current content.

No separate full-bleed original Journey Map file was found under `09_Assets`. The approved image in use is the existing crop registered as `journeyMapArtwork`.

## Inconsistencies and fixes

| What was wrong | Fix |
| --- | --- |
| Journey screen stacked scripture, statistics, and cards above a small map. | Journey uses its own compact header. The approved campus image sits directly under “Your Journey” and the Baccalaureate countdown. |
| Extra gold rings were drawn on top of the painted medallions. | Removed. The hit targets are transparent. A gold outline appears only for keyboard focus. |
| Tapping a painted medallion opened a second dialog before the milestone. | The painted control now opens `/journey/{id}` directly. |
| Home counted 203 days to commencement and led with résumé or interview recommendations. | Home counts days until a separate Baccalaureate date and offers the student’s next passage step. |
| Active copy included Build Your Resume, résumé review, Practice the Interview, and a simulated reviewer. | Those activities were removed from milestones, tasks, resources, events, and recommendations. Task ids T041–T043 and T081–T083 were kept and rewritten. Old completed checks are not copied onto the new prompts. |
| M01 and M02 used different catalog titles from the artwork. | Live titles are Discover Your Pathway and Build Your Graduation Readiness Plan for every student. |
| The countdown treated commencement as the destination. | Countdown uses simulated Baccalaureate **2027-05-09**. Commencement stays **2027-05-15** on the student record. The 100-day window opens **January 29, 2027**. |
| Before day 100, the map and the fifteen-step list were still available. | Both stay closed before the window. Chapter dots are hidden in that state. |
| Pathway preview did not exist, and post-M02 content was easy to mistake for one career track. | `/preview` opens five working pathway screens. Checks stay in page state. |
| Student screens used “demonstration student” and developer explanations. | Those lines were rewritten on Home, Journey, prayer, reflections, resources, events, achievements, and profile. Simulated events are still labeled simulated. |

## Journey map asset

Rendered file: `public/assets/panther-passage/04_Journey_Map/Mobile/Journey_Map_Campus_Artwork.png` (576×683). Registry source note: `docs/reference/Journey_Map_Approved_Reference.png`, rows 249–931. The running screen shows that campus, banner, path, lighting, and painted medallions. The app does not draw a second set of medallions.

Hit targets use percentages of that image:

| Slot | Milestone for a new student | Image center |
| --- | --- | --- |
| 0 | M01 Discover Your Pathway | 148, 632 |
| 1 | M02 Build Your Graduation Readiness Plan | 150, 568 |
| 2 | M03 Collect Your Story | 236, 490 |
| 3 | M04 Name Your Professional Direction | 322, 418 |
| 4 | M05 Introduce Your Future Self | 400, 250 |

The upper three move with the student’s current canonical steps. They are not a second copy of the painted check marks. Browser clicks at 390px width opened M01 through M05 to those exact titles.

## 100-day model

`src/domain/passageCalendar.ts`

- Baccalaureate: 2027-05-09, labeled simulated. It is not an official university date.
- Commencement: 2027-05-15, unchanged on student records, not used for the countdown.
- Window opens January 29, 2027.
- Presenter clock, used when the app is opened without an explicit date: March 28, 2027, which is 42 days until Baccalaureate.
- Pre-launch clock, session key `panther-passage:clock` = `before`: January 1, 2027. The map and the fifteen-step list stay closed. The preview page button “See the passage before it opens” sets that key.
- Completing a milestone does not change the day count. M01 and M02 can both be finished on day 100. The app does not relabel that day as day 98.

## Personalization

M01 and M02 are one shared pair. After them, the live graph is still the approved fifteen milestones. Pathways differ by recommendation and by the preview tracks:

| Direction | Approved name kept | Preview milestones | Activity prompts |
| --- | --- | --- | --- |
| Continue My Education | Continue My Education | M07, M12, M13 | Programs, requirements, application step |
| Start My Career | Start My Career | M04, M05, M06 | Direction, strengths, one opportunity. No résumé or interview. |
| Build My Business | Start a Business | M07, M10, M13 | Offer, costs, money decision |
| Independent Living & Financial Readiness | Life After Graduation and Financial Independence | M10, M12, M13 | Housing, monthly costs, money boundary |
| Purpose, Wellness & Personal Growth | Wellness & Balance, with Leadership & Legacy | M03, M11, M14 | Pressure, rest, one practice |

Independent living and purpose are onboarding priorities, not new pathway ids. The dependency graph still requires M04 before M05 and M08 before M10 for every student. That is a remaining limit: the live passage does not yet give each student a fully separate milestone sequence after M02.

## Data migration

Schema version stays 1. Optional `honoredMilestoneIds` and `contentRevision` were added. If a saved passage had all three old M04 or M08 checks complete, those milestones stay complete in the graph, and the three checks and answers are cleared so the new prompts start unchecked. Seeded Avery and Morgan keep their completed milestones through that rule.

## What remains

- `Complete_Milestone_Catalog.md` still describes the removed résumé and interview tasks.
- The internal constant `RESUME_MILESTONE_ID` still names M04. Behavior is professional direction, and non-career students are not sent there when another step is open.
- Only five painted medallions exist. M06–M15 are reached from the list and chapter navigation.
- The milestone detail mark is still a small generated medallion. The map artwork was not redrawn.
- Crest image files named by the achievements dataset are still absent.
- The finale reuses the approved onboarding campus footer.
- A separate desktop screenshot of the map was not captured. Hotspots are percentages of the image, and the image is capped at 32rem so it is not stretched on a wide screen.
