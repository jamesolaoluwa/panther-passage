# Achievements Screen

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

## Identification
**Route:** `/achievements` · **Purpose:** Achievements · **Intended emotion:** clarity, welcome and personal agency.

## Exact copy
- Eyebrow: `100 DAYS OF BECOMING`
- H1: `Look how far you have come.`
- Primary CTA: `See My Passage`
- Footer disclaimer where demo service is mentioned: `This is a simulated Panther Passage experience.`

## Visual hierarchy / component tree
```text
<PageShell>
  <AccessibleSkipLink />
  <BrandHeader />
  <Main aria-labelledby=pageTitle>
    <EditorialHero eyebrow heading description />
    <PrimaryAction label="See My Passage" />
    <ScreenSpecificContent />
  </Main>
  <ResponsivePrimaryNavigation />
</PageShell>
```

**Screen-specific content:** Five crests; earned status; why earned; no leaderboard.

## Interactive and state contract
Derived from completion. All user-initiated changes must produce local state updates or real navigations; never decorative 'dead' controls. Base navigation paths on `02_User_Experience/Information_Architecture.md`; use typed route definitions.

## Mobile vs desktop
Mobile: 320–767px, single-column, hero text ahead of artwork, sticky bottom navigation only for authenticated demo context, 20px gutters; all labels visible, 44px min buttons. Desktop: 1200px max container, generous editorial hero, supporting panel beside the content where meaningful, top/side navigation. Both: no overlapping headings, no clipped text at 200% zoom.

## Assets
Draw from Asset_Manifest.json: provisional chapter SVGs and crest images. Welcome and finale especially require approved brand/logo input before declaring pixel-perfect production fidelity. Functional UI never depends on a missing image.

## Accessibility and feedback
H1/hierarchy, proper label association, visible keyboard focus, page title announcements, text status independent of color, meaningful alt/empty alt for decoration. Error: render a specific recovery path. Empty: show how to begin. Success: confirm exactly what changed. Offline: display bundled resources; missing storage warns about session persistence.

## Screen acceptance criteria
1. Route loads directly. 2. H1 and CTA are present. 3. Buttons are wired. 4. Validations are announced near controls. 5. Works at 390px and 1440px and keyboard only. 6. Layout communicates distinct brand with no generic stock fallback.
