import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', '@radix-ui/react-checkbox', '@radix-ui/react-label', '@radix-ui/react-radio-group', '@radix-ui/react-select', '@radix-ui/react-slot', '@radix-ui/react-toast'],
          utils: ['clsx', 'class-variance-authority', 'tailwind-merge', 'date-fns']
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild'
  },
  // No necesitas configuración de proxy ya que usarás la URL de Render directamente
});
