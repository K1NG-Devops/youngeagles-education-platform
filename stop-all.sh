#!/bin/bash

# Young Eagles School Management - Stop All Services
# This script stops all running components of the Young Eagles system

echo "🛑 Stopping Young Eagles School Management System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to stop a service
stop_service() {
    local name=$1
    
    if [ -f ".$name.pid" ]; then
        local pid=$(cat ".$name.pid")
        echo -e "${BLUE}Stopping $name (PID: $pid)...${NC}"
        
        if kill -0 $pid 2>/dev/null; then
            kill $pid 2>/dev/null || true
            
            # Wait for process to stop
            local count=0
            while kill -0 $pid 2>/dev/null && [ $count -lt 10 ]; do
                sleep 1
                count=$((count + 1))
            done
            
            # Force kill if still running
            if kill -0 $pid 2>/dev/null; then
                echo -e "${YELLOW}Force stopping $name...${NC}"
                kill -9 $pid 2>/dev/null || true
            fi
            
            echo -e "${GREEN}$name stopped${NC}"
        else
            echo -e "${YELLOW}$name was not running${NC}"
        fi
        
        rm -f ".$name.pid"
    else
        echo -e "${YELLOW}No PID file found for $name${NC}"
    fi
}

# Stop all Node.js services
for service in api frontend pwa; do
    stop_service $service
done

# Stop Docker containers
echo -e "${BLUE}Stopping databases...${NC}"
docker-compose down

# Kill any remaining Node.js processes on our ports (fallback)
echo -e "${BLUE}Cleaning up any remaining processes...${NC}"
for port in 3001 5173 3002; do
    local pid=$(lsof -ti:$port 2>/dev/null || true)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}Killing process on port $port (PID: $pid)${NC}"
        kill -9 $pid 2>/dev/null || true
    fi
done

# Clean up any remaining PID files
rm -f .api.pid .frontend.pid .pwa.pid

echo ""
echo -e "${GREEN}✅ All Young Eagles services have been stopped${NC}"
echo ""

