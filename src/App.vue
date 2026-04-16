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

const authStore = useAuthStore();
const taskStore = useTaskStore();

onMounted(async () => {
  // Проверяем, есть ли токен в localStorage
  if (authStore.token) {
    // Если токен есть, считаем, что пользователь уже авторизован
    // Включаем API в taskStore
    taskStore.enableApi(true);
    // Подгружаем задачи с API
    await taskStore.fetchTasks();
  } else {
    // Если токена нет, пробуем авторизоваться
    // Получаем initData из Telegram SDK (window.Telegram.WebApp)
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initData) {
      try {
        // Вызываем login, передав initData
        await authStore.login(tg.initData);
        // После успешного логина, API уже включён в authStore
        // Подгружаем задачи с API
        await taskStore.fetchTasks();
      } catch (error) {
        console.error('Auto-login failed:', error);
        // Оставляем в состоянии без API или показать ошибку пользователю
        // authStore.error содержит ошибку
      }
    } else {
      // SDK не доступен или initData нет (режим разработки в браузере)
      // authStore.login() может использовать фейковый initData в dev режиме
      try {
        await authStore.login(); // Это вызовет getFakeInitData в dev режиме
        taskStore.enableApi(true);
        await taskStore.fetchTasks();
      } catch (error) {
        console.error('Auto-login failed (no SDK/initData):', error);
      }
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