// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/css/globals.css'
import './assets/css/telegram-theme.css'

// Импортируем store
import { useAuthStore } from './stores/authStore'

const app = createApp(App)
const pinia = createPinia()

// Инициализируем Telegram SDK (если доступен)
// import { init } from '@twa-dev/sdk'
// init() // <- Раскомментировать, когда пакет будет установлен

// Попробуем получить initData и авторизоваться при запуске
// (это можно вынести в App.vue или HomeView.vue, если нужно)
const tg = window.Telegram?.WebApp
if (tg) {
  console.info('Telegram WebApp SDK detected.')
  tg.ready()
  tg.expand()
  // Здесь можно получить initData
  const initData = tg.initData
  // И вызвать авторизацию
  // const authStore = useAuthStore();
  // authStore.login(initData).catch(err => console.error('Auto-login failed:', err));
} else {
  console.info('Telegram WebApp SDK not available. Running in browser mode.')
  // Если SDK нет, можно вызвать login с фейковым initData (в dev режиме)
  // const authStore = useAuthStore();
  // authStore.login().catch(err => console.error('Auto-login failed:', err));
}

app.use(pinia)
app.mount('#app')