# Panther Passage — Implementation Audit

**Date:** 2026-10-24  
**Scope:** Documentation, datasets, design tokens, cursor rules, and files actually present on disk.  
**Code status:** The Vite app now includes welcome, onboarding, the journey artwork, and the remaining screen families. See `docs/FINAL_BUILD_AUDIT.md` for what was verified and what is still limited. The notes below keep the earlier decisions.

## Platform decision — final

Panther Passage is a **mobile-first web application** for the Last 100 Days HBCU Challenge demonstration. It runs in a phone browser and is meant to look and behave like a polished mobile app. It is not a native iOS or Android application.

The confirmed stack is React, Vite, TypeScript, Tailwind CSS, React Router, `@phosphor-icons/react`, Zod, browser `localStorage`, Vitest, and React Testing Library.

**2026-10-24 update.** A thin Expo SDK 53 shell now lives in `ipad-shell/`. It does not reimplement the product. It loads the deployed web app in a full-screen WebView so the iPad Pro 13-inch (M4) simulator can be recorded without Safari chrome. Expo Router is still unused. The web app remains the product.

The primary viewport is **390 × 844**. Layouts start as a portrait phone column and widen at 760px and 1040px so the dashboard and lists can sit in two columns. The campus artwork is now a full-width trailhead scene; live nodes sit on a separate winding path.

This decision replaces the stack recommendation in the master build instructions and the earlier “exact first implementation step” in this audit. Journey rules, fictional students, asset limits, and the Expressive Collegiate Editorial identity still stand. The plum/maroon token file remains unused. The working palette is the provisional evergreen, gold, ivory, and slate set. Fraunces and Manrope are labeled stand-ins, not Recoleta.

## Journey map artwork

The My Passage screen shows the campus scene from the supplied screenshot, cropped to rows 249–931 so the baked phone header and bottom navigation are not drawn a second time. File: `public/assets/panther-passage/04_Journey_Map/Mobile/Journey_Map_Campus_Artwork.png` (576×683). The full screenshot is kept at `docs/reference/Journey_Map_Approved_Reference.png` and is byte-identical to the upload.

**2026-10-24 update.** My Passage still uses that approved campus file as a full-width trailhead backdrop. The live passage is now a data-driven winding path (`src/components/journey/PassagePath.tsx`) with all fifteen catalog nodes, chapter banners, an SVG road, and a Duolingo-style node pop-up. Status still comes from the catalog, not from painted labels in the artwork. The “All fifteen steps” list remains the accessible structured view.

## Welcome screen — Phase 2 (image-first)

The welcome route `/` shows the user-supplied frameless export of the approved design, unmodified: `public/assets/panther-passage/03_Welcome/Welcome_Approved_Frameless.png`, 576 × 1024 PNG, SHA-256 `EE39F8844CAA819446C71750B9946FF3CC5D3BE747967EF4894B9FDCE230C7F4`. The upload arrived with a `.jpg` name but is PNG data; only the filename changed. The older `Welcome_Screen_Standalone_Reference.png` and the two phone mockups are not used.

- The image is scaled with contain behavior, never cropped, and centered on `#F7F4EB`. On a 390 × 844 viewport this leaves about 75px of ivory above and below.
- An empty, transparent `<button aria-label="Get Started">` sits over the drawn button. It uses pixel bounds x 122, y 858, 330 × 62 (gold border included), converted to percentages of an aspect-locked frame so it follows the image in pure CSS. Its height never drops below 44px.
- The image's `alt` carries the required description. The app header, status line, and tab bar are not shown on `/`. If the image fails to load, a readable text version with a real Get Started button appears instead.
- **Limitations:**
  - 576 × 1024 is low resolution for 3× phone screens and will look slightly soft.
  - The words in the image cannot be resized or translated by assistive tools. The alt text is their only text equivalent.

## Onboarding step 1 — Phase 3 (approved reference, real form)

**Source of truth.** The user-supplied approved design is saved at `docs/reference/Onboarding_Step1_Approved_Reference.png` (576 × 1024 PNG, SHA-256 `4817E5EF…A2CE587A`). It overrides `06_Screen_Specifications/Onboarding_Screens.md` and `03_Features/Onboarding.md`. Those specs call for the heading "Make this passage yours.", a "Begin My Passage" button and a fictional-persona switcher; none of these is used on this screen.

**Campus artwork.**
- Official footer: `09_Assets/02_Campus/Panther_Passage_Onboarding_Campus_Footer.png`, 1774 × 577, 32-bit PNG with a transparent fade and a gold base. Copied without changing pixels to `public/assets/panther-passage/02_Campus/Panther_Passage_Onboarding_Campus_Footer.png`. SHA-256 `016C0D05…54D147E9`.
- Shared component: `OnboardingCampusFooter`. Used on all four onboarding routes. Decorative (`alt=""`, `aria-hidden`, `pointer-events-none`), in normal flow below the form, on `#F7F4EB`.
- The earlier crop from the Step 1 screenshot is no longer used.

