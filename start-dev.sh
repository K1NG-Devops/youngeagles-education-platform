#!/bin/bash

# Young Eagles Local Development Script

# Text styling
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BOLD}${BLUE}=========================================${NC}"
echo -e "${BOLD}${BLUE} Young Eagles Local Development Starter ${NC}"
echo -e "${BOLD}${BLUE}=========================================${NC}\n"

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Error: Docker is not running.${NC}"
  echo -e "Please start Docker and try again."
  exit 1
fi

# Start Docker containers
echo -e "${YELLOW}Starting Docker containers...${NC}"
docker-compose up -d
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to start Docker containers.${NC}"
  exit 1
fi
echo -e "${GREEN}Docker containers started successfully!${NC}"
echo -e "- phpMyAdmin: http://localhost:8080 (username: root, password: young_eagles_root)\n"

# Wait for databases to be ready
echo -e "${YELLOW}Waiting for databases to be ready...${NC}"
sleep 10

# Initialize the databases if needed
echo -e "${YELLOW}Checking if databases need initialization...${NC}"
curl -s -X POST http://localhost:3000/api/init-db > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}API server is not running yet. Will initialize databases after API starts.${NC}"
else
  echo -e "${GREEN}Databases initialized!${NC}"
fi

# Start API server in a new terminal window
echo -e "${YELLOW}Starting API server...${NC}"
gnome-terminal -- bash -c "cd api && echo -e '${BOLD}${BLUE}API Server Terminal${NC}' && npm install && npm run dev; read -p 'Press any key to close...'"

# Give API time to start
sleep 5

# Initialize databases if not done earlier
curl -s -X POST http://localhost:3000/api/init-db > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Databases initialized!${NC}"
else
  echo -e "${RED}Failed to initialize databases. Make sure API server is running.${NC}"
fi

# Start Frontend in a new terminal window
echo -e "${YELLOW}Starting React frontend...${NC}"
gnome-terminal -- bash -c "cd frontend && echo -e '${BOLD}${BLUE}React Frontend Terminal${NC}' && npm install && npm run dev; read -p 'Press any key to close...'"

echo -e "\n${GREEN}Development environment is ready!${NC}"
echo -e "- API: http://localhost:3000"
echo -e "- Frontend: http://localhost:5173"
echo -e "- phpMyAdmin: http://localhost:8080"
echo -e "\n${YELLOW}Test Accounts:${NC}"
echo -e "Admin: king@youngeagles.org.za / King@123"
echo -e "Teacher: teacher@youngeagles.org.za / King@123"
