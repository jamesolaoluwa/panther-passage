# State Management

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

Use `useReducer` + context or Zustand (proposed), with pure selectors for unlock, readiness, chapter reward and next action. Derive percentages rather than persisting computed values. Persist only student-scoped input and completion events, debounced where needed. Store scenario seed separately from current state. Dispatch `TASK_TOGGLED`, `MILESTONE_COMPLETED`, `PLAN_SAVED`, `REFLECTION_SAVED`, `EVENT_RSVP`, `RESET_SCENARIO`, `PROFILE_SELECTED`.
