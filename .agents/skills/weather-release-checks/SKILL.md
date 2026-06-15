---
name: weather-release-checks
description: Validate and prepare Weather repository changes before commit, push, pull request, or release. Use for pre-commit checks, branch publishing, CI parity, dependency checks, coverage review, GitHub Pages readiness, or diagnosing why local validation differs from GitHub Actions.
---

# Weather Release Checks

Read `references/check-matrix.md` and choose checks based on the change scope.

## Workflow

1. Inspect `git status --short --branch`, `git diff --stat`, and the full
   relevant diff. Do not stage unrelated changes.
2. Run focused tests during development.
3. Before publishing, run:

   ```text
   npm run format:check
   npm run validate
   ```

4. For broad behavior or shared state changes, run:

   ```text
   npm run test:coverage
   ```

5. For dependency changes, also run:

   ```text
   npm run dependencies:deprecated
   npm audit --audit-level=high
   ```

6. For build, public asset, manifest, routing, or deployment changes, run:

   ```text
   npm run build
   ```

7. Confirm generated `dist`, `coverage`, and `node_modules` content is not
   staged.
8. Commit only after checks pass. Push only with explicit user permission.

## CI Parity

- Pull requests run formatting, validation, 90% unit test coverage enforcement,
  deprecated dependency checks, high-severity audit, and CodeQL.
- GitHub Pages builds on `master` with Node 24 and requires the
  `VITE_OPENWEATHER_API_KEY` repository secret.
- Deployment uses the Vite `/Weather/` base and uploads `dist`.

## Reporting

State the branch, commit when applicable, checks run, failures or skipped
checks, and whether the working tree is clean.
