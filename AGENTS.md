# Project Instructions for AI Agents

## Stack

- React 19 web application
- TypeScript with strict compiler settings
- Vite for development and production builds
- Material UI and Emotion for components, theming, and styles
- MobX and `mobx-react-lite` for shared weather and location state
- React Context for providing the application-scoped `WeatherStore`
- Vitest with jsdom
- React Testing Library, jest-dom, and user-event
- ESLint flat configuration
- npm and Node.js 20.19 or newer
- GitHub Pages deployment under the `/Weather/` base path

## Architecture

- Preserve the existing project architecture.
- Keep application composition in `src/App.tsx` and browser setup in
  `src/main.tsx`.
- Keep external HTTP calls in `src/api`.
- Keep shared weather and location state, actions, request ownership, and
  persistence coordination in `src/store/weatherStore.ts`.
- Keep the store context, provider, and `useWeatherContext` hook in
  `src/context`.
- Keep runtime data types and type guards in `src/types`.
- Keep browser persistence logic in `src/utils`.
- Keep reusable UI in `src/components`, with component-specific styled
  elements in adjacent `*.styles.ts` files.
- Prefer the existing `WeatherStore`, `useWeatherContext`, API functions, type
  guards, storage helpers, theme tokens, and test fixtures before adding new
  patterns.
- Keep successful weather data and weather errors separate in the store.
- Preserve the latest-request-wins behavior: selection changes invalidate
  visible weather, cancel the active request, and prevent stale responses from
  updating state.
- Keep selected location persistence separate from the last successful weather
  cache. Validate all restored storage values before use.
- Do not introduce a new library without explaining why.
- Avoid unnecessary abstractions.

## Project skills

- Use `.agents/skills/weather-feature-workflow` for scoped application feature
  work across components, store, API, persistence, and tests.
- Use `.agents/skills/weather-request-state` when changing city/country
  selection, weather request ownership, cancellation, persistence, or stale
  response behavior.
- Use `.agents/skills/weather-release-checks` before commits, pushes, pull
  requests, dependency updates, or deployment-related changes.
- Read each selected skill's `SKILL.md` completely and load only the referenced
  resource files needed for the task.

## Codex hooks

- Project-local Codex hooks are configured in `.codex/hooks.json`.
- Keep hook handlers deterministic, fast, and non-destructive.
- Hooks may block destructive Git commands, `.env` access, generated output
  edits, or prompts containing likely secrets.
- Do not weaken or bypass project hooks unless the user explicitly requests a
  hook-policy change.
- After hooks are added or changed, review and trust them through `/hooks`.
- See `docs/codex-hooks.md` for behavior, testing, and troubleshooting.

## Code changes

- Make small and reviewable changes.
- Do not modify unrelated files.
- Do not change public APIs unless explicitly requested.
- Preserve existing naming conventions.
- Use functional React components and hooks.
- Wrap components that read observable store values with `observer`.
- Use store actions for shared city, country, weather, error, and loading
  changes instead of duplicating them in component state.
- Use explicit TypeScript types and `import type` for type-only imports.
- Treat API and storage data as `unknown` until validated by a type guard.
- Use `AbortController` when an effect owns a cancellable request.
- Pass an `AbortSignal` through API functions when the caller owns a
  cancellable request.
- When changing weather request logic, preserve request IDs and selected
  city/country checks so only the latest valid response is committed.
- Treat selecting the current country or city as a no-op. Changing or clearing
  a selection must invalidate stale weather immediately.
- Keep the form behavior consistent: valid city selections request weather
  automatically, while explicit form submission always refreshes it.
- Use relative imports; the project does not define path aliases.
- Use Material UI components and the shared theme instead of adding standalone
  CSS or hard-coded design values where a theme token fits.
- Follow the existing formatting style: two spaces, double quotes, semicolons,
  and trailing commas where supported.
- Prefer readability over clever solutions.

## Testing

- Update tests when business logic changes.
- Use existing test patterns from the repository.
- Place tests beside the source as `*.test.ts` or `*.test.tsx`.
- Use Vitest APIs from `vitest`; do not add Jest-specific configuration.
- Prefer user-visible queries such as roles, accessible names, and text in
  component tests.
- Use `userEvent.setup()` for user interaction and mock network boundaries with
  `vi`.
- Reuse `src/test/weatherFixture.ts` when weather test data is needed.
- The shared test setup already cleans up renders, local storage, and mocks.
- Cover selection changes, request cancellation, stale response suppression,
  persistence restoration, and error visibility when weather workflow behavior
  changes.
- Use controllable promises in store tests when request ordering or
  cancellation matters.
- Run focused tests while developing, then run `npm run validate`.
- Run `npm run test:coverage` when changes affect broad behavior or coverage.
- Keep coverage at or above 90% for statements, branches, functions, and lines.

## Commands

- `npm run dev` - start the Vite development server.
- `npm run build` - create the production build.
- `npm run format` - format supported files with Prettier.
- `npm run format:check` - verify formatting without changing files.
- `npm run lint` - run ESLint.
- `npm run typecheck` - run TypeScript without emitting files.
- `npm test` - run the Vitest suite once.
- `npm run validate` - run lint, type checking, and tests.
- `npm run dependencies:deprecated` - check for deprecated dependencies.

## Safety

- Do not edit `.env` files or expose `VITE_OPENWEATHER_API_KEY`.
- Only update `.env.example` when explicitly requested and never place a real
  key in it.
- Do not expose secrets or tokens.
- Do not run destructive Git commands.
- Do not push or merge changes without explicit permission.
- Do not modify CI/CD or deployment configuration unless requested.
- Do not commit generated `dist`, `coverage`, or `node_modules` content.
