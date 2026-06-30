## Weather Outfit Advisor

This project was created with React, the OpenWeather API, and Cloudflare
Workers AI. Select a country and city to get current weather and outfit
recommendations.

Country names, ISO2 codes, and curated city options are bundled with the app so
the location selectors are available without an extra network request.

## Link

https://EvgeniyKrishtopa.github.io/Weather

## Local Development

Requires Node.js 22.0 or newer.

Install dependencies:

```sh
npm install
```

`npm install` also configures the Husky pre-commit hook. Every commit runs
ESLint, the TypeScript compiler check, and the test suite. Run the same checks
manually with:

```sh
npm run validate
```

Pull requests run formatting, ESLint, the TypeScript compiler check, and
coverage-enforced unit tests in GitHub Actions. CI also rejects deprecated
dependencies, audits high and critical dependency vulnerabilities, and runs
CodeQL security analysis for JavaScript and TypeScript.

## GitHub Pages Deployment

In the repository settings, set **Pages → Build and deployment → Source** to
**GitHub Actions**. Add an Actions repository secret named
`VITE_OPENWEATHER_API_KEY`.

Every push to `master` builds the application with that secret and deploys the
`dist` directory to GitHub Pages. The workflow can also be started manually
from the Actions tab.

Create a local environment file and add an OpenWeather API key:

```sh
cp .env.example .env.local
```

`VITE_OUTFIT_RECOMMENDATION_API_URL` is optional. Leave it empty to use local
fallback outfit recommendations, or point it at a local/deployed Cloudflare
Worker to enable Workers AI recommendations.

Start the Vite development server:

```sh
npm run dev
```

Create a production build:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run build
npm run preview
```

Deploy the `dist` directory to GitHub Pages:

```sh
npm run deploy
```

Run or deploy the Cloudflare Worker for outfit recommendations:

```sh
npm run outfit-worker:dev
npm run outfit-worker:deploy
```

When the local Worker is running, set this value in `.env.local` and restart the
Vite development server:

```sh
VITE_OUTFIT_RECOMMENDATION_API_URL=http://localhost:8787/recommend-outfit
```

Run or deploy the app with Wrangler instead of GitHub Pages:

```sh
npm run wrangler:dev
npm run wrangler:deploy
```
