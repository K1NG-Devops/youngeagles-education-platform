#!/bin/bash

# Young Eagles School Management - Complete Development Server Startup
# This script starts all components of the Young Eagles system

set -e

echo "🏫 Starting Young Eagles School Management System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}Warning: Port $1 is already in use${NC}"
        return 1
    else
        return 0
    fi
}

# Function to start a service in background
start_service() {
    local name=$1
    local dir=$2
    local command=$3
    local port=$4
    
    echo -e "${BLUE}Starting $name...${NC}"
    
    cd $dir
    
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing dependencies for $name...${NC}"
        npm install
    fi
    
    # Start the service in background
    $command &
    local pid=$!
    
    echo "$pid" > "../.$name.pid"
    echo -e "${GREEN}$name started on port $port (PID: $pid)${NC}"
    
    cd - > /dev/null
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Start databases with Docker Compose
echo -e "${BLUE}Starting databases...${NC}"
docker-compose up -d

# Wait for databases to be ready
echo -e "${YELLOW}Waiting for databases to initialize...${NC}"
sleep 10

# Check if all required ports are available
ports=(3001 5173 3002)
port_names=("API" "Frontend" "PWA")

for i in "${!ports[@]}"; do
    if ! check_port ${ports[$i]}; then
        echo -e "${RED}Error: ${port_names[$i]} port ${ports[$i]} is in use. Please free the port and try again.${NC}"
        exit 1
    fi
done

# Start API server
start_service "api" "api" "npm run dev" "3001"

# Wait a moment for API to start
sleep 3

# Start Frontend
start_service "frontend" "frontend" "npm run dev" "5173"

# Start PWA
start_service "pwa" "pwa" "npm run dev" "3002"

# Wait for all services to start
sleep 5

echo ""
echo -e "${GREEN}🎉 Young Eagles School Management System is now running!${NC}"
echo ""
echo -e "${BLUE}Services:${NC}"
echo -e "  📊 Database (phpMyAdmin): ${YELLOW}http://localhost:8080${NC}"
echo -e "  🔧 API Server:            ${YELLOW}http://localhost:3001${NC}"
echo -e "  🖥️  Frontend App:          ${YELLOW}http://localhost:5173${NC}"
echo -e "  📱 PWA App:               ${YELLOW}http://localhost:3002${NC}"
echo ""
echo -e "${BLUE}Database Credentials:${NC}"
echo -e "  Username: ${YELLOW}root${NC}"
echo -e "  Password: ${YELLOW}young_eagles_root${NC}"
echo ""
echo -e "${YELLOW}To stop all services, run: ./stop-all.sh${NC}"
echo ""

# Keep the script running and monitor services
trap 'echo -e "\n${YELLOW}Stopping all services...${NC}"; ./stop-all.sh; exit 0' INT

echo -e "${GREEN}Press Ctrl+C to stop all services${NC}"

# Monitor services
while true; do
    sleep 30
    
    # Check if services are still running
    for service in api frontend pwa; do
        if [ -f ".$service.pid" ]; then
            pid=$(cat ".$service.pid")
            if ! kill -0 $pid 2>/dev/null; then
                echo -e "${RED}Warning: $service (PID: $pid) has stopped${NC}"
                rm -f ".$service.pid"
            fi
        fi
    done
done

