#!/bin/bash
echo "🛑 Stopping all services..."
kill -9 466 467 468 470 472 2>/dev/null
docker-compose -f docker-compose.dev.yml down
echo "✅ All services stopped."
