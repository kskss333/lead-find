import { defineStore } from 'pinia'
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
    async login(initData) {
      if (!initData) {
        throw new Error('No initData provided')
      }

      this.isLoading = true
      this.error = null

      try {
        const response = await fetch('https://api.integralab.team/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Auth failed' }))
          throw new Error(errorData.message || 'Login failed')
        }

        const data = await response.json()
        this.token = data.token
        localStorage.setItem('authToken', this.token)

        const taskStore = useTaskStore()
        taskStore.enableApi(true)
      } catch (error) {
        this.error = error.message || 'Login failed'
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