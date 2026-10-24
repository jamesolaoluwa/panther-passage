# PANTHER PASSAGE
# MASTER CURSOR BUILD INSTRUCTIONS
### Production-Grade Frontend · Interactive 100-Day Journey · Expressive Collegiate Editorial · Competition Demo

---

## 0. YOUR MISSION

You are the Lead Product Engineer, Senior Frontend Architect, Creative Technologist, UI/UX Engineering Lead, Interaction Designer, Accessibility Engineer, and QA Lead responsible for building **Panther Passage**.

Panther Passage is an innovative, mobile-first graduation transition experience designed for the **Last 100 Days HBCU Challenge at Philander Smith University**.

It helps graduating students navigate their final 100 days of college and prepare for life beyond graduation through a personalized, interactive, milestone-based experience.

**YOUR TASK IS TO BUILD THE ACTUAL WORKING APPLICATION.**

Not a collection of static mockups.

Not a generic university portal.

Not a landing page pretending to be a product.

Not a simple checklist with gamification decorations.

Build a genuinely interactive, polished, cohesive Panther Passage application suitable for a high-stakes innovation competition demonstration.

The result must demonstrate:

1. Exceptional visual design.
2. Real functional interactions.
3. Meaningful 100-day journey progression.
4. Personalized student experiences.
5. Consistent application state.
6. Reliable navigation.
7. High-quality responsive layouts.
8. Smooth and intentional animations.
9. Accessible interface design.
10. A memorable graduation completion experience.

The application must be demo-ready, not merely visually convincing in screenshots.

---

# 1. STUDY THE PROJECT BEFORE WRITING CODE

## 1.1 Inspect the entire workspace

Before implementing anything, inspect all available files and directories.

The workspace may contain:

- `Panther_Passage/`
- `Panther_Passage_Visual_Assets/`
- Project concept documentation.
- Approved brand references.
- UI screenshots.
- Presentation references.
- JSON datasets.
- Design tokens.
- Existing source code.

Do not assume that a file exists simply because its name appears in these instructions.

If ZIP archives are provided, inspect and extract them safely into appropriate directories without overwriting approved originals.

Review the actual contents.

## 1.2 Required documentation

Read the following files wherever available:

**Project foundation**

- `README.md`
- `PROJECT_CONTEXT.md`
- `CURSOR_MASTER_INSTRUCTIONS.md`
- `ASSUMPTIONS_AND_DECISIONS.md`

**Product requirements**

- `01_Product_Strategy/`
- `02_User_Experience/`
- `03_Features/`
- `04_Journey_Content/`

**Visual design**

- `05_Design_System/`
- `06_Screen_Specifications/`
- `Panther_Passage_Visual_Assets/VISUAL_DIRECTION.md`
- `Panther_Passage_Visual_Assets/ASSET_MANIFEST.json`
- `Panther_Passage_Visual_Assets/ASSET_USAGE_GUIDE.md`

**Technical requirements**

- `07_Technical/`

**Demo content**

- `08_Demo_Data/`
- `10_Competition_Demo/`

**Quality assurance**

- `11_Quality_Assurance/`

**Implementation handoff**

- `12_Cursor_Handoff/`
- `Panther_Passage_Visual_Assets/11_Cursor_Handoff/`

Read all existing `.cursor/rules/` files.

## 1.3 Source-of-truth hierarchy

When requirements conflict, prioritize:

1. Latest explicitly approved user decisions and visual references available in the workspace.
2. Approved Panther Passage concept documentation.
3. Approved design and screen specifications.
4. Verified asset manifests and actual visual files.
5. Confirmed product requirements and business rules.
6. Current demo datasets.
7. Existing technical recommendations.
8. New implementation proposals.

A newly generated image does not override an explicitly approved reference.

Do not silently replace established decisions with your own preferences.

## 1.4 Produce an implementation audit

Before building, create:

`docs/IMPLEMENTATION_AUDIT.md`

Include:

- Available source documents.
- Approved visual assets located.
- Missing assets.
- Existing code and dependencies.
- Confirmed screens and routes.
- Confirmed milestones and tasks.
- Existing datasets.
- Design inconsistencies.
- Technical gaps.
- Proposed implementation order.

