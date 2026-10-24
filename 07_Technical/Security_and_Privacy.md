# Security and Privacy

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

A local demo is not a production FERPA-compliant student information system. Use **fictional names only**; no real emails, passwords, graduation verification, student IDs or institutional records. Prevent XSS by rendering notes as plain text and escaping input; cap note length; no `dangerouslySetInnerHTML` for editable reflections. Communicate local device storage, deletion and visibility honestly. For later production, require consent, least privilege, data minimization, encryption in transit/at rest, user deletion, retention schedule, approved vendors and institutional/legal review. Do not assert any approval exists.
