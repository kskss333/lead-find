// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/css/globals.css'
import './assets/css/telegram-theme.css'

// ✅ Импортируем SDK — init() вызывается автоматически
import '@twa-dev/sdk'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')