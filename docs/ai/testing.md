# Testing And Validation

## Test Placement

- Use `src/App.test.tsx` for full user workflows across form, store, API, and
  output.
- Keep module behavior in colocated tests beside the module.
- Add unit tests for new components, hooks, services, API modules, utilities,
  helpers, and runtime type guards.
- Reuse `src/test/weatherFixture.ts` for weather test data.

## Test Style

- Use Vitest APIs from `vitest`; do not add Jest-specific configuration.
- Prefer user-visible queries such as roles, accessible names, and text.
- Use `userEvent.setup()` for interactions.
- Mock network boundaries with `vi`.
- The shared setup already cleans up renders, local storage, and mocks.

## Required Coverage Areas

- Selection changes and no-op selections.
- Weather request cancellation and stale-response suppression.
- Persistence restoration and invalid storage tolerance.
- Error visibility and hidden stale weather.
- Outfit profile persistence.
- Recommendation fallback behavior and Worker response validation.
- Geolocation/default-country refinement.
- Retained-city reconciliation and invalid retained-city clearing.

Use controllable promises for request ordering and cancellation tests.

## Validation Commands

- Run focused tests while developing.
- Run the Husky pre-commit hook before committing so `codex exec review` can
  inspect staged changes with `docs/ai/code-review.md` before validation.
- Run `npm run format:check` for documentation-only changes.
- Run `npm run validate` for code changes.
- Run `npm run test:coverage` when changes affect broad behavior or shared
  workflows.
- Run `npm run build` for build, public asset, manifest, routing, Vite, Worker,
  or deployment changes.
- Run `npm run dependencies:deprecated` and `npm audit --audit-level=high` for
  dependency changes.

Coverage thresholds are 90% for statements, branches, functions, and lines.

## Check Matrix

| Change                                      | Checks                                                                              |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| Documentation only                          | `npm run format:check`                                                              |
| Narrow component styles                     | Focused test, typecheck, format check                                               |
| Component behavior                          | Focused component/App tests, `npm run validate`                                     |
| Store, API, or persistence                  | Focused unit and App tests, `npm run validate`, coverage                            |
| Outfit Worker or recommendation flow        | Focused API/hook/Worker tests, `npm run validate`, build when deploy paths change   |
| Dependencies                                | Install, validation, deprecated check, audit, build                                 |
| Public assets, Vite, routing, or deployment | Validation, build, review `/Weather/` paths                                         |
| Before commit or push                       | Codex pre-commit review, diff review, format check, validation, clean staging scope |
