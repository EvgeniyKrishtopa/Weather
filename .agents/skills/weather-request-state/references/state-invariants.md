# State Invariants

## Ownership

- `city` and `countryIso` represent the current user selection.
- `weather` contains only the latest valid successful response.
- `error` contains only the latest valid failed response.
- `loading` represents only the latest active weather request.
- `activeRequest` and `requestId` are internal request-ownership details.

## Selection Rules

- Selecting the current value changes nothing.
- Changing or clearing a selection invalidates visible and cached weather.
- Changing country retains the current city until the new city list determines
  whether it remains valid.
- A valid retained city starts a request for the new country.
- An invalid retained city is cleared without a weather request.

## Request Rules

- Every new request cancels the previous request.
- A response may update state only when all request ownership checks pass.
- An aborted or outdated response must not update weather, error, loading,
  persistence, or selection.
- Explicit submit always refreshes when city and country are valid.
- API failures produce `WeatherError`; aborts are control flow, not user errors.

## Persistence Rules

- `weather-app:selected-location` stores city and country selection.
- `weather-app:last-weather` stores only successful validated weather.
- Selection invalidation removes the last-weather cache.
- Storage failures must not block user interaction or weather requests.
