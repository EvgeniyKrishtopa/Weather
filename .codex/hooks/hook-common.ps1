Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Read-HookInput {
  $rawInput = [Console]::In.ReadToEnd()

  if ([string]::IsNullOrWhiteSpace($rawInput)) {
    return [pscustomobject]@{}
  }

  return $rawInput | ConvertFrom-Json
}

function Write-HookJson {
  param([Parameter(Mandatory)] [hashtable] $Value)

  $Value | ConvertTo-Json -Depth 10 -Compress
}

function Write-PreToolDenial {
  param([Parameter(Mandatory)] [string] $Reason)

  Write-HookJson @{
    hookSpecificOutput = @{
      hookEventName            = "PreToolUse"
      permissionDecision       = "deny"
      permissionDecisionReason = $Reason
    }
  }
}

function Get-RepositoryRoot {
  param([string] $WorkingDirectory)

  $originalLocation = Get-Location

  try {
    if ($WorkingDirectory -and (Test-Path -LiteralPath $WorkingDirectory)) {
      Set-Location -LiteralPath $WorkingDirectory
    }

    $root = (& git rev-parse --show-toplevel 2>$null)

    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($root)) {
      return $null
    }

    return $root.Trim()
  } finally {
    Set-Location $originalLocation
  }
}

function Get-PatchFilePaths {
  param([string] $Command)

  if ([string]::IsNullOrWhiteSpace($Command)) {
    return @()
  }

  $paths = foreach ($line in ($Command.Replace("\", "/") -split "\r?\n")) {
    if ($line -match '^\*\*\* (?:Add|Update|Delete) File:\s+(.+)$') {
      $Matches[1].Trim().Trim('"', "'")
    }
  }

  return @($paths | Sort-Object -Unique)
}

function Get-NpmCommand {
  $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue

  if ($npmCommand) {
    return $npmCommand.Source
  }

  $npmCommand = Get-Command npm -ErrorAction SilentlyContinue

  if ($npmCommand) {
    return $npmCommand.Source
  }

  throw "npm was not found on PATH."
}

function Get-WorkingTreeFingerprint {
  $status = (& git status --porcelain=v1 -uall 2>$null) -join "`n"
  $diff = (& git diff --binary HEAD 2>$null) -join "`n"
  $payload = "$status`n$diff"
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
  $hash = [System.Security.Cryptography.SHA256]::Create()

  try {
    return ([BitConverter]::ToString($hash.ComputeHash($bytes))).Replace("-", "")
  } finally {
    $hash.Dispose()
  }
}

function Get-HookStatePath {
  param([Parameter(Mandatory)] [string] $RepositoryRoot)

  $rootBytes = [System.Text.Encoding]::UTF8.GetBytes($RepositoryRoot.ToLowerInvariant())
  $rootHashProvider = [System.Security.Cryptography.SHA256]::Create()

  try {
    $rootHash = ([BitConverter]::ToString($rootHashProvider.ComputeHash($rootBytes))).Replace("-", "").Substring(0, 16)
  } finally {
    $rootHashProvider.Dispose()
  }

  $stateDirectory = Join-Path ([System.IO.Path]::GetTempPath()) "codex-weather-hooks\$rootHash"
  New-Item -ItemType Directory -Path $stateDirectory -Force | Out-Null

  return Join-Path $stateDirectory "validation.json"
}

function New-ValidationState {
  param([Parameter(Mandatory)] [string] $Fingerprint)

  return [ordered]@{
    fingerprint = $Fingerprint
    typecheck   = "pending"
    test        = "pending"
    build       = "pending"
    checkedAt   = (Get-Date).ToString("o")
  }
}
