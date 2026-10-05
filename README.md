# Learning Platform

Documentation awal untuk website pembelajaran.

## Documents

- `docs/design-system.md` — visual language, UI components, UX rules.
- `docs/architecture.md` — technical architecture, module boundaries, security, data flow.
- `docs/prd.md` — product requirements and user flow.
- `AGENTS.md` — coding agent constraints and development rules.

## Initial Stack

Next.js + React + TypeScript + Tailwind CSS + Prisma + PostgreSQL/Supabase + Supabase Auth + Supabase Storage.

## Architecture

Modular monolith. Frontend and backend responsibilities are separated. Database access and sensitive business logic remain server-side.

## Primary User Flow

```text
Student:
Login → Pre-Test → Material 1 → Video 1 → Quiz 1 → Material 2 → Video 2 → Quiz 2 → Post-Test → Result

Admin:
Login → Dashboard → Materials / Videos / Questions / Participants / Results / Export
```
