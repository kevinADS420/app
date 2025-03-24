import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://backendhuertomkt.onrender.com'),
  },
  server: {
    proxy: {
      '/Update/customer': {
        target: 'https://backendhuertomkt.onrender.com',
        changeOrigin: true,
      }
    }
  }
})