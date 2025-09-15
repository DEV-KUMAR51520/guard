# Main Script to Start All Services

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

function Start-ServiceInNewTerminal($scriptPath, $serviceName) {
    try {
        Write-InfoMessage "Starting $serviceName in a new terminal..."
        Start-Process powershell -ArgumentList "-NoExit", "-File", $scriptPath
        Write-SuccessMessage "$serviceName terminal launched successfully"
        return $true
    } catch {
        Write-ErrorMessage "Failed to start $serviceName: $($_.Exception.Message)"
        return $false
    }
}

# Create a log directory if it doesn't exist
$logDir = "..\logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
    Write-InfoMessage "Created logs directory"
}

$logFile = "$logDir\startup_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
Start-Transcript -Path $logFile -Append

try {
    # Get the script directory
    $scriptDir = $PSScriptRoot
    Set-Location $scriptDir
    
    Write-InfoMessage "Starting all services for Smart Tourist Safety System..."
    Write-InfoMessage "Log file: $logFile"
    
    # Start PostgreSQL database
    Write-InfoMessage "Step 1/3: Initializing PostgreSQL database..."
    $dbSuccess = Start-ServiceInNewTerminal "$scriptDir\init-database.ps1" "PostgreSQL Database"
    
    if (-not $dbSuccess) {
        throw "Database initialization failed. Cannot continue."
    }
    
    # Wait for database to be ready
    Write-InfoMessage "Waiting for database to be fully initialized..."
    Start-Sleep -Seconds 15
    
    # Start API Gateway
    Write-InfoMessage "Step 2/3: Starting API Gateway..."
    $apiSuccess = Start-ServiceInNewTerminal "$scriptDir\start-api-gateway.ps1" "API Gateway"
    
    if (-not $apiSuccess) {
        throw "API Gateway initialization failed. Cannot continue."
    }
    
    # Wait for API Gateway to be ready
    Write-InfoMessage "Waiting for API Gateway to be fully initialized..."
    Start-Sleep -Seconds 10
    
    # Start User Dashboard
    Write-InfoMessage "Step 3/3: Starting User Dashboard..."
    $dashboardSuccess = Start-ServiceInNewTerminal "$scriptDir\start-user-dashboard.ps1" "User Dashboard"
    
    if (-not $dashboardSuccess) {
        throw "User Dashboard initialization failed."
    }
    
    Write-SuccessMessage "All services started successfully!"
    Write-InfoMessage "Service URLs:"
    Write-InfoMessage "- API Gateway: http://localhost:3000"
    Write-InfoMessage "- User Dashboard: http://localhost:3001"
    Write-InfoMessage "- PostgreSQL: localhost:5432 (Database: tourist_safety_dev, User: admin)"
    
    Write-InfoMessage "You can now test the registration and authentication features."
    Write-InfoMessage "Monitor the terminal windows for any errors or warnings."
    
} catch {
    Write-ErrorMessage "An error occurred during service initialization:"
    Write-ErrorMessage $_.Exception.Message
    Write-ErrorMessage "Please check individual service logs for more details."
} finally {
    Stop-Transcript
}