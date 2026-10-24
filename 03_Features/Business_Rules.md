# Business Rules

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

## Progression source of truth
- There are 15 milestones, M01–M15, three per chapter P1–P5. Within each chapter, the third milestone is optional in P1–P4, while M15 in P5 is required for the ceremony.
- `dependsOn` are the only map unlock requirements. No unlocking by countdown alone. All optional nodes remain playable even after graduation.
- To mark a milestone done: required tasks all complete; if a task asks for text, trim and require nonempty within validation bounds. Undo must be possible and cascade derived badges.
- Required milestone count: milestones with `required === true` **plus M15**; total = 11 (two required × five chapters + M15; M15 is already marked required, so count it only once). An optional milestone does not block the next chapter or final ceremony.
- Chapter crest: all `required===true` chapter milestones done, plus M15 for P5 crest. Finale: all 11 ceremony-required done.
- Completion display: X/15 all-milestone progress, Y/11 readiness completion; do not conflate.
- Countdown uses local calendar days with `max(0,difference)` and is unaffected by tasks. If graduation date passes, show `Graduation day has arrived` without clearing progress.
- Demo event RSVP local only; full if `rsvpCount + local RSVPs >= capacity`; cancel frees a seat in the same local session.
- Switching profiles isolates notes/tasks; reset restores seeded completions, plan and RSVP states.
- Always preserve ability to revisit and revise previously finished milestones.
