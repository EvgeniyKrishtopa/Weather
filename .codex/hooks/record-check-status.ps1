. (Join-Path $PSScriptRoot "hook-common.ps1")

$inputData = Read-HookInput
$root = Get-RepositoryRoot $inputData.cwd

if (-not $root) {
  exit 0
}

$command = [string] $inputData.tool_input.command
$normalizedCommand = $command.Replace("\", "/")
$checks = [System.Collections.Generic.List[string]]::new()

if ($normalizedCommand -match '(?i)npm(?:\.cmd)?[''"]?\s+run\s+typecheck\b') {
  $checks.Add("typecheck")
}

if ($normalizedCommand -match '(?i)npm(?:\.cmd)?[''"]?\s+test\b') {
  $checks.Add("test")
}

if ($normalizedCommand -match '(?i)npm(?:\.cmd)?[''"]?\s+run\s+build\b') {
  $checks.Add("build")
}

if ($normalizedCommand -match '(?i)npm(?:\.cmd)?[''"]?\s+run\s+validate\b') {
  $checks.Add("typecheck")
  $checks.Add("test")
}

if ($checks.Count -eq 0) {
  exit 0
}

$responseText = $inputData.tool_response | ConvertTo-Json -Depth 20 -Compress
$exitCode = $null

foreach ($pattern in @(
  '"exit_code"\s*:\s*(-?\d+)',
  '"exitCode"\s*:\s*(-?\d+)',
  '(?i)exit code:\s*(-?\d+)'
)) {
  if ($responseText -match $pattern) {
    $exitCode = [int] $Matches[1]
    break
  }
}

if ($null -eq $exitCode) {
  exit 0
}

$originalLocation = Get-Location

try {
  Set-Location -LiteralPath $root
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

  if (-not $state -or $state.fingerprint -ne $fingerprint) {
    $state = [pscustomobject] (New-ValidationState $fingerprint)
  }

  $status = if ($exitCode -eq 0) { "passed" } else { "failed" }

  foreach ($check in ($checks | Sort-Object -Unique)) {
    $state.$check = $status
  }

  $state.checkedAt = (Get-Date).ToString("o")
  $state | ConvertTo-Json | Set-Content -LiteralPath $statePath
} finally {
  Set-Location $originalLocation
}
