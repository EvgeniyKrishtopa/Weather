# Weather Project Agent Router

## Always Load

- Use this file as the root router for Codex context.
- Load the narrowest matching project skill before task work.
- Load only the `docs/ai/*` files named by the selected skill or directly
  relevant to the user request.
- Keep durable standards in `docs/ai`, task procedures in `.agents/skills`,
  hook details in `docs/codex-hooks.md`, and this file short.

## Project Snapshot

- React 19, TypeScript strict, Vite, Material UI, Emotion, MobX, Vitest, npm,
  Node.js 22 or newer.
- Weather outfit advisor with country/city selection, OpenWeather data,
  timezone-based default country selection, local persistence, static supported
  country/city options, and optional Cloudflare Workers AI outfit
  recommendations.
- GitHub Pages deploys under the `/Weather/` base path.

## Context Routing

| Task                                                                                                         | Load                                                                        |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Project orientation or repo map                                                                              | `docs/ai/project-overview.md`, `docs/ai/architecture.md`                    |
| App feature, UI, API, persistence, accessibility, or tests                                                   | `.agents/skills/weather-feature-workflow/SKILL.md`                          |
| City/country selection, outfit profile, weather request ownership, cancellation, stale responses, or storage | `.agents/skills/weather-request-state/SKILL.md`                             |
| Weather API, static location options, storage semantics, or domain behavior                                  | `docs/ai/weather-domain.md`                                                 |
| Outfit recommendation API, Worker, Workers AI, fallbacks, or Worker deploy                                   | `docs/ai/ai-layer.md`                                                       |
| React, Material UI, styling, component structure, or browser UX                                              | `docs/ai/frontend-standards.md`                                             |
| Store, MobX, context, request ownership, or persistence coordination                                         | `docs/ai/state-management.md`                                               |
| Locale, country detection, or future localization work                                                       | `docs/ai/i18n.md`                                                           |
| Tests, validation, coverage, or manual npm commands                                                          | `docs/ai/testing.md`                                                        |
| Review, regression check, PR audit, or findings-first output                                                 | `.agents/skills/weather-code-review/SKILL.md`                               |
| Commit, push, PR, release, dependency, CI, or deploy readiness                                               | `.agents/skills/weather-release-checks/SKILL.md`                            |
| Agent context, hooks, skills, or docs routing changes                                                        | `docs/codex-context.md`, `docs/skills-cheatsheet.md`, `docs/codex-hooks.md` |

## Critical Safety

- Never read, edit, log, or expose secret-bearing `.env` files such as
  `.env.local`, `.env.production`, or developer-specific env files.
- `.env.example` is a tracked placeholder template and may be staged when a
  config-template change is intentional.
- Never expose `VITE_OPENWEATHER_API_KEY`, Cloudflare credentials, Workers AI
  account details, tokens, or secrets.
- Treat browser-visible `VITE_*` values as public client configuration.
- Do not run destructive Git commands.
- Do not push, merge, deploy, or publish without explicit permission.
- Do not commit generated `dist`, `coverage`, `.wrangler`, or `node_modules`
  content.
- Do not modify CI/CD, deployment, or hook policy unless the user asks for it.
