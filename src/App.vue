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
import { applyTelegramTheme } from './services/telegram'

const authStore = useAuthStore()
const taskStore = useTaskStore()

onMounted(() => {
  applyTelegramTheme()

  if (authStore.token) {
    taskStore.enableApi(true)
    taskStore.fetchTasks().catch(console.error)
  } else {
    taskStore.enableApi(false)
    taskStore.fetchTasks().catch(console.error)
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