# PowerShell script to remove redundant directories after consolidation

$projectRoot = "C:\Users\Dev Kumar\OneDrive\Desktop\savior\smart-tourist-safety-system"

# Directories to remove
$aiSourceDir = "$projectRoot\ai-service"
$blockchainSourceDir = "$projectRoot\blockchain"

# Check if directories exist
if (Test-Path $aiSourceDir) {
    Write-Host "Removing $aiSourceDir"
    Remove-Item -Path $aiSourceDir -Recurse -Force
    Write-Host "Removed: $aiSourceDir"
} else {
    Write-Host "Directory not found: $aiSourceDir"
}

if (Test-Path $blockchainSourceDir) {
    Write-Host "Removing $blockchainSourceDir"
    Remove-Item -Path $blockchainSourceDir -Recurse -Force
    Write-Host "Removed: $blockchainSourceDir"
} else {
    Write-Host "Directory not found: $blockchainSourceDir"
}

Write-Host "Redundant directories have been removed."