# Progression Rules

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

## Pseudocode
```ts
type Milestone = {id:string; required:boolean; dependsOn:string[]; chapterId:string};
const ceremonyRequired = (m:Milestone) => m.required || m.id === 'M15';
const unlocked = (m:Milestone, completed:Set<string>) => m.dependsOn.every(id=>completed.has(id));
const isReady = (all:Milestone[], completed:Set<string>) => all.filter(ceremonyRequired).every(m=>completed.has(m.id));
const overallPercent = (all:Milestone[], completed:Set<string>) => Math.round(100 * all.filter(m=>completed.has(m.id)).length / all.length);
const readinessPercent = (all:Milestone[], completed:Set<string>) => { const core=all.filter(ceremonyRequired); return Math.round(100 * core.filter(m=>completed.has(m.id)).length / core.length); };
const daysRemaining = (gradISO:string, now:Date) => { const [y,m,d]=gradISO.split('-').map(Number); const target=Date.UTC(y,m-1,d); const localToday=Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()); return Math.max(0,Math.round((target-localToday)/86400000)); };
```

**Guardrails:** Never trust a raw completed flag without checking tasks; treat imported seeded completed milestones as pre-validated demo fixtures. If user unchecks a prerequisite, downstream completed data can remain archived but display `needs review` until dependencies are restored; do not silently delete journal entries. Mark dependent milestone locked until prerequisite restored.

See `03_Features/Business_Rules.md` for reward/finale behavior.
