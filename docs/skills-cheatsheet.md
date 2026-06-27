# Cheat Sheet: Skills and Sub‑agents (brief)

## Purpose

A concise description of how each skill/agent optimizes workflow and context handling in the project.

---

## weather-feature-workflow

- What it does: Defines the structure for adding features (components, store, API, tests).
- How it optimizes: Removes ad‑hoc architectural decisions, speeds feature kickoff, and makes PRs predictable.
- When to use: When adding or refactoring user‑visible features.

## weather-release-checks

- What it does: A collection of pre‑release checks (lint, typecheck, tests, coverage, deploy readiness).
- How it optimizes: Catches issues locally before CI, reduces fix iterations, and speeds releases.
- When to use: Before pushing, opening a PR, or releasing.

## weather-code-review

- What it does: Guides findings-first reviews of local diffs, PRs, UI, API, Worker, request-state, and deploy changes.
- How it optimizes: Focuses review on regressions, stale state, env leaks, deploy risk, and missing tests.
- When to use: When asking for a review, code review, PR audit, or regression check.

## weather-request-state

- What it does: Rules and patterns for managing requests, cancellation, "last‑request‑wins" logic, caching, and state restoration.
- How it optimizes: Prevents races and inconsistent UI states; simplifies testing of request logic.
- When to use: When changing the store, API calls, effects, or optimizing loading behavior.

## project-setup-info-local

- What it does: Detailed steps for setting up the local environment, dependencies, and configs.
- How it optimizes: Speeds onboarding and ensures consistent environments.
- When to use: When creating a new environment, cloning the repo, or updating dependencies.

## get-search-view-results

- What it does: Collects search view results from VS Code for quick review.
- How it optimizes: Saves time on manual file search during audits or change preparation.
- When to use: When analyzing code, preparing large refactors, or assembling a PR.

## agent-customization

- What it does: Files and skills to configure agent behavior (instructions, SKILL.md, frontmatter).
- How it optimizes: Makes agent behavior predictable and easy to edit; reduces unexpected actions.
- When to use: When changing agent policies, response templates, or debugging instructions.

## Sub‑agent: Explore

- What it does: Fast read‑only codebase overview (options: quick/medium/thorough).
- How it optimizes: Provides initial context before edits, showing relevant files and dependencies.
- When to use: Always at the start of work to orient in the codebase.

---

## Recommended sequence

1. Run `Explore` to gather context and file lists.
2. Follow `weather-feature-workflow` when implementing a feature.
3. Apply `weather-request-state` for changes affecting requests/state.
4. Use `weather-code-review` to review important diffs before release.
5. Run `weather-release-checks` before opening a PR.
6. If needed, adjust agent behavior via `agent-customization`.

---

File created automatically — I can add a short README or CI commands next if you want.
