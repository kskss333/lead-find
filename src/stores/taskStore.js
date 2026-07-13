import { defineStore } from 'pinia'
import apiClient from '../services/api'

const TASKS_STORAGE_KEY = 'lead-find-tasks'

const normalizeKeywords = (value) => {
  if (!value) return ''
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

const parseKeywords = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value
  return value.split(/[,\s]+/).map(k => k.trim()).filter(Boolean)
}

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
    isApiEnabled: false,
  }),

  actions: {
    hydrateFromStorage() {
      try {
        const stored = localStorage.getItem(TASKS_STORAGE_KEY)
        if (stored) {
          this.tasks = JSON.parse(stored)
        }
      } catch {
        this.tasks = []
      }
    },

    saveToStorage() {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(this.tasks))
    },

    async fetchTasks() {
      if (!this.isApiEnabled) {
        this.hydrateFromStorage()
        return
      }

      this.loading = true
      try {
        const response = await apiClient.get('/tasks')
        this.tasks = response.data
      } catch {
        this.hydrateFromStorage()
      } finally {
        this.loading = false
      }
    },

    async createTask(taskData) {
      const payload = {
        ...taskData,
        keywords: parseKeywords(taskData.keywords)
      }

      if (this.isApiEnabled) {
        try {
          const response = await apiClient.post('/tasks', payload)
          this.tasks.push(response.data)
          this.saveToStorage()
          return response.data
        } catch {
          return this._createLocalTask(payload)
        }
      }

      return this._createLocalTask(payload)
    },

    async updateTask(id, taskData) {
      const payload = {
        ...taskData,
        keywords: parseKeywords(taskData.keywords)
      }

      if (this.isApiEnabled) {
        try {
          const response = await apiClient.patch(`/tasks/${id}`, payload)
          const index = this.tasks.findIndex(t => t.id === id)
          if (index !== -1) this.tasks[index] = response.data
          this.saveToStorage()
          return
        } catch {
        }
      }

      const index = this.tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        this.tasks[index] = {
          ...this.tasks[index],
          ...payload,
          keywords: normalizeKeywords(payload.keywords),
          updatedAt: new Date().toISOString()
        }
        this.saveToStorage()
      }
    },

    async deleteTask(id) {
      if (this.isApiEnabled) {
        try {
          await apiClient.delete(`/tasks/${id}`)
        } catch {
        }
      }

      this.tasks = this.tasks.filter(t => t.id !== id)
      this.saveToStorage()
    },

    async duplicateTask(originalId) {
      const original = this.tasks.find(t => t.id === originalId)
      if (!original) return

      const payload = {
        ...original,
        id: undefined,
        keywords: parseKeywords(original.keywords)
      }

      if (this.isApiEnabled) {
        try {
          const response = await apiClient.post('/tasks', payload)
          const index = this.tasks.findIndex(t => t.id === originalId)
          if (index !== -1) {
            this.tasks.splice(index + 1, 0, response.data)
          } else {
            this.tasks.push(response.data)
          }
          this.saveToStorage()
          return response.data
        } catch {
        }
      }

      const newTask = {
        ...original,
        id: Date.now() + Math.random(),
        keywords: normalizeKeywords(original.keywords),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const index = this.tasks.findIndex(t => t.id === originalId)
      if (index !== -1) {
        this.tasks.splice(index + 1, 0, newTask)
      } else {
        this.tasks.push(newTask)
      }
      this.saveToStorage()
      return newTask
    },

    enableApi(enabled) {
      this.isApiEnabled = enabled
    },

    _createLocalTask(payload) {
      const newTask = {
        id: Date.now() + Math.random(),
        status: true,
        ...payload,
        keywords: normalizeKeywords(payload.keywords),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      this.tasks.push(newTask)
      this.saveToStorage()
      return newTask
    }
  }
})