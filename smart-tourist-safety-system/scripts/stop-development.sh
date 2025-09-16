#!/bin/bash
echo "🛑 Stopping all services..."
kill -9 350 351 352 354 356 2>/dev/null
docker-compose -f docker-compose.dev.yml down
echo "✅ All services stopped."
