import { defineStore } from 'pinia'
import apiClient from '../services/api'
import { useTaskStore } from './taskStore'

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
      if (!initData) {
        throw new Error('No initData provided')
      }

      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.post('/auth', { initData })
        this.token = response.data.token
        localStorage.setItem('authToken', this.token)

        const taskStore = useTaskStore()
        taskStore.enableApi(true)
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
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