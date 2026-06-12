# Project Instructions for AI Agents

## Stack

- React 19 web application
- TypeScript with strict compiler settings
- Vite for development and production builds
- Material UI and Emotion for components, theming, and styles
- React Context with `useReducer` for shared weather state
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
- Keep shared weather state, actions, and the context hook in `src/context`.
- Keep runtime data types and type guards in `src/types`.
- Keep browser persistence logic in `src/utils`.
- Keep reusable UI in `src/components`, with component-specific styled
  elements in adjacent `*.styles.ts` files.
- Prefer the existing `useWeatherContext`, API functions, reducer, type guards,
  storage helpers, theme tokens, and test fixtures before adding new patterns.
- Do not introduce a new library without explaining why.
- Avoid unnecessary abstractions.

## Code changes

- Make small and reviewable changes.
- Do not modify unrelated files.
- Do not change public APIs unless explicitly requested.
- Preserve existing naming conventions.
- Use functional React components and hooks.
- Use explicit TypeScript types and `import type` for type-only imports.
- Treat API and storage data as `unknown` until validated by a type guard.
- Use `AbortController` when an effect owns a cancellable request.
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
- Run focused tests while developing, then run `npm run validate`.
- Run `npm run test:coverage` when changes affect broad behavior or coverage.
- Keep coverage at or above the configured thresholds: 80% statements,
  functions, and lines, and 75% branches.

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
