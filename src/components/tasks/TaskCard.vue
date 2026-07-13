<template>
  <div class="task-card">
    <div class="card-description">
      {{ task.description || '—' }}
    </div>
    <div class="card-meta">
      <img src="@/assets/icons/marker.svg" class="meta-icon" alt="Регион" />
      <span class="meta-text">{{ task.region || '—' }}</span>
    </div>
    <div class="card-meta">
      <img src="@/assets/icons/tags.svg" class="meta-icon" alt="Теги" />
      <span class="meta-text">Теги: {{ task.keywords || '—' }}</span>
    </div>
    <div class="card-stats">
      <span class="stat-text">Найдено:</span>
      <span class="stat-number">{{ task.foundLeads || 0 }}</span>
    </div>

    <div class="card-actions">
      <button class="action-btn" title="Изменить статус" @click="showStatusModal = true">
        <img :src="statusIcon" class="action-icon" alt="Статус" />
      </button>
      <button class="action-btn" title="Редактировать" @click="openEditModal">
        <img src="@/assets/icons/pencil.svg" class="action-icon" alt="Редактировать" />
      </button>
      <button class="action-btn" title="Копировать" @click="duplicate">
        <img src="@/assets/icons/copy-alt.svg" class="action-icon" alt="Копировать" />
      </button>
      <button class="action-btn" title="Удалить" @click="showDeleteModal = true">
        <img src="@/assets/icons/trash.svg" class="action-icon" alt="Удалить" />
      </button>
    </div>

    <ConfirmModal
      v-if="showDeleteModal"
      title="Удалить задание?"
      message="Вы уверены, что хотите удалить это задание?"
      confirm-label="Удалить"
      @confirm="removeTask"
      @cancel="showDeleteModal = false"
    />

    <ConfirmModal
      v-if="showStatusModal"
      :title="statusModalTitle"
      :message="statusModalMessage"
      confirm-label="Да"
      @confirm="toggleStatus"
      @cancel="showStatusModal = false"
    />

    <EditModal
      v-if="showEditModal"
      :task="task"
      @save="saveEdit"
      @close="showEditModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import ConfirmModal from '../modals/ConfirmModal.vue'
import EditModal from '../modals/EditModal.vue'
import pauseCircleIcon from '@/assets/icons/pause-circle.svg'
import playCircleIcon from '@/assets/icons/play-circle.svg'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const taskStore = useTaskStore()
const showDeleteModal = ref(false)
const showStatusModal = ref(false)
const showEditModal = ref(false)

const statusIcon = computed(() => {
  return props.task.status ? pauseCircleIcon : playCircleIcon
})

const statusModalTitle = computed(() => {
  return props.task.status ? 'Приостановить задание?' : 'Возобновить задание?'
})

const statusModalMessage = computed(() => {
  return `Вы уверены, что хотите ${props.task.status ? 'приостановить' : 'возобновить'} задание?`
})

const removeTask = () => {
  taskStore.deleteTask(props.task.id)
  showDeleteModal.value = false
}

const toggleStatus = () => {
  taskStore.updateTask(props.task.id, { status: !props.task.status })
  showStatusModal.value = false
}

const duplicate = () => {
  taskStore.duplicateTask(props.task.id)
}

const openEditModal = () => {
  showEditModal.value = true
}

const saveEdit = (updatedData) => {
  taskStore.updateTask(props.task.id, updatedData)
  showEditModal.value = false
}
</script>

<style scoped>
.task-card {
  background-color: var(--tg-section-bg-color);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid var(--tg-hint-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: var(--tg-link-color);
}

.card-description {
  font-size: 16px;
  font-weight: 700;
  color: var(--tg-text-color);
  line-height: 1.5;
  word-break: break-word;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--tg-text-color);
}

.meta-icon {
  width: 16px;
  height: 16px;
}

.meta-text {
  flex: 1;
}

.card-stats {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.stat-number {
  font-size: 14px;
  font-weight: 700;
  color: var(--tg-link-color);
}

.stat-text {
  color: var(--tg-hint-color);
  font-weight: 500;
}

.card-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--tg-section-bg-color);
  border: 1px solid var(--tg-hint-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--tg-secondary-bg-color);
  border-color: var(--tg-link-color);
}

.action-icon {
  width: 18px;
  height: 18px;
}
</style>