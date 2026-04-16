// src/services/api.js
import axios from 'axios'

// Используем /api как базовый путь — Vite проксирует его на https://api.attractor.fun
const apiClient = axios.create({
  baseURL: '/api', // ← Теперь не нужно указывать полный URL
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
  (error) => Promise.reject(error)
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