# PowerShell script to consolidate microservices directories

$projectRoot = "C:\Users\Dev Kumar\OneDrive\Desktop\savior\smart-tourist-safety-system"

# Function to merge directories
function Merge-Directories {
    param (
        [string]$sourceDir,
        [string]$targetDir
    )

    Write-Host "Merging $sourceDir into $targetDir"

    # Create target directory if it doesn't exist
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        Write-Host "Created directory: $targetDir"
    }

    # Get all items from source directory
    $items = Get-ChildItem -Path $sourceDir -Recurse

    foreach ($item in $items) {
        $relativePath = $item.FullName.Substring($sourceDir.Length + 1)
        $targetPath = Join-Path -Path $targetDir -ChildPath $relativePath

        if ($item.PSIsContainer) {
            # Create directory if it doesn't exist
            if (-not (Test-Path $targetPath)) {
                New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
                Write-Host "Created directory: $targetPath"
            }
        } else {
            # Check if file exists in target
            if (Test-Path $targetPath) {
                # Compare file content
                $sourceContent = Get-Content -Path $item.FullName -Raw
                $targetContent = Get-Content -Path $targetPath -Raw

                if ($sourceContent -ne $targetContent) {
                    Write-Host "WARNING: File content differs: $targetPath"
                    Write-Host "Keeping newer version..."
                    
                    $sourceLastWrite = (Get-Item $item.FullName).LastWriteTime
                    $targetLastWrite = (Get-Item $targetPath).LastWriteTime
                    
                    if ($sourceLastWrite -gt $targetLastWrite) {
                        Copy-Item -Path $item.FullName -Destination $targetPath -Force
                        Write-Host "Updated with source version: $targetPath"
                    } else {
                        Write-Host "Kept target version: $targetPath"
                    }
                }
            } else {
                # Copy file to target
                $targetDir = Split-Path -Path $targetPath -Parent
                if (-not (Test-Path $targetDir)) {
                    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                }
                Copy-Item -Path $item.FullName -Destination $targetPath -Force
                Write-Host "Copied: $targetPath"
            }
        }
    }
}

# Consolidate AI Service
$aiSourceDir = "$projectRoot\ai-service"
$aiTargetDir = "$projectRoot\microservices\ai-service"
Merge-Directories -sourceDir $aiSourceDir -targetDir $aiTargetDir

# Consolidate Blockchain
$blockchainSourceDir = "$projectRoot\blockchain"
$blockchainTargetDir = "$projectRoot\microservices\blockchain"
Merge-Directories -sourceDir $blockchainSourceDir -targetDir $blockchainTargetDir

Write-Host "Consolidation complete. Please verify the merged directories before removing the original ones."
Write-Host "To remove original directories after verification, run:"
Write-Host "Remove-Item -Path '$aiSourceDir' -Recurse -Force"
Write-Host "Remove-Item -Path '$blockchainSourceDir' -Recurse -Force"