**Implementation.**
- Route `/onboarding`, `src/screens/OnboardingScreen.tsx`, with validation in `src/domain/onboarding.ts`.
- The app header and tab bar are hidden on this route.
- Colors were sampled from the reference and added to `globals.css`. The onboarding surface is `#F7F4EB` so the official footer fade matches the approved ivory.
- Entered answers are saved to `progress.onboardingProfile` in the active fictional student's local record. They never overwrite that student's seed data, are sent nowhere, and are cleared by scenario reset.
- Routes: `/onboarding` (step 1), `/onboarding/direction` (step 2), `/onboarding/priorities` (step 3), `/onboarding/confirmation` (step 4). A valid Continue on step 1 opens step 2. `Enter My Journey` sets `onboardingComplete` and opens `/home` without changing milestone progress.

**Open decisions and conflicts.**
- **Student ID field vs. the rule "no fake credential prompts".** The approved design asks for a student ID. It is stored only locally, never verified, and treated as demo text. A visible demo label was not added because the brief forbids extra copy. This needs a product decision.
- **Provisional option lists.** No verified major list or graduation calendar exists. Majors appear under the dropdown group "Sample majors (demo list, not official programs)". Graduation options are terms only (Fall 2026 – Spring 2028, Not sure yet) and are never converted to dates.
- **Student ID format.** Validation accepts 1–20 letters, numbers or hyphens. This is a provisional sanity check, not a known university format. The value is stored as a string, so leading zeros are kept.
- **WCAG 2.2 AA risks, kept to match the approved look.**
  - The field border `#D3CFC6` is about 1.5:1 against the page, below the 3:1 non-text guideline.
  - The gold asterisk is about 2.2:1. Required state is also conveyed programmatically.
  - Placeholder text was darkened from the sampled `#7E7C7F` to `#6F6D70` (about 4.9:1).
- **Deliberate deviations from the reference.**
  - Fields are 48px tall (reference ≈ 36px) for touch.
  - Typed text is 16px to avoid iOS focus zoom; placeholders are 14px, or 13px under 385px wide.
  - The heading is sized by width (one line, about 77% of the screen) because Fraunces is a stand-in font and wider than the reference face.
  - On tall phones, extra ivory sits between Continue and the bottom-anchored artwork, because the reference is a 9:16 image and phones are taller.

Panther Passage is a **proposed** Last 100 Days HBCU Challenge experience for graduating students at Philander Smith University. It is not an official university system, clearance tool, or live service directory.

## 1. How conflicts were judged

When sources disagree, this audit uses the workspace authority order:

1. Latest explicitly approved visual references that were actually inspected.
2. Approved concept decisions recorded in `PROJECT_CONTEXT.md` and `ASSUMPTIONS_AND_DECISIONS.md`.
3. Screen and design specifications, when they are specific.
4. Files that exist and were opened, over manifests that only claim they exist.
5. `08_Demo_Data` plus `03_Features/Business_Rules.md` and `04_Journey_Content/Progression_Rules.md` for journey behavior.
6. Proposed technical notes.
7. New implementation choices, which stay labeled provisional.

`CURSOR_MASTER_BUILD_INSTRUCTIONS.md` is present as `CURSOR_MASTER_BUILD_INSTRUCTIONS.md.md`. There is no file named `CURSOR_MASTER_INSTRUCTIONS.md`. The double-extension file was read in full and treated as the master build instruction.

`PACKAGE_FILE_INDEX.json`, `PACKAGE_AUDIT.md`, `12_Cursor_Handoff/Known_Gaps.md`, and `05_Design_System/Brand_Guidelines.md` describe an earlier starter package. The later `09_Assets` library is on disk and overrides those “file missing / file present” claims wherever a hash or visual inspection disagrees.

## 2. Workspace reality

| Item | Finding |
|---|---|
| Application source | None. No `package.json`, `src/`, framework config, or tests. |
| Git | No `.git` repository. |
| Documentation | Folders `01` through `12`, plus root context files, are present. |
| Demo data | Nine JSON files in `08_Demo_Data/`. All parse as JSON. |
| Design tokens | `05_Design_System/Design_Tokens.json` is present and explicitly provisional. |
| Visual library | `09_Assets/` contains raster references, state medallions, route SVGs, and handoff notes. |
| Fonts | No `.woff`, `.woff2`, `.ttf`, or `.otf` files. |
| Rules | Seven files in `.cursor/rules/`: `00` through `60`. |
| Stale index | `PACKAGE_FILE_INDEX.json` lists rule names, chapter SVGs, crest SVGs, and `CURSOR_MASTER_INSTRUCTIONS.md` that are not the current tree. |

