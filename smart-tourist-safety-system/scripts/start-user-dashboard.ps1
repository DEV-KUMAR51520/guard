# User Dashboard Frontend Initialization Script

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
    $dashboardPath = "..\frontend\user-dashboard"
    Set-Location -Path $dashboardPath

    # Check if node_modules exists, if not install dependencies
    if (-not (Test-Path "node_modules")) {
        Write-InfoMessage "Installing User Dashboard dependencies..."
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to install dependencies"
        }
        Write-SuccessMessage "Dependencies installed successfully"
    } else {
        Write-InfoMessage "Dependencies already installed"
    }

    # Create .env file for React app if it doesn't exist
    if (-not (Test-Path ".env")) {
        Write-InfoMessage "Creating .env file for User Dashboard..."
        @"
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
"@ | Out-File -FilePath ".env" -Encoding utf8
        Write-SuccessMessage ".env file created successfully"
    } else {
        Write-InfoMessage ".env file already exists"
    }

    # Start the User Dashboard
    Write-InfoMessage "Starting User Dashboard..."
    Write-InfoMessage "User Dashboard will be available at http://localhost:3001"
    
    # Use a different port than API Gateway
    $env:PORT = 3001
    npm start

} catch {
    Write-ErrorMessage "An error occurred during User Dashboard initialization:"
    Write-ErrorMessage $_.Exception.Message
    exit 1
}