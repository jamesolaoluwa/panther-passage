# Color Palette

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

## Status
No exact approved palette numeric values supplied in the available source context. **All listed hexes are provisional** and intended as a coherent working system, not Philander Smith's official brand colors.

| Token | Hex | RGB | HSL | Usage |
|---|---|---|---|---|
| ink | `#221C22` | `34, 28, 34` | `300, 10%, 12%` | primary body |
| plum | `#4C253E` | `76, 37, 62` | `322, 35%, 22%` | deep feature surface |
| maroon | `#782C43` | `120, 44, 67` | `342, 46%, 32%` | main action |
| rose | `#B45D73` | `180, 93, 115` | `345, 37%, 54%` | decorative tertiary |
| gold | `#D0A34A` | `208, 163, 74` | `40, 59%, 55%` | path + achievement |
| ivory | `#FFFDF9` | `255, 253, 249` | `40, 100%, 99%` | warm surfaces |
| paper | `#FFFFFF` | `255, 255, 255` | `0, 0%, 100%` | white background |
| mist | `#F4EFF0` | `244, 239, 240` | `348, 19%, 95%` | secondary panel |
| sage | `#557568` | `85, 117, 104` | `156, 16%, 40%` | subtle natural accent |
| focus | `#214ED5` | `33, 78, 213` | `225, 73%, 48%` | focus ring |
| success | `#246B54` | `36, 107, 84` | `161, 50%, 28%` | positive text |
| warning | `#8A5809` | `138, 88, 9` | `37, 88%, 29%` | caution text |
| danger | `#A72B40` | `167, 43, 64` | `350, 59%, 41%` | error text |

## Semantics
`bg.default=paper`, `bg.warm=ivory`, `surface.secondary=mist`, `text.primary=ink`, `button.primary=maroon` with white text, `accent.path=gold`, `focus.ring=focus`, `status.success=success`. Test actual contrast in all combinations. Gold is **not** body text on white; use ink or maroon for small labels. Only paper/ivory surfaces are required for P0; dark mode is future scope, not an auto-generated inversion.
