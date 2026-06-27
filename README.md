## Weather Outfit Advisor

This project was created with React, the OpenWeather API, and Cloudflare
Workers AI. Select a country and city to get current weather and outfit
recommendations.

Country names, ISO2 codes, and city options are loaded from the public
[CountriesNow API](https://countriesnow.space/).

## Link

https://EvgeniyKrishtopa.github.io/Weather

## Local Development

Requires Node.js 20.19 or newer.

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

Pull requests run the same checks in GitHub Actions. CI also requires at least
90% unit test coverage for statements, branches, functions, and lines, rejects
deprecated dependencies, audits high and critical dependency vulnerabilities,
and runs CodeQL security analysis for JavaScript and TypeScript.

## GitHub Pages Deployment

In the repository settings, set **Pages → Build and deployment → Source** to
**GitHub Actions**. Add an Actions repository secret named
`VITE_OPENWEATHER_API_KEY`.

Every push to `master` builds the application with that secret and deploys the
`dist` directory to GitHub Pages. The workflow can also be started manually
from the Actions tab.

Create a local environment file and add an OpenWeather API key. Add
`VITE_OUTFIT_RECOMMENDATION_API_URL` when a local or deployed Cloudflare Worker
should provide LLM outfit recommendations:

```sh
cp .env.example .env.local
```

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
npm run preview
```

Deploy the `dist` directory to GitHub Pages:

```sh
npm run deploy
```
