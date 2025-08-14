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
          // Core React - Split into smaller chunks for mobile
          if (id.includes('node_modules')) {
            // React core - Essential for initial render
            if (id.includes('react/') && !id.includes('react-dom') && !id.includes('react-router')) {
              return 'react-core';
            }
            // React DOM - Heavy but needed
            if (id.includes('react-dom')) {
              return 'react-dom';
            }
            // React Router - Can be lazy loaded
            if (id.includes('react-router')) {
              return 'router';
            }
            // UI libraries - Split further
            if (id.includes('@radix-ui/react-select') || id.includes('@radix-ui/react-toast')) {
              return 'ui-heavy';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('@radix-ui/')) {
              return 'ui-light';
            }
            // Utilities
            if (id.includes('clsx') || id.includes('class-variance-authority') || 
                id.includes('tailwind-merge')) {
              return 'utils';
            }
            if (id.includes('date-fns')) {
              return 'date-utils';
            }
            // Other smaller libraries
            return 'vendor-misc';
          }
        }
      }
    },
    target: 'es2020', // Better mobile compatibility
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500, // Smaller chunks for mobile
    sourcemap: false // Disable sourcemaps for production mobile
  },
  // No necesitas configuración de proxy ya que usarás la URL de Render directamente
});
