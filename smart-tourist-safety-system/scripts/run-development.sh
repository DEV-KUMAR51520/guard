#!/bin/bash

echo "🚀 Starting Smart Tourist Safety System - Development Mode"

# Start databases with Docker
echo "📊 Starting databases..."
docker-compose -f docker-compose.dev.yml up -d postgres redis

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
sleep 10

# Start backend
echo "🖥️ Starting backend service..."
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
export FLASK_ENV=development
export DATABASE_URL=postgresql://admin:devpassword123@localhost:5432/tourist_safety_dev
export REDIS_URL=redis://:devpassword123@localhost:6379/0
flask run &
BACKEND_PID=$!
cd ..

# Start AI service
echo "🤖 Starting AI service..."
cd microservices/ai-service
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
python app.py &
AI_PID=$!
cd ../..

# Start admin dashboard
echo "📱 Starting admin dashboard..."
cd frontend/dashboard
npm install
npm run dev -- --port 3000 &
DASHBOARD_PID=$!
cd ../..

# Start user dashboard
echo "👤 Starting user dashboard..."
cd frontend/user-dashboard
npm install
npm start &
USER_DASHBOARD_PID=$!
cd ../..

echo "✅ All services started!"
echo "📊 Admin Dashboard: http://localhost:3000"
echo "👤 User Dashboard: http://localhost:3001"
echo "🔌 Backend API: http://localhost:5000/api"
echo "🤖 AI Service: http://localhost:5001"
echo ""
echo "📱 To start mobile app:"
echo "   cd mobile && npm install && npx react-native run-android"
echo ""
echo "🛑 To stop all services: ./scripts/stop-development.sh"

# Create stop script with new PIDs
cat > scripts/stop-development.sh << 'STOP_EOF'
#!/bin/bash
echo "🛑 Stopping all services..."
kill $BACKEND_PID $AI_PID $DASHBOARD_PID $USER_DASHBOARD_PID 2>/dev/null
docker-compose -f docker-compose.dev.yml down
echo "✅ All services stopped"
STOP_EOF

chmod +x scripts/stop-development.sh
