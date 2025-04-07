import { type Express } from "express";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import jwt from 'jsonwebtoken';
import { User } from "./models/user";

const scryptAsync = promisify(scrypt);
const JWT_SECRET = process.env.JWT_SECRET || process.env.REPL_ID || "mood-tracker-secret";

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
  // Register endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const { username, password, email, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: { username }
      });

      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      // Check if email is already in use
      const existingEmail = await User.findOne({
        where: { email }
      });

      if (existingEmail) {
        return res.status(400).send("Email already in use");
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
        { expiresIn: '24h' }
      );

      return res.json({
        message: "Registration successful",
        user: {
          id: newUser.id,
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).send("Internal server error");
    }
  });

  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find user
      const user = await User.findOne({
        where: { username }
      });

      if (!user) {
        return res.status(400).send("Incorrect username or password");
      }

      // Verify password
      const isMatch = await crypto.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send("Incorrect username or password");
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).send("Internal server error");
    }
  });

  // Get current user endpoint
  app.get("/api/user", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).send('Access token required');
    }

    jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).send('Invalid or expired token');
      }

      try {
        const user = await User.findByPk(decoded.id);

        if (!user) {
          return res.status(404).send('User not found');
        }

        res.json({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal server error');
      }
    });
  });
}