# Persistence

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

## Prototype persistence
Key `panther-passage:demo:v1:{studentId}`, JSON with schemaVersion=1. Attempt read on startup; validate with Zod; if incompatible/corrupt, safely fall back to a fresh seed with warning. Try/catch quota and private-window errors. Never store passwords, official IDs, medical information, or bank records. `Reset scenario` overwrites only active fictional profile's state and requires confirmation for edits. Optional export/import must validate schema and scrub metadata.
