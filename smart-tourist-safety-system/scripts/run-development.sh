#!/bin/bash

# ---
# FINAL Corrected run-development.sh Script
#
# Fixes:
# 1. Uses 'npx kill-port' for reliable cross-platform process termination.
# 2. Actively waits for the database to be ready, eliminating race conditions.
# 3. Ensures all services are stopped cleanly before starting.
# ---

echo "🚀 Starting Smart Tourist Safety System - Development Mode"

# Function to clean up on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down all services..."
    npx kill-port 5000 5002 8000 3000 3002 || true
    docker-compose -f docker-compose.dev.yml down --volumes
    echo "✅ All services stopped."
}

# Always run cleanup first to ensure a clean slate
cleanup
sleep 2

# Trap CTRL+C to run cleanup
trap cleanup INT TERM

# Start Databases
echo "🐳 Starting database containers..."
docker-compose -f docker-compose.dev.yml up -d postgres redis

# ✅ NEW: Actively wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to accept connections..."
until docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready --username=admin --dbname=tourist_safety -q; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
echo "✅ PostgreSQL is up and running!"

# Start Services
echo "🐍 Starting Python backend on port 5000..."
(cd backend && source venv/Scripts/activate && flask run --port=5000) &

echo "🔐 Starting Node.js auth service on port 5002..."
(cd auth-service && npm install && npm start) &

echo "GATEWAY: Starting API Gateway on port 8000..."
(cd api-gateway && npm install && npm start) &

echo "🌐 Starting user application on port 3000..."
(cd frontend/landing && npm install && npm run dev -- --port 3000) &

echo "📊 Starting admin dashboard on port 3002..."
(cd frontend/dashboard && npm install && npm run dev -- --port 3002) &

echo ""
echo "✅ All services are starting up!"
echo "----------------------------------------"
echo "➡️  User App: http://localhost:3000"
echo "➡️  Admin App:  http://localhost:3002"
echo "➡️  API Gateway: http://localhost:8000"
echo "----------------------------------------"
echo "🛑 Press CTRL+C to stop all services."

# Wait for any process to exit to keep the script running
wait -n