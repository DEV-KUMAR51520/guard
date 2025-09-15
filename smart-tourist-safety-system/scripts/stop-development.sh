#!/bin/bash
echo "🛑 Stopping all services..."
kill $BACKEND_PID $AI_PID $DASHBOARD_PID $USER_DASHBOARD_PID 2>/dev/null
docker-compose -f docker-compose.dev.yml down
echo "✅ All services stopped"
