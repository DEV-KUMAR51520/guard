# Auth Service Initialization Script

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
    $authServicePath = "..\auth-service"
    Set-Location -Path $authServicePath

    # Check if .env file exists
    if (-not (Test-Path ".env")) {
        Write-WarningMessage ".env file not found. Creating default .env file..."
        @"
# Database Connection
DB_USER=admin
DB_PASSWORD=devpassword123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tourist_safety_dev

# Connection Pool
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=5000

# Health Checks
DB_HEALTH_CHECK_INTERVAL=30000
DB_UNHEALTHY_THRESHOLD=3

# Authentication
PORT=3001
JWT_SECRET=dev_jwt_secret_key_for_testing
JWT_EXPIRATION=86400
BCRYPT_SALT_ROUNDS=10

# External Services
BLOCKCHAIN_API_URL=http://localhost:5002
AI_SERVICE_URL=http://localhost:5000
"@ | Out-File -FilePath ".env" -Encoding utf8
        Write-SuccessMessage ".env file created successfully"
    } else {
        Write-InfoMessage ".env file already exists"
    }

    # Check if node_modules exists, if not install dependencies
    if (-not (Test-Path "node_modules")) {
        Write-InfoMessage "Installing Auth Service dependencies..."
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to install dependencies"
        }
        Write-SuccessMessage "Dependencies installed successfully"
    } else {
        Write-InfoMessage "Dependencies already installed"
    }

    # Start the Auth Service
    Write-InfoMessage "Starting Auth Service..."
    Write-InfoMessage "Auth Service will be available at http://localhost:3001"
    npm start

} catch {
    Write-ErrorMessage "An error occurred during Auth Service initialization:"
    Write-ErrorMessage $_.Exception.Message
    exit 1
}