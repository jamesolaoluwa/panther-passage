# Phosphor functional icon system

`npm install @phosphor-icons/react`

Prefer **regular** for general UI, **fill** for selected tabs/success, **duotone** for resource categories, **light** for selected low-emphasis secondary icons.

```tsx
import { MapTrifold, Books, UsersThree, UserCircle, Lock, CheckCircle, CalendarBlank, Briefcase, GraduationCap, Compass } from '@phosphor-icons/react';
const tabs = [MapTrifold, Books, UsersThree, UserCircle];
```

Use 24px standard nav, 20px compact, 16px inline, and 28–32px large actions. The library is a runtime dependency: package deliberately does not redistribute icons. Milestone medallions and chapter badges are **custom** SVG assets, not Phosphor.

Always supply `aria-label` on icon-only actions, `aria-hidden=true` for decorative SVG, keyboard focus and 44px minimum tappable targets.
