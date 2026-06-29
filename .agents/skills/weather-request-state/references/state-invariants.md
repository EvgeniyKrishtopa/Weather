# State Invariants

## Ownership

- `city` and `countryIso` represent the current location selection.
- `outfitProfile` represents the current recommendation profile selection.
- `weather` contains only the latest valid successful response.
- `error` contains only the latest valid failed response.
- `loading` represents only the latest active weather request.
- `activeRequest` and `requestId` are internal request-ownership details.

## Selection Rules

- Selecting the current value changes nothing.
- Changing or clearing a selection invalidates visible and cached weather.
- Changing outfit profile persists selection without invalidating weather.
- Changing outfit profile can request missing weather when a valid city is
  selected and no weather is currently shown.
- Changing country retains the current city until the new city list determines
  whether it remains valid.
- A valid retained city starts a request for the new country.
- An invalid retained city is cleared without a weather request.

## Request Rules

- Every new request cancels the previous request.
- A response may update state only when all request ownership checks pass.
- An aborted or outdated response must not update weather, error, loading,
  persistence, or selection.
- The form has no submit request path; valid city selection requests weather.
- Weather request loading remains visible for at least 2 seconds for the latest
  request.
- API failures produce `WeatherError`; aborts are control flow, not user errors.

## Persistence Rules

- `weather-app:selected-location` stores city, country, and outfit profile
  selection.
- `weather-app:last-weather` stores only successful validated weather.
- Selection invalidation removes the last-weather cache.
- Storage failures must not block user interaction or weather requests.
