# Project Map

| Area                           | Responsibility                                                   |
| ------------------------------ | ---------------------------------------------------------------- |
| `src/App.tsx`                  | Application composition                                          |
| `src/main.tsx`                 | Browser bootstrap, theme provider, console bridge                |
| `vite.config.ts`               | Vite, Cloudflare plugin, Vitest, console bridge middleware       |
| `src/components/Form`          | Form UI, option loading, retained-city reconciliation            |
| `src/components/Info`          | Weather display, errors, clothing recommendations                |
| `src/store/weatherStore.ts`    | Shared selection, request, weather, error, loading, persistence  |
| `src/context`                  | Store provider, `useWeatherContext`, detected country refinement |
| `src/api`                      | Weather, geocoding, location, recommendation HTTP boundaries     |
| `src/services`                 | Injectable default-country, persistence, and request wrappers    |
| `src/types`                    | Runtime data contracts and type guards                           |
| `src/utils`                    | Storage, geolocation, locale country, terminal console bridge    |
| `src/test`                     | Shared setup and weather fixture                                 |
| `worker/outfit-recommendation` | Cloudflare Workers AI outfit recommendation service              |
| `docs/ai`                      | Shared agent standards loaded by task-specific skills            |

## UI Behavior

- Selecting a valid city requests weather automatically.
- Explicit form submission always refreshes weather.
- Selection changes hide stale weather immediately.
- The weather section is hidden while loading or when no valid weather exists.
- Errors are stored separately from successful weather data.
- Country, city, and outfit profile selections persist independently from
  successful weather.
- Outfit recommendations stay available through local fallbacks when the
  Worker is not configured or returns invalid data.

## Existing Test Patterns

- `src/App.test.tsx`: user workflows across form, store, API, and output.
- `src/store/weatherStore.test.ts`: state transitions, cancellation, and request
  ordering with controllable promises.
- `src/api/*.test.ts`: network boundary validation.
- `src/utils/*.test.ts`: storage parsing and failure tolerance.
- `src/components/Info/useOutfitRecommendation/*.test.tsx`: recommendation
  request and fallback behavior.
- Component tests: accessible roles, names, visible text, and fallback display.
