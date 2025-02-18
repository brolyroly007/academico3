import { fileURLToPath } from "url";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL de API forzada para producción
const API_URL = "https://academico3-production.up.railway.app";

export default defineConfig({
  plugins: [react()],
  define: {
    // Forzar la URL de API
    "import.meta.env.VITE_API_URL": JSON.stringify(API_URL),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: API_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
