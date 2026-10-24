# API Contracts

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

## Local demo service contracts (in-memory async-compatible methods)
```ts
interface PassageRepository {
 listMilestones(): Promise<Milestone[]>;
 getProgress(studentId:string): Promise<UserProgress>;
 setTask(studentId:string, taskId:string, done:boolean, note?:string):Promise<UserProgress>;
 saveReflection(studentId:string, key:string, text:string, visibility:'private'|'demo-visible'):Promise<void>;
 rsvp(studentId:string, eventId:string, action:'join'|'cancel'):Promise<{status:'saved'|'cancelled'|'full'}>;
 resetScenario(scenario:'new'|'in-progress'|'almost-graduated'):Promise<void>;
}
```

## Possible backend endpoints later
`GET /v1/journey`, `GET /v1/me/progress`, `PATCH /v1/me/tasks/:id`, `PUT /v1/me/reflections/:id`, `POST /v1/events/:id/rsvp`. All hypothetical; require institutional approval, auth, roles, rate-limiting, and audit logging.
