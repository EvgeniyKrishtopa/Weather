# Architecture

## Ownership Boundaries

- Keep application composition in `src/App.tsx`.
- Keep browser setup in `src/main.tsx`, including the MUI theme provider,
  `CssBaseline`, theme-color setup, and development-only terminal console
  bridge.
- Keep Vite setup in `vite.config.ts`, including the `/Weather/` base path,
  React plugin, Cloudflare plugin, Vitest config, and console bridge middleware.
- Keep HTTP calls in `src/api/<apiName>/index.ts`, with tests beside each API.
- Keep shared state transitions in `src/store/weatherStore.ts`.
- Keep the store context, provider, and `useWeatherContext` in `src/context`.
- Keep concrete service wrappers in `src/services`.
- Keep browser persistence and browser-specific helpers in `src/utils`.
- Keep runtime contracts and type guards in `src/types`.
- Keep constants in `src/constants.ts` and shared URLs in `src/urls.ts`.
- Keep reusable UI under `src/components` with adjacent `*.styles.ts` files.

## API And Service Boundaries

- `src/api/weatherApi`: OpenWeather current weather boundary.
- `src/api/locationApi`: static supported country and curated city options.
- `src/api/outfitRecommendationApi`: browser-to-Worker recommendation boundary.
- `src/services/defaultCountryService`: default country detection wrapper.
- `src/services/weatherPersistenceService`: storage wrapper.
- `src/services/weatherRequestService`: weather request wrapper.

Prefer wrapping or injecting API, storage, and default-detection dependencies
through services instead of importing concrete infrastructure directly into
store logic.

## UI Composition

- `src/components/Form` owns form UI and local validation visibility.
- `src/components/Form/useLocationOptions` owns country/city option derivation and
  retained-city reconciliation.
- `src/components/Info` owns weather display, error display, and clothing
  recommendation UI.
- `src/components/Info/useOutfitRecommendation` owns recommendation request
  state and fallback selection.

## Worker Boundary

Keep the Cloudflare outfit recommendation Worker in
`worker/outfit-recommendation`. Worker-local responsibilities include request
validation, CORS handling, model policy, Workers AI calls, response
normalization, and fallback recommendation behavior.

## Design Principles

- Preserve existing module boundaries before adding new abstractions.
- Prefer existing store actions, API functions, type guards, services, storage
  helpers, theme tokens, and test fixtures.
- Avoid unnecessary abstractions.
- Apply SOLID, DRY, and KISS pragmatically: remove duplication when it hides
  behavior or creates maintenance risk, and keep explicit validation when it is
  clearer than generic machinery.