Mark unresolved information as provisional.

Do not invent university policies, partnerships, or integrations to fill gaps.

Proceed with reasonable, documented prototype assumptions when necessary.

---

# 2. THE NON-NEGOTIABLE DESIGN DIRECTION

## EXPRESSIVE COLLEGIATE EDITORIAL

This is Panther Passage's established creative identity.

Every screen must look like it belongs to the same deliberately art-directed application.

The visual experience should feel:

- Distinctive.
- Sophisticated.
- Aspirational.
- Confident.
- Youthful without being childish.
- Premium without being inaccessible.
- Culturally thoughtful.
- Warm and emotionally engaging.
- Editorial rather than corporate.
- Beautifully crafted.

Think of an immersive college graduation journey expressed through premium editorial design and refined interactive storytelling.

## 2.1 No generic AI aesthetics

Avoid:

- Generic SaaS dashboards.
- Purple gradients on white.
- Random glassmorphism.
- Excessive rounded cards.
- Unnecessary floating objects.
- Generic stock illustrations.
- Random 3D blobs.
- Inconsistent shadows.
- Arbitrary color choices.
- Repeated identical layouts.
- Default-looking component libraries.
- Excessive animations.
- Unrelated icon families.
- Cartoonish achievement systems.
- Poorly integrated image backgrounds.

Do not build an interface that could belong to any other productivity app by simply replacing the logo.

Panther Passage must have its own recognizable design language.

## 2.2 Reference-matched design is mandatory

When an approved visual reference exists, implement it faithfully.

Match:

- Composition.
- Relative spacing.
- Typography hierarchy.
- Color relationships.
- Image treatment.
- Geometry.
- Decorative layering.
- Alignment.
- Overall atmosphere.

Do not improvise a different design because it is easier to code.

When a reference is unavailable, use the approved design system and screen specification.

Document any significant interpretation.

## 2.3 Creative ambition within the brand

Use:

- Expressive typography.
- Elegant asymmetry.
- Meaningful negative space.
- Layered architectural artwork.
- Premium milestone illustrations.
- Carefully controlled shadows.
- Sophisticated visual depth.
- Purposeful transitions.
- Editorial section composition.
- Distinctive progress visualizations.

Creative freedom must strengthen the established product identity, not replace it.

---

# 3. TYPOGRAPHY

Typography is a defining Panther Passage brand characteristic.

Use the approved typography system from the project documentation.

The display direction is **Recoleta-inspired, expressive, and editorial**.

## Typography requirements

- Use licensed supplied font files when available and permitted.
- Do not assume the Recoleta font files are included.
- Do not download unauthorized font files.
- Do not substitute generic fonts without documenting the choice.
- Use a distinctive display typeface for major headings.
- Use a readable complementary typeface for interface text.
- Use consistent font weights, sizes, line heights, and tracking.
- Apply responsive typography.
- Preserve legibility at small screen sizes.

Implement typography through centralized design tokens.

Avoid arbitrary font sizes or inconsistent heading styles.

Typography should create visual personality while maintaining accessibility.

---

# 4. COLOR SYSTEM

Use the confirmed Panther Passage palette from the design system.

Read:

`05_Design_System/Color_Palette.md`

and:

`05_Design_System/Design_Tokens.json`

Do not invent a new official palette.

If exact approved color values are unavailable:

1. Identify the gap.
2. Use documented provisional tokens.
3. Keep colors centralized.
4. Make them easy to replace.
5. Never label provisional values as official university colors.

Define semantic variables for:

- Primary brand color.
- Secondary brand color.
- Accent.
- Main background.
- Elevated surface.
- Primary text.
- Secondary text.
- Border.
- Disabled state.
- Success.
- Warning.
- Error.
- Active milestone.
- Locked milestone.
- Completed milestone.
- Achievement highlight.

Check accessible contrast ratios.

Never sacrifice readability to preserve decorative effects.

---

# 5. OFFICIAL ICON SYSTEM

