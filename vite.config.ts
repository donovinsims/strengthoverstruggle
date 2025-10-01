import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk splitting for better caching and smaller initial bundle
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React vendor chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI library chunk - split by usage frequency
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-accordion', '@radix-ui/react-slot'],
          // Icons chunk - deferred loading
          'icons': ['lucide-react'],
        },
        // Add content hash to filenames for cache busting
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
    // Increase chunk size warning limit (after optimization, we expect larger but fewer chunks)
    chunkSizeWarningLimit: 1000,
    // Use esbuild for minification with tree shaking enabled
    minify: 'esbuild',
    // Enable tree shaking and drop console in production
    target: 'es2015',
  },
}));
