# Recommended Tech Stack

> **Status:** Proposed implementation guidance, not an institutional commitment. Panther Passage is a competition concept for Philander Smith University. All sample people, events and services are fictional/simulated unless explicitly labeled externally verified.

Proposed: Next.js App Router with React and TypeScript, Tailwind CSS or CSS Modules with tokens, Zod to validate all imported JSON and persistent records, Vitest + Testing Library, Playwright, and optionally Lucide icons. Favor deployable static/client-first routes for robust offline judging, no database and no authentication service required. Browser storage schema versioning and `navigator.onLine` are enhancements; use a service worker/PWA only after testing cache correctness.

Do not install dependencies blindly: validate current compatible versions and licenses in Cursor.