Use **Phosphor Icons** for everyday UI iconography.

Install:

```bash
npm install @phosphor-icons/react
```

Use consistent icon weights.

| Context | Weight |
|---|---|
| Inactive navigation | Regular |
| Active navigation | Fill |
| Buttons | Regular |
| Resource categories | Duotone |
| Events | Regular |
| Success | Fill |
| Settings | Regular |

Use design tokens to control icon size and color.

Prefer importing only the icons required by each component.

Do not mix Lucide, Heroicons, Tabler, and Phosphor arbitrarily.

## Custom artwork exceptions

Never replace these with ordinary icon-library components:

- Journey milestone medallions.
- Chapter emblems.
- Achievement badges.
- Graduation destination artwork.
- Signature Panther Passage decorative symbols.

Use the actual supplied custom assets.

If the required custom artwork is missing, implement a clearly identified temporary fallback without misrepresenting it as approved.

---

# 6. RECOMMENDED TECHNICAL STACK

Inspect existing technical specifications and source code first.

If no approved framework or architecture already exists, use the following default stack:

**Frontend**

- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- React Router.
- Phosphor Icons.

**Animation**

- Motion for React, where meaningful.

**State management**

- React Context with focused hooks for simple global state.
- A lightweight store such as Zustand only if complexity justifies it.

**Persistence**

- Local storage for demo functionality.
- Versioned persistence with validation and migration.

**Data**

- Local typed JSON datasets.
- No mandatory live backend for the competition demo.

**Testing**

- Vitest.
- React Testing Library.
- Playwright for end-to-end flows.

Do not add dependencies solely because they are popular.

Use existing compatible dependencies when the project is already initialized.

Choose maintainability, reliability, and visual quality over unnecessary architectural complexity.

---

# 7. APPLICATION ARCHITECTURE

Create a clear, scalable project structure.

A recommended structure:

```text
src/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── journey/
│   ├── milestones/
│   ├── achievements/
│   └── feedback/
├── screens/
├── features/
│   ├── onboarding/
│   ├── dashboard/
│   ├── journey/
│   ├── resources/
│   ├── events/
│   ├── achievements/
│   ├── reflections/
│   └── graduation/
├── data/
├── hooks/
├── stores/
├── services/
├── types/
├── utils/
├── styles/
└── assets/
```

Adapt this structure to the existing project rather than creating unnecessary duplication.

## Architectural rules

- Use reusable components.
- Keep business logic separate from presentation.
- Use strict TypeScript types.
- Centralize routes.
- Centralize design tokens.
- Keep source data separate from user progress.
- Avoid duplicated milestone content.
- Avoid hard-coded demo dates.
- Avoid monolithic screen components.
- Avoid fragile absolute positioning for ordinary UI.
- Document architectural decisions.

The journey map may use controlled absolute positioning inside a defined coordinate system when that is necessary for accurate artwork alignment.

---

# 8. COMPLETE APPLICATION SCREENS

Build all confirmed application screens according to the available screen inventory.

At minimum, the planned screen families include:

1. Welcome.
2. Onboarding.
3. Home dashboard.
4. Interactive journey map.
5. Milestone details.
6. Resource hub.
7. Events and opportunities.
8. Achievements.
9. Next Chapter planning.
10. Reflections and legacy.
11. Graduation readiness.
12. Final graduation destination.
13. Profile and settings.

Use the exact approved route names from the technical documentation.

Do not create competing routes if the source documentation already defines them.

Every screen must include:

- Accurate content.
- Correct branding.
- Functional navigation.
- Responsive layout.
- Meaningful interactions.
- Accessible controls.
- Loading states where needed.
- Empty states.
- Error states.
- Success feedback.
- Appropriate visual assets.

**Do not consider a screen complete simply because it renders.**

---

# 9. WELCOME SCREEN

The welcome screen is one of the highest-priority visual elements.

Use the most recently approved Panther Passage welcome-screen reference.

Preserve:

- Approved logo.
- Campus-inspired environment.
- Architectural composition.
- Journey path visual.
- Milestone elements.
- Expressive typography.
- Overall spatial hierarchy.
- Get Started button.
- Supporting paragraph placement.

