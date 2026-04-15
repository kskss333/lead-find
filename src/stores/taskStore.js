// src/stores/taskStore.js
import { defineStore } from 'pinia'
// Импортируем apiClient, но пока не используем
// import apiClient from '../services/api'

const TASKS_STORAGE_KEY = 'lead-find-tasks'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [], // Инициализируется пустым, но потом загрузится
    loading: false,
    error: null,
    // Флаг для определения, использовать ли API или localStorage
    // Пока false, можно будет включить позже
    useApi: false,
  }),

  actions: {
    // --- Методы для работы с localStorage ---
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

    // --- Методы для работы с API (заготовка) ---
    // async fetchTasksFromApi() {
    //   this.loading = true
    //   this.error = null
    //   try {
    //     const response = await apiClient.get('/tasks')
    //     this.tasks = response.data
    //   } catch (error) {
    //     this.error = error.response?.data?.message || 'Failed to fetch tasks'
    //     throw error
    //   } finally {
    //     this.loading = false
    //   }
    // },

    // async createTaskViaApi(taskData) {
    //   this.loading = true
    //   this.error = null
    //   try {
    //     const response = await apiClient.post('/tasks', taskData)
    //     this.tasks.push(response.data)
    //     return response.data
    //   } catch (error) {
    //     this.error = error.response?.data?.message || 'Failed to create task via API'
    //     throw error
    //   } finally {
    //     this.loading = false
    //   }
    // },

    // --- Обновлённые методы, которые работают с форматом ТЗ ---
    async fetchTasks() {
      // Пока используем localStorage
      this.hydrateFromStorage()
      // Если useApi станет true, можно будет вызвать fetchTasksFromApi()
      // if (this.useApi) {
      //   await this.fetchTasksFromApi()
      // } else {
      //   this.hydrateFromStorage()
      // }
    },

    async createTask(taskData) {
      this.loading = true
      this.error = null
      try {
        // --- Обработка данных в соответствии с ТЗ ---
        // keywords: string[] -> сохраняем как строку для localStorage
        const keywordsAsString = Array.isArray(taskData.keywords) ? taskData.keywords.join(', ') : taskData.keywords || '';
        // city: string (опционально)
        const city = taskData.city;

        // --- Создание объекта задачи ---
        const newTask = {
          id: Date.now() + Math.random(),
          status: true, // ✅ По умолчанию активен
          // Сохраняем city отдельным полем
          city: city,
          // Сохраняем keywords как строку
          keywords: keywordsAsString,
          // Остальные поля
          ...taskData,
          // Перезаписываем keywords, чтобы не сохранялся массив
          keywords: keywordsAsString,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Пока сохраняем в localStorage
        this.tasks.push(newTask)
        this.saveToStorage()
        return newTask

        // Если useApi станет true:
        // if (this.useApi) {
        //   return await this.createTaskViaApi(taskData)
        // } else {
        //   this.tasks.push(newTask)
        //   this.saveToStorage()
        //   return newTask
        // }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create task'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTask(id, taskData) {
      try {
        const index = this.tasks.findIndex(t => t.id === id)
        if (index !== -1) {
          // --- Обработка обновляемых данных в соответствии с ТЗ ---
          const updatedFields = { ...taskData };

          // Если передан keywords как массив, сохраняем как строку
          if (Array.isArray(updatedFields.keywords)) {
            updatedFields.keywords = updatedFields.keywords.join(', ');
          }

          this.tasks[index] = {
            ...this.tasks[index],
            ...updatedFields,
            updatedAt: new Date().toISOString()
          }
          this.saveToStorage()
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update task'
        throw error
      }
    },

    async deleteTask(id) {
      try {
        const index = this.tasks.findIndex(t => t.id === id)
        if (index !== -1) {
          this.tasks.splice(index, 1)
        }
        this.saveToStorage()
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete task'
        throw error
      }
    },

    // ✅ Новый метод дублирования (также обновлён для поддержки новых полей)
    async duplicateTask(originalId) {
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
})