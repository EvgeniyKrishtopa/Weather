---
name: weather-code-review
description: Review Weather app local diffs, pull requests, deployment changes, Worker/API changes, UI changes, request-state changes, and tests. Use when Codex is asked for "review", "code review", "проверь изменения", "проверь PR/diff", regression analysis, or pre-merge risk assessment in this React/MobX/Vite Weather repository.
---

# Weather Code Review

Read `AGENTS.md`, relevant changed files and tests, and
`references/review-checklist.md` before reporting findings.

## Workflow

1. Inspect `git status --short --branch`, `git diff --stat`, and the relevant
   diff or PR context. Do not modify files during review unless the user asks
   for fixes.
2. Identify the affected ownership boundary:
   - components and adjacent styles
   - `WeatherStore` request and selection state
   - API, service, storage, helper, or runtime type contracts
   - Cloudflare Worker, Vite env, GitHub Pages, or CI/deploy config
3. Trace user-visible behavior through loading, success, empty, fallback, and
   error states. For request changes, trace cancellation and stale responses.
4. Prioritize findings over summaries. Order findings by severity and include
   precise file/line references.
5. Call out missing or weak tests only when they hide a concrete regression
   risk.

## Review Output

- Start with findings. Use `No findings.` only when no actionable issue is
  found.
- For each finding, explain the bug, the impacted scenario, and why the changed
  code causes it.
- After findings, add open questions or assumptions if needed.
- Keep the summary brief and secondary.
- Mention tests reviewed or residual test gaps. Do not claim tests were run
  unless they actually were.

## Severity Guide

- **Critical**: secret exposure, broken production deploy, data loss, or app
  unusable on common paths.
- **High**: request-order bugs, stale weather display, uncaught runtime crashes,
  invalid persisted data, or API/Worker contract mismatch.
- **Medium**: accessibility regressions, missing error/fallback states,
  meaningful test gaps, or deployment configuration drift.
- **Low**: maintainability risks, confusing naming, or minor UX regressions.
