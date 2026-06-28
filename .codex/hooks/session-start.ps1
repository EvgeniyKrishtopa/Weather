. (Join-Path $PSScriptRoot "hook-common.ps1")

$inputData = Read-HookInput
$root = Get-RepositoryRoot $inputData.cwd

if (-not $root) {
  exit 0
}

$originalLocation = Get-Location

try {
  Set-Location -LiteralPath $root
  $branch = (& git branch --show-current 2>$null).Trim()
  $status = @(& git status --short 2>$null)
  $state = if ($status.Count -eq 0) {
    "The working tree is clean."
  } else {
    "The working tree has $($status.Count) changed path(s); preserve user changes."
  }

  $context = @"
Weather project orientation:
- Read AGENTS.md as the root context router before editing.
- Current branch: $branch.
- $state
- Use weather-feature-workflow for application features.
- Use weather-request-state for selection, cancellation, persistence, or request-order changes.
- Use weather-code-review for review or regression analysis.
- Use weather-release-checks before committing or publishing.
- Load only relevant docs/ai files named by the selected task or skill.
- Never read or edit .env, and never expose VITE_OPENWEATHER_API_KEY.
"@

  Write-HookJson @{
    hookSpecificOutput = @{
      hookEventName    = "SessionStart"
      additionalContext = $context.Trim()
    }
  }
} finally {
  Set-Location $originalLocation
}