The supporting paragraph is:

"Plan your next steps, discover resources, and move confidently toward graduation and beyond."

Do not duplicate this paragraph.

Do not restore the previously removed "I already have an account" footer unless a newer approved requirement explicitly reinstates it.

## Functionality

Get Started must launch onboarding or the approved next step.

Do not create a decorative button without functionality.

Use semantic HTML for text and buttons.

Use artwork as visual layers, not as a single image containing inaccessible controls.

The welcome screen must look exceptional on mobile.

---

# 10. ONBOARDING AND PERSONALIZATION

Build a concise, beautiful onboarding flow grounded in approved requirements.

Potential fields include:

- Student name or demo profile selection.
- Graduation date.
- Career or post-graduation interests.
- Primary goals.
- Areas where the student wants support.

Do not add sensitive personal-data collection without a legitimate requirement.

For the competition prototype, use fictional student data.

Onboarding must:

- Validate required inputs.
- Persist completed selections locally.
- Allow appropriate backward navigation.
- Preserve entered information.
- Display a meaningful completion state.
- Route the student into their personalized experience.

Do not claim actual university authentication.

---

# 11. THE SIGNATURE INTERACTIVE JOURNEY MAP

**THIS IS THE MOST IMPORTANT INTERACTIVE FEATURE IN PANTHER PASSAGE.**

Treat it as the primary product experience.

The map should communicate a journey through the final 100 days, not a traditional checklist.

## 11.1 Visual requirements

Use supplied assets to create:

- Campus-inspired pathway environments.
- Visually connected chapters.
- Winding journey progression.
- Custom milestone medallions.
- Completed and upcoming pathway states.
- Chapter transitions.
- A memorable graduation destination.

The experience is inspired by milestone-based progression in Candy Crush but must remain visually original.

Do not copy Candy Crush assets, characters, or visual styling.

## 11.2 Interactive behavior

Students should be able to:

- Scroll or navigate through the journey.
- View available milestones.
- Identify their current milestone.
- Distinguish locked and completed milestones.
- Open milestone details.
- Complete tasks.
- Receive completion feedback.
- Unlock subsequent milestones.
- Review previous achievements.
- Return to the journey without losing progress.

## 11.3 Data-driven rendering

Render chapters, milestones, and progression states from the supplied datasets.

Do not hard-code 15 individual medallions directly into JSX.

Use reusable components such as:

- `JourneyMap`
- `JourneyChapter`
- `JourneyPath`
- `MilestoneNode`
- `MilestoneDetail`
- `MilestoneProgress`
- `ChapterTransition`
- `GraduationDestination`

Names may be adapted to the existing project conventions.

## 11.4 Map layout architecture

Create a stable logical coordinate system.

For mobile:

- Vertical journey progression.
- Scrollable environment.
- Comfortable milestone spacing.
- Touchable milestones.
- Responsive chapter transitions.

For desktop:

- Purposefully adapted layout.
- Wider environmental composition.
- Clear interaction zones.
- No simple stretching of mobile graphics.

Keep environment imagery and interactive components as separate layers.

Use coordinate metadata only when it corresponds to actual available assets.

## 11.5 Milestone states

Support states established by the journey rules, including:

- Locked.
- Available.
- Active.
- In progress.
- Completed.

Additional states must be grounded in the documentation.

Use both visual and accessible textual indications of status.

## 11.6 Progression logic

Progression must obey the milestone dataset.

Do not unlock milestones arbitrarily.

Do not use elapsed calendar days as proof of task completion.

The **100-day graduation countdown and milestone completion progress are separate concepts**.

Calendar progress reflects time remaining until graduation.

Preparation progress reflects completion of defined student activities.

These measures must not be conflated.

## 11.7 Completion behavior

When a student completes an eligible milestone:

1. Validate completion requirements.
2. Save progress.
3. Update derived progression state.
4. Show completion feedback.
5. Grant any defined achievement.
6. Unlock dependent milestones where applicable.
7. Update dashboard indicators.
8. Update journey visualization.
9. Preserve state after refresh.

Do not grant rewards twice.

Do not allow duplicate completion records.

The experience should feel rewarding without becoming frivolous.

---

# 12. MILESTONE DETAIL EXPERIENCE

Every milestone must present:

- Milestone title.
- Purpose.
- Connection to life after graduation.
- Required tasks.
- Optional tasks, where applicable.
- Progress.
- Relevant resources.
- Completion criteria.
- Next actions.
- Completion feedback.

Task completion must actually update application state.

Do not implement fake progress indicators.

Support incomplete, partially completed, and completed states.

A student should always understand what they need to do next.

---

# 13. STUDENT DASHBOARD

The dashboard should be personalized, visually expressive, and immediately useful.

Include approved features such as:

- Personalized greeting.
- Graduation countdown.
- Preparation progress.
- Current journey chapter.
- Next recommended milestone.
- Upcoming events.
- Relevant resources.
- Recent achievements.

Do not fill the dashboard with meaningless metrics.

All progress and summary values must be derived from the shared application state.

Do not hard-code percentages that contradict actual task completion.

Use a strong editorial hierarchy rather than an endless grid of identical cards.

---

# 14. RESOURCE HUB

Create a functional resource-discovery experience.

Use the supplied dataset for content.

Support appropriate features such as:

- Category browsing.
- Search.
- Filters.
- Resource detail.
- Useful links.
- Saved resources, if specified.

Clearly distinguish simulated resources from real university services.

Do not invent official partnerships or resource availability.

Use Phosphor Duotone icons where appropriate.

Resource content must connect to meaningful student goals and milestone needs.

---

# 15. EVENTS AND OPPORTUNITIES

Build a functioning demo events experience.

Support:

- Event listing.
- Event details.
- Categories.
- Dates.
- RSVP interactions where specified.
- RSVP confirmation.
- Saved attendance state.

Use fictional, clearly labeled demonstration events where no verified official schedule is provided.

Do not claim integration with the university calendar.

A simulated RSVP must not imply that a real seat has been reserved.

---

# 16. ACHIEVEMENTS AND REWARDS

Create an achievements system that reinforces student preparation.

Achievements should feel valuable, meaningful, and visually consistent.

Use the custom achievement artwork.

Support:

- Locked achievements.
- Earned achievements.
- Achievement detail.
- Award criteria.
- Earned date.
- Collection progress.

Achievement awards must follow defined business rules.

Do not duplicate awards.

Avoid meaningless reward inflation.

---

# 17. NEXT CHAPTER PLANNING

Build an experience that helps students translate their final 100 days into actionable next steps.

Use the approved feature specifications.

Potential functionality may include:

- Career goals.
- Financial preparation goals.
- Graduate-school planning.
- Entrepreneurship planning.
- Relocation preparation.
- Personal action plans.

Do not implement every possible feature unless it is within the approved MVP.

Prioritize a coherent, working flow over broad but superficial functionality.

---

# 18. REFLECTIONS AND LEGACY

Build an emotionally meaningful reflection experience.

Depending on approved requirements, this may include:

- Guided reflections.
- Personal accomplishments.
- Lessons learned.
- Future-self writing.
- Legacy statements.
- Final journey reflection.

Persist reflections in local demo storage.

Do not send personal reflections to external services.

Support editing and saving.

Respect privacy and avoid unnecessary sensitive-data collection.

---

# 19. GRADUATION READINESS

Create a readiness overview based on actual completed activities.

The readiness experience must not falsely claim a student is officially cleared to graduate.

Differentiate:

**Panther Passage preparation readiness:** Completion of the product's defined transition activities.

**Official university graduation eligibility:** An institutional determination that the prototype does not verify.

Use language that makes this distinction clear.

Show meaningful accomplishments, remaining preparation tasks, and practical next steps.

---

# 20. THE FINAL GRADUATION DESTINATION

This is the emotional culmination of Panther Passage.

It must be memorable.

Use the approved graduation destination artwork.

The final experience should celebrate preparation, growth, and the student's transition beyond college.

Potential features include:

- Completed journey reveal.
- Final medallion.
- Personalized completion summary.
- Earned achievements.
- Meaningful reflection.
- Next Chapter transition.
- Celebration animation.

Trigger the experience using the approved journey completion rules.

Do not automatically equate reaching graduation day with finishing every milestone.

Do not present a Panther Passage completion screen as an official university credential.

Respect reduced-motion preferences.

---

# 21. DEMONSTRATION DATA AND SCENARIOS

Use the existing fictional demo datasets.

Do not silently replace supplied students with unrelated generated profiles.

Support three core scenarios:

**Scenario A — New Student**

The student is just beginning Panther Passage.

Demonstrate onboarding and the first available milestone.

**Scenario B — Student in Progress**

The student has completed some activities and is progressing through the journey.

Demonstrate tasks, progression, resources, and achievements.

**Scenario C — Almost Graduated**

The student is approaching completion.

Demonstrate readiness, final milestones, and the graduation experience.

## Demo scenario switching

Create a clearly designated demonstration control, accessible from an appropriate development/demo area.

Allow judges or presenters to switch between scenarios without manually editing local storage.

Scenario switching must:

1. Load the selected student's defined data.
2. Replace the active demo session coherently.
3. Recalculate derived progress.
4. Render the correct unlocked milestones.
5. Display correct achievements.
6. Restore the appropriate onboarding state.
7. Maintain consistency across screens.

Include a reset-demo function.

Prevent accidental switching in ordinary student-facing navigation where it would be confusing.

---

# 22. LOCAL PERSISTENCE

The application must function without real university accounts.

Use reliable local-first state management.

Persist:

- Onboarding selections.
- Active demo student.
- Completed tasks.
- Completed milestones.
- Achievements.
- Reflections.
- Event RSVPs.
- Saved resources, when supported.
- Personal planning information.

Use versioned storage.

Validate persisted data.

Handle corrupted or outdated storage gracefully.

Provide demo reset functionality.

Do not write real student information into fictional seed datasets.

---

# 23. INTERACTION AND MOTION DESIGN

Use Motion for React or CSS animations where appropriate.

Prioritize meaningful moments:

- Welcome entrance.
- Onboarding completion.
- Milestone selection.
- Task completion.
- Path illumination.
- Milestone unlocking.
- Chapter completion.
- Achievement reveal.
- Final graduation celebration.

Animation must enhance comprehension and emotional engagement.

Do not add arbitrary motion simply to make a screen feel busy.

Avoid excessive bouncing and attention-grabbing effects.

Provide reduced-motion alternatives.

Ensure interactions remain responsive.

---

# 24. RESPONSIVE DESIGN

Panther Passage is mobile-first.

Start by ensuring the application works beautifully at common phone widths.

Then expand to tablets and desktop.

Test at representative widths such as:

- 320px.
- 375px.
- 390px.
- 430px.
- 768px.
- 1024px.
- 1440px.

These are test targets, not a restriction on supporting other viewport sizes.

Ensure:

- No horizontal overflow.
- Comfortable touch targets.
- Readable typography.
- Predictable navigation.
- Correct image crops.
- Functional modals.
- Accessible forms.
- Proper journey-map positioning.
- No overlapping fixed UI.
- Appropriate safe-area spacing.

Do not simply center a phone-sized application inside a blank desktop canvas unless the desktop design specifications explicitly require that approach.

---

# 25. ACCESSIBILITY

Target WCAG 2.2 AA accessibility where reasonably applicable.

Use:

- Semantic HTML.
- Accessible labels.
- Visible focus states.
- Keyboard navigation.
- Suitable color contrast.
- Meaningful image alternatives.
- Logical headings.
- Proper form validation.
- Motion reduction.
- Accessible dialogs.
- Accessible status announcements.

Interactive milestone nodes must be keyboard accessible.

The journey map must offer a usable alternative to purely visual spatial navigation.

Do not make completion states dependent on color alone.

Ensure the application remains usable when decorative assets fail to load.

---

# 26. PERFORMANCE

