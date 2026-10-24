# Component Library

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

| Component | Variants and contract |
|---|---|
| BrandHeader | Wordmark slot, back button, profile menu; mobile collapse |
| PassageButton | Primary, secondary, ghost, destructive; loading/disabled; 44px min |
| JourneyNode | locked, available, active, completed; focusable button; title text alternative |
| ChapterBanner | Number, evocative title, dates descriptor, crest |
| MilestoneCard | 3 tasks, duration, importance, start/resume |
| TaskCheck | true/false, optional note, validation and success |
| ProgressPair | days until graduation and tasks complete separately |
| AchievementCrest | locked/earned state with accessible textual status |
| ResourceTile | category + title + usefulness + action |
| EventTile | capacity, demo disclaimer, RSVP state |
| ReflectionEditor | editable, private by default; explicit delete |
| PassageModal | announcement and dialog focus management |
| BottomNav | four destinations and current-page indication |
| EmptyState | empathetic title + precise one-step recovery |
| Toast | nonblocking aria-live status plus undo when available |

Always provide real labels for icon-only actions. Compose components from semantic elements; don't use a canvas-only path for critical navigation.
