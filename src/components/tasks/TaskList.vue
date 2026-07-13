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
          @delete="onDelete"
          @duplicate="onDuplicate"
          @edit="onEdit"
        />
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import TaskCard from './TaskCard.vue'
import EmptyState from '../shared/EmptyState.vue'

const taskStore = useTaskStore()
const emit = defineEmits(['switchToNew'])

const tasks = computed(() => taskStore.tasks)
const loading = computed(() => taskStore.loading)

const onDelete = async (task) => {
  if (confirm(`Удалить задание "${task.description.substring(0, 30)}..."?`)) {
    await taskStore.deleteTask(task.id)
  }
}

const onDuplicate = (task) => {
  taskStore.duplicateTask(task.id)
}

const onEdit = (task) => {
  //внутри тасккард
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
  color: var(--tg-hint-color);
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