. (Join-Path $PSScriptRoot "hook-common.ps1")

$inputData = Read-HookInput
$prompt = [string] $inputData.prompt

if ([string]::IsNullOrWhiteSpace($prompt)) {
  exit 0
}

$secretPatterns = @(
  '(?i)\bsk-[a-z0-9_-]{20,}\b',
  '(?i)\b(?:ghp|github_pat)_[a-z0-9_]{20,}\b',
  '\bAKIA[0-9A-Z]{16}\b',
  '(?i)\bVITE_OPENWEATHER_API_KEY\s*=\s*["'']?(?!your_|example|replace|test-key)[^\s"'']{12,}'
)

foreach ($pattern in $secretPatterns) {
  if ($prompt -match $pattern) {
    Write-HookJson @{
      decision = "block"
      reason   = "The prompt appears to contain a secret or API key. Remove or redact it before continuing."
    }
    exit 0
  }
}
