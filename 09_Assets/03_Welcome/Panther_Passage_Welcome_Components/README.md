# Panther Passage — Welcome Screen Component Starter Kit

## Ready to use
- `01_References/approved_welcome_phone.png`: approved visual reference, **NOT** the app background.
- `01_References/approved_logo_reference.png`: approved logo shown on its original background; inspect transparency before placing over scenery. Preserve its lettering; do not regenerate.
- `02_Path/mobile_route.svg` and `.png`: reusable provisional route graphic; must be positioned and sized to match the approved screen.
- `03_Milestones/completed.*` and `locked.*`: reusable provisional status graphics; compare styling carefully against approved mockup.
- `04_Overlays/ivory_text_scrim.png`: optional legibility overlay.

## Still needed
- A **clean photorealistic campus background without logo, headline, badges, labels, path, or button**. Do not use the full phone mockup as the background while also rendering these elements in code.
- A genuinely transparent approved stitched logo. The included original is a visual reference; avoid crude automated background removal that damages gold edges or stitching.
- A faithful route overlay aligned to the new clean campus background. The existing SVG is reusable but not necessarily a pixel-perfect extraction from the mockup.

## Render as actual React Native components
- `WelcomeScreen`: stack background, logo, headline, path preview, CTA and caption.
- `WelcomeHeadline`: "Your last 100 days start here."
- `WelcomeJourneyPreview`: display 2 completed milestones, 3 upcoming locked badges; decorative on this screen.
- `MilestoneLabel`: labels only for completed milestones.
- `GetStartedButton`: a *real Pressable*, navigate to onboarding.
- `WelcomeSupportingText`: "Plan your next steps, discover resources, and move confidently toward graduation and beyond."

## Recommendation
Use the approved PNG for a **temporary visual-only proof**, but implement the functional app with separate assets and text. Keep the smartphone bezel OUT of the actual mobile app screen.
