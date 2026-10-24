# Final build audit

Panther Passage remains a proposed competition demonstration. Nothing in the app is an official Philander Smith University service, clearance process, or measured outcome.

## Visual sources

| Screen | Source used |
| --- | --- |
| Welcome | `public/assets/panther-passage/03_Welcome/Welcome_Approved_Frameless.png` |
| Onboarding footer | `public/assets/panther-passage/02_Campus/Panther_Passage_Onboarding_Campus_Footer.png` |
| Journey map | Approved campus file used as a full-width trailhead. Live nodes, banners, and the road are drawn from catalog data in `PassagePath`. |
| Finale atmosphere | The same approved onboarding footer, not a new illustration |
| Milestone, dashboard, and supporting screens | Live interface using Fraunces, Manrope, evergreen, gold, and ivory. No milestone-details reference image was in the repository. |
| Chapter crests | Named in the interface. `09_Assets/Achievements/crest-*.svg` is not present, so no crest image is shown. |

The campus file is the original artwork and is not redrawn. The winding path, chapter banners, and fifteen nodes are a separate live layer. Painted labels inside the campus picture are not catalog titles and are not treated as live progress. Student portraits are the user-supplied fictional photos in `public/assets/panther-passage/avatars/`, with the earlier SVGs as fallback.

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
- Vitest passed: 16 files, 81 tests, including unlock rules, onboarding, the live 15-node path, node pop-up Escape close, avatar photos, `diffPathStatuses`, task completion, bookmarks, RSVP, reflections, goals, and the finale gate.
- Production build passed, with the usual single-chunk size warning (about 727 kB before gzip).
- Deployed at `https://panther-passage.onrender.com` from `https://github.com/jamesolaoluwa/panther-passage`. Home, campus art, avatars, and milestone SVGs returned 200. Hard refresh of `/journey` returns 404 on this Render static site (no SPA rewrite applied by the MCP create). The Expo shell always enters at `/`.
- Rendered welcome and My Passage (Jordan, new student) on the iPad Pro 13-inch (M4) simulator in Expo Go, iOS 26, portrait, 9:41 status bar. The winding path, START bubble, node pop-up, two-column list, and Jordan photo avatar were visible. Avery and Morgan avatar files are served; switching those students was not re-walked in this simulator session after the 13-inch cutover.

## iPad responsiveness audit

Checked with viewport emulation and simulator rendering, in portrait and landscape, plus a phone regression pass. Measurements compared document scroll width against the viewport width.

- No horizontal overflow was found on welcome, onboarding, home, journey, milestone detail, resources, or profile at 390px, 744px, 820px, 1024px, 1180px, 1194px, or 1366px.
- The welcome image stays centered and letterboxed on ivory with no crop.
- The live path nodes are data-driven and sit on a serpentine road, not on painted medallions. The two-column path and list appears from 900px.
- Scenario switching from Profile loads Jordan, Avery, and Morgan with their own seeds; Avery showed 7 of 15 preparation and 5 of 11 required after switching.

Issues found and fixed:

- iPad mini portrait, 744px, left the main column at the 430px phone width with wide empty margins. Added a 680px step from 744px wide in `src/components/layout/AppShell.tsx`.
- Onboarding was capped at 430px on every iPad, and the approved campus footer rendered only 430px wide. Widened the onboarding content column to 620px from 744px wide and made the footer span the full width, capped at 860px, in `src/screens/OnboardingScreen.tsx`, `src/components/onboarding/OnboardingChrome.tsx`, and `src/components/onboarding/OnboardingCampusFooter.tsx`. The footer image is scaled by width only and is not cropped.
- The milestone task dialog had no height cap, so a reduced viewport from the on-screen keyboard could hide the complete and close controls. Capped it at the viewport height with internal scrolling in `src/screens/MilestoneScreen.tsx`. Verified on a 380px-tall viewport that both controls stay reachable.

## Recording readiness

- Recording target is the iPad Pro 13-inch (M4) Simulator in portrait, via `ipad-shell/` Expo Go WebView loading `https://panther-passage.onrender.com`.
- Status bar is overridden to 9:41, full battery, full Wi-Fi. Hardware keyboard is off. Appearance is light.
- `docs/DEMO_WALKTHROUGH.md` has the current recording steps. Use an external recorder.
- Simulator screenshots from this pass are in `docs/screenshots/ipad-13-01.png` and `docs/screenshots/ipad-13-02.png`.

## Intentional limits

See `docs/KNOWN_LIMITATIONS.md`.
