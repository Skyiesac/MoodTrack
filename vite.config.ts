import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.jpg', '**/*.png'],
  optimizeDeps: {
    exclude: ['lightningcss']
  },
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      external: ['pg-native'],
      output: {
        manualChunks: undefined
      }
    },
    commonjsOptions: {
      include: [/node_modules/, /@babel\/preset-typescript\/package\.json/],
      extensions: ['.js', '.cjs', '.jsx', '.tsx']
    },
    target: 'es2015',
    sourcemap: false
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
    }
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'client/src') },
      { find: '@db', replacement: path.resolve(__dirname, 'db') }
    ]
  },
  root: path.resolve(__dirname, "client"),
  server: {
    port: 5184,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3002",
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
    cors: {
      origin: true,
      credentials: true,
    },
  },
});
