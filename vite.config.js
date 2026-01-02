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

    // ✅ REQUIRED to fix "Blocked request. This host is not allowed"
    allowedHosts: ['cms.sinoxisdigital.com'],

    cors: true,
  },

  // ✅ REQUIRED for preview / production-like serving
  preview: {
    allowedHosts: ['cms.sinoxisdigital.com'],
  },
})

