<template>
  <div v-if="authStore.isLoading" class="loading-screen">
    <p>Входим в приложение...</p>
  </div>
  <HomeView v-else />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'
import { useTaskStore } from './stores/taskStore'
import HomeView from './views/HomeView.vue'
import { initTelegram } from './services/telegram'

const authStore = useAuthStore()
const taskStore = useTaskStore()

onMounted(async () => {
  // ✅ Инициализируем Telegram SDK (применит тему, эмулирует в браузере)
  initTelegram()

  // Проверяем, есть ли токен в localStorage
  if (authStore.token) {
    console.log('✅ Токен найден в localStorage')
    taskStore.enableApi(true)
    await taskStore.fetchTasks()
  } else {
    // Если токена нет, пробуем авторизоваться
    const tg = window.Telegram?.WebApp
    if (tg && tg.initData) {
      console.log('✅ initData получен:', tg.initData.substring(0, 50) + '...')
      try {
        await authStore.login(tg.initData)
        taskStore.enableApi(true)
        await taskStore.fetchTasks()
      } catch (error) {
        console.error('❌ Ошибка авторизации:', error)
        // В dev-режиме попробуем фейк
        if (import.meta.env.MODE === 'development') {
          try {
            await authStore.login()
            taskStore.enableApi(true)
            await taskStore.fetchTasks()
          } catch (e) {
            console.error('❌ Фейковая авторизация тоже не удалась:', e)
          }
        }
      }
    } else {
      console.warn('❌ initData не получен. Работаем в режиме localStorage.')
      // В браузере — используем localStorage
      taskStore.enableApi(false)
      await taskStore.fetchTasks()
    }
  }
})
</script>

<style scoped>
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 16px;
  color: var(--tg-text-color, #000);
}
</style>