<template>
  <div class="task-list">
    <div v-if="loading" class="loading-state">
      <p>Загружаем ваши задания...</p>
    </div>

    <EmptyState v-else-if="tasks.length === 0" @create-first="$emit('switchToNew')" />

    <TransitionGroup
      v-else
      name="task-list"
      tag="ul"
      class="tasks-grid"
    >
      <li :key="`wrapper-${task.id}`" v-for="task in tasks" class="task-item">
        <TaskCard
          :task="task"
          @edit="onEdit"
          @delete="onDelete"
          @duplicate="onDuplicate"
        />
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import TaskCard from './TaskCard.vue'
import EmptyState from '../shared/EmptyState.vue'

const taskStore = useTaskStore()

onMounted(() => {
  taskStore.fetchTasks()
})

const tasks = computed(() => taskStore.tasks)
const loading = computed(() => taskStore.loading)

defineEmits(['switchToNew'])

const onEdit = (task) => {
  console.log('Редактировать задание', task.id)
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
  taskStore.duplicateTask(task.id)
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
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: block;
}

.task-list-move,
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.3s ease;
}

.task-list-enter-from {
  opacity: 0;
  transform: scale(0.9) translateX(20px);
}

.task-list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateX(-20px);
}

.task-list-leave-active {
  position: absolute;
  width: 100%;
}
</style>