Optimize for realistic demo conditions.

Prioritize:

- Fast initial rendering.
- Efficient image loading.
- WebP and responsive image variants.
- Lazy loading where appropriate.
- Stable page layout.
- Reasonable bundle size.
- Efficient animation rendering.
- Avoiding unnecessary re-renders.
- Reliable local navigation.

Do not load every high-resolution journey image immediately if only a portion is visible.

Use available optimized artwork.

Do not sacrifice image quality unnecessarily.

---

# 27. SECURITY AND PRIVACY

The prototype must not imply access to official university student records.

Do not build fake institutional SSO.

Do not hard-code real credentials.

Do not use production secrets in frontend code.

Use fictional demonstration data.

Do not collect unnecessary sensitive information.

Do not claim that locally stored demo information is secure institutional data storage.

Clearly document future authentication and backend requirements separately from implemented demo functionality.

---

# 28. COMPLETE TESTING STRATEGY

Implement automated tests appropriate to the project.

## Unit tests

Test:

- Graduation countdown.
- Progress calculations.
- Milestone eligibility.
- Dependency unlocking.
- Task completion.
- Achievement awarding.
- Scenario selection.
- Storage hydration.
- Demo reset.

## Component tests

Test:

- Milestone nodes.
- Task controls.
- Navigation.
- Onboarding.
- Progress indicators.
- Completion feedback.
- Accessible interaction states.

## End-to-end tests

Test:

1. New student starts onboarding.
2. Student completes onboarding.
3. Student enters journey map.
4. Student opens a milestone.
5. Student completes required tasks.
6. Milestone becomes completed.
7. Next milestone unlocks.
8. Dashboard progress updates.
9. Achievements update appropriately.
10. Student refreshes the page.
11. Progress remains saved.
12. Demo scenario can be changed.
13. Almost-graduated scenario reaches its defined final completion state.
14. Demo reset restores the correct seed data.

Do not claim tests passed unless they were actually executed successfully.

---

# 29. COMPETITION DEMO MODE

Create a presentation-friendly demo experience.

It should be reliable enough for live judging.

Support:

- Predictable demo scenarios.
- Resettable application state.
- Offline or locally available content where feasible.
- No required university credentials.
- No dependency on external APIs for essential flows.
- Smooth transitions between key screens.
- Clear feature demonstrations.

Provide a simple demo control that allows the presenter to:

- Load New Student.
- Load Student in Progress.
- Load Almost Graduated.
- Reset current scenario.

Add a documented walkthrough.

Avoid displaying developer-only debug information across the main student experience.

---

# 30. BUILD ORDER

Implement Panther Passage in the following order.

## Stage 1 — Foundation

- Inspect workspace.
- Audit requirements.
- Establish project structure.
- Install appropriate dependencies.
- Configure routes.
- Import design tokens.
- Load fonts and assets.
- Create application shell.
- Validate datasets.

## Stage 2 — Shared UI System

- Typography.
- Buttons.
- Navigation.
- Layout components.
- Progress indicators.
- Milestone states.
- Resource components.
- Form components.
- Feedback components.

## Stage 3 — Core Student Journey

- Welcome.
- Onboarding.
- Dashboard.
- Journey map.
- Milestone details.
- Progression engine.
- Local persistence.

## Stage 4 — Supporting Experiences

- Resources.
- Events.
- Achievements.
- Next Chapter.
- Reflections.
- Graduation readiness.

## Stage 5 — Emotional Finale

- Final destination.
- Completion celebration.
- Personalized summary.
- Next Chapter transition.

## Stage 6 — Competition Readiness

- Demo scenario switching.
- Demo reset.
- Accessibility checks.
- Responsive refinements.
- Performance improvements.
- End-to-end testing.
- Final visual polish.

A functioning vertical slice of the core journey should be completed and verified before expanding to every secondary screen.

---

# 31. CURSOR WORKING RULES

When implementing the product:

