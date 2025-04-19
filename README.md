# SoulSync - Mood Tracking Application

A full-stack application for tracking daily moods and journal entries.

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration (Example format)
DATABASE_URL=postgresql://username:password@host/database_name

# Server Configuration
PORT=3002
NODE_ENV=development

# Security
JWT_SECRET=your_jwt_secret
CORS_ALLOWED_ORIGINS=http://localhost:5184
```

**Important**: Never commit your `.env` file or sensitive credentials to version control. The `.env` file is already included in `.gitignore`.

For Render deployment, you'll use the internal Database URL provided by Render's PostgreSQL service, which follows this format:
```
postgresql://user:password@host/database_name
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npm run db:push
```

### Running the Application

The application uses a coordinated startup process to ensure both frontend and backend are running properly:

```bash
npm run dev
```

This command will:
1. Check and clear any processes using required ports (3002, 5184)
2. Start the backend server (port 3002)
3. Wait for the backend health check to pass
4. Start the frontend development server (port 5184)

The startup process includes automatic port management to prevent "Address already in use" errors.

### Health Checks

The backend provides a health endpoint at `/health` that monitors:
- Server status
- Database connection
- System uptime

### Development Notes

- Backend runs on `http://localhost:3002`
- Frontend runs on `http://localhost:5184`
- Health check ensures services start in the correct order
- API endpoints are proxied through the frontend development server

### Troubleshooting

If you encounter startup issues:

1. Check if both ports (3002 and 5184) are available
2. Verify database connection string in `.env`
3. Ensure all dependencies are installed
4. Check the logs for specific error messages

For database connection issues:
```bash
# Verify database connection
curl http://localhost:3002/health
```

## Deployment on Render

### PostgreSQL Setup

1. Create a new PostgreSQL instance on Render
2. Select the same region as you'll use for your web service
3. Copy the internal Database URL for use in the web service setup

### Web Service Configuration

1. Create a new Web Service with these settings:
   - Name: `soulsync-api` (or your preferred name)
   - Region: Same as PostgreSQL instance
   - Branch: main
   - Runtime: Node
   - Build Command: `npm install; npm run build`
   - Start Command: `cd dist && node index.js`
   - Instance Type: Free

Note: The build process will:
1. Install dependencies
2. Build frontend assets to dist/public
3. Bundle backend code to dist/index.js
4. Copy production dependencies to dist folder

2. Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=[Your Internal PostgreSQL URL from Render]
   JWT_SECRET=[Your Secret Key]
   PORT=10000
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.onrender.com
   ```

### Important Configuration Notes

1. Port Configuration:
   - The application uses `process.env.PORT` in production
   - Host is set to `0.0.0.0` in production for Render compatibility

2. Database Connection:
   - Uses Render's internal PostgreSQL URL
   - SSL is enabled for secure database connections
   - Connection pooling is configured for production use

3. Security Settings:
   - CORS is configured for your frontend domain
   - Helmet and CSRF protection enabled in production
   - Secure cookie settings for production environment

### Troubleshooting Deployment

If you encounter issues during deployment:

1. Check Build Logs:
   - View deploy logs in Render Dashboard
   - Search for "error" in log explorer
   - Verify build command completes successfully

2. Environment Variables:
   - Ensure all required variables are set:
     ```
     NODE_ENV=production
     DATABASE_URL=[Your PostgreSQL URL]
     JWT_SECRET=[Your Secret]
     PORT=10000
     CORS_ALLOWED_ORIGINS=[Frontend URL]
     ```
   - Double-check PostgreSQL URL format

3. Build Process:
   - Frontend builds to `dist/public`
   - Backend bundles to `dist/index.js`
   - Production dependencies installed in dist folder

4. Common Issues:
   - If build fails: Check Node.js version (set to 18.x)
   - If runtime fails: Verify start command and working directory
   - Database errors: Check PostgreSQL connection and SSL settings

## License

MIT
