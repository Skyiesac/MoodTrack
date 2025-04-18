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
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
CORS_ALLOWED_ORIGINS=http://localhost:5184
PORT=3002
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
1. Start the backend server (port 3002)
2. Wait for the backend health check to pass
3. Start the frontend development server (port 5184)

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

## License

MIT
