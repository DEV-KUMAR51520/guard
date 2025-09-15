# PostgreSQL Database Initialization Script

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
    Write-InfoMessage "Starting PostgreSQL database initialization..."

    # Check if Docker is installed
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-ErrorMessage "Docker is not installed. Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
        exit 1
    }

    # Check if PostgreSQL container is already running
    $containerRunning = docker ps --filter "name=postgres" --format "{{.Names}}" | Select-String -Pattern "postgres"
    
    if ($containerRunning) {
        Write-WarningMessage "PostgreSQL container is already running. Stopping and removing it..."
        docker stop postgres
        docker rm postgres
    }

    # Start PostgreSQL container
    Write-InfoMessage "Starting PostgreSQL container..."
    docker run --name postgres -e POSTGRES_DB=tourist_safety_dev -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=devpassword123 -p 5432:5432 -d postgres:15

    # Wait for PostgreSQL to start
    Write-InfoMessage "Waiting for PostgreSQL to start..."
    Start-Sleep -Seconds 10

    # Copy the SQL file to the container
    $sqlFilePath = "..\api-gateway\db.sql"
    if (-not (Test-Path $sqlFilePath)) {
        Write-ErrorMessage "SQL file not found at $sqlFilePath"
        exit 1
    }

    Write-InfoMessage "Copying SQL schema to container..."
    docker cp $sqlFilePath postgres:/db.sql

    # Execute the SQL file
    Write-InfoMessage "Creating database schema..."
    docker exec -i postgres psql -U admin -d tourist_safety_dev -f /db.sql

    Write-SuccessMessage "Database initialized successfully!"
    Write-InfoMessage "PostgreSQL is running on localhost:5432"
    Write-InfoMessage "Database: tourist_safety_dev"
    Write-InfoMessage "Username: admin"
    Write-InfoMessage "Password: devpassword123"

} catch {
    Write-ErrorMessage "An error occurred during database initialization:"
    Write-ErrorMessage $_.Exception.Message
    exit 1
}