Root `SKILL.md` and `.cursor/skills/frontend-design/SKILL.md` are a generic marketing-site skill (giant headings, “no cards,” scroll-pinned scenes). `.cursor/rules/20-frontend-excellence.mdc` already says those marketing rules do not apply to this student application. Product rules and the approved Panther Passage references govern the UI.

## 3. Documents reviewed

Reviewed in full or to the point of extracting every route, data rule, token, and asset claim:

- Root: `README.md`, `PROJECT_CONTEXT.md`, `ASSUMPTIONS_AND_DECISIONS.md`, `PACKAGE_AUDIT.md`, `PACKAGE_FILE_INDEX.json`, `EXTERNAL_REFERENCES.md`, `CURSOR_MASTER_BUILD_INSTRUCTIONS.md.md`.
- `01_Product_Strategy/` through `12_Cursor_Handoff/`.
- `05_Design_System/Design_Tokens.json` and the color, type, icon, motion, layout, and component specs.
- All nine files in `08_Demo_Data/`.
- `09_Assets` manifest, audit, usage guide, visual direction, missing-asset note, coordinates, screen mapping, icon system, and implementation guide.
- All seven `.cursor/rules/*.mdc` files.

Screen specifications in `06_Screen_Specifications/` share one template: the same shell, the same emotion line, and the same six acceptance checks. The distinctive content in each file is the route, H1, primary CTA, and one screen-specific sentence. Feature specs and the inspected visuals have to carry layout decisions the screen files do not specify.

## 4. Confirmed product decisions

These are stable enough to build against:

- Name: **Panther Passage**. Frame: **100 DAYS OF BECOMING**.
- Audience: graduating students, demonstrated with fictional profiles only.
- Purpose: practical post-college preparation. Points do not gate access and are not a score to chase.
- Creative direction: **Expressive Collegiate Editorial**. Campus architecture, a winding passage, editorial type, warm surfaces. Candy Crush is a navigation metaphor only. Do not copy its art.
- Welcome supporting sentence, once, under Get Started: “Plan your next steps, discover resources, and move confidently toward graduation and beyond.”
- No “I already have an account” footer.
- Get Started opens onboarding. There is no university login.
- Calendar countdown and preparation progress are separate. Neither is official graduation clearance.
- Fifteen milestones, `M01`–`M15`, in five chapters, `P1`–`P5`. IDs stay stable.
- Three fictional scenarios: Jordan Ellis (new), Avery Brooks (in progress), Morgan Reed (almost graduated). Shared seed graduation date `2027-05-15`.
- Local persistence, demo reset, and offline core flows. No SSO, live calendar, or invented university services.
- Resources and events in the datasets are already labeled simulated.

The five-chapter / fifteen-milestone catalog is still marked **proposed** in `ASSUMPTIONS_AND_DECISIONS.md`. The approved concept PDF is not in the workspace. Build the supplied catalog, and keep it replaceable. Do not rename IDs.

## 5. Screens and routes

Use these routes from `06_Screen_Specifications/Screen_Inventory.md`. React Router param syntax is `/journey/:milestoneId`; the public path shape stays the same.

| Screen | Route | Live H1 | Primary action |
|---|---|---|---|
| Welcome | `/` | Your next chapter starts here. | Get Started |
| Onboarding | `/onboarding` | Make this passage yours. | Begin My Passage |
| Home | `/home` | Your next move starts here. | Continue My Passage |
| Journey map | `/journey` | Every step becomes part of your story. | View Milestone |
| Milestone detail | `/journey/:milestoneId` | One meaningful move at a time. | Complete Milestone |
| Resources | `/resources` | Tools for the road ahead. | Open Guide |
| Events | `/events` | Make room for connection. | Save Demo RSVP |
| Achievements | `/achievements` | Look how far you have come. | See My Passage |
| Next Chapter | `/next-chapter` | Your future deserves a first draft. | Save My Plan |
| Reflections | `/reflections` | What will you carry forward? | Save Reflection |
| Readiness | `/readiness` | Prepared in ways that matter. | Continue Readiness |
| Final destination | `/destination` | You made it. Now carry it forward. | Open My Next Chapter |
| Profile | `/profile` | Your passage, your pace. | Save Preferences |

Invalid milestone IDs outside `M01`–`M15` get a recoverable not-found state. A locked deep link explains the unmet `dependsOn` milestone and links to it.

**Primary navigation** from `02_User_Experience/Information_Architecture.md`:

- Home → `/home`
- My Passage → `/journey`
- Explore → `/resources`, with events reached from Explore
- My Chapter → `/next-chapter`
- Profile from the header, not the four-item bar

The portrait journey mockup shows Journey / Resources / Community / Profile and a hardcoded “100 DAYS TO GRADUATION.” That chrome is baked into a provisional picture. It is not the navigation contract. There is no Community route.

Demo controls (load Jordan, Avery, Morgan, and reset) live in a discrete demo area, not in the student tab bar.

## 6. Journey data the map must use

### Chapters

| ID | Title | Editorial window | Theme |
|---|---|---|---|
| P1 | Find Your Footing | 100–81 days | Identity & intention |
| P2 | Build Your Toolkit | 80–61 days | Readiness & resources |
| P3 | Make Your Moves | 60–41 days | Action & connection |
| P4 | Ready for What’s Next | 40–21 days | Confidence & continuity |
| P5 | Carry It Forward | 20–0 days | Legacy & launch |

Chapter windows are editorial labels. They are not the live countdown and they do not unlock nodes.

### Milestones

Each milestone has exactly three tasks, `Txx1`–`Txx3`. All 45 task records point at the milestone that lists them. Every task is `required: true` **inside its milestone**. A milestone with `"required": false` can be skipped without blocking the ceremony; if the student opens it, its three tasks still have to be completed to finish that milestone.

| ID | Chapter | Required | Depends on | Title |
|---|---|---|---|---|
| M01 | P1 | yes | — | Name Your North Star |
| M02 | P1 | yes | M01 | Take Your Readiness Snapshot |
| M03 | P1 | no | M02 | Collect Your Story |
| M04 | P2 | yes | M02 | Build Your Resume |
| M05 | P2 | yes | M04 | Introduce Your Future Self |
| M06 | P2 | no | M05 | Make a Connection |
| M07 | P3 | yes | M05 | Explore Your Options |
| M08 | P3 | yes | M07 | Practice the Interview |
| M09 | P3 | no | M08 | Find a Support Circle |
| M10 | P4 | yes | M08 | Map Your Money |
| M11 | P4 | yes | M10 | Plan Your Wellbeing |
| M12 | P4 | no | M11 | Explore a City or Community |
| M13 | P5 | yes | M11 | Create Your 30-Day Launch Plan |
| M14 | P5 | yes | M13 | Leave a Legacy Note |
| M15 | P5 | yes | M13 | Cross the Threshold |

The graph is not a single chain. After M02, M03 and M04 can both be available. After M05, M06 and M07 can both be available. The same pattern repeats at M08/M09/M10, M11/M12/M13, and M13/M14/M15. M14 does not unlock M15. Both depend on M13.

Ceremony-required set is every milestone with `required === true`. That is 11 milestones. M15 is already in that set; do not add it twice. Optional milestones M03, M06, M09, and M12 never block the finale.

Progress displays:

- Preparation count: completed milestones / 15.
- Readiness count: completed ceremony-required milestones / 11.
- Countdown: local calendar days until the active profile’s graduation date, floored at 0. On 2026-10-23 the seed date `2027-05-15` is **204 days** away. Do not paint “100” because the brand line says 100 days.

### Seeded scenarios

Students do not store task checks. `Progression_Rules.md` says seeded completed milestones are pre-validated fixtures. Loading a scenario must mark that milestone’s three tasks complete, then derive locks, the current milestone, crests, and readiness from the rules.

| Scenario | Student | Pathway | Seeded complete | What should be available |
|---|---|---|---|---|
| `new` | S-A Jordan Ellis | career | none | M01 only. Onboarding still to do. |
| `in-progress` | S-B Avery Brooks | graduate-school | M01–M07 | M08 is the next core milestone. M06 is already done. |
| `almost-graduated` | S-C Morgan Reed | entrepreneurship | M01–M14 | M15 is available. Finale stays closed until M15 is actually completed. |

`demo_scenarios.json` sends every scenario to `/home`. That fights the new-student story. Provisional behavior: Jordan starts at `/` with onboarding incomplete; Avery and Morgan start at `/home` with onboarding already complete.

### Crest rule to implement

`03_Features/Business_Rules.md` and the `criteria` strings in `achievements.json` agree: a chapter crest is earned when every `required: true` milestone in that chapter is complete. P5 also requires M15, which is already required, so the P5 crest needs M13, M14, and M15.

`rewardId` on M03, M06, M09, M12, and M15 disagrees. Those IDs would award a crest for finishing the third node, including optional nodes, and could award the P5 crest before M14 is done. **Do not award from `rewardId`.** Derive crests from required chapter completion. Keep `rewardId` in the data for later reconciliation.

Points are 25 on milestones without a `rewardId` and 15 on milestones with one. M15 is required and still has 15 points, so the “25 core / 15 optional” sentence in `Rewards_System.md` does not match the file. Points stay in the dataset and stay out of the student interface.

### Other content counts

- 6 simulated resources, `R01`–`R06`, each tied to one milestone. Providers already say they are not university services. `url` is null.
- 2 simulated events, `E01` and `E02`, with capacity and a seeded `rsvpCount`. RSVP copy must say the seat is a demo save.
- Personalization is a documented scoring rule in `Personalization_Logic.md`. It may reorder the home recommendation. It must not hide milestones.

### Task completion ambiguity

Task `type` is `checkbox-or-saved-text`, and the validation line says text of 1–500 characters applies “where entered.” `Business_Rules.md` says a task that asks for text needs a nonempty trimmed value. Several labels are writing tasks (“Write your north-star statement,” “Write a 50-word story”) and others are confirmations (“Confirm your starting point”).

**Provisional rule:** if the label asks the student to write, draft, list, or allocate, require trimmed text of 1–500 characters. If the label is only a confirmation, a checked box is enough. Store both the check and the text. Undo is allowed. Unchecking a prerequisite does not delete later notes; downstream milestones display `needs review` until the dependency is restored.

## 7. Design direction

The product should feel like one editorial passage: stitched green-and-gold varsity lettering, warm ivory surfaces, brick and arch as atmosphere, a gold path, and serif headlines with a readable body face. Screens should not collapse into a repeated card grid, a purple SaaS dashboard, or glassmorphism.

### Palette conflict

Two palettes are written down.

`05_Design_System/Design_Tokens.json` and `Color_Palette.md` use plum `#4C253E`, maroon `#782C43`, rose `#B45D73`, gold `#D0A34A`, ivory `#FFFDF9`, and ink `#221C22`. The file says every hex is provisional and not an official university color. `Creative_Direction.md` describes plum fields.

The inspected logo, welcome references, journey references, and the milestone/path SVGs use a different set, also written in `09_Assets/README.md` and `DESIGN_CONSISTENCY_RULES.md`:

| Working token | Hex | Role |
|---|---|---|
| Warm ivory | `#F7F4EB` | App background |
| Paper | `#FFFFFF` | Elevated surface |
| Evergreen | `#173F35` | Primary action, completed medallion |
| Vibrant evergreen | `#146B50` | Active medallion |
| Legacy gold | `#D7AD56` | Path and brand metal |
| Radiant gold | `#F2BD49` | Medallion rim and highlight |
| Midnight slate | `#263641` | Text |
| Sage mint | `#B8D9C9` | Quiet surface accent |
| Focus | `#214ED5` | Keyboard focus only, from the token file |

**Provisional decision:** build with the evergreen / gold / ivory / slate set, because it is the color relationship in the supplied logo and references. Centralize it. Label it provisional. Do not call it Philander Smith’s official palette. Keep the plum/maroon token file in the repo unused until the team picks one system. Gold is for path, metal, and large display moments, not small body text. Slate or evergreen carries text. Check contrast in the running UI before calling any pair accessible.

### Typography

Direction is Recoleta-inspired display type. No Recoleta file and no license are in the workspace. Do not download Recoleta.

**Provisional pairing:** Fraunces for display (SIL Open Font License, expressive serif, not Recoleta) and Manrope for UI text (OFL). Georgia and Arial remain the font-stack fallbacks named in the type spec. Document the substitution in the UI foundation so it can be replaced when a licensed display face arrives. `VISUAL_DIRECTION.md` also mentions DM Sans and Clash Grotesk as discussion notes; Clash is not licensed here and is not the body face.

Use the responsive scale in `Typography_and_Type_Scale.md` (hero 42/64, body 16, overline tracked uppercase). Do not adopt the generic skill’s 6rem-minimum and pinned-scroll rules.

### Icons

Functional icons come from `@phosphor-icons/react`.

| Context | Weight |
|---|---|
| Inactive navigation | regular |
| Active navigation | fill |
| Buttons | regular |
| Resource categories | duotone |
| Events | regular |
| Success | fill |
| Settings | regular |

`05_Design_System/Iconography.md` and `Recommended_Tech_Stack.md` suggest Lucide. The master instructions and `09_Assets/11_Cursor_Handoff/ICON_SYSTEM.md` win. Do not mix icon families.

Suggested Phosphor names for the four tabs: `House`, `Path`, `Books`, `Flag` or the closest semantic match already listed in `ICON_SYSTEM.md` (`MapTrifold`, `Books`, `UsersThree`, `UserCircle`) mapped onto Home, My Passage, Explore, and My Chapter. Record the final names in code comments next to the nav config. Medallions, the wordmark, the arch motif, and crests are custom artwork, not enlarged Phosphor icons.

### Motion

Meaningful motion only: welcome entrance, milestone selection, completion, unlock, chapter crest, finale. Durations already specified: 130ms quick, 240ms standard, about 650ms for the ceremony. Honor `prefers-reduced-motion` even though `MVP_Scope.md` once listed reduced motion as P1. `Functional_Requirements.md` FR13 and the accessibility rule make it P0.

## 8. Visual assets

### Use these

| Asset | Role | Constraint |
|---|---|---|
| `09_Assets/01_Branding/Logos/Panther_Passage_APPROVED_Logo_Original.png` | The wordmark | Stitched green “PANTHER,” gold “PASSAGE,” cap on the final R, ivory field. Use the pixels intact. Do not redraw, recolor, or restack the cap. The PNG is opaque, not a transparent SVG. |
| Welcome phone references, especially `Welcome_Updated_Landscaping_Phone_Mockup.png` | Composition reference | Logo, campus threshold, path, Get Started, supporting sentence below the button. Rebuild as HTML. Do not ship the PNG as the screen. |
| `Photoreal_Journey_Map_PREFERRED_REFERENCE.png` | Atmosphere benchmark | Winding brick path, arch, gold nodes, green completed nodes, locked nodes. |
| `Portrait_Journey_Concept.png` | Mobile atmosphere only | Same warning. Its labels and tab bar are not the catalog. |
| `06_Milestones/{Locked,Available,Active,In_Progress,Completed}/Milestone_*.svg` | Shared state medallions | One graphic per state, reused for all 15 milestones. Status still needs a text label. |
| `04_Journey_Map/Pathways/mobile_route.svg` (900×2400) and `desktop_route.svg` (1600×900) | Path geometry | Separate artboards. Do not stretch the phone path across desktop. |
| Completed-route SVGs | Progress treatment | The files draw the full path. Mask them to the completed portion in the app. |
| `Arch_Motif.svg`, `Path_Emblem.svg`, `Brick_Linework.svg`, `Ivory_Text_Scrim.svg` | Supporting motifs | Abstract. The arch is not a verified campus building. |

### Byte-identical files presented as different assets

| Pair | SHA-256 prefix |
|---|---|
| `Panther_Passage_APPROVED_Logo_Original.png` and `Panther_Passage_Logo_Previous_Reference.png` | `F9D49D2CF1EC` |
| `Photoreal_Journey_Map_PREFERRED_REFERENCE.png` and `Photoreal_Journey_Map_Alternate.png` | `9F89510FA0F6` |

There is one logo binary and one preferred map binary. The “previous” logo and the “alternate” map are copies. Do not design a before/after from them.

### Mislabeled files — do not use in the product

| File | What the manifest calls it | What inspection showed |
|---|---|---|
| `02_Campus/References/Campus_Photo_01.png` | Campus photographic reference | A wordmark reading “PHILANDER SMITH COLLEGE,” with “THINK JUSTICE” and “EST 1877.” Not a photograph. |
| `02_Campus/References/Campus_Photo_02.png` | Campus architecture image | A generic graduation-party invitation for “Sebastian Bennett,” including a phone number. Not campus architecture. |
| `02_Campus/References/Institutional_Logo_Reference.png` | Philander institutional insignia | An unrelated ID-card layout branded NONACAD / CGSI / Sosa Graphix, with fictional staff and students. Not this university’s seal. |

Generated welcome and map images also paint building signs as “PHILANDER SMITH COLLEGE” or “PHILANDER SMITH UNIVERSITY,” plus “P” and “PSU” banners. Those signs are not verified campus photography. Do not crop them into the product as official architecture, and do not recreate the College wording. The interactive UI should name Philander Smith University only as the competition context, in prose that does not imply an official deployment.

### Coordinates are not milestone positions

`JOURNEY_ASSET_COORDINATES.json` has 9 sample anchors on the mobile path and 8 on the desktop path. Its own note says they are illustrative positions for the generated vector, not a mapping onto the photograph or the milestone catalog. The sample code in `ASSET_IMPLEMENTATION_GUIDE.md` uses a node titled “Discover Your Pathway,” which is not an ID in `milestones.json`.

**Provisional map layout:** place the 15 milestones in `sequence` order along each path’s curve, inside that path’s viewBox, with chapter bands between P1–P5. Unlock state still comes from `dependsOn`, so a later node can be available while an earlier optional node is untouched. Ship a keyboard list of the same 15 records on the journey screen. Replace the generated positions when a real coordinate file keyed by `M01`–`M15` exists.

The photoreal maps already contain baked nodes, labels, and incorrect signage. `SCREEN_TO_ASSET_MAPPING.json` correctly marks a clean campus background as missing. Do not drop HTML buttons on top of the baked buttons.

### Missing artwork

These paths are referenced and absent:

- `09_Assets/Chapters/chapter-01.svg` through `chapter-05.svg`
- `09_Assets/Achievements/crest-1.svg` through `crest-5.svg` (the paths in `achievements.json`)
- `09_Assets/Icons/panther-passage-mark-provisional.svg`
- `09_Assets/Journey/passage-path.svg`
- `09_Assets/Textures/paper-grain.svg`
- `09_Assets/Welcome/welcome-environment-provisional.svg`
- A transparent or vector master of the wordmark
- A clean campus background with no baked UI and no incorrect institutional signage
- Unique medallion symbols per milestone
- A final graduation destination scene
- Resource-category illustrations
- Licensed Recoleta
- Responsive image variants (`responsive_variants` is empty on every manifest record; only three WebP companions exist)

Until crests and chapter plates arrive, use an accessible named fallback: chapter title, earned/locked text, and the arch or path motif marked provisional. Do not draw a substitute and call it the approved crest. Do not use the institutional reference file as a crest.

`ASSET_AUDIT.md` says 48 asset files were verified and that the approved logo was copied byte-for-byte from a distinct source. The logo copy is byte-identical to the previous-reference file, and several manifest descriptions do not match the images. Trust the files over that audit paragraph.

## 9. Conflicts that would change the build

| Topic | What to follow now | What to leave unused |
|---|---|---|
| Framework | Vite, React, TypeScript, Tailwind, React Router. Master instructions, because no framework is already installed and the Next.js note is labeled proposed. | `Recommended_Tech_Stack.md` and `Implementation_Prompts.md` saying Next.js App Router. `Component_Structure.md`’s `src/app/(routes)` layout can be adapted to Vite `src/screens`. |
| Icons | Phosphor | Lucide |
| Color | Evergreen, gold, ivory, slate from the logo and SVGs | Plum/maroon token set, until the team chooses |
| Display type | Fraunces as a labeled stand-in; Georgia fallback | Downloading Recoleta; treating Georgia as if it were the approved face |
| Welcome headline | “Your next chapter starts here.” from `content_copy.json` and `Welcome_Screen.md` | “Your last 100 days start here.” baked into the phone mockups |
| Welcome structure | Logo, scene, one supporting sentence, Get Started, no account link | Using the mockup PNG as the page |
| Journey content | `milestones.json` titles and dependencies | Mockup labels such as “Discover Your Pathway,” “Build Your Graduation Readiness Plan,” “Celebrate Graduation” |
| Navigation | Home, My Passage, Explore, My Chapter | Journey, Resources, Community, Profile on the portrait mockup |
| Crests | Required milestones in the chapter | `rewardId` as the award trigger |
| Countdown | Computed from `graduationDate` | A hardcoded 100 |
| Map background | SVG path plus DOM nodes, list fallback | Photoreal PNG as the hit-target layer |
| Reduced motion | P0 | The P1 line in `MVP_Scope.md` |
| New-student entry | `/` then `/onboarding` | `demo_scenarios.json` `startRoute: /home` for Jordan |
| Campus references | Stylized original motifs only | The three files in `02_Campus/References/` |
| Database and REST | In-memory repository described in `API_Contracts.md` | `Database_Schema.md` and the hypothetical `/v1` endpoints. They are future notes, not demo work. |

`PACKAGE_AUDIT.md` says five chapter illustrations and five crests are in the package. They are not on disk. `Known_Gaps.md` says the approved logo is absent. The logo PNG is present, with the duplicate-file caveat above. `Brand_Guidelines.md` points at a provisional arch mark that is not in the tree. Use the PNG wordmark, not a reconstructed SVG.

## 10. Technical gaps

- No toolchain, linting, formatting, or test runner.
- No typed models. `Data_Models.md` is a sketch and omits fields the JSON actually has (`year`, `avatarInitials`, `currentChapter`, `fictional` on students; event location and description).
- No versioned storage adapter. Target key shape from `Persistence.md`: `panther-passage:demo:v1:{studentId}`. Validate with Zod. Corrupt JSON falls back to the seed with an explicit warning. Reset is confirmed and scoped to the active fictional student.
- No progression engine. It should be a pure module, covered by unit tests before screens depend on it: unlocks, optional skips, M14 not blocking M15, crest idempotency, 15-vs-11 percents, countdown, scenario isolation.
- Screen specs will produce thirteen identical pages if implemented literally. Each screen needs the composition in its feature spec and, where a reference exists, the inspected artwork.
- State medallions are generic circles (arrow, lock, check). They are acceptable provisional state art. They are not fifteen unique milestone identities.
- Task UI has to support partial completion. A milestone is `available`, `active`, `in progress` (at least one task done), or `completed`. Locked nodes stay visible and explain why.
- Reflections render as text, never HTML. Private by default. Not sent anywhere.
- Readiness copy must say preparation progress, not that the university has cleared the student to graduate.
- Finale opens only when all 11 ceremony-required milestones are complete, including M15’s own tasks. Reaching the graduation date does not open it.
- Judge countdown will read about 204 days on this audit date. Scenarios should be introduced by progress (“just starting,” “in the middle,” “one milestone from the threshold”), not by pretending it is day 100, day 60, or day 5.

## 11. Implementation risks

