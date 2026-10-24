# Component Structure

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

```text
src/app/(routes)/*
src/components/ui/{Button,Input,Dialog,Toast,ProgressPair}.tsx
src/features/journey/{JourneyMap,JourneyList,MilestoneDetail,engine}.tsx
src/features/dashboard/{Countdown,NextMilestone}.tsx
src/features/resources/{ResourceFilters,ResourceCard}.tsx
src/features/events/{EventCard,RSVPState}.tsx
src/features/reflection/{ReflectionEditor,LegacyNote}.tsx
src/features/finale/{ThresholdReveal,CrestCollection}.tsx
src/lib/{dataLoader,storage,validators,dates}.ts
src/styles/{tokens,globals}.css
public/assets/… (copied from 09_Assets on implementation)
```
Use named exports, well-labeled components and never embed substantive product content as ad hoc JSX literals when datasets exist.
