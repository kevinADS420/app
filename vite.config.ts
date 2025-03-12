import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:10101'),
  },
  server: {
    proxy: {
      '/Update/customer': {
        target: 'http://localhost:10101',
        changeOrigin: true,
      }
    }
  }
})
