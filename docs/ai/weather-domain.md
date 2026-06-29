# Weather Domain

## Core Behavior

- Selecting a valid city requests weather automatically.
- The form has no weather submit button or manual refresh action.
- City validation appears as helper text on the city field after user
  interaction.
- Blurring a selected city or changing outfit profile requests missing weather
  when no weather is currently shown.
- Weather request loaders remain visible for at least 2 seconds, and provider
  recommendation loaders remain visible for at least 1 second.
- Manual city text edits clear stale weather when they diverge from the
  selected city.
- Selection changes hide stale weather immediately.
- The weather section is hidden while loading or when no valid weather exists.
- Errors are stored separately from successful weather data.
- Country, city, and outfit profile selections persist separately from the last
  successful weather cache.

## External APIs

- Weather data uses OpenWeather current weather with metric units.
- Country and city options use static in-repo supported country and curated
  city data.
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

## Location And Country Defaults

- The default country starts from locale/default-country service behavior.
- Unsupported default or stored countries normalize to `DEFAULT_COUNTRY_ISO`.
- Changing country retains the current city until the new city list determines
  whether it remains valid.
- A valid retained city requests weather for the new country.
- An invalid retained city is cleared without a weather request.
