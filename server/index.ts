import express from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import sequelize from "./models/db";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import csrf from 'csurf';
import { setupAuth } from "./auth";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Security middleware
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(csrf({ cookie: true }));
} else {
  // In development, only use basic security
  if (!process.env.CORS_ALLOWED_ORIGINS) {
    throw new Error('CORS_ALLOWED_ORIGINS environment variable is required');
  }

  app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
  }));
}

// Parse cookies and JSON body before any routes
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable pre-flight requests for all routes
app.options('*', cors());

// Error handling middleware
const errorHandler = (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Authentication error',
      details: err.message,
      type: err.name
    });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ 
    message,
    details: err.details || err.message,
    type: err.name,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

(async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Register routes first (public endpoints like quotes)
    const server = registerRoutes(app);

    // Setup auth routes and middleware
    setupAuth(app);

    // Add error handling middleware last
    app.use(errorHandler);

    // Setup Vite or static serving after creating server
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const PORT = parseInt(process.env.PORT || '3002', 10);
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} in ${app.get("env")} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

export default app;
