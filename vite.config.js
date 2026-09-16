import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window', // Define 'global' para que Jitsi no rompa la ejecución en el navegador
  },
})