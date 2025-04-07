import type { Express } from "express";
import { createServer, type Server } from "http";
import { User, MoodEntry, Tag } from "./models";
import { setupAuth } from "./auth";
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

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

const JWT_SECRET = process.env.JWT_SECRET || process.env.REPL_ID || "mood-tracker-secret";

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access token required');
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).send('Invalid or expired token');
    }
    req.user = decoded;
    next();
  });
};

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

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
          userId: req.user!.id
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
      const { tags: tagNames, ...moodEntryData } = req.body;

      const entry = await MoodEntry.create({
        ...moodEntryData,
        userId: req.user!.id
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
      }

      res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating entry:", error);
      res.status(400).json({ message: "Failed to create entry" });
    }
  });

  // Get a specific mood entry
  app.get("/api/entries/:id", authenticateToken, async (req, res) => {
    try {
      const entryId = parseInt(req.params.id);
      const entry = await MoodEntry.findOne({
        where: {
          id: entryId,
          userId: req.user!.id
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
          userId: req.user!.id
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
          userId: req.user!.id
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