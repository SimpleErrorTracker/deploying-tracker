import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  base: '/',
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vendor'
            }
            if (id.includes('@supabase')) {
              return 'supabase'
            }
            if (id.includes('chart.js') || id.includes('vue-chartjs')) {
              return 'charts'
            }
            if (id.includes('lucide-vue-next')) {
              return 'icons'
            }
            // всё остальное из node_modules — в общий vendor
            return 'vendor'
          }
        },
      },
    },
  },
})
