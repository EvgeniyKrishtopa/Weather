---
name: weather-architecture-check
description: Review serious Weather feature implementation plans for architectural fit before coding. Use for multi-layer feature planning, architecture planning, implementation plan review, or when a proposed change touches two or more layers such as UI, store, API, services, storage, Worker, config/deploy, or shared runtime contracts.
---

# Weather Architecture Check

Use this skill during implementation planning, before editing application code.
It does not replace code review; it checks whether the proposed architecture is
sound before implementation starts.

## Workflow

1. Read `AGENTS.md`, `docs/ai/architecture.md`, and
   `references/architecture-checklist.md`.
2. Identify the affected layers:
   - UI or component composition
   - `WeatherStore`, context, request ownership, or persistence coordination
   - API, service, utility, helper, or runtime type contract
   - Cloudflare Worker, Vite config, environment variables, deploy, or routing
3. Load only the shared standards that match the affected layers:
   - `docs/ai/frontend-standards.md` for React, MUI, styling, or browser UX
   - `docs/ai/state-management.md` for store, context, request, or persistence
   - `docs/ai/weather-domain.md` for weather, static locations, or storage
   - `docs/ai/ai-layer.md` for outfit recommendations, Worker, or Workers AI
   - `docs/ai/i18n.md` for locale, default country, or localization
   - `docs/ai/testing.md` for validation and test planning
4. Evaluate the proposed implementation plan against ownership boundaries,
   existing project patterns, data flow, testability, and risk.
5. Return the architecture verdict before implementation proceeds.

## Serious Feature Rule

Treat a feature as serious when it touches two or more architectural layers. Do
not require this skill for narrow documentation changes, copy edits, isolated
component styling, or one-file refactors that do not move ownership boundaries.

## Output

Use this structure:

```md
Architecture Check: Approved | Needs changes

Findings:

- ...

Required plan changes:

- ...

Testing impact:

- ...
```

Use `Architecture Check: Approved` only when the plan fits project boundaries
and does not need architectural changes. Use `Needs changes` when implementation
should not start until the listed plan changes are applied.
