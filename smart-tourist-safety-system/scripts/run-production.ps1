# PowerShell Production Environment Script

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

try {
    Write-InfoMessage "🚀 Starting Smart Tourist Safety System - Production Mode"

    # Build and start all services
    docker-compose up --build -d

    Write-SuccessMessage "✅ Production environment started!"
    Write-InfoMessage "📊 Dashboard: http://localhost:3000"
    Write-InfoMessage "🔌 Backend API: http://localhost:5000/api"
    Write-InfoMessage "🤖 AI Service: http://localhost:5001"
    Write-InfoMessage ""
    Write-InfoMessage "📊 Monitor with: docker-compose logs -f"
    Write-InfoMessage "🛑 Stop with: docker-compose down"

} catch {
    Write-ErrorMessage "An error occurred during startup:"
    Write-ErrorMessage $_.Exception.Message
    exit 1
}