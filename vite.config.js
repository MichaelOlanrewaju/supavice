import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // The catalogue snapshot is large and only used as an offline
          // fallback now that data is live — keep it in its own chunk so it
          // doesn't bloat the main bundle everyone downloads.
          if (id.includes('products.json')) return 'catalog'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
