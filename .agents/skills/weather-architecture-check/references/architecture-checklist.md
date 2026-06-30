# Architecture Checklist

## Ownership And Boundaries

- Preserve existing module ownership before adding abstractions.
- Keep shared selection, weather, error, loading, request ownership, and
  persistence coordination in `WeatherStore`.
- Keep recommendation request state outside `WeatherStore`; it belongs to the
  Info recommendation hook.
- Keep HTTP calls in `src/api`, service wrappers in `src/services`, browser
  persistence in `src/utils`, and runtime contracts in `src/types`.
- Keep Worker validation, model policy, CORS, response normalization, and
  fallback behavior in `worker/outfit-recommendation`.

## Data Flow And State

- Trace user-visible data flow from UI event to store action, API/service,
  storage when relevant, and rendered loading, success, empty, fallback, and
  error states.
- Do not duplicate store-owned state in React state.
- Preserve request ownership, cancellation, stale-response suppression, and
  abort-as-control-flow behavior when request paths change.
- Treat external API, Worker, and storage data as `unknown` until validated.

## Design Quality

- Apply SOLID, DRY, and KISS pragmatically.
- Add abstractions only when they remove real complexity, reduce meaningful
  duplication, or match an established local pattern.
- Reuse existing store actions, API functions, services, storage helpers, type
  guards, theme tokens, fixtures, and colocated test patterns.
- Do not add dependencies for behavior already supported by the stack.

## UI And UX

- Keep presentational components prop-driven and free of shared request,
  storage, or persistence logic.
- Use Material UI, shared theme tokens, accessible roles and labels, stable
  loading states, and visible error or fallback states.
- Preserve `/Weather/` base-path assumptions for public assets and deploy paths.

## Testing And Release Risk

- Map architecture decisions to focused tests before implementation starts.
- Use `src/App.test.tsx` for full user workflows and colocated tests for module
  behavior.
- Use controllable promises when request ordering or cancellation matters.
- Call out build, coverage, deployment, or env-var checks when the plan changes
  Vite, Worker, public assets, routing, or shared workflows.
