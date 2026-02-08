// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { initTelegram } from './services/telegram.js'

// Подключаем глобальные стили
import './assets/css/globals.css'
import './assets/css/telegram-theme.css'

const app = createApp(App)
const pinia = createPinia()

// Инициализируем Telegram SDK
initTelegram()

app.use(pinia)
app.mount('#app')