import { defineConfig } from 'vite';

// Configuración de Vite para Fronteras Jurídicas.
export default defineConfig({
  // Permite publicar en Netlify y utilizar rutas relativas.
  base: './',

  build: {
    // Mantiene el límite de advertencia original.
    chunkSizeWarningLimit: 1600,

    // Configuración compatible con Vite 8 y Rolldown.
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'phaser',
              test: /node_modules[\\/]phaser[\\/]/,
            },
            {
              name: 'supabase',
              test: /node_modules[\\/]@supabase[\\/]supabase-js[\\/]/,
            },
          ],
        },
      },
    },
  },

  // Conserva la configuración del servidor local.
  server: {
    host: true,
    port: 5173,
  },
});