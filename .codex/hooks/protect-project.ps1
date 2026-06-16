. (Join-Path $PSScriptRoot "hook-common.ps1")

$inputData = Read-HookInput
$toolName = [string] $inputData.tool_name
$command = [string] $inputData.tool_input.command

if ([string]::IsNullOrWhiteSpace($command)) {
  exit 0
}

$normalized = $command.Replace("\", "/")

$destructiveGitPatterns = @(
  '(?i)\bgit\s+reset\s+--hard\b',
  '(?i)\bgit\s+clean\s+-(?:[a-z]*f[a-z]*d|[a-z]*d[a-z]*f)\b',
  '(?i)\bgit\s+checkout\s+--\s+',
  '(?i)\bgit\s+push\b[^\r\n]*(?:--force|-f)\b'
)

foreach ($pattern in $destructiveGitPatterns) {
  if ($normalized -match $pattern) {
    Write-PreToolDenial "Destructive Git command blocked by Weather repository policy."
    exit 0
  }
}

if ($normalized -match '(?i)\bgit\s+push\b') {
  $root = Get-RepositoryRoot $inputData.cwd
  $currentBranch = ""

  if ($root) {
    $originalLocation = Get-Location

    try {
      Set-Location -LiteralPath $root
      $currentBranch = (& git branch --show-current 2>$null).Trim()
    } finally {
      Set-Location $originalLocation
    }
  }

  if (
    $currentBranch -in @("main", "master") -or
    $normalized -match '(?i)\bgit\s+push\b[^\r\n]*\b(?:main|master)\b'
  ) {
    Write-PreToolDenial "Direct pushes to the protected main/master branch are blocked. Push a feature branch instead."
    exit 0
  }
}

$productionDependencyInstall = (
  $normalized -match '(?i)\bnpm(?:\.cmd)?\s+(?:install|i|add)\s+\S+' -and
  $normalized -notmatch '(?i)\s(?:-D|--save-dev)(?:\s|$)'
)

if ($productionDependencyInstall) {
  Write-HookJson @{
    systemMessage = "This command appears to install a production dependency. Confirm the dependency is required and explain why before proceeding."
  }
  exit 0
}

$blockedPath = $false

if ($toolName -eq "apply_patch") {
  foreach ($path in (Get-PatchFilePaths $normalized)) {
    $segments = @($path.ToLowerInvariant().Split("/", [System.StringSplitOptions]::RemoveEmptyEntries))
    $fileName = if ($segments.Count -gt 0) { $segments[-1] } else { "" }

    if (
      $fileName -eq ".env" -or
      $fileName.StartsWith(".env.") -or
      $segments -contains "dist" -or
      $segments -contains "coverage" -or
      $segments -contains "node_modules"
    ) {
      $blockedPath = $true
      break
    }
  }
} else {
  $shellPathPatterns = @(
    '(?i)\b(?:Get-Content|type|cat|more|gc)\b[^\r\n]*(?:^|[\s"''])\.env(?:\s|$)',
    '(?i)\b(?:Set-Content|Add-Content|Out-File|Remove-Item|Move-Item|Copy-Item)\b[^\r\n]*(?:^|[\s"''])\.env(?:\s|$)',
    '(?i)(?:>|Set-Content|Add-Content|Out-File|Remove-Item|Move-Item|Copy-Item)[^\r\n]*(?:^|[\s"'']/)(?:dist|coverage|node_modules)(?:/|$)'
  )

  $blockedPath = $shellPathPatterns.Where({ $normalized -match $_ }).Count -gt 0
}

if ($blockedPath) {
  Write-PreToolDenial "Access to .env or generated output is blocked by Weather repository policy."
  exit 0
}

if (
  $toolName -eq "apply_patch" -and
  $normalized -match '(?im)^\*\*\* (?:Add|Update|Delete) File:\s+.*\.github/workflows/'
) {
  Write-HookJson @{
    systemMessage = "Deployment or CI workflow files are being changed. Confirm the user explicitly requested CI/CD changes before proceeding."
  }
}
