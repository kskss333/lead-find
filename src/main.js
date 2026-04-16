// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/css/globals.css'
import './assets/css/telegram-theme.css'

// ✅ Импортируем SDK (init вызывается автоматически)
// import { init } from '@twa-dev/sdk'
// init() // ❌ Не нужно вызывать вручную в v8+

// Импортируем stores (только для типизации, не вызываем actions)
// const app = createApp(App)
const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.mount('#app')