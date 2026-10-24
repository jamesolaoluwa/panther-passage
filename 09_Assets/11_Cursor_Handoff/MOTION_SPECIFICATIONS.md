# Motion treatment (not actual animation files)

- Welcome hero: fade/translateY(8px) over 480ms cubic-bezier(.2,.8,.2,1); reduced-motion: immediate.
- Milestone select: scale 1→1.035→1 over 280ms, no perpetual pulse; reduced-motion: static focus ring.
- Milestone complete: brief ring/opacity transition 400ms and badge swap; reduced-motion: immediate state/text swap.
- Section reveal: opacity from .75 to 1 in 240ms on scroll entry; reduced-motion: no animation.
- Do not suggest these effects are packaged animations; implement in CSS or Motion for React.
