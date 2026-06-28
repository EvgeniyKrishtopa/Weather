# Weather Domain

## Core Behavior

- Selecting a valid city requests weather automatically.
- Explicit form submission always refreshes weather when city and country are
  valid.
- Selection changes hide stale weather immediately.
- The weather section is hidden while loading or when no valid weather exists.
- Errors are stored separately from successful weather data.
- Country, city, and outfit profile selections persist separately from the last
  successful weather cache.

## External APIs

- Weather data uses OpenWeather current weather with metric units.
- Reverse geocoding uses OpenWeather coordinates-to-country lookup.
- Country and city options use Countries Now endpoints.
- Outfit recommendation calls are optional and depend on
  `VITE_OUTFIT_RECOMMENDATION_API_URL`.

Treat all API responses as `unknown` until validated by a type guard or explicit
boundary validation.

## Storage

- `weather-app:selected-location` stores `city`, `countryIso`, and
  `outfitProfile`.
- `weather-app:last-weather` stores only validated successful weather.
- Storage failures must not block form interaction or weather requests.
- Invalidating weather removes only the successful weather cache.
- Preserve backward-compatible reads for older stored outfit profile values
  unless intentionally removing a migration.

## Location And Country Refinement

- The default country starts from locale/default-country service behavior.
- Browser geolocation can refine the country only while the store still allows
  auto-detected country application.
- A country option list that does not contain the detected country reconciles to
  `DEFAULT_COUNTRY_ISO` when possible.
- Changing country retains the current city until the new city list determines
  whether it remains valid.
- A valid retained city requests weather for the new country.
- An invalid retained city is cleared without a weather request.
