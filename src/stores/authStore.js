// src/stores/authStore.js
import { defineStore } from 'pinia'
import apiClient from '../services/api'

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
      this.isLoading = true
      this.error = null

      try {
        const response = await apiClient.post('/auth', { initData })
        this.token = response.data.token
        localStorage.setItem('authToken', this.token)
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        throw error // Пробросим ошибку наверх, чтобы компонент мог её обработать
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.token = null
      localStorage.removeItem('authToken')
    },
  },
})