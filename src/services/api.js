// src/services/api.js
import axios from 'axios'

// Используем реальный API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.attractor.fun/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Interceptor для добавления токена
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message)
    return Promise.reject(error)
  }
)

export default apiClient