# Codex Context Management

This repository uses a layered context model so Codex gets the right guidance
without loading every project detail for every task.

## Context Layers

| Layer                  | Location                                  | Purpose                                                                                                        |
| ---------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Root router            | `AGENTS.md`                               | Short always-loaded routing, project snapshot, and critical safety                                             |
| Task workflows         | `.agents/skills/*/SKILL.md`               | Triggered procedures for feature work, architecture checks, request-state changes, reviews, and release checks |
| Shared standards       | `docs/ai/*.md`                            | Architecture, domain, frontend, state, testing, AI, i18n, and review standards                                 |
| Skill-local references | `.agents/skills/*/references/*.md`        | Narrow checklists and invariants loaded only when the selected skill asks for them                             |
| Runtime guardrails     | `.codex/hooks.json`, `.codex/hooks/*.ps1` | Session orientation, command/file safety, secret scanning, formatting, and completion gates                    |
| Maintainer docs        | `docs/*.md`                               | Context maintenance, hook behavior, and skill maps                                                             |

## Maintenance Rules

- Put instructions in the narrowest layer that still reaches the right tasks.
- Keep `AGENTS.md` short enough to scan during every session.
- Put repeated task procedures in project skills, not in hook messages.
- Put cross-cutting standards in `docs/ai`.
- Put task-specific checklists, matrices, and invariants in skill references.
- Keep hook messages brief; hooks should orient or guard, not replace skills.
- Update `docs/skills-cheatsheet.md` whenever skills are added, removed, or
  retargeted.
- Update relevant `docs/ai/*` files whenever architecture, domain, testing,
  review, or command guidance changes.
- Update `docs/codex-hooks.md` whenever hook events, blocking behavior, cached
  validation, or trust requirements change.
- Remove stale entries instead of keeping "maybe useful later" context.

## Change Checklist

1. Identify which layer owns the new guidance.
2. Remove duplicated text from broader layers after moving it into a narrower
   layer.
3. Confirm each affected skill frontmatter still names the task triggers that
   should load it.
4. Confirm `agents/openai.yaml` matches each changed skill's purpose.
5. For hook changes, test at least one allowed payload and one blocked payload.
6. For documentation-only changes, run `npm run format:check`.

## Current Skill Routing

| Task                                                                                                                     | Use                          |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| Serious multi-layer feature planning or implementation plan architecture checks                                          | `weather-architecture-check` |
| App features, UI behavior, API integration, persistence, accessibility, or tests                                         | `weather-feature-workflow`   |
| City/country selection, outfit profile, cancellation, stale responses, request ownership, storage, or weather visibility | `weather-request-state`      |
| Local diff, PR, regression, deployment, Worker, API, UI, or test review                                                  | `weather-code-review`        |
| Pre-commit, pre-push, PR readiness, dependency checks, coverage, build, or deploy readiness                              | `weather-release-checks`     |

## Shared Standards Routing

| Topic                                                | File                            |
| ---------------------------------------------------- | ------------------------------- |
| Stack, product shape, repo map, commands             | `docs/ai/project-overview.md`   |
| Module boundaries and ownership                      | `docs/ai/architecture.md`       |
| Weather, static location options, and storage domain | `docs/ai/weather-domain.md`     |
| Outfit recommendations and Cloudflare Workers AI     | `docs/ai/ai-layer.md`           |
| React, MUI, styling, and UX standards                | `docs/ai/frontend-standards.md` |
| MobX store, request ownership, and persistence       | `docs/ai/state-management.md`   |
| Locale/default country and future i18n               | `docs/ai/i18n.md`               |
| Test patterns, coverage, and validation commands     | `docs/ai/testing.md`            |
| Findings-first review checklist                      | `docs/ai/code-review.md`        |
