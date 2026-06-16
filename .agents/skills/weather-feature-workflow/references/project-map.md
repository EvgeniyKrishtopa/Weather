# Project Map

| Area                        | Responsibility                                               |
| --------------------------- | ------------------------------------------------------------ |
| `src/App.tsx`               | Application composition                                      |
| `src/main.tsx`              | Browser bootstrap and theme provider                         |
| `src/components`            | Reusable UI and adjacent `*.styles.ts` files                 |
| `src/store/weatherStore.ts` | Shared selection, request, weather, error, and loading state |
| `src/context`               | Store provider and `useWeatherContext`                       |
| `src/api`                   | Location and weather HTTP boundaries                         |
| `src/types`                 | Runtime data contracts and type guards                       |
| `src/utils`                 | Local storage validation and persistence                     |
| `src/test`                  | Shared setup and weather fixture                             |

## UI Behavior

- Selecting a valid city requests weather automatically.
- Explicit form submission always refreshes weather.
- Selection changes hide stale weather immediately.
- The weather section is hidden while loading or when no valid weather exists.
- Errors are stored separately from successful weather data.
- Country and city selections persist independently from successful weather.

## Existing Test Patterns

- `src/App.test.tsx`: user workflows across form, store, API, and output.
- `src/store/weatherStore.test.ts`: state transitions, cancellation, and request
  ordering with controllable promises.
- `src/api/*.test.ts`: network boundary validation.
- `src/utils/*.test.ts`: storage parsing and failure tolerance.
- Component tests: accessible roles, names, visible text, and fallback display.
