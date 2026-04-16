// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5173,
    // ✅ Добавляем proxy для API
    proxy: {
      '/api': {
        target: 'https://api.attractor.fun',
        changeOrigin: true,
        secure: false, // разрешает HTTPS без проверки сертификата (для dev)
        rewrite: (path) => path.replace(/^\/api/, ''), // убираем /api перед отправкой
      },
    },
  },
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
    cors: true,
  },
})