---
name: weather-feature-workflow
description: Implement and review scoped features in this Weather React application. Use for component changes, form behavior, weather display updates, API integration, persistence, accessibility, tests, or any request that should follow the repository architecture and validation workflow.
---

# Weather Feature Workflow

## Workflow

1. Read `AGENTS.md`, the affected source files, adjacent tests, and
   `references/project-map.md`.
2. Trace the full behavior before editing:
   - UI event
   - MobX store action
   - API or storage boundary
   - rendered loading, success, empty, and error states
3. Preserve ownership boundaries:
   - components render and manage local UI-only state
   - `WeatherStore` owns shared selection and weather state
   - `src/api` owns HTTP calls
   - `src/utils` owns browser persistence
   - `src/types` owns runtime guards and data contracts
4. Reuse Material UI, theme tokens, existing fixtures, and adjacent styled
   files. Do not add a library for behavior already supported by the stack.
5. Update focused tests with user-visible queries. Add store or utility tests
   when logic moves below the component layer.
6. Run the narrowest relevant tests while iterating.
7. Format edited files, then run `npm run validate` and
   `npm run format:check`.
8. Run `npm run test:coverage` when behavior spans multiple layers or changes
   shared workflows.

## Guardrails

- Treat API and storage values as `unknown` until validated.
- Wrap components that read observable values with `observer`.
- Do not duplicate store-owned city, country, weather, error, or loading state
  in React state.
- Use `AbortController` for cancellable effects and requests.
- Preserve the `/Weather/` Vite base path when changing public assets or URLs.
- Never read, edit, log, or expose `.env` secrets.

## Verification

Report changed behavior, tests run, and any validation that could not be run.
Do not claim visual verification unless the app was actually inspected in a
browser.
