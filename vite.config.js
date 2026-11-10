import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Lee el puerto desde la variable de entorno PORT (usado por el panel de preview)
// o usa 5173 por defecto en desarrollo local
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT) || 5173,
    strictPort: false,
    proxy: {
      // Todo /api va al servidor, menos /api/lib/: ahí viven módulos que el
      // cliente importa (api/lib/meta-seo.js) y que Vite debe servir como código.
      '^/api/(?!lib/)': {
        target: process.env.VITE_API_TARGET || 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
})
