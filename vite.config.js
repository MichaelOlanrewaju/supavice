import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // The catalogue is large and changes independently of the app code.
          // Splitting it means a product update does not bust the vendor cache,
          // and vice versa.
          if (id.includes('products.json')) return 'catalog'
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
            return 'react'
          }
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
