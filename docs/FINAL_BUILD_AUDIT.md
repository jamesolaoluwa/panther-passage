# Final build audit

Panther Passage remains a proposed competition demonstration. Nothing in the app is an official Philander Smith University service, clearance process, or measured outcome.

## Visual sources

| Screen | Source used |
| --- | --- |
| Welcome | `public/assets/panther-passage/03_Welcome/Welcome_Approved_Frameless.png` |
| Onboarding footer | `public/assets/panther-passage/02_Campus/Panther_Passage_Onboarding_Campus_Footer.png` |
| Journey map | `public/assets/panther-passage/04_Journey_Map/Mobile/Journey_Map_Campus_Artwork.png` (576×683 crop of the supplied screenshot, rows 249–931) |
| Finale atmosphere | The same approved onboarding footer, not a new illustration |
| Milestone, dashboard, and supporting screens | Live interface using Fraunces, Manrope, evergreen, gold, and ivory. No milestone-details reference image was in the repository. |
| Chapter crests | Named in the interface. `09_Assets/Achievements/crest-*.svg` is not present, so no crest image is shown. |

The journey file is the original artwork. The app does not redraw the campus, the path, or the medallions. Painted labels inside that picture are not catalog titles and are not treated as live progress.

## Behavior that is implemented

- Thirteen route families: welcome, onboarding, home, journey, milestone detail, resources, events, achievements, next chapter, reflections, readiness, destination, profile, plus not-found.
- Four-item navigation: Home, My Passage, Explore, My Chapter. Events, achievements, reflections, readiness, and the finale are linked from those screens.
- Fifteen milestones and forty-five tasks. Completion is derived from task checks. Text is required when a task label asks the student to write, draft, list, or allocate.
- Optional milestones remain M03, M06, M09, and M12. M15 still depends on M13.
- Readiness is 11 required milestones. The calendar countdown is separate and does not open the finale.
- Crests are awarded once per chapter when that chapter’s required milestones are complete.
- Bookmarks, RSVPs, reflections, goals, and preferences are stored per fictional student and cleared by that student’s reset.
- Scenario switch loads Jordan at `/`, and Avery or Morgan at `/home`, without mixing their saved records.

## Checks actually run

- Typecheck passed.
- Vitest passed: 14 files, 71 tests, including unlock rules, onboarding, journey artwork, task completion, bookmarks, RSVP, reflections, goals, and the finale gate. Re-run and still passing after the tablet layout changes.
- Production build passed, with the usual single-chunk size warning.
- Rendered welcome, onboarding, home, journey, milestone detail, resources, and profile were inspected in the iPad Air 13-inch (M3) simulator on iOS 26, Safari WebKit, with a standardized 9:41 status bar.

## iPad responsiveness audit

Checked with viewport emulation and simulator rendering, in portrait and landscape, plus a phone regression pass. Measurements compared document scroll width against the viewport width.

- No horizontal overflow was found on welcome, onboarding, home, journey, milestone detail, resources, or profile at 390px, 744px, 820px, 1024px, 1180px, 1194px, or 1366px.
- The welcome image stays centered and letterboxed on ivory with no crop.
- The journey map buttons stay aligned to the painted medallions, since both are positioned by percentage over the same artwork. The two-column map and list appears from 900px.
- Scenario switching from Profile loads Jordan, Avery, and Morgan with their own seeds; Avery showed 7 of 15 preparation and 5 of 11 required after switching.

Issues found and fixed:

- iPad mini portrait, 744px, left the main column at the 430px phone width with wide empty margins. Added a 680px step from 744px wide in `src/components/layout/AppShell.tsx`.
- Onboarding was capped at 430px on every iPad, and the approved campus footer rendered only 430px wide. Widened the onboarding content column to 620px from 744px wide and made the footer span the full width, capped at 860px, in `src/screens/OnboardingScreen.tsx`, `src/components/onboarding/OnboardingChrome.tsx`, and `src/components/onboarding/OnboardingCampusFooter.tsx`. The footer image is scaled by width only and is not cropped.
- The milestone task dialog had no height cap, so a reduced viewport from the on-screen keyboard could hide the complete and close controls. Capped it at the viewport height with internal scrolling in `src/screens/MilestoneScreen.tsx`. Verified on a 380px-tall viewport that both controls stay reachable.

## Recording readiness

- Added `public/manifest.webmanifest` and Apple web-app meta tags in `index.html` so the demo can launch full screen from the home screen. No custom home-screen icon is bundled; the approved wordmark is not approximated into an app icon.
- `docs/DEMO_WALKTHROUGH.md` has step-by-step iPad simulator recording instructions.
- Before and after reference screenshots are in `docs/screenshots/ipad/`.

## Intentional limits

See `docs/KNOWN_LIMITATIONS.md`.
