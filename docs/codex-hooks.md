# Codex Hooks

Project-local Codex hooks are configured in `.codex/hooks.json`. They load only
when Codex trusts this repository and the current hook definitions.

Use `/hooks` in Codex to review, trust, disable, or inspect them after cloning
the repository or changing hook files.

## Installed hooks

### SessionStart

Adds project context at startup, resume, clear, and compaction:

- current branch and working-tree state
- instruction to read `AGENTS.md`
- relevant project-local skills
- `.env` and API-key safety reminder

### PreToolUse

Checks shell and file-edit tool calls before execution.

It blocks:

- `git reset --hard`
- `git clean` with force and directory removal
- `git checkout -- <path>`
- direct pushes to `main` or `master`
- forced pushes
- reading or changing `.env`
- edits to `dist`, `coverage`, or `node_modules`

It warns before installing a production dependency with `npm install`,
`npm i`, or `npm add` without `--save-dev` or `-D`.

It warns when `.github/workflows` files are edited because CI/CD changes require
an explicit request.

This is a guardrail, not a complete security boundary. Codex hooks do not
intercept every possible tool path.

### UserPromptSubmit

Blocks prompts that appear to contain:

- OpenAI keys
- GitHub personal access tokens
- AWS access key IDs
- assigned `VITE_OPENWEATHER_API_KEY` values

The hook does not store or log prompt contents.

### PostToolUse

After file edits it:

- formats edited `.ts` and `.tsx` files with Prettier
- runs `npm audit --audit-level=high` when `package.json` changes
- runs `git diff --check`

Audit or formatting failures are returned to Codex for correction.

### Stop

For a dirty working tree it requires successful:

- `npm run typecheck`
- `npm test`
- `npm run build`

`PostToolUse(Bash)` records the exit status of those commands. A successful
`npm run validate` records both typecheck and test. Results are cached under the
system temporary directory for the current repository path and working-tree
fingerprint. Any file change makes previous statuses stale.

It also requires the final response to contain a `Diff summary`,
`Change summary`, `Summary of changes`, or `Changes:` section. If checks fail or
the summary is missing, Codex receives a continuation prompt instead of
finishing.

It does not commit, push, install dependencies, or deploy.

## Windows execution

The hook configuration uses `commandWindows` with:

```text
powershell.exe -NoProfile -ExecutionPolicy Bypass
```

This bypass applies only to the individual checked-in hook script invocation.
It does not change the machine execution policy.

## Manual testing

Each hook reads one JSON object from standard input. Example:

```powershell
$payload = @{
  cwd = (Get-Location).Path
  hook_event_name = "PreToolUse"
  tool_name = "Bash"
  tool_input = @{ command = "git reset --hard HEAD~1" }
} | ConvertTo-Json -Depth 5 -Compress

$payload | powershell.exe -NoProfile -ExecutionPolicy Bypass `
  -File .codex/hooks/protect-project.ps1
```

The expected result contains `permissionDecision: "deny"`.

## Maintenance

- Keep handlers under `.codex/hooks`.
- Share parsing and output helpers through `hook-common.ps1`.
- Prefer warnings over blocking unless the action is clearly unsafe.
- Avoid full lint or test suites in lifecycle hooks; Husky and CI already run
  validation.
- Re-test safe and blocked payloads after changing a handler.

Official hook behavior and schemas:
<https://developers.openai.com/codex/hooks>
