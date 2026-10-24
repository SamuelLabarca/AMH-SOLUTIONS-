import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Deja entrar por el tunel de Cloudflare (AMH-servidor-red.bat,
    // opcion "otra red"); sin esto Vite rechaza el dominio publico.
    allowedHosts: ['.trycloudflare.com'],
  },
  build: {
    rollupOptions: {
      output: {
        // React y el router en su propio archivo: cambian muy poco, así
        // el navegador los guarda en caché entre una publicación y otra.
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
