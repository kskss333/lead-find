<template>
  <div class="task-list">
    <div v-if="loading" class="loading-state">
      <p>Загружаем ваши задания...</p>
    </div>

    <EmptyState v-else-if="tasks.length === 0" />

    <div v-else class="tasks-grid">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @edit="onEdit"
        @delete="onDelete"
        @duplicate="onDuplicate"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import TaskCard from './TaskCard.vue'
import EmptyState from '../shared/EmptyState.vue'

const taskStore = useTaskStore()

// Загружаем задачи при монтировании
onMounted(async () => {
  if (taskStore.tasks.length === 0) { // Загружаем только если список пуст
    try {
      await taskStore.fetchTasks()
    } catch (error) {
      console.error('Ошибка при загрузке заданий:', error)
      // Можно добавить уведомление пользователю
    }
  }
})

const { tasks, loading } = taskStore

// Заглушка для действий — пока просто лог
const onEdit = (task) => {
  console.log('Редактировать задание', task.id)
  // TODO: Открыть форму редактирования
}

const onDelete = async (task) => {
  if (confirm(`Удалить задание "${task.description.substring(0, 30)}..."?`)) {
    try {
      await taskStore.deleteTask(task.id)
    } catch (error) {
      console.error('Ошибка при удалении задания:', error)
      alert('Не удалось удалить задание. Попробуйте позже.')
    }
  }
}

const onDuplicate = (task) => {
  console.log('Дублировать задание', task.id)
  // TODO: Открыть форму с предзаполненными данными
}
</script>

<style scoped>
.task-list {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--tg-hint-color, #8c8c8c);
  font-size: 16px;
}

.tasks-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>