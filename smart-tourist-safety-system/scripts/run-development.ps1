# PowerShell Development Environment Script

# Error handling
$ErrorActionPreference = "Stop"

# Function to display colored output
function Write-ColorOutput($ForegroundColor, [string]$message) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $message
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

function Start-ServiceInNewTerminal($command, $workingDir, $serviceName) {
    try {
        Write-InfoMessage "Starting $serviceName in a new terminal..."
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$workingDir'; $command"
        Write-SuccessMessage "$serviceName terminal launched successfully"
        Start-Sleep -Seconds 2
        return $true
    } catch {
        # CORRECTED: Used $($_.Exception.Message) to correctly access the property within the string
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

    # ---------------- Backend Service ----------------
    Write-InfoMessage "🖥️ Starting backend service..."
    $backendDir = "$projectRoot\backend"
    $backendCommand = @"
if (-not (Test-Path '.\venv')) { python -m venv venv }
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
`$env:FLASK_ENV='development'
`$env:DATABASE_URL='postgresql://admin:devpassword123@localhost:5432/tourist_safety_dev'
`$env:REDIS_URL='redis://:devpassword123@localhost:6379/0'
flask run
"@
    # CORRECTED: Removed extra quotes around variables
    Start-ServiceInNewTerminal $backendCommand $backendDir "Backend Service"

    # ---------------- AI Service ----------------
    Write-InfoMessage "🤖 Starting AI service..."
    $aiDir = "$projectRoot\ai-service"
    $aiCommand = @"
if (-not (Test-Path '.\venv')) { python -m venv venv }
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
"@
    # CORRECTED: Removed extra quotes around variables
    Start-ServiceInNewTerminal $aiCommand $aiDir "AI Service"

    # ---------------- Landing Page ----------------
    Write-InfoMessage "🌐 Starting landing page..."
    $landingDir = "$projectRoot\frontend\landing"
    $landingCommand = @"
npm install
npm run dev
"@
    # CORRECTED: Removed extra quotes around variables
    Start-ServiceInNewTerminal $landingCommand $landingDir "Landing Page"

    # ---------------- Admin Dashboard ----------------
    Write-InfoMessage "📱 Starting admin dashboard..."
    $dashboardDir = "$projectRoot\frontend\dashboard"
    $dashboardCommand = @"
npm install
`$env:PORT='3002'
npm start
"@
    # CORRECTED: Removed extra quotes around variables
    Start-ServiceInNewTerminal $dashboardCommand $dashboardDir "Admin Dashboard"

    # ---------------- User Dashboard ----------------
    Write-InfoMessage "📱 Starting user dashboard..."
    $userDashboardDir = "$projectRoot\frontend\user-dashboard"
    $userDashboardCommand = @"
npm install
`$env:PORT='3001'
npm start
"@
    # CORRECTED: Removed extra quotes around variables
    Start-ServiceInNewTerminal $userDashboardCommand $userDashboardDir "User Dashboard"

    Write-SuccessMessage "✅ All services started!"
    Write-InfoMessage "🌐 Landing Page: http://localhost:3000"
    Write-InfoMessage "👤 User Dashboard: http://localhost:3001"
    Write-InfoMessage "📊 Admin Dashboard: http://localhost:3002"
    Write-InfoMessage "🔌 Backend API: http://localhost:5000/api"
    Write-InfoMessage "🤖 AI Service: http://localhost:5001"
    Write-InfoMessage ""
    Write-InfoMessage "📱 To start mobile app:"
    Write-InfoMessage "   cd mobile && npm install && npx react-native run-android"
    Write-InfoMessage ""
    Write-InfoMessage "🚀 To begin using the system, navigate to: http://localhost:3000"

} catch {
    Write-ErrorMessage "An error occurred during startup:"
    # CORRECTED: Used $($_.Exception.Message) to correctly access the property within the string
    Write-ErrorMessage "$($_.Exception.Message)"
    exit 1
}