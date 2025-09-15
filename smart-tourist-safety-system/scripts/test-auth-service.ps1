# Auth Service Test Script

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
    # Define the Auth Service URL
    $authServiceUrl = "http://localhost:3001"
    
    Write-InfoMessage "Testing Auth Service at $authServiceUrl"
    
    # Test 1: Health Check
    Write-InfoMessage "Test 1: Health Check"
    try {
        $response = Invoke-RestMethod -Uri "$authServiceUrl/health" -Method Get
        Write-SuccessMessage "Health check successful. Service status: $($response.status)"
        Write-InfoMessage "Database status: $(if ($response.database.healthy) { 'Healthy' } else { 'Unhealthy' })"
    } catch {
        Write-ErrorMessage "Health check failed: $_"
        Write-WarningMessage "The Auth Service may not be running. Please start it using the start-auth-service.ps1 script."
        exit 1
    }
    
    # Test 2: Register Endpoint (Just checking if it's accessible, not actually registering)
    Write-InfoMessage "Test 2: Checking Register Endpoint"
    try {
        $registerUrl = "$authServiceUrl/api/auth/register"
        $headers = @{"Content-Type" = "application/json"}
        
        # We're just checking if the endpoint exists, not actually registering
        # This will fail with a 400 Bad Request which is expected
        Invoke-RestMethod -Uri $registerUrl -Method Post -Headers $headers -Body "{}" -ErrorAction SilentlyContinue
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 400) {
            # 400 Bad Request is expected since we didn't provide valid data
            Write-SuccessMessage "Register endpoint is accessible"
        } else {
            Write-ErrorMessage "Register endpoint check failed: $_"
        }
    }
    
    # Test 3: Login Endpoint (Just checking if it's accessible, not actually logging in)
    Write-InfoMessage "Test 3: Checking Login Endpoint"
    try {
        $loginUrl = "$authServiceUrl/api/auth/login"
        $headers = @{"Content-Type" = "application/json"}
        
        # We're just checking if the endpoint exists, not actually logging in
        # This will fail with a 400 Bad Request which is expected
        Invoke-RestMethod -Uri $loginUrl -Method Post -Headers $headers -Body "{}" -ErrorAction SilentlyContinue
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 400) {
            # 400 Bad Request is expected since we didn't provide valid data
            Write-SuccessMessage "Login endpoint is accessible"
        } else {
            Write-ErrorMessage "Login endpoint check failed: $_"
        }
    }
    
    Write-SuccessMessage "Auth Service tests completed"
    Write-InfoMessage "The Auth Service appears to be properly configured and running"
    
} catch {
    Write-ErrorMessage "An error occurred during Auth Service testing:"
    Write-ErrorMessage $_.Exception.Message
    exit 1
}