import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills' // Importamos el plugin nuevo

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills() // Esto inyecta las funciones de Node.js que necesita el PDF
  ],
  define: {
    // Aseguramos que 'global' apunte a la ventana del navegador
    global: 'window',
  },
})