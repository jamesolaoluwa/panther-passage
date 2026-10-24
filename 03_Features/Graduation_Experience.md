# Graduation Experience

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

## Purpose and problem addressed
A dignified moment of completion. Students should leave with an observable next step, not a decorative achievement.

## Prototype interaction contract
Threshold/arch sequence, earned crests, promise, next steps.

## Data, business rules and state transitions
**Inputs:** required completion, promise. **Rule:** celebration only when prerequisites met; alternative progress route.

**State flow:** idle → editing/selection → validating → saved/completed, with recoverable failure and undo where safe. **Next destination:** home/next chapter.

## UI required
Screen heading, brief instructional subcopy, prominent call to action, progress/context label, meaningful empty state, consistent top back navigation and responsive footer navigation. Show tasks as checkable items with associated text fields when needed. Never show an unbounded blank canvas.

## Empty, loading, success, error
- Empty: compassionate prompt and specific next action; no fake data fetched.
- Loading: instantaneous local data should not need long skeletons; brief transition only if lazy-loaded.
- Success: affirm action with precise status and clear continuation.
- Error: validation message nearest input; for storage issues offer continue-in-memory warning and copy/export.

## Acceptance checks
1. All buttons work with mouse, touch and keyboard.
2. Refresh preserves state scoped to chosen fictional profile.
3. Tab order and focus target remain usable at mobile 390px and desktop 1440px.
4. Status cannot be advanced by decoration alone.
5. Switching demo profiles does not leak content.

## Production later
Real content ownership, research validation, authorization, consent, analytics and institutional integrations require approvals.
