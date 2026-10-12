import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  define: {
    global: 'window', // Define 'global' para que Jitsi no rompa la ejecución en el navegador
  },
})