# Build progress

Panther Passage is a proposed Last 100 Days demonstration for Philander Smith University. It is not an official university system.

## Done in this build

- Welcome remains the approved frameless image, with the real Get Started control and a short entrance fade that reduced motion removes.
- Onboarding steps 1–4, validation, and the official campus footer stay in place.
- My Passage uses the supplied campus artwork file, cropped only to remove the baked phone header and tab bar. Live progress stays in the fifteen-step list.
- Home, milestone detail, Explore, events, achievements, My Chapter, reflections, readiness, finale, and profile are functional screens on the existing routes.
- Task checks, answers, bookmarks, RSVPs, reflections, goals, working notes, and the larger-text preference save in the existing per-student local record.
- Chapter crests, required readiness, and the finale still come from the existing progression rules.
- Jordan, Avery, and Morgan scenario controls and reset remain on Profile.

## Verified

- `npx tsc -p tsconfig.json --noEmit` passed.
- `npx vitest run --no-file-parallelism --maxWorkers=1` passed: 11 files, 51 tests.
- `npx vite build` passed. The JavaScript chunk is about 518 kB before gzip and Vite reports a size warning.
- Browser check on the running app at `http://localhost:5173/`: home at 390px with no horizontal overflow, journey artwork recognizable, milestone task persisted after reload, resource list and empty saved filter, finale stayed closed for Avery at 5 of 11 required steps.

## Not claimed

- Pixel match to a milestone-details screenshot. No such file is in the project.
- Official crest illustrations. The achievement JSON points at crest files that are not in the asset library.
- Dynamic medallions painted into the journey image. Those marks do not match live student state.
