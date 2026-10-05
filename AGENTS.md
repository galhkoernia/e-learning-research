# AGENTS.md — Development Rules

## 1. Mission

Build and maintain a minimal, secure, modular learning platform using Next.js, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL/Supabase, Supabase Auth, and Supabase Storage where appropriate.

The application is a learning website for a thesis project. Do not expand the product into a generic LMS unless explicitly requested.

## 2. Architecture Rules

- Use Next.js App Router.
- Prefer Server Components by default.
- Use Client Components only when interaction, browser APIs, or client state requires them.
- Keep frontend presentation and interaction logic separate from server business logic.
- Never import Prisma/database code into client components.
- Never expose service-role keys or database credentials to the browser.
- Treat the server as the source of truth for authorization, scoring, and mutations.
- Keep feature-specific code close to its feature.

## 3. Frontend Rules

Frontend may handle:

- UI state;
- form state;
- client-side validation for immediate feedback;
- loading states;
- navigation;
- presentation formatting.

Frontend must not decide:

- whether a user is actually an admin;
- final score;
- correct answers as a security authority;
- whether a protected mutation is allowed.

## 4. Backend Rules

Backend must handle:

- session verification;
- authorization;
- input validation;
- business rules;
- score calculation;
- persistence;
- storage authorization;
- transactions where consistency requires them.

Every sensitive mutation must independently verify authentication and authorization.

## 5. Security

- Never trust client-provided role, score, ownership, or completion status.
- Validate all mutation input server-side.
- Use environment variables for secrets.
- Never print secrets or tokens in logs.
- Return safe errors to the client.
- Do not reveal database errors or stack traces to users.
- Do not expose answer keys unnecessarily.
- Use secure storage access for private videos.
- Consider rate limiting before production if endpoints become publicly reachable.

## 6. Code Style

Code should be clean, direct, and minimal.

Rules:

- TypeScript strict mode.
- Prefer small functions with one responsibility.
- Prefer explicit names over clever abstractions.
- Avoid unnecessary generic utilities.
- Avoid premature design patterns.
- Avoid duplicated business rules.
- Do not introduce a dependency for a trivial function.
- Do not create a component abstraction solely to reduce a few lines.

## 7. Comments

Comments are not documentation for obvious code.

Write comments only when they explain:

- why a non-obvious decision exists;
- a security constraint;
- an external limitation;
- a temporary workaround;
- a subtle domain rule.

Comments should sound like a developer explaining the code to another developer. Do not generate verbose AI-style comments.

Bad:

```ts
// This function is used to calculate the score by iterating through...
```

Good:

```ts
// Score is calculated server-side so submitted values cannot override the result.
```

## 8. Validation

Use a schema validation library such as Zod when useful.

Do not duplicate large validation schemas across client and server unnecessarily. Shared schemas may be placed in a feature module when the schema is safe to import into both environments.

Client validation improves UX. Server validation enforces correctness.

## 9. Database

Prisma is the application ORM.

Rules:

- database access is server-only;
- use transactions for multi-step writes that must be atomic;
- use indexes based on actual query patterns;
- avoid N+1 queries;
- do not fetch fields that are not needed;
- use pagination for potentially large admin lists.

## 10. Authentication

Supabase Auth is the identity provider.

Application roles are enforced server-side.

Minimum roles:

```text
ADMIN
STUDENT
```

Do not build a second password system inside the application.

## 11. Video

Videos are storage assets, not database blobs.

Store metadata/reference in PostgreSQL and the actual file in Supabase Storage or another explicitly approved storage provider.

Do not route large video files through application API handlers unnecessarily.

## 12. API / Server Actions

Choose Server Actions for simple application mutations where appropriate.

Use Route Handlers when a stable HTTP endpoint, file-related flow, external integration, or explicit API boundary is needed.

Do not create API endpoints merely because an API endpoint feels architectural.

## 13. UI

Use Tailwind CSS and project components.

Avoid unnecessary animation, visual complexity, and excessive client-side rendering.

Student UI prioritizes learning flow.

Admin UI prioritizes data management and clarity.

## 14. Development Workflow

Before implementing a feature:

1. inspect the existing structure;
2. identify the correct feature module;
3. check whether an existing component/service already solves the problem;
4. define the smallest required change;
5. implement;
6. run typecheck/lint/tests relevant to the change;
7. inspect the resulting diff.

Do not rewrite unrelated code.

## 15. Debugging Policy

Do not generate speculative large patches when a bug is reported.

Debug in this order:

1. reproduce;
2. identify the failing layer;
3. inspect the smallest relevant code path;
4. determine root cause;
5. make the smallest safe fix;
6. verify the fix;
7. check for regression.

When the cause is uncertain, state the uncertainty and inspect evidence rather than inventing an explanation.

## 16. AI Coding Policy

AI-generated code must not be accepted merely because it compiles.

Every generated change must be reviewed for:

- correctness;
- security;
- unnecessary abstraction;
- duplication;
- runtime behavior;
- maintainability.

Prefer writing less code that is correct over generating large scaffolding.

## 17. Do Not Overbuild

Do not add without a concrete requirement:

- microservices;
- Redis;
- queues;
- event sourcing;
- GraphQL;
- complex state management;
- elaborate repository frameworks;
- feature flags;
- multi-tenancy;
- advanced observability stacks.

The expected architecture is a modular monolith.

## 18. Expected Runtime Model

```text
Browser
  │
  ├── React UI
  └── Client interaction
          │
          ▼
Next.js server boundary
          │
          ├── Auth verification
          ├── Authorization
          ├── Validation
          ├── Business rules
          │
          ▼
       Prisma
          │
          ▼
PostgreSQL / Supabase

Video files → Supabase Storage
Identity → Supabase Auth
```

## 19. Future-Proofing

Design current modules so future requirements can be added without rewriting the application.

Expected future changes may include:

- more than two materials;
- more assessment sets;
- more participants;
- question bank;
- richer reporting;
- multiple classes;
- additional roles.

Do not implement these future features until requirements appear.

## 20. Definition of Done

A change is done when:

- it follows the existing architecture;
- authorization is enforced server-side;
- inputs are validated;
- no secret is exposed;
- relevant typecheck/lint/test passes;
- UI handles loading/error/empty states where relevant;
- code remains minimal;
- unrelated files are not changed;
- comments are limited to non-obvious reasoning.
