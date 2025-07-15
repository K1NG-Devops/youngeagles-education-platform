# Young Eagles School Management - Local Development

This is a cleaned up version of the Young Eagles School Management system for local development.

## Project Structure

- `api/` - Backend API server
- `frontend/` - React frontend application  
- `pwa/` - Progressive Web App with offline capabilities
- `docker-compose.yml` - Docker setup for local databases

## Requirements

- Node.js v18+
- Docker and Docker Compose
- Git

## Getting Started

### 1. Start the Databases

```bash
# From the project root
docker-compose up -d
```

This will start:
- MySQL database for parents and students (skydek_DB) on port 3306
- MySQL database for staff (railway) on port 3307
- phpMyAdmin for database management on port 8080

Access phpMyAdmin at: http://localhost:8080
- Username: root
- Password: young_eagles_root

### 2. Set Up the API Server

```bash
# Navigate to the API directory
cd api

# Install dependencies
npm install

# Start the development server
npm run dev
```

The API will be available at: http://localhost:3000

### 3. Set Up the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at: http://localhost:5173

### 4. Set Up the PWA ✅ (Complete)

```bash
# Navigate to the PWA directory
cd pwa

# Install dependencies
npm install

# Start the development server
npm run dev
```

The PWA will be available at: http://localhost:3004 (or next available port)

**PWA Features Implemented:**
- ✅ Offline functionality with cached data
- ✅ Push notification support (ready)
- ✅ Installable app experience
- ✅ Service worker for background sync
- ✅ Role-based navigation (Parent/Teacher/Admin)
- ✅ Mobile-first responsive design
- ✅ Development mode with mock authentication
- ✅ Production-ready build system

**Quick Test:**
1. Visit the PWA URL
2. Login with any email/password (dev mode)
3. Navigate using bottom tabs
4. Test offline functionality

## Key Features

- PWA Support with offline capabilities
- Google Sign-In authentication
- Admin dashboard for school management
- Teacher portal for managing classes and assignments
- Parent portal for monitoring student progress

## Database Initialization

If this is your first time setting up the project, you'll need to initialize the database tables. This can be done through the API's initialization endpoint:

```bash
curl -X POST http://localhost:3000/api/init-db
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues, ensure that:
1. Docker containers are running (`docker ps`)
2. Database credentials in `.env` match docker-compose.yml
3. Wait a few moments after starting containers for MySQL to initialize

### Authentication Issues

If authentication isn't working:
1. Check Google Sign-In configuration in frontend/.env.local
2. Ensure JWT_SECRET is consistent in api/.env
3. Check browser console for CORS errors
