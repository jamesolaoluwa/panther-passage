# Loading / performance

- Preserve PNG originals; prefer included WebP where provided.
- Use `<picture>` or CSS media queries for real responsive variants only; do not pretend a stretched image is a separate composition.
- Lazy-load below-the-fold journey sections, preload the initial hero and logo only.
- Use CSS transforms rather than animating layout properties; disable nonessential motion via `prefers-reduced-motion`.
- Predefine width/height or aspect-ratio to avoid layout shifting.
- Only the SVG overlays/medallions are transparent; existing photo and brand sources are opaque.
- Use aria text for all milestone meaning; lock graphic alone is insufficient.
