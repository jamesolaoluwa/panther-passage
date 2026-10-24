# Future Database Schema

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

**Not needed for the competition demo**. Suggested PostgreSQL relational model for a future, authorized pilot: `users(id, institution_subject_id, consent_version, created_at)`, `cohorts(id, graduation_date, content_version)`, `chapters(id, order, content)`, `milestones(id, chapter_id, order, required, data)`, `tasks(id,milestone_id,order,label)`, `user_task_progress(user_id,task_id,done,updated_at)`, `artifacts(id,user_id,milestone_id,encrypted_payload)`, `events(id,capacity,status)`, `event_rsvps(user_id,event_id,status)`, `resource_items(id,owner_id,reviewed_at,metadata)`.

Keys and constraints: FK on every relation, unique `(user_id,task_id)` and `(user_id,event_id)`, transaction-safe capacity checks; per-user authorization and deletion. Avoid storing health status or sensitive financial account data. No institution integration is implied.
