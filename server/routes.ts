import type { Express, Request, Response, NextFunction, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { User, MoodEntry, Tag } from "./models";
import { setupAuth } from "./auth";
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import sequelize from "./models/db";

// Define token payload type
interface TokenPayload {
  id: number;
  username: string;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      tokenPayload?: TokenPayload;
    }
  }
}

// Type guard for token payload
function isValidTokenPayload(payload: any): payload is TokenPayload {
  return payload && 
         typeof payload.id === 'number' && 
         typeof payload.username === 'string';
}

const logError = (location: string, error: unknown) => {
  console.error(`[${location}] Error:`, {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });
};

// Types for external API responses
type QuotableQuote = {
  content: string;
  author: string;
  tags: string[];
};

type ZenQuote = {
  q: string;
  a: string;
  h: string;
};

// Fallback quotes when APIs are unreachable
const FALLBACK_QUOTES = [
  {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    source: "Fallback"
  },
  {
    content: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    source: "Fallback"
  },
  {
    content: "Everything you've ever wanted is sitting on the other side of fear.",
    author: "George Addair",
    source: "Fallback"
  }
];

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware
const authenticateToken: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    
    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).json({
        message: 'Authentication required',
        details: 'No auth token found'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!isValidTokenPayload(decoded)) {
        throw new Error('Invalid token payload');
      }
      req.tokenPayload = decoded;
      next();
    } catch (err) {
      console.log('Token verification failed:', err);
      return res.status(401).json({
        message: 'Invalid or expired token',
        details: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  } catch (err) {
    logError('auth_middleware', err);
    return res.status(500).json({
      message: 'Internal server error',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // Get current user endpoint
  app.get("/api/user", authenticateToken, async (req, res) => {
    try {
      const user = await User.findByPk(req.tokenPayload!.id);

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
      logError('get_user', error);
      res.status(500).json({
        message: 'Failed to fetch user',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // External API: Get a random quote from Quotable API
  app.get("/api/quotes/random", authenticateToken, async (req, res) => {
    try {
      try {
        const response = await fetch("https://api.quotable.io/random");
        if (!response.ok) {
          throw new Error("Failed to fetch quote from Quotable API");
        }
        const quote: QuotableQuote = await response.json();
        return res.json({
          content: quote.content,
          author: quote.author,
          source: "Quotable",
          tags: quote.tags
        });
      } catch (apiError) {
        console.error("Error fetching Quotable quote:", apiError);
        // Use fallback quote if API is unreachable
        const fallbackQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
        return res.json(fallbackQuote);
      }
    } catch (error) {
      console.error("Error in quote endpoint:", error);
      res.status(500).json({ message: "Failed to fetch quote" });
    }
  });

  // External API: Get a random quote from Zen Quotes API
  app.get("/api/quotes/zen", authenticateToken, async (req, res) => {
    try {
      try {
        const response = await fetch("https://zenquotes.io/api/random");
        if (!response.ok) {
          throw new Error("Failed to fetch quote from Zen Quotes API");
        }
        const [quote]: ZenQuote[] = await response.json();
        return res.json({
          content: quote.q,
          author: quote.a,
          source: "Zen Quotes"
        });
      } catch (apiError) {
        console.error("Error fetching Zen quote:", apiError);
        // Use fallback quote if API is unreachable
        const fallbackQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
        return res.json(fallbackQuote);
      }
    } catch (error) {
      console.error("Error in quote endpoint:", error);
      res.status(500).json({ message: "Failed to fetch quote" });
    }
  });

  // Get all mood entries with their tags
  app.get("/api/entries", authenticateToken, async (req, res) => {
    try {
      const entries = await MoodEntry.findAll({
        where: {
          userId: req.tokenPayload!.id
        },
        include: [{
          model: Tag,
          as: 'tags'
        }],
        order: [['date', 'DESC']]
      });

      res.json(entries);
    } catch (error) {
      console.error("Error fetching entries:", error);
      res.status(500).json({ message: "Failed to fetch entries" });
    }
  });

  // Create a new mood entry with tags
  app.post("/api/entries", authenticateToken, async (req, res) => {
    try {
      // Validate required fields
      const { mood, content, date, tags: tagNames } = req.body;
      
      if (!mood || !content) {
        return res.status(422).json({
          message: 'Validation failed',
          details: {
            mood: !mood ? 'Mood is required' : undefined,
            content: !content ? 'Content is required' : undefined
          }
        });
      }

      // Validate mood value
      if (!['great', 'good', 'neutral', 'bad', 'terrible'].includes(mood)) {
        return res.status(422).json({
          message: 'Validation failed',
          details: { mood: 'Invalid mood value' }
        });
      }

      // Start transaction
      const transaction = await sequelize.transaction();

      try {
        // Create entry
        const entry = await MoodEntry.create({
          mood,
          content,
          date: date || new Date().toISOString().split('T')[0],
          userId: req.tokenPayload!.id
        }, { transaction });

        // Handle tags if present
        if (tagNames?.length) {
          const tags = await Promise.all(
            tagNames.map(async (name: string) => {
              const [tag] = await Tag.findOrCreate({
                where: { name: name.trim().toLowerCase() },
                transaction
              });
              return tag;
            })
          );

          await entry.setTags(tags, { transaction });
        }

        await transaction.commit();

        // Fetch complete entry with tags
        const entryWithTags = await MoodEntry.findByPk(entry.id, {
          include: [{ model: Tag, as: 'tags' }]
        });

        res.status(201).json(entryWithTags);
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      logError('create_entry', error);
      res.status(500).json({
        message: 'Failed to create entry',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get a specific mood entry
  app.get("/api/entries/:id", authenticateToken, async (req, res) => {
    try {
      const entryId = parseInt(req.params.id);
      const entry = await MoodEntry.findOne({
        where: {
          id: entryId,
          userId: req.tokenPayload!.id
        },
        include: [{
          model: Tag,
          as: 'tags'
        }]
      });

      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }

      res.json(entry);
    } catch (error) {
      console.error("Error fetching entry:", error);
      res.status(500).json({ message: "Failed to fetch entry" });
    }
  });

  // Update a mood entry
  app.put("/api/entries/:id", authenticateToken, async (req, res) => {
    try {
      const entryId = parseInt(req.params.id);
      const { tags: tagNames, ...moodEntryData } = req.body;

      const entry = await MoodEntry.findOne({
        where: {
          id: entryId,
          userId: req.tokenPayload!.id
        }
      });

      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }

      await entry.update({
        ...moodEntryData,
        updatedAt: new Date()
      });

      if (tagNames && tagNames.length > 0) {
        const tags = await Promise.all(
          tagNames.map(async (name: string) => {
            const [tag] = await Tag.findOrCreate({
              where: { name }
            });
            return tag;
          })
        );

        await entry.setTags(tags);
      } else {
        await entry.setTags([]);
      }

      res.json(entry);
    } catch (error) {
      console.error("Error updating entry:", error);
      res.status(400).json({ message: "Failed to update entry" });
    }
  });

  // Delete a mood entry
  app.delete("/api/entries/:id", authenticateToken, async (req, res) => {
    try {
      const entryId = parseInt(req.params.id);
      const entry = await MoodEntry.findOne({
        where: {
          id: entryId,
          userId: req.tokenPayload!.id
        }
      });

      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }

      await entry.destroy();
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting entry:", error);
      res.status(500).json({ message: "Failed to delete entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
