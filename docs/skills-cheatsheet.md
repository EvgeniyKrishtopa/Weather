# Skills Cheat Sheet

Use this as the maintainer-facing map for the project-local skills under
`.agents/skills`. Keep task procedures in skills and shared standards in
`docs/ai`.

## Current Skills

| Skill                        | Use When                                                                                                                   | Loads Next                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `weather-architecture-check` | Reviewing serious multi-layer feature implementation plans before coding                                                   | `docs/ai/architecture.md`, `references/architecture-checklist.md`, relevant `docs/ai/*` |
| `weather-feature-workflow`   | Implementing or refactoring app features across components, store, API, persistence, accessibility, and tests              | `references/project-map.md`, relevant `docs/ai/*`                                       |
| `weather-request-state`      | Changing selection, loading, cancellation, stale-response handling, request ownership, persistence, or weather visibility  | `docs/ai/state-management.md`, `references/state-invariants.md`                         |
| `weather-code-review`        | Reviewing local diffs, PRs, UI/API/request-state changes, tests, Worker/deployment risk, or regressions                    | `docs/ai/code-review.md`, `references/review-checklist.md`                              |
| `weather-release-checks`     | Preparing commits, pushes, PRs, releases, dependency changes, CI parity checks, coverage, build, or GitHub Pages readiness | `docs/ai/testing.md`, `references/check-matrix.md`                                      |

## Routing Order

1. Start from `AGENTS.md` for global project rules.
2. Select the narrowest matching skill.
3. Read that skill's `SKILL.md` completely.
4. Load only the `docs/ai/*` files and skill references named by the selected
   skill and relevant to the task.
5. Use `docs/codex-context.md` when changing this context model.

## Maintenance

- Add a row here whenever a project-local skill is added.
- Remove rows for deleted or unavailable skills.
- Keep stale helper names, sub-agent notes, and one-off workflow ideas out of
  this file unless they exist in the repository.
