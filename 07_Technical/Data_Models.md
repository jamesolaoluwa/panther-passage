# Data Models

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

```ts
type ChapterId = 'P1'|'P2'|'P3'|'P4'|'P5';
type MilestoneId = `M${string}`;
type TaskId = `T${string}`;
interface Chapter { id:ChapterId; title:string; daysRemaining:string; summary:string; theme:string; order:number; }
interface Milestone { id:MilestoneId; chapterId:ChapterId; sequence:number; title:string; slug:string; category:string; description:string; purpose:string; emotionalObjective:string; estimatedMinutes:number; required:boolean; dependsOn:MilestoneId[]; taskIds:TaskId[]; completionRule:string; rewardId:string|null; points:number; successCopy:string; cta:string; demoAsset:string; status:string; }
interface Task { id:TaskId; milestoneId:MilestoneId; order:number; label:string; type:string; required:boolean; validation:string; }
interface Student { id:string; name:string; graduationDate:string; pathway:string; interests:string[]; completedMilestoneIds:MilestoneId[]; scenario:string; fictional:true; }
interface UserProgress { schemaVersion:1; studentId:string; completedMilestoneIds:MilestoneId[]; taskChecks:Record<TaskId,boolean>; answers:Record<TaskId,string>; reflections:Record<string,{text:string;visibility:'private'|'demo-visible'}>; rsvpEventIds:string[]; updatedAt:string; }
```

All dates saved ISO; display localized dates. Treat all sample data as explicitly fictional. Validate IDs and references on import.
