import axios from 'axios'

const API_BASE_URL = 'https://api.integralab.team/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  if (!config.url.includes('/auth')) {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

export default apiClient