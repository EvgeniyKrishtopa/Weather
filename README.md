## Get Current Weather

This project was created with React and the OpenWeather API.
Select a country and city to get the current weather.

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

Create a local environment file and add an OpenWeather API key:

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
