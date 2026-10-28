import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (/node_modules[\\/]maplibre-gl/.test(id)) {
            return 'vendor-maplibre';
          }
          if (/node_modules[\\/]@supabase/.test(id)) {
            return 'vendor-supabase';
          }
          if (/node_modules[\\/]lucide-react/.test(id)) {
            return 'vendor-icons';
          }
          if (/node_modules[\\/](react|react-dom|react-router-dom)/.test(id)) {
            return 'vendor-react';
          }
        },
      },
    },
  },
})



