import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Disable caching during development
    fs: {
      strict: true,
    },
    hmr: {
      overlay: true,
    },
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  // Add timestamp to asset filenames for cache busting
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`,
      },
    },
  },
})
