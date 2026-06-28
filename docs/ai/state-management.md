# State Management

## WeatherStore Ownership

`WeatherStore` owns shared selection, weather, error, loading, request
ownership, outfit profile selection, and persistence coordination.

- `city` and `countryIso` represent the current user location selection.
- `outfitProfile` represents the current recommendation profile.
- `weather` contains only the latest valid successful weather response.
- `error` contains only the latest valid failed weather response.
- `loading` represents only the latest active weather request.
- `activeRequest` and `requestId` are internal request-ownership details.

Keep recommendation fetch state outside `WeatherStore`; it belongs to the Info
recommendation hook.

## Selection Rules

- Selecting the current city, country, or outfit profile changes nothing.
- Changing or clearing city/country invalidates visible and cached weather.
- Changing outfit profile persists the selection without invalidating successful
  weather.
- Changing country retains the current city until the new city list proves it
  valid or invalid.
- A valid retained city starts a weather request for the new country.
- An invalid retained city is cleared without a weather request.

## Request Rules

- Every new weather request cancels the previous active request.
- `getWeather` persists the requested city/country, creates a fresh
  `AbortController`, increments request ID, clears visible weather/errors, and
  passes the signal through the request service.
- A response may update state only when the signal is active, request ID is
  current, and selected city/country still match the request.
- Aborted or outdated responses must not update weather, error, loading,
  persistence, or selection.
- API failures produce `WeatherError`; aborts are control flow.
- Loading finishes only for the current request.

## Persistence Rules

- Selected location persistence is separate from last successful weather cache.
- Restored storage values must be validated before use.
- Save only successful weather.
- Store failures in `error`, not `weather`.
- Storage failures must not block user interaction or weather requests.

## Implementation Rules

- Use store actions for shared city, country, outfit profile, weather, error,
  and loading changes.
- Do not duplicate store-owned state in React state.
- Use controllable promises in store tests when request ordering matters.
