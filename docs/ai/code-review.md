# Code Review

Use this for Weather app reviews, PR audits, local diff reviews, regression
checks, and pre-merge risk assessment.

## Output Shape

- Start with findings.
- Use `No findings.` only when no actionable issue is found.
- Order findings by severity.
- Include precise file and line references.
- Explain the bug, impacted scenario, and why the changed code causes it.
- After findings, add open questions or assumptions if needed.
- Keep summaries brief and secondary.
- Mention tests reviewed or residual test gaps.
- Do not claim tests were run unless they actually were.

## Severity Guide

- **Critical**: secret exposure, broken production deploy, data loss, or app
  unusable on common paths.
- **High**: request-order bugs, stale weather display, uncaught runtime crashes,
  invalid persisted data, or API/Worker contract mismatch.
- **Medium**: accessibility regressions, missing error/fallback states,
  meaningful test gaps, or deployment configuration drift.
- **Low**: maintainability risks, confusing naming, or minor UX regressions.

## Review Checklist

- Components reading observable store values are wrapped with `observer`.
- Presentational components stay prop-driven and avoid request, storage, or
  shared state ownership.
- Loading, empty, fallback, success, and error states remain visible and
  accessible.
- Interactive controls use roles, labels, disabled/loading states, and stable
  layout dimensions.
- Styling uses Material UI and shared theme tokens when a local pattern exists.
- Selecting the current city, country, or outfit profile remains a no-op.
- Effective city/country changes cancel active requests, clear stale weather,
  clear errors, stop loading, and remove cached weather.
- Outfit profile changes persist selection without invalidating weather.
- `getWeather` creates a fresh `AbortController`, request ID, and signal.
- Weather responses commit only when request ID, selected city, selected
  country, and signal still match.
- Abort failures are ignored as control flow; latest non-abort failures show an
  error without saving weather.
- External data is treated as `unknown` until validated.
- API modules accept `AbortSignal` when callers own cancellation.
- Service wrappers preserve injection points used by tests and store logic.
- Weather, storage, and recommendation contracts stay aligned with fixtures and
  guards.
- Browser code only uses public `VITE_*` values.
- Worker validates request bodies before calling Workers AI.
- Worker response shape remains `{ title, items, description }` and is
  validated before the frontend renders it.
- Local fallback recommendations remain available when the Worker URL is
  absent, requests fail, or model output is invalid.
- CORS allows intended local Vite and GitHub Pages origins without weakening
  secret handling.
- Selected location persistence is separate from the weather cache.
- Restored storage values are validated before use.
- `/Weather/` base path is preserved for GitHub Pages.
- New production env vars are passed in GitHub Actions build steps when needed.
- `dist`, `coverage`, `node_modules`, secret-bearing `.env*` files other than
  `.env.example`, and `.wrangler` are not staged.
- `.env.example` may be staged when the change is an intentional placeholder
  config-template update.
- User workflows belong in `src/App.test.tsx`; module behavior belongs beside
  the module.
- Request ordering and cancellation use controllable promises when timing
  matters.
