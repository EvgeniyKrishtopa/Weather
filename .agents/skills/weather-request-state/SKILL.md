---
name: weather-request-state
description: Modify or debug WeatherStore selection, outfit profile persistence, loading, error, cancellation, and request-order behavior. Use when changing city or country interactions, automatic weather fetching, refresh behavior, AbortController handling, stale-response suppression, local storage, or weather visibility rules.
---

# Weather Request State

Read `docs/ai/state-management.md`, `docs/ai/weather-domain.md`, and
`references/state-invariants.md` before changing request, selection, or
persistence logic.

## Workflow

1. Identify the triggering selection event and its expected no-op,
   invalidation, loading, success, and failure states.
2. Keep shared transitions in `WeatherStore`; keep option loading and
   presentation-only state in the form component.
3. On an effective city or country change:
   - cancel the active request
   - increment the request generation
   - clear weather and error
   - stop loading
   - clear the successful weather cache
   - persist the new selection
4. On `getWeather`:
   - persist the requested city and country
   - cancel the previous request
   - create a new `AbortController` and request ID
   - hide stale weather and clear errors
   - pass the signal through `fetchWeather`
   - keep loading visible for at least 2 seconds for the latest request
5. Commit a response only when the signal is active, the request ID is current,
   and the selected city and country still match the request.
6. Save only successful weather. Store failures in `error`, not `weather`.
7. Ignore abort failures. Finish loading only for the current request.
8. Persist outfit profile changes without invalidating successful weather.

## Required Tests

- Same city or country is a no-op.
- Same outfit profile is a no-op.
- Clearing a city invalidates weather and an active request.
- A newer request wins even if an older promise resolves last.
- A valid retained city requests after country options load.
- An invalid retained city is cleared without a weather request.
- The form has no submit request path; valid city selection requests weather.
- Blur and outfit-profile changes can request missing weather when a valid city
  is selected and no weather is currently shown.
- Failed latest requests keep weather hidden and show an error.
- Outfit profile changes persist without clearing current weather.

Use controllable promises for ordering tests and assert that stale requests do
not save weather.
