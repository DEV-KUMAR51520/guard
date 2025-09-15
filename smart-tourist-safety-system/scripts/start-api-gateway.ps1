# API Gateway Initialization Script

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
    $apiGatewayPath = "..\api-gateway"
    Set-Location -Path $apiGatewayPath

    # Check if .env file exists, if not create one
    if (-not (Test-Path ".env")) {
        Write-InfoMessage "Creating .env file for API Gateway..."
        @"
PORT=3000
NODE_ENV=development
JWT_SECRET=dev_jwt_secret_key_for_testing
PG_HOST=localhost
PG_PORT=5432
PG_USER=admin
PG_PASSWORD=devpassword123
PG_DATABASE=tourist_safety_dev
REDIS_URL=redis://localhost:6379
BLOCKCHAIN_API_URL=http://localhost:8545
AI_SERVICE_URL=http://localhost:5000
"@ | Out-File -FilePath ".env" -Encoding utf8
        Write-SuccessMessage ".env file created successfully"
    } else {
        Write-InfoMessage ".env file already exists"
    }

    # Check if node_modules exists, if not install dependencies
    if (-not (Test-Path "node_modules")) {
        Write-InfoMessage "Installing API Gateway dependencies..."
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to install dependencies"
        }
        Write-SuccessMessage "Dependencies installed successfully"
    } else {
        Write-InfoMessage "Dependencies already installed"
    }

    # Start the API Gateway
    Write-InfoMessage "Starting API Gateway..."
    Write-InfoMessage "API Gateway will be available at http://localhost:3000"
    npm start

} catch {
    Write-ErrorMessage "An error occurred during API Gateway initialization:"
    Write-ErrorMessage $_.Exception.Message
    exit 1
}