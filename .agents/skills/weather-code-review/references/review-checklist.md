# Weather Review Checklist

## React, MUI, And UI

- Components reading observable store values are wrapped with `observer`.
- Presentational components stay prop-driven and avoid request, storage, or
  shared state ownership.
- Loading, empty, fallback, success, and error states remain visible and
  accessible.
- Interactive controls use roles, labels, disabled/loading states, and stable
  layout dimensions.
- Styling uses Material UI and shared theme tokens instead of ad hoc CSS when a
  local pattern exists.

## WeatherStore And Request State

- Selecting the current city or country remains a no-op.
- Effective city/country changes cancel active requests, clear stale weather,
  clear errors, stop loading, and remove cached weather.
- `getWeather` creates a fresh `AbortController`, request ID, and signal.
- Responses commit only when request ID, selected city, selected country, and
  signal still match.
- Abort failures are ignored as control flow; latest non-abort failures show an
  error without saving weather.
- Gender changes persist selection but do not invalidate weather.

## API, Services, And Runtime Types

- External data is treated as `unknown` until a type guard validates it.
- API modules accept `AbortSignal` when callers own cancellation.
- Service wrappers preserve injection seams used by tests and store logic.
- `WeatherSuccess`, storage contracts, and recommendation contracts stay aligned
  with fixtures and guards.
- API failures return typed errors or safe `null` fallbacks consistently with
  existing boundaries.

## Cloudflare Worker And LLM Recommendations

- Browser code only uses public `VITE_*` values; Cloudflare tokens and account
  secrets never enter Vite bundles.
- Worker validates request bodies before calling Workers AI.
- Worker response shape remains `{ title, items, description }` and is validated
  before the frontend renders it.
- Local fallback recommendations remain available when Worker URL is absent,
  requests fail, or model output is invalid.
- CORS allows local Vite and GitHub Pages origins without weakening secret
  handling.
- Local `wrangler dev` and production `wrangler deploy` paths are documented or
  scripted consistently.

## Storage And Persistence

- Selected location persistence is separate from last successful weather cache.
- Restored storage values are validated before use.
- Storage failures do not block user interaction or weather requests.
- Invalidating weather removes only successful weather cache, not unrelated
  selection data.

## GitHub Pages, Vite Env, And CI

- `/Weather/` base path is preserved for GitHub Pages.
- New production env vars are passed in GitHub Actions build steps.
- Deploy workflows fail clearly when required secrets or variables are missing.
- `dist`, `coverage`, `node_modules`, `.env*`, and local `.wrangler` cache are
  not staged.
- Worker config, GitHub Pages config, and README/deploy instructions agree.

## Tests

- User workflows belong in `src/App.test.tsx`; module behavior belongs beside
  the module.
- Request ordering and cancellation use controllable promises when timing
  matters.
- Component tests prefer roles, accessible names, visible text, and user-event.
- API, storage, and type guard tests cover malformed data and failure paths.
- Broad behavior changes run `npm run validate`; shared workflow changes also
  run coverage.
