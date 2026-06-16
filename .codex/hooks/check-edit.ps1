. (Join-Path $PSScriptRoot "hook-common.ps1")

$inputData = Read-HookInput
$root = Get-RepositoryRoot $inputData.cwd

if (-not $root) {
  exit 0
}

$originalLocation = Get-Location

try {
  Set-Location -LiteralPath $root
  $editedPaths = Get-PatchFilePaths ([string] $inputData.tool_input.command)
  $typeScriptPaths = @(
    $editedPaths | Where-Object {
      $_ -match '\.(?:ts|tsx)$' -and (Test-Path -LiteralPath $_)
    }
  )
  $messages = [System.Collections.Generic.List[string]]::new()

  if ($typeScriptPaths.Count -gt 0) {
    $prettierCommand = Join-Path $root "node_modules\.bin\prettier.cmd"

    if (-not (Test-Path -LiteralPath $prettierCommand)) {
      $messages.Add("Prettier was not found. Run npm install before editing TypeScript files.")
    } else {
      $previousErrorActionPreference = $ErrorActionPreference
      $ErrorActionPreference = "Continue"

      try {
        $formatOutput = @(& $prettierCommand --write -- $typeScriptPaths 2>&1)

        if ($LASTEXITCODE -ne 0) {
          $messages.Add("Prettier failed for edited TypeScript files:`n$($formatOutput -join "`n")")
        }
      } finally {
        $ErrorActionPreference = $previousErrorActionPreference
      }
    }
  }

  if ($editedPaths -contains "package.json") {
    try {
      $npmCommand = Get-NpmCommand
      $previousErrorActionPreference = $ErrorActionPreference
      $ErrorActionPreference = "Continue"

      try {
        $auditOutput = @(& $npmCommand audit --audit-level=high 2>&1)

        if ($LASTEXITCODE -ne 0) {
          $messages.Add("npm audit failed after package.json changed:`n$($auditOutput -join "`n")")
        }
      } finally {
        $ErrorActionPreference = $previousErrorActionPreference
      }
    } catch {
      $messages.Add("Unable to run npm audit after package.json changed: $($_.Exception.Message)")
    }
  }

  $diffCheck = @(& git diff --check 2>&1)

  if ($LASTEXITCODE -ne 0) {
    $messages.Add("The latest edit introduced whitespace errors:`n$($diffCheck -join "`n")")
  }

  if ($messages.Count -gt 0) {
    Write-HookJson @{
      decision      = "block"
      reason        = $messages -join "`n`n"
      systemMessage = $messages -join "`n`n"
    }
  }
} finally {
  Set-Location $originalLocation
}