1. **Generic dashboard drift.** Templated screen specs plus missing chapter art make a card grid the easy path. The welcome composition and the passage map have to stay specific to the supplied wordmark and path.
2. **Baked-mockup implementation.** Shipping a phone PNG, or aligning buttons to its two fake milestone chips, would freeze the wrong catalog and the wrong headline.
3. **False campus claims.** Several “reference” images are mislabeled, and generated signs disagree about College versus University. Using them as factual campus photography would misrepresent the institution.
4. **Linear map, branching data.** A single SVG curve cannot honestly show “M03 required before M04.” Sequence can follow the curve; status text and the list have to show the real dependencies.
5. **Crest files 404.** `achievements.json` points at SVGs that do not exist. A naive `<img src>` will break the achievements screen.
6. **Seed date versus brand countdown.** Hardcoding 100 days would contradict Avery and Morgan’s shared date and the progression rules.
7. **Duplicate award paths.** Implementing both `rewardId` and the chapter rule would grant crests twice or at the wrong time.
8. **Opaque logo on ivory.** Placing the PNG on a non-ivory background will show a box. Keep its backing ivory, or pad it; do not knock out the background by hand and call the result the original.
9. **Contrast.** Gold on ivory fails for small text. Evergreen buttons need white or ivory labels and a 3px focus ring that is not color-only.
10. **No concept PDF.** The catalog can still be wrong relative to an unseen approved deck. IDs and copy stay in JSON so a later reconciliation does not require a rewrite.

## 12. Provisional decisions for the prototype

All of these are reversible and should stay in one tokens/config layer:

1. Vite + React + TypeScript + Tailwind + React Router + Phosphor + Zod. Motion for React only for welcome, unlock, crest, and finale. Context plus a pure progression module. Zustand only if that module stops fitting in context.
2. Working palette is the evergreen/gold/ivory/slate set. Plum tokens stay documented and unused.
3. Fraunces + Manrope, with Georgia/Arial fallbacks, labeled as substitutes.
4. Wordmark is the existing PNG, used intact.
5. Journey nodes are the 15 JSON milestones, positioned along the existing SVG paths by sequence. List view is part of the same screen, not a later extra.
6. Crests derive from required chapter completion. Missing crest art uses a named provisional fallback.
7. Live welcome headline is the JSON/spec headline. Supporting sentence appears once.
8. Jordan’s scenario begins on the welcome screen. Avery and Morgan begin on home, already onboarded.
9. Points are stored and not displayed.
10. Campus reference images in `02_Campus/References/` are excluded from the UI.
11. The photoreal map is a design benchmark in docs, not the interactive background.
12. P0 includes the vertical slice first (welcome, onboarding, home, map, milestone, persistence, three scenarios), then resources, events, achievements, next chapter, reflections, readiness, and finale. Search within resources can follow filtering; `MVP_Scope.md` calls search P1, while the master instructions ask for it. Filtering ships in the first resources pass. Search ships in the same screen if it does not delay the slice.

## 13. Proposed implementation order

1. **Foundation.** Toolchain, provisional tokens, font loading, copy of only real assets into `public/`, Zod schemas, route shell, empty states for missing images.
2. **Progression engine and tests.** Unlocks, tasks, crests, countdown, readiness versus preparation, scenario load, reset, corrupt storage.
3. **Shared UI.** Type, buttons, focus, four-item nav, header wordmark, progress pair, milestone state, form fields, toasts.
4. **Core slice.** Welcome, onboarding, home, journey map plus list, milestone detail, persistence across refresh.
5. **Supporting screens.** Resources, events with simulated RSVP, achievements, next chapter, reflections, readiness.
6. **Finale.** Destination gated on the 11 required milestones, reduced-motion ceremony, link into Next Chapter.
7. **Demo hardening.** Scenario switcher, reset confirmation, responsive pass at 320, 375, 390, 430, 768, 1024, and 1440, keyboard pass, Playwright path from new student through unlock and refresh.

Do not write `docs/FINAL_BUILD_AUDIT.md` until those checks have actually been run.

## 14. Exact first implementation step

Scaffold the Vite + React + TypeScript app and the pure data layer, with no screen design yet:

1. Create the Vite React TypeScript project in this workspace.
2. Add Tailwind, React Router, Zod, and Phosphor. Defer Motion, Vitest UI, and Playwright until the shell runs.
3. Add semantic color and type tokens for the provisional evergreen/gold/ivory/slate palette and the Fraunces/Manrope pairing. Do not import the plum token set into components.
4. Copy only existing `09_Assets` files that this audit marks usable into `public/assets/panther-passage/`, preserving relative paths. Do not copy `02_Campus/References/`.
5. Type and Zod-validate the nine JSON datasets. Fail startup with a readable error if an ID reference breaks.
6. Implement the progression module and unit tests for the dependency graph, the 11-versus-15 counts, crest derivation, the 204-day countdown on 2026-10-23, and the three scenario seeds.
7. Register the 13 routes as an accessible shell that renders each screen’s H1 and says the screen is not built yet.

After that shell and those tests pass, the next build step is the welcome screen: the real PNG wordmark, HTML text, one supporting sentence, and a Get Started control that routes to `/onboarding`.
