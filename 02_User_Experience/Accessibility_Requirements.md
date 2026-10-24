# Accessibility Requirements

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

## Target
WCAG 2.2 AA as a design and QA target (not certification). References: https://www.w3.org/TR/WCAG22/ and https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/.

- Visible labels for all inputs; semantic landmarks; one h1 per screen; meaningful headings.
- Standard 4.5:1 body-text and 3:1 nontext/large text target; check actual rendered pairings.
- Keyboard journey list alternative; spatial node SVG must not be sole means of access.
- No reliance on color alone; status conveyed by text and icon.
- Touch targets at least 44×44 CSS px as a design preference (WCAG 2.2 AA minimum is 24×24 with exceptions).
- Avoid aggressive countdown effects; support `prefers-reduced-motion` and disable particles/confetti.
- Announce completion using polite live region; focus restored to sensible heading after navigation.
- Inline descriptive errors; never auto-advance on text input; allow undo for completion and RSVP.
- Keyboard trap check for dialogs; `Escape` closes modal; focus stays inside while open.
