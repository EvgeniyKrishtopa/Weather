. (Join-Path $PSScriptRoot "hook-common.ps1")

$inputData = Read-HookInput
$root = Get-RepositoryRoot $inputData.cwd

if (-not $root) {
  Write-HookJson @{ continue = $true }
  exit 0
}

$originalLocation = Get-Location

try {
  Set-Location -LiteralPath $root
  $changedFiles = @(& git status --short)

  if ($changedFiles.Count -eq 0) {
    Write-HookJson @{ continue = $true }
    exit 0
  }

  $fingerprint = Get-WorkingTreeFingerprint
  $statePath = Get-HookStatePath $root
  $state = $null

  if (Test-Path -LiteralPath $statePath) {
    try {
      $state = Get-Content -Raw -LiteralPath $statePath | ConvertFrom-Json
    } catch {
      $state = $null
    }
  }

  $missingChecks = [System.Collections.Generic.List[string]]::new()

  foreach ($check in @("typecheck", "test", "build")) {
    if (
      -not $state -or
      $state.fingerprint -ne $fingerprint -or
      $state.$check -ne "passed"
    ) {
      $missingChecks.Add($check)
    }
  }

  if ($missingChecks.Count -gt 0) {
    $commands = $missingChecks | ForEach-Object {
      switch ($_) {
        "typecheck" { "npm run typecheck" }
        "test" { "npm test" }
        "build" { "npm run build" }
      }
    }

    Write-HookJson @{
      decision = "block"
      reason   = "Required completion checks are missing or stale for the current diff. Run: $($commands -join ', ')."
    }
    exit 0
  }

  $diffSummary = @(& git diff --stat HEAD)
  $untrackedFiles = @(& git ls-files --others --exclude-standard)

  if ($untrackedFiles.Count -gt 0) {
    $diffSummary += "Untracked files:"
    $diffSummary += $untrackedFiles | ForEach-Object { "  $_" }
  }

  $assistantMessage = [string] $inputData.last_assistant_message
  $hasDiffSummary = $assistantMessage -match '(?i)(diff summary|change summary|summary of changes|changes:)'

  if (-not $hasDiffSummary) {
    Write-HookJson @{
      decision = "block"
      reason   = "Before finishing, include a `Diff summary`, `Change summary`, or `Changes:` section. Current diff:`n$($diffSummary -join "`n")"
    }
    exit 0
  }

  Write-HookJson @{
    continue      = $true
    systemMessage = "Completion checks passed: typecheck, test, and build. Diff summary was included."
  }
} catch {
  Write-HookJson @{
    decision = "block"
    reason   = "Unable to verify completion checks: $($_.Exception.Message)"
  }
} finally {
  Set-Location $originalLocation
}
