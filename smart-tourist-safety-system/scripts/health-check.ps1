# PowerShell Health Check Script

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

Write-InfoMessage "🔍 Performing system health check..."

# Check backend
Write-Host -NoNewline "Backend API: "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-SuccessMessage "✅ Running"
    } else {
        Write-ErrorMessage "❌ Not responding (Status: $($response.StatusCode))"
    }
} catch {
    Write-ErrorMessage "❌ Not responding"
}

# Check AI service
Write-Host -NoNewline "AI Service: "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/health" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-SuccessMessage "✅ Running"
    } else {
        Write-ErrorMessage "❌ Not responding (Status: $($response.StatusCode))"
    }
} catch {
    Write-ErrorMessage "❌ Not responding"
}

# Check dashboard
Write-Host -NoNewline "Dashboard: "
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-SuccessMessage "✅ Running"
    } else {
        Write-ErrorMessage "❌ Not responding (Status: $($response.StatusCode))"
    }
} catch {
    Write-ErrorMessage "❌ Not responding"
}

# Check databases
Write-Host -NoNewline "PostgreSQL: "
try {
    $containerRunning = docker ps --filter "name=postgres" --format "{{.Names}}" | Select-String -Pattern "postgres"
    if ($containerRunning) {
        Write-SuccessMessage "✅ Running"
    } else {
        Write-ErrorMessage "❌ Not running"
    }
} catch {
    Write-ErrorMessage "❌ Not running"
}

Write-Host -NoNewline "Redis: "
try {
    $containerRunning = docker ps --filter "name=redis" --format "{{.Names}}" | Select-String -Pattern "redis"
    if ($containerRunning) {
        Write-SuccessMessage "✅ Running"
    } else {
        Write-ErrorMessage "❌ Not running"
    }
} catch {
    Write-ErrorMessage "❌ Not running"
}

Write-InfoMessage "🏁 Health check complete"