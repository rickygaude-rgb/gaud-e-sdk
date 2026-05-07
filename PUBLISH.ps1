####################################################################
# GAUD-E SDK — npm Publish Script (ELv2 v2.0.1)
# Run from PowerShell in the gaud-e-sdk directory
#
# PREREQUISITES:
#   npm login   (run once, uses npmjs.com credentials)
####################################################################

$ErrorActionPreference = "Stop"

Write-Host "=== GAUD-E SDK npm Publish ===" -ForegroundColor Cyan

# Verify version
$pkg = Get-Content package.json | ConvertFrom-Json
Write-Host "`nPackage: $($pkg.name) v$($pkg.version)" -ForegroundColor White
Write-Host "License: $($pkg.license)" -ForegroundColor White

if ($pkg.version -ne "2.0.1") {
    Write-Host "WARNING: Expected version 2.0.1, got $($pkg.version)" -ForegroundColor Yellow
}

# Dry run first
Write-Host "`n[1/2] Dry run (checking what would be published)..." -ForegroundColor Yellow
npm publish --dry-run --access public

# Ask for confirmation
Write-Host ""
$confirm = Read-Host "Publish v$($pkg.version) to npm? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Aborted." -ForegroundColor Yellow
    exit 0
}

# Publish
Write-Host "`n[2/2] Publishing to npm..." -ForegroundColor Yellow
npm publish --access public
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Published! View at: https://www.npmjs.com/package/@gaude/sdk" -ForegroundColor Green
} else {
    Write-Host "`n✗ Publish failed. Run 'npm login' first if you're not authenticated." -ForegroundColor Red
    exit 1
}
