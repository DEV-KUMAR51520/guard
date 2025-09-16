#!/bin/bash

echo "🚀 Starting Smart Tourist Safety System - Development Mode"
set -e

# Start Databases
docker-compose -f docker-compose.dev.yml up -d postgres redis
echo "⏳ Waiting for databases..."
sleep 10

# Start Python Backend Service
echo "🐍 Starting Python backend on port 5000..."
(cd backend && source venv/Scripts/activate && flask run --port=5000) &
BACKEND_PID=$!

# Start Node.js Auth Service
echo "🔐 Starting Node.js auth service on port 5002..."
(cd auth-service && npm install && npm start) &
AUTH_SERVICE_PID=$!

# Start API Gateway
echo "GATEWAY: Starting API Gateway on port 8000..."
(cd api-gateway && npm install && npm start) &
GATEWAY_PID=$!

# Start Main User Frontend
echo "🌐 Starting user application on port 3000..."
(cd frontend/landing && npm install && npm run dev -- --port 3000) &
MAIN_APP_PID=$!

# Start Admin Dashboard Frontend
echo "📊 Starting admin dashboard on port 3002..."
(cd frontend/dashboard && npm install && npm run dev -- --port 3002) &
ADMIN_DASHBOARD_PID=$!

sleep 8
echo ""
echo "✅ All services are up and running!"
echo "----------------------------------------"
echo "➡️  User App: http://localhost:3000"
echo "➡️  Admin App:  http://localhost:3002"
echo "➡️  API Gateway: http://localhost:8000"
echo "----------------------------------------"
echo "🛑 To stop all services, run: ./scripts/stop-development.sh"

# Create the stop script
cat > scripts/stop-development.sh << STOP_EOF
#!/bin/bash
echo "🛑 Stopping all services..."
kill -9 $BACKEND_PID $AUTH_SERVICE_PID $GATEWAY_PID $MAIN_APP_PID $ADMIN_DASHBOARD_PID 2>/dev/null
docker-compose -f docker-compose.dev.yml down
echo "✅ All services stopped."
STOP_EOF
chmod +x scripts/stop-development.sh