# Architecture

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

```text
app/routes → feature containers → UI components → selectors/state hooks
                                    ↑                ↓
                    validated JSON datasets ← localStorage adapter
```

Read data statically at app startup and validate IDs; state scoped to student IDs. Separate pure progression engine from React to enable unit testing. Rendering chapter map should be data-driven (not hardcoded 15 separate JSX nodes) with an HTML list navigation fallback. No external requests required.
