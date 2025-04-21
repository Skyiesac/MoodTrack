import type { Express } from "express";
import express from "express";
import type { Server } from "http";
import path from "path";

export function log(message: string) {
  console.log(`[server] ${message}`);
}

export function serveStatic(app: Express) {
  const publicDir = path.join(process.cwd(), "dist", "public");
  app.use(express.static(publicDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

export async function setupVite(app: Express, server: Server) {
  const vite = await import("vite");
  const plugin = await import("@vitejs/plugin-react");

  const viteDevServer = await vite.createServer({
    root: path.join(process.cwd(), "client"),
    logLevel: "error",
    server: {
      middlewareMode: true,
      hmr: {
        server: server,
      },
    },
    plugins: [plugin.default()],
  });

  app.use(viteDevServer.middlewares);
}
