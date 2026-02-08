// src/stores/taskStore.js
import { defineStore } from 'pinia'
import apiClient from '../services/api'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchTasks() {
      this.loading = true
      this.error = null
      try {
        const response = await apiClient.get('/tasks')
        this.tasks = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch tasks'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTask(taskData) {
      this.loading = true
      this.error = null
      try {
        const response = await apiClient.post('/tasks', taskData)
        this.tasks.push(response.data) // Добавляем новое задание в локальный список
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create task'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTask(id, taskData) {
      // Реализация PUT запроса для обновления задания
      try {
        const response = await apiClient.put(`/tasks/${id}`, taskData)
        const index = this.tasks.findIndex(t => t.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update task'
        throw error
      }
    },

    async deleteTask(id) {
      // Реализация DELETE запроса
      try {
        await apiClient.delete(`/tasks/${id}`)
        this.tasks = this.tasks.filter(t => t.id !== id)
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete task'
        throw error
      }
    }
  },
})