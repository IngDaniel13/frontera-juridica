import { defineConfig } from 'vite';

// Configuración de Vite. "base: './'" permite publicar en Netlify o abrir la carpeta dist desde cualquier ruta.
export default defineConfig({
  base: './',
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Phaser y Supabase se separan para que la pantalla inicial cargue rápido.
        manualChunks: {
          phaser: ['phaser'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  },
  server: { host: true, port: 5173 }
});
