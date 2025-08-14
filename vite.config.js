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
        manualChunks: (id) => {
          // Vendor chunk - Core React libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor';
            }
            // UI libraries chunk
            if (id.includes('lucide-react') || id.includes('@radix-ui/')) {
              return 'ui';
            }
            // Utility libraries chunk
            if (id.includes('clsx') || id.includes('class-variance-authority') || 
                id.includes('tailwind-merge') || id.includes('date-fns')) {
              return 'utils';
            }
            // Other node_modules go to vendor
            return 'vendor';
          }
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false, // Faster builds
    chunkSizeWarningLimit: 1000
  },
  // No necesitas configuración de proxy ya que usarás la URL de Render directamente
});
