# Responsive Design

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

| Width | Treatment |
|---|---|
| 320–767px | 20px padding, one column, bottom navigation, single map rail, no clipped nodes |
| 768–1199px | 2-column hero with stacked supporting cards, map plus optional sticky chapter overview |
| 1200px+ | 1200px max content, desktop primary nav, dashboard split with featured next step |

At 320px no horizontal scroll for text. At 200% zoom ensure map list alternative, scrollable single column. In safe-area devices pad bottom by `env(safe-area-inset-bottom)`. Prefer fluid heading clamps, never fixed-height text panels.
