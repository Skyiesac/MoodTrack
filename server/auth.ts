import { type Express } from "express";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import jwt from 'jsonwebtoken';
import { User } from "./models/user";
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

const scryptAsync = promisify(scrypt);

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = '24h';

// Rate limiting configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later'
});

const crypto = {
  hash: async (password: string) => {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  },
  compare: async (suppliedPassword: string, storedPassword: string) => {
    const [hashedPassword, salt] = storedPassword.split(".");
    const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
    const suppliedPasswordBuf = (await scryptAsync(
      suppliedPassword,
      salt,
      64
    )) as Buffer;
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
  },
};

declare global {
  namespace Express {
    interface Request {
      user?: typeof User.prototype;
    }
  }
}

export function setupAuth(app: Express) {
  // Setup middleware
  app.use(cookieParser());
  app.use(csrf({ cookie: true }));

  // CSRF error handler
  app.use((err: any, req: any, res: any, next: any) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    res.status(403).json({ message: 'Invalid CSRF token' });
  });

  // Register endpoint
  app.post("/api/register", authLimiter, async (req, res) => {
    try {
      const { username, password, email, firstName, lastName } = req.body;

      if (!username || !password || !email || !firstName || !lastName) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        where: { username }
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check if email is already in use
      const existingEmail = await User.findOne({
        where: { email }
      });

      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Hash the password
      const hashedPassword = await crypto.hash(password);

      // Create the new user
      const newUser = await User.create({
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      // Set token in HTTP-only cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      return res.json({
        message: "Registration successful",
        user: {
          id: newUser.id,
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email
        },
        token, // Still include token in response for legacy clients
        csrfToken: req.csrfToken()
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Login endpoint
  app.post("/api/login", authLimiter, async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Find user
      const user = await User.findOne({
        where: { username }
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isMatch = await crypto.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      // Set token in HTTP-only cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      return res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        },
        token, // Still include token in response for legacy clients
        csrfToken: req.csrfToken()
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get current user endpoint
  app.get("/api/user", async (req, res) => {
    try {
      const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    res.clearCookie('auth_token');
    res.json({ message: "Logged out successfully" });
  });
}
