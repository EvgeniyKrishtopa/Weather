# Project Overview

## Stack

- React 19 web application with TypeScript strict settings.
- Vite for development, build, preview, Vitest, and dev-server middleware.
- Material UI and Emotion for UI components, theming, and styles.
- MobX and `mobx-react-lite` for shared weather/location state.
- React Context provides the application-scoped `WeatherStore`.
- Vitest with jsdom, React Testing Library, jest-dom, and user-event.
- ESLint flat config, Prettier, npm, and Node.js 22 or newer.
- Cloudflare Vite plugin, Wrangler, and Workers AI support the optional outfit
  recommendation Worker.
- GitHub Pages deployment uses the `/Weather/` base path.

## Product Shape

The app lets a user select a country, city, and outfit profile, fetches current
weather, displays weather details, and shows clothing recommendations. Weather
data comes from OpenWeather. Countries and curated top-city lists are static
in-repo data. The default country is inferred from the browser timezone. Outfit
recommendations are local fallbacks by default and may be enhanced through a
Cloudflare Workers AI endpoint.

## Repository Map

| Area                           | Responsibility                                                                         |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| `src/App.tsx`                  | Application composition                                                                |
| `src/main.tsx`                 | Browser bootstrap, MUI theme provider, theme color, terminal console bridge            |
| `vite.config.ts`               | Vite, React plugin, Cloudflare plugin, Vitest config, console bridge middleware        |
| `src/components/Form`          | Country/city/outfit form UI and retained-city reconciliation                           |
| `src/components/Info`          | Weather rendering, errors, outfit recommendations                                      |
| `src/store/weatherStore.ts`    | Shared selection, weather, error, loading, request ownership, persistence coordination |
| `src/context`                  | Store provider and `useWeatherContext`                                                 |
| `src/api`                      | Weather, static location options, and outfit recommendation boundaries                 |
| `src/services`                 | Injectable wrappers for default country, persistence, and request services             |
| `src/types`                    | Runtime contracts, type guards, enums, and shared interfaces                           |
| `src/utils`                    | Browser storage, locale country, terminal console bridge                               |
| `src/helpers`                  | Reusable pure helpers                                                                  |
| `src/test`                     | Shared setup and weather fixture                                                       |
| `worker/outfit-recommendation` | Cloudflare Workers AI outfit recommendation service                                    |

## Manual Commands

- `npm run dev` or `npm start`: start Vite and open `/Weather/`.
- `npm run stop`: stop the Vite server on port `5173`.
- `npm run build`: create the production build.
- `npm run preview`: preview the production build locally.
- `npm run wrangler:dev`: build and run the app through Wrangler.
- `npm run wrangler:deploy`: build and deploy the app through Wrangler.
- `npm run outfit-worker:dev`: run the outfit Worker locally on port `8787`.
- `npm run outfit-worker:deploy`: deploy the outfit Worker.
- `npm run deploy`: build and publish GitHub Pages through `gh-pages`.
- `npm run format`: format supported files.
- `npm run format:check`: verify formatting.
- `npm run lint`: run ESLint.
- `npm run typecheck`: run TypeScript without emitting files.
- `npm test`: run the Vitest suite once.
- `npm run test:watch`: run Vitest in watch mode.
- `npm run test:coverage`: run coverage with 90% thresholds.
- `npm run validate`: run lint, typecheck, and tests.
- `npm run dependencies:deprecated`: check deprecated dependencies.

## Safety

- Do not introduce a new library without explaining why.
- Use relative imports; the project does not define path aliases.
- Do not stage generated `dist`, `coverage`, `.wrangler`, or `node_modules`.
- Keep `/Weather/` intact for GitHub Pages paths and public assets.
