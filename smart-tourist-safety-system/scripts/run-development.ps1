# PowerShell Development Environment Script

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

function Start-ServiceInNewTerminal($command, $workingDir, $serviceName) {
    try {
        Write-InfoMessage "Starting $serviceName in a new terminal..."
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$workingDir'; $command"
        Write-SuccessMessage "$serviceName terminal launched successfully"
        return $true
    } catch {
        Write-ErrorMessage "Failed to start $serviceName: $($_.Exception.Message)"
        return $false
    }
}

try {
    Write-InfoMessage "🚀 Starting Smart Tourist Safety System - Development Mode"

    # Start databases
    Write-InfoMessage "📊 Starting databases..."
    docker-compose -f docker-compose.dev.yml up -d postgres redis

    # Wait for databases
    Write-InfoMessage "⏳ Waiting for databases to be ready..."
    Start-Sleep -Seconds 10

    # Get the project root directory
    $projectRoot = (Get-Location).Path

    # Start backend
    Write-InfoMessage "🖥️ Starting backend service..."
    $backendDir = "$projectRoot\backend"
    $backendCommand = ""
    if (-not (Test-Path "$backendDir\venv")) {
        $backendCommand += "python -m venv venv; "
    }
    $backendCommand += ".\venv\Scripts\Activate.ps1; "
    $backendCommand += "pip install -r requirements.txt; "
    $backendCommand += "$env:FLASK_ENV='development'; "
    $backendCommand += "$env:DATABASE_URL='postgresql://admin:devpassword123@localhost:5432/tourist_safety_dev'; "
    $backendCommand += "$env:REDIS_URL='redis://:devpassword123@localhost:6379/0'; "
    $backendCommand += "flask run"
    
    Start-ServiceInNewTerminal $backendCommand $backendDir "Backend Service"

    # Start AI service
    Write-InfoMessage "🤖 Starting AI service..."
    $aiDir = "$projectRoot\ai-service"
    $aiCommand = ""
    if (-not (Test-Path "$aiDir\venv")) {
        $aiCommand += "python -m venv venv; "
    }
    $aiCommand += ".\venv\Scripts\Activate.ps1; "
    $aiCommand += "pip install -r requirements.txt; "
    $aiCommand += "python app.py"
    
    Start-ServiceInNewTerminal $aiCommand $aiDir "AI Service"

    # Start dashboard
    Write-InfoMessage "📱 Starting dashboard..."
    $dashboardDir = "$projectRoot\dashboard"
    $dashboardCommand = "npm install; npm start"
    
    Start-ServiceInNewTerminal $dashboardCommand $dashboardDir "Dashboard"

    Write-SuccessMessage "✅ All services started!"
    Write-InfoMessage "📊 Dashboard: http://localhost:3000"
    Write-InfoMessage "🔌 Backend API: http://localhost:5000/api"
    Write-InfoMessage "🤖 AI Service: http://localhost:5001"
    Write-InfoMessage ""
    Write-InfoMessage "📱 To start mobile app:"
    Write-InfoMessage "   cd mobile && npm install && npx react-native run-android"

} catch {
    Write-ErrorMessage "An error occurred during startup:"
    Write-ErrorMessage $_.Exception.Message
    exit 1
}