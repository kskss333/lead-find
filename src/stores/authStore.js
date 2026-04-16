// src/stores/authStore.js
import { defineStore } from 'pinia'
import apiClient from '../services/api'
import { useTaskStore } from './taskStore' // Импортируем taskStore

// Функция для эмуляции initData в браузере (временно, для тестирования)
function getFakeInitData() {
  // Это пример фейкового initData для тестирования
  // В реальности это строка, закодированная Telegram
  // ЗАМЕНИТЬ НА РЕАЛЬНЫЙ initData ИЗ Telegram SDK
  return 'query_id=xxx&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Anastasia%22%2C%22last_name%22%3A%22Sorokina%22%2C%22username%22%3A%22anastasia%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1234567890&hash=xxx'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    // Обновляем login, чтобы он мог принимать initData или использовать фейк
    async login(initData = null) {
      // Если initData не передан, используем фейковый (только для разработки)
      if (!initData) {
        if (import.meta.env.MODE === 'development') {
          console.warn('Using fake initData for development.')
          initData = getFakeInitData()
        } else {
          throw new Error('No initData provided and not in development mode.')
        }
      }

      if (!initData) {
        throw new Error('No initData provided')
      }

      this.isLoading = true
      this.error = null

      try {
        // Отправляем на реальный эндпоинт /auth
        const response = await apiClient.post('/auth', { initData })
        this.token = response.data.token
        localStorage.setItem('authToken', this.token)

        // ✅ После успешного логина, включаем API в taskStore
        const taskStore = useTaskStore();
        taskStore.enableApi(true);

      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        console.error('Auth Error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.token = null
      localStorage.removeItem('authToken')
      // ✅ После выхода, отключаем API в taskStore
      const taskStore = useTaskStore();
      taskStore.enableApi(false);
    },
  },
})