# Cursor / React handoff

Copy the library into `public/assets/panther-passage` and reference files with absolute URLs; filenames must match manifest paths. Put app text, actions, status and journey data into components. Never bake clickable experiences into a JPEG/PNG.

## Compositing order
1. Campus backdrop (once a CLEAN, no-UI campus image is obtained)
2. Architectural decorative foreground layers
3. Transparent SVG path overlay
4. React interactive milestone buttons with absolute percentage anchor coordinates
5. Text tooltips for only completed milestones
6. Sticky bottom app navigation and any non-scrolling header

```tsx
import { useState } from 'react';
const nodes = [{ id:'m1', x: 50, y: 97.5, status:'completed', title:'Discover Your Pathway' }]; // demo data, not approved catalog
function Milestone({node}:{node:typeof nodes[number]}){
  return <button style={{position:'absolute',left:`${node.x}%`,top:`${node.y}%`,transform:'translate(-50%,-50%)',minWidth:44,minHeight:44}} aria-label={`${node.title}: ${node.status}`}>
    <img width={64} height={64} alt="" src={`/assets/panther-passage/06_Milestones/Completed/Milestone_Completed.svg`}/>
  </button>;
}
```

Use `object-fit:cover` with validated focal point and device-specific assets, NOT a naive stretch. Paths use their own `viewBox` units and should preserve `xMidYMid meet` unless deliberately cropping. Ensure reduced-motion support and keep focused controls visible above fixed bottom navigation.

Important: `JOURNEY_ASSET_COORDINATES.json` contains verified coordinates for the **generated vector paths only**; it does not supply false pixel coordinates for raster mockups.