1. Read the relevant specification before building each feature.
2. Reuse approved assets.
3. Follow established design tokens.
4. Use Phosphor for ordinary interface icons.
5. Use custom artwork for milestone identity.
6. Keep milestone content data-driven.
7. Separate calendar and preparation progress.
8. Implement actual state changes.
9. Verify navigation.
10. Test persistence.
11. Maintain responsive layouts.
12. Respect accessibility.
13. Avoid unnecessary dependencies.
14. Document assumptions.
15. Do not silently redesign approved screens.

Do not repeatedly rewrite working architecture.

Do not replace completed components merely because a different coding style is preferred.

Make incremental, verifiable improvements.

---

# 32. FRONTEND DESIGN EXCELLENCE REVIEW

Before marking any screen complete, evaluate it against the following questions.

### Visual quality

- Does it look unmistakably like Panther Passage?
- Does it follow the approved reference?
- Is the typography expressive and refined?
- Does it have a clear visual hierarchy?
- Is the composition purposeful?
- Does it avoid repetitive generic card layouts?
- Are backgrounds and textures meaningful?
- Does the screen feel professionally art-directed?

### Interaction quality

- Does every visible action work?
- Is feedback immediate and clear?
- Does navigation behave predictably?
- Are state changes preserved?
- Are completion states accurate?
- Does the UI remain usable without animations?

### Product quality

- Does this feature support a real student need?
- Is the content meaningful?
- Does the experience reinforce graduation preparation?
- Is demo behavior distinguished from future production functionality?
- Are claims realistic?

### Technical quality

- Is the component maintainable?
- Is it typed?
- Is it responsive?
- Is it accessible?
- Is it tested?
- Does it use the correct assets?
- Does it avoid unnecessary complexity?

Revise screens that fail critical requirements.

Do not accept merely functional but visually generic output.

Do not accept beautiful but nonfunctional output.

---

# 33. FINAL DEFINITION OF DONE

Panther Passage is ready for its competition demo only when:

- The application runs successfully.
- All core routes are functional.
- The welcome screen respects approved visual references.
- Onboarding works.
- The dashboard reflects actual demo state.
- The journey map is interactive.
- Milestones correctly unlock.
- Tasks can genuinely be completed.
- Progress is calculated correctly.
- Achievements follow business rules.
- Student data persists locally.
- Three demo scenarios can be loaded.
- The demo can be reset.
- The graduation destination works.
- Mobile and desktop layouts have been tested.
- No broken images are present.
- No dead buttons remain.
- Critical accessibility issues are resolved.
- Automated tests pass.
- The application can be demonstrated without live institutional integrations.
- The visual identity is coherent across screens.

Create:

`docs/FINAL_BUILD_AUDIT.md`

Document what is implemented, tested, provisional, simulated, incomplete, or blocked.

Never describe unimplemented functionality as completed.

---

# 34. FINAL INSTRUCTIONS TO CURSOR

You are not building a generic app.

You are bringing Panther Passage to life.

The experience must combine the beauty of an editorial digital product with the clarity of a student success platform and the anticipation of an interactive progression journey.

The application should feel cohesive from the first welcome screen to the final graduation celebration.

Every screen must belong to the same visual world.

Every feature must have a purpose.

Every interaction must work.

Every milestone must mean something.

**The journey map is our signature experience. Protect its quality.**

**The approved visual identity is our creative foundation. Do not replace it.**

**The functional student journey is our product promise. Deliver it.**

## BEGIN EXECUTION

First, inspect and audit the actual project workspace and available source files.

Create the implementation audit.

Then establish the development foundation and begin implementing the core student experience in the defined build order.

Continue implementing, testing, and refining the application within the available execution environment.

Do not stop after merely proposing an implementation plan.

When an approved requirement is missing, document the gap, choose a clearly marked reversible prototype assumption where safe, and continue.

When source assets are missing, do not falsely recreate them as approved originals.

When tests fail, fix the underlying issue rather than bypassing the test.

The final result should be a cohesive, responsive, accessible, interactive, and visually unforgettable Panther Passage competition demo.

**BUILD PANTHER PASSAGE WITH THE QUALITY AND INTENTION OF A FLAGSHIP DIGITAL PRODUCT.**