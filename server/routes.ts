import express from "express";
import { createServer } from "http";
import { healthCheck } from "./health";
import { User } from "./models/user";

const quotes = [
  {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    content: "Life is what happens when you're busy making other plans.",
    author: "John Lennon"
  },
  {
    content: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu"
  },
  {
    content: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein"
  },
  {
    content: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  }
];

export function registerRoutes(app: express.Express) {
  // Health check endpoint
  app.get('/health', healthCheck);

  // API routes
  app.get('/api/status', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Quotes endpoint
  app.get('/api/quotes/random', (req, res) => {
    try {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      console.log('Sending quote:', randomQuote);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      if (!randomQuote) {
        throw new Error('No quotes available');
      }
      
      res.status(200).json(randomQuote);
    } catch (error) {
      console.error('Error serving quote:', error);
      res.status(500).json({ error: 'Failed to fetch quote' });
    }
  });

  // Middleware to check if user is authenticated
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!(req as any).user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };

  // User settings endpoint
  app.put('/api/user/settings', requireAuth, async (req, res) => {
    try {
      const { firstName, lastName, email, theme, notifications, privacy } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Update user in database
      await User.update(
        { 
          firstName, 
          lastName, 
          email,
          settings: JSON.stringify({ theme, notifications, privacy })
        },
        { where: { id: userId } }
      );

      res.json({ message: 'Settings updated successfully' });
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // Create HTTP server
  const server = createServer(app);

  return server;
}
