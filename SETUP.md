# Local Development Environment Setup Instructions

## Requirements
- Node.js v18+
- Docker and Docker Compose
- Git

## Quick Start
Run the provided start script to quickly set up everything:
```bash
./start-dev.sh
```

## Manual Setup Instructions

### 1. Start Docker Containers
```bash
docker-compose up -d
```

### 2. Setup Backend API
```bash
cd api
npm install
npm run dev
```

### 3. Initialize Databases
After the API is running:
```bash
curl -X POST http://localhost:3000/api/init-db
```

### 4. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## Accessing the Application
- Frontend: http://localhost:5173
- API: http://localhost:3000
- PhpMyAdmin: http://localhost:8080 (user: root, password: young_eagles_root)

## Test Accounts
- Admin: king@youngeagles.org.za / King@123
- Teacher: teacher@youngeagles.org.za / King@123

## Key Components

### PWA Support
The application is configured as a Progressive Web App (PWA), which means it can be installed on mobile devices and desktops, and can work offline. This is handled through the VitePWA plugin in the frontend.

### Google Sign-In
Google authentication is integrated through Firebase. The configuration is in the `.env.local` file and the functionality is implemented in the `GoogleSignIn.jsx` component.

### Databases
1. skydek_DB: Contains tables for parents and students
2. railway: Contains tables for staff (teachers and admins)

Both databases are run in Docker containers for easy local development.

## Troubleshooting

### Database Connection Issues
1. Check if Docker containers are running: `docker ps`
2. Make sure database ports are not being used by other applications
3. Check the database logs: `docker logs skydek_db` or `docker logs railway_db`

### Authentication Issues
1. Verify Firebase configuration in frontend/.env.local
2. Check that the API server is running and accessible
3. Look for CORS errors in the browser console

### PWA Issues
1. Make sure service worker is registered properly
2. Clear browser cache and try again
3. Check the Network tab in browser developer tools for any failing requests
