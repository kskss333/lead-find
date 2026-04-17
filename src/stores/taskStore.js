// src/stores/taskStore.js
import { defineStore } from 'pinia'
import apiClient from '../services/api'

const TASKS_STORAGE_KEY = 'lead-find-tasks'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
    isApiEnabled: false, // 🔑 Главный флаг
  }),

  actions: {
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

    async fetchTasks() {
      if (this.isApiEnabled) {
        try {
          this.loading = true
          const response = await apiClient.get('/tasks')
          this.tasks = response.data
        } catch (error) {
          console.warn('⚠️ API fetch failed, fallback to localStorage')
          this.hydrateFromStorage()
        } finally {
          this.loading = false
        }
      } else {
        this.hydrateFromStorage()
      }
    },

    async createTask(taskData) {
      if (this.isApiEnabled) {
        try {
          const response = await apiClient.post('/tasks', taskData)
          this.tasks.push(response.data)
          this.saveToStorage()
          return response.data
        } catch (error) {
          console.warn('⚠️ API create failed, saving to localStorage')
          const keywordsStr = Array.isArray(taskData.keywords) ? taskData.keywords.join(', ') : taskData.keywords || ''
          const newTask = {
            id: Date.now() + Math.random(),
            status: true,
            ...taskData,
            keywords: keywordsStr,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          this.tasks.push(newTask)
          this.saveToStorage()
          return newTask
        }
      } else {
        const keywordsStr = Array.isArray(taskData.keywords) ? taskData.keywords.join(', ') : taskData.keywords || ''
        const newTask = {
          id: Date.now() + Math.random(),
          status: true,
          ...taskData,
          keywords: keywordsStr,
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
          const response = await apiClient.patch(`/tasks/${id}`, taskData)
          const index = this.tasks.findIndex(t => t.id === id)
          if (index !== -1) this.tasks[index] = response.data
          this.saveToStorage()
        } catch (error) {
          console.warn('⚠️ API update failed, updating localStorage')
          const index = this.tasks.findIndex(t => t.id === id)
          if (index !== -1) {
            const keywordsStr = Array.isArray(taskData.keywords) ? taskData.keywords.join(', ') : taskData.keywords || ''
            this.tasks[index] = {
              ...this.tasks[index],
              ...taskData,
              keywords: keywordsStr,
              updatedAt: new Date().toISOString(),
            }
            this.saveToStorage()
          }
        }
      } else {
        const index = this.tasks.findIndex(t => t.id === id)
        if (index !== -1) {
          const keywordsStr = Array.isArray(taskData.keywords) ? taskData.keywords.join(', ') : taskData.keywords || ''
          this.tasks[index] = {
            ...this.tasks[index],
            ...taskData,
            keywords: keywordsStr,
            updatedAt: new Date().toISOString(),
          }
          this.saveToStorage()
        }
      }
    },

    async deleteTask(id) {
      if (this.isApiEnabled) {
        try {
          await apiClient.delete(`/tasks/${id}`)
          this.tasks = this.tasks.filter(t => t.id !== id)
          this.saveToStorage()
        } catch (error) {
          console.warn('⚠️ API delete failed, deleting from localStorage')
          this.tasks = this.tasks.filter(t => t.id !== id)
          this.saveToStorage()
        }
      } else {
        this.tasks = this.tasks.filter(t => t.id !== id)
        this.saveToStorage()
      }
    },

    async duplicateTask(originalId) {
      if (this.isApiEnabled) {
        try {
          const original = this.tasks.find(t => t.id === originalId)
          if (!original) throw new Error('Original not found')
          const keywordsArray = original.keywords.split(/[,\s]+/).map(k => k.trim()).filter(Boolean)
          const newTaskData = {
            ...original,
            id: undefined,
            keywords: keywordsArray,
          }
          const response = await apiClient.post('/tasks', newTaskData)
          const index = this.tasks.findIndex(t => t.id === originalId)
          if (index !== -1) {
            this.tasks.splice(index + 1, 0, response.data)
          } else {
            this.tasks.push(response.data)
          }
          this.saveToStorage()
          return response.data
        } catch (error) {
          console.warn('⚠️ API duplicate failed, duplicating locally')
          const originalIndex = this.tasks.findIndex(t => t.id === originalId)
          if (originalIndex === -1) return
          const originalTask = this.tasks[originalIndex]
          const newTask = {
            ...originalTask,
            id: Date.now() + Math.random(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          this.tasks.splice(originalIndex + 1, 0, newTask)
          this.saveToStorage()
          return newTask
        }
      } else {
        const originalIndex = this.tasks.findIndex(t => t.id === originalId)
        if (originalIndex === -1) return
        const originalTask = this.tasks[originalIndex]
        const newTask = {
          ...originalTask,
          id: Date.now() + Math.random(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        this.tasks.splice(originalIndex + 1, 0, newTask)
        this.saveToStorage()
        return newTask
      }
    },

    enableApi(enabled) {
      this.isApiEnabled = enabled
    },
  },
})