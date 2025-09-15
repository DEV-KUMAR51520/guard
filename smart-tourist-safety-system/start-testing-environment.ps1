# Master Script to Start Testing Environment

# Error handling
$ErrorActionPreference = "Stop"

# Function to display colored output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    } else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-InfoMessage($message) {
    Write-ColorOutput Blue "[INFO] $message"
}

function Write-SuccessMessage($message) {
    Write-ColorOutput Green "[SUCCESS] $message"
}

function Write-ErrorMessage($message) {
    Write-ColorOutput Red "[ERROR] $message"
}

function Write-WarningMessage($message) {
    Write-ColorOutput Yellow "[WARNING] $message"
}

# Create a log directory if it doesn't exist
$logDir = "logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
    Write-InfoMessage "Created logs directory"
}

$logFile = "$logDir\startup_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
Start-Transcript -Path $logFile -Append

try {
    Write-InfoMessage "Starting Smart Tourist Safety System Testing Environment"
    Write-InfoMessage "Log file: $logFile"
    
    # Navigate to scripts directory
    $scriptsDir = "scripts"
    if (-not (Test-Path $scriptsDir)) {
        throw "Scripts directory not found at $scriptsDir"
    }
    
    # Start all services
    Write-InfoMessage "Starting all services..."
    Start-Process powershell -ArgumentList "-NoExit", "-File", "$scriptsDir\start-all-services.ps1"
    
    # Wait for services to initialize
    Write-InfoMessage "Waiting for services to initialize (30 seconds)..."
    Start-Sleep -Seconds 30
    
    # Start monitoring in a new window
    Write-InfoMessage "Starting service monitoring..."
    Start-Process powershell -ArgumentList "-NoExit", "-File", "$scriptsDir\monitor-services.ps1"
    
    # Open the test interface in the default browser
    Write-InfoMessage "Opening test interface in default browser..."
    Start-Process "http://localhost:3001/test-auth.html"
    
    Write-SuccessMessage "Testing environment is now ready!"
    Write-InfoMessage "You can access the following resources:"
    Write-InfoMessage "- Test Interface: http://localhost:3001/test-auth.html"
    Write-InfoMessage "- API Gateway: http://localhost:3000"
    Write-InfoMessage "- PostgreSQL Database: localhost:5432 (tourist_safety_dev)"
    
    Write-InfoMessage "Monitor the terminal windows for any errors or warnings."
    Write-InfoMessage "Press Ctrl+C in the respective terminal windows to stop services."
    
} catch {
    Write-ErrorMessage "An error occurred during startup:"
    Write-ErrorMessage $_.Exception.Message
} finally {
    Stop-Transcript
}