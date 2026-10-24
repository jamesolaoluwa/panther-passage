# Use cases

- **Logo:** use `01_Branding/Logos/Panther_Passage_APPROVED_Logo_Original.png` intact. It includes an opaque background, so do not assume transparent PNG. Avoid stretching or recoloring.
- **Campus map reference:** use `04_Journey_Map/Desktop/Photoreal_Journey_Map_PREFERRED_REFERENCE.webp` as visual benchmark or presentation image. It includes baked path/UI. Do not place interactive nodes on top of the baked nodes in an app.
- **Journey implementation:** build a **new composited map** from a campus background without baked milestones, transparent SVG path overlays and interactive React nodes. The independent background requested for this is not yet available.
- **Medallions:** `06_Milestones/{State}/Milestone_{State}.svg` with accessibility labels in React; `.png` fallback.
- **Path overlay:** SVG assets in `04_Journey_Map/Pathways` and progress variants in `Progress_Overlays`; transparent.
- **Architectural motif:** abstract branding only; never identify it as actual campus architecture.
