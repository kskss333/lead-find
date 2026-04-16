// src/stores/taskStore.js
import { defineStore } from 'pinia'
import apiClient from '../services/api' // ✅ Импортируем apiClient

const TASKS_STORAGE_KEY = 'lead-find-tasks'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
    // ✅ Добавляем флаг для выбора источника данных
    isApiEnabled: false, // По умолчанию используем localStorage
  }),

  actions: {
    // --- Старые методы для работы с localStorage ---
    hydrateFromStorage() {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY)
      if (stored) {
        try {
          this.tasks = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse tasks from localStorage', e)
          this.tasks = []
        }
      }
    },

    saveToStorage() {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(this.tasks))
    },

    // --- Новые методы для работы с API ---
    // fetchTasksFromApi
    async fetchTasksFromApi() {
      this.loading = true
      this.error = null
      try {
        const response = await apiClient.get('/tasks')
        // API возвращает keywords как массив, но мы хотим, чтобы в store он был строкой (для совместимости с localStorage)
        // Если в будущем localStorage уйдёт, можно хранить как массив.
        // Пока оставим как есть, так как TaskCard ожидает строку.
        // В ТЗ API: keywords: string[], но UI ожидает строку. Будем считать, что API возвращает строку.
        // Если API вернёт массив, строка ниже раскомментируется.
        // keywords: Array.isArray(task.keywords) ? task.keywords.join(', ') : task.keywords,
        this.tasks = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch tasks from API'
        console.error('API Fetch Error:', this.error)
        throw error // Пробрасываем ошибку, чтобы вызывающий код мог решить, использовать ли fallback
      } finally {
        this.loading = false
      }
    },

    // createTaskViaApi
    async createTaskViaApi(taskData) {
      this.loading = true
      this.error = null
      try {
        // taskData.keywords уже должен быть массивом, если правильно пришёл из TaskForm.vue
        const response = await apiClient.post('/tasks', taskData)
        // API возвращает созданный объект. keywords в ответе от API должен быть массивом.
        // Но для совместимости с localStorage и UI, сохраним как строку.
        const taskToStore = {
          ...response.data,
          keywords: Array.isArray(response.data.keywords) ? response.data.keywords.join(', ') : response.data.keywords
        }
        // Не добавляем в this.tasks здесь, это делает вызывающий метод в зависимости от источника
        return taskToStore
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create task via API'
        console.error('API Create Error:', this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // updateTaskViaApi
    async updateTaskViaApi(id, taskData) {
      this.loading = true
      this.error = null
      try {
        // taskData.keywords уже должен быть массивом, если правильно пришёл из EditTaskModal
        const response = await apiClient.patch(`/tasks/${id}`, taskData)
        // keywords в ответе от API должен быть массивом.
        // Но для совместимости с localStorage и UI, сохраним как строку.
        const taskToStore = {
          ...response.data,
          keywords: Array.isArray(response.data.keywords) ? response.data.keywords.join(', ') : response.data.keywords
        }
        // Не изменяем this.tasks здесь, это делает вызывающий метод
        return taskToStore
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update task via API'
        console.error('API Update Error:', this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // deleteTaskViaApi
    async deleteTaskViaApi(id) {
      this.loading = true
      this.error = null
      try {
        await apiClient.delete(`/tasks/${id}`)
        // Не удаляем из this.tasks здесь, это делает вызывающий метод
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete task via API'
        console.error('API Delete Error:', this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // duplicateTaskViaApi (для API дублирование обычно делается на бэкенде, но можно эмулировать)
    // Для простоты, будем дублировать локально и отправлять новый объект на создание через API
    async duplicateTaskViaApi(originalId) {
      const originalTask = this.tasks.find(t => t.id === originalId)
      if (!originalTask) {
        throw new Error('Original task not found for duplication via API')
      }

      // Подготовим объект для отправки, удалив id
      // keywords - преобразуем строку обратно в массив для отправки
      const keywordsArray = originalTask.keywords
        .split(/[,\s]+/)
        .map(k => k.trim())
        .filter(Boolean)

      const newTaskData = {
        ...originalTask,
        id: undefined, // Убираем id, чтобы бэкенд создал новый
        keywords: keywordsArray, // Отправляем как массив
        // createdAt и updatedAt пусть генерит бэкенд
      }

      // Создаём через API
      return await this.createTaskViaApi(newTaskData)
    },

    // --- Обновлённые публичные методы ---
    async fetchTasks() {
      if (this.isApiEnabled) {
        try {
          await this.fetchTasksFromApi()
        } catch (error) {
          // Если API не сработал, fallback на localStorage
          console.warn('API fetch failed, falling back to localStorage:', error.message)
          this.hydrateFromStorage()
        }
      } else {
        this.hydrateFromStorage()
      }
    },

    async createTask(taskData) {
      if (this.isApiEnabled) {
        try {
          const createdTask = await this.createTaskViaApi(taskData)
          // Добавляем в store после успешного API-ответа
          this.tasks.push(createdTask)
          // И сохраняем в localStorage на всякий случай (если нужен offline cache)
          this.saveToStorage()
          return createdTask
        } catch (error) {
          // Fallback: сохраняем в localStorage
          console.warn('API create failed, saving to localStorage:', error.message)
          // keywords: преобразуем массив в строку для localStorage
          const keywordsForStorage = Array.isArray(taskData.keywords) ? taskData.keywords.join(', ') : taskData.keywords || ''
          const newTask = {
            id: Date.now() + Math.random(),
            status: true,
            ...taskData,
            keywords: keywordsForStorage,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          this.tasks.push(newTask)
          this.saveToStorage()
          return newTask
        }
      } else {
        // Текущая логика localStorage
        const keywordsForStorage = Array.isArray(taskData.keywords) ? taskData.keywords.join(', ') : taskData.keywords || ''
        const newTask = {
          id: Date.now() + Math.random(),
          status: true,
          ...taskData,
          keywords: keywordsForStorage,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        this.tasks.push(newTask)
        this.saveToStorage()
        return newTask
      }
    },

    async updateTask(id, taskData) {
      if (this.isApiEnabled) {
        try {
          // keywords: если пришло как массив (из EditTaskModal), отправляем как массив
          const taskDataToSend = { ...taskData }
          if (Array.isArray(taskDataToSend.keywords)) {
            // Оставляем как массив для отправки в API
          } else if (typeof taskDataToSend.keywords === 'string') {
             // Если строка, разберём в массив для API, но это вряд ли
             // Скорее всего EditTaskModal отправит строку, которую мы потом в updateTask преобразуем
             // Лучше в EditTaskModal сразу формировать массив, если мы хотим отправлять его в API.
             // Но пока оставим так, и в updateTaskViaApi преобразуем строку в массив для отправки, если нужно.
             // Нет, лучше оставить как есть и позволить EditTaskModal отправлять массив.
             // Тогда строка ниже не нужна.
          }
          const updatedTask = await this.updateTaskViaApi(id, taskDataToSend)
          // Обновляем в store
          const index = this.tasks.findIndex(t => t.id === id)
          if (index !== -1) {
            this.tasks[index] = updatedTask
          }
          // И сохраняем в localStorage на всякий случай
          this.saveToStorage()
        } catch (error) {
          console.warn('API update failed, updating localStorage only:', error.message)
          // Обновляем только в localStorage
          const index = this.tasks.findIndex(t => t.id === id)
          if (index !== -1) {
            // keywords: если пришло как массив, преобразуем в строку для localStorage
            const updatedFields = { ...taskData }
            if (Array.isArray(updatedFields.keywords)) {
               updatedFields.keywords = updatedFields.keywords.join(', ')
            }
            this.tasks[index] = {
              ...this.tasks[index],
              ...updatedFields,
              updatedAt: new Date().toISOString()
            }
            this.saveToStorage()
          }
        }
      } else {
        // Текущая логика localStorage
        const index = this.tasks.findIndex(t => t.id === id)
        if (index !== -1) {
          // keywords: если пришло как массив, преобразуем в строку
          const updatedFields = { ...taskData }
          if (Array.isArray(updatedFields.keywords)) {
             updatedFields.keywords = updatedFields.keywords.join(', ')
          }
          this.tasks[index] = {
            ...this.tasks[index],
            ...updatedFields,
            updatedAt: new Date().toISOString()
          }
          this.saveToStorage()
        }
      }
    },

    async deleteTask(id) {
      if (this.isApiEnabled) {
        try {
          await this.deleteTaskViaApi(id)
          // Удаляем из store
          this.tasks = this.tasks.filter(t => t.id !== id)
          // И сохраняем в localStorage на всякий случай
          this.saveToStorage()
        } catch (error) {
          console.warn('API delete failed, deleting from localStorage only:', error.message)
          // Удаляем только из localStorage
          this.tasks = this.tasks.filter(t => t.id !== id)
          this.saveToStorage()
        }
      } else {
        // Текущая логика localStorage
        this.tasks = this.tasks.filter(t => t.id !== id)
        this.saveToStorage()
      }
    },

    async duplicateTask(originalId) {
      if (this.isApiEnabled) {
        try {
          const duplicatedTask = await this.duplicateTaskViaApi(originalId)
          // Вставляем после оригинала
          const originalIndex = this.tasks.findIndex(t => t.id === originalId)
          if (originalIndex !== -1) {
            this.tasks.splice(originalIndex + 1, 0, duplicatedTask)
          } else {
            // Если оригинала нет в списке (маловероятно), просто добавляем в конец
            this.tasks.push(duplicatedTask)
          }
          // И сохраняем в localStorage на всякий случай
          this.saveToStorage()
          return duplicatedTask
        } catch (error) {
          console.warn('API duplicate failed, duplicating in localStorage only:', error.message)
          // Fallback: дублируем в localStorage
          const originalIndex = this.tasks.findIndex(t => t.id === originalId)
          if (originalIndex === -1) return

          const originalTask = this.tasks[originalIndex]
          const newTask = {
            ...originalTask,
            id: Date.now() + Math.random(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          this.tasks.splice(originalIndex + 1, 0, newTask)
          this.saveToStorage()
          return newTask
        }
      } else {
        // Текущая логика localStorage
        const originalIndex = this.tasks.findIndex(t => t.id === originalId)
        if (originalIndex === -1) return

        const originalTask = this.tasks[originalIndex]
        const newTask = {
          ...originalTask,
          id: Date.now() + Math.random(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        this.tasks.splice(originalIndex + 1, 0, newTask)
        this.saveToStorage()
        return newTask
      }
    },

    // --- Action для включения/выключения API ---
    enableApi(enabled) {
      this.isApiEnabled = enabled
    }
  },
})