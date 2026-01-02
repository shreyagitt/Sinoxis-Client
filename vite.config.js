import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  optimizeDeps: {
    include: ['react-apexcharts', 'apexcharts'],
  },

  server: {
    host: '0.0.0.0',
    port: 5173,

    // ✅ Allow ALL domains dynamically
    allowedHosts: true,   // <-- Most important
    cors: true,
  },

  // ✅ REQUIRED for preview / production-like serving
  preview: {
    allowedHosts: true,
  },
})

