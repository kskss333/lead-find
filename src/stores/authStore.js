// src/stores/authStore.js
import { defineStore } from 'pinia'
import apiClient from '../services/api'
import { useTaskStore } from './taskStore'
import { getFakeInitData } from '../services/telegram'

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
    async login(initData = null) {
      if (!initData && import.meta.env.MODE === 'development') {
        console.warn('🛠 Используем фейковый initData для разработки')
        initData = getFakeInitData()
      }

      if (!initData) {
        throw new Error('No initData provided')
      }

      this.isLoading = true
      this.error = null

      try {
        console.log('📡 Отправляем POST /auth...')
        const response = await apiClient.post('/auth', { initData })
        this.token = response.data.token
        localStorage.setItem('authToken', this.token)

        // ✅ После успешного логина — включаем API в taskStore
        const taskStore = useTaskStore()
        taskStore.enableApi(true)

        console.log('✅ Авторизация успешна. Token сохранён.')
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        console.error('❌ Ошибка авторизации:', this.error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.token = null
      localStorage.removeItem('authToken')
      const taskStore = useTaskStore()
      taskStore.enableApi(false)
    },
  },
})