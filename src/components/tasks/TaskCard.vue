<template>
  <div class="task-card">
    <!-- Описание -->
    <div class="card-description">
      {{ task.description || '—' }}
    </div>
    <!-- Регион -->
    <div class="card-meta">
      <img src="@/assets/icons/marker.svg" class="meta-icon" alt="Регион" />
      <span class="meta-text">{{ task.region || '—' }}</span>
    </div>
    <!-- Теги -->
    <div class="card-meta">
      <img src="@/assets/icons/tags.svg" class="meta-icon" alt="Теги" />
      <span class="meta-text">Теги: {{ task.keywords || '—' }}</span>
    </div>
    <!-- Найдено -->
    <div class="card-stats">
      <span class="stat-number">{{ task.foundLeads || 0 }}</span>
      <span class="stat-text">Найдено:</span>
    </div>
    <!-- Иконки -->
    <div class="card-actions">
      <button class="action-btn" title="Воспроизвести" @click.stop="showToggleStatusModal = true">
        <img
          :src="statusIconPath"
          class="action-icon"
          alt="Статус"
          @error="(e) => console.error('Ошибка иконки:', statusIconPath)"
        />
      </button>
      <button class="action-btn" title="Редактировать" @click.stop="showEdit = true">
        <img src="@/assets/icons/pencil.svg" class="action-icon" alt="Редактировать" />
      </button>
      <button class="action-btn" title="Копировать" @click.stop="duplicate">
        <img src="@/assets/icons/copy-alt.svg" class="action-icon" alt="Копировать" />
      </button>
      <button class="action-btn" title="Удалить" @click.stop="showConfirm = true">
        <img src="@/assets/icons/trash.svg" class="action-icon" alt="Удалить" />
      </button>
    </div>
  </div>
  <!-- Модалка подтверждения смены статуса -->
  <Teleport to="body" v-if="showToggleStatusModal">
    <div class="modal-overlay" @click="showToggleStatusModal = false">
      <div class="modal-content" @click.stop>
        <h3>{{ toggleStatusTitle }}</h3>
        <p>{{ toggleStatusMessage }}</p>
        <div class="modal-buttons">
          <button @click="showToggleStatusModal = false" class="btn-secondary">Отмена</button>
          <button @click="confirmToggleStatus" class="btn-primary">Да</button>
        </div>
      </div>
    </div>
  </Teleport>
  <!-- Модалка подтверждения удаления -->
  <Teleport to="body" v-if="showConfirm">
    <div class="modal-overlay" @click="showConfirm = false">
      <div class="modal-content" @click.stop>
        <h3>Удалить задание?</h3>
        <p>Вы уверены?</p>
        <div class="modal-buttons">
          <button @click="showConfirm = false" class="btn-secondary">Отмена</button>
          <button @click="remove" class="btn-primary">Удалить</button>
        </div>
      </div>
    </div>
  </Teleport>
  <!-- Модалка редактирования -->
  <Teleport to="body" v-if="showEdit">
    <div class="modal-overlay" @click="showEdit = false">
      <div class="modal-content" @click.stop>
        <h3>Редактировать задание</h3>
        <div class="input-group">
          <label class="input-label">Описание</label>
          <textarea v-model="localTask.description" class="input-field"></textarea>
        </div>
        <div class="input-group">
          <label class="input-label">Регион</label>
          <input v-model="localTask.region" class="input-field" />
        </div>
        <div class="input-group">
          <label class="input-label">Ключевые слова</label>
          <input v-model="localTask.keywords" class="input-field" />
        </div>
        <div class="modal-buttons">
          <button @click="showEdit = false" class="btn-secondary">Отмена</button>
          <button @click="saveEdit" class="btn-primary">Сохранить</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['delete'])
const taskStore = useTaskStore()
const showConfirm = ref(false)
const showEdit = ref(false)
const showToggleStatusModal = ref(false)
const localTask = reactive({ ...props.task })

// ✅ Вычисляем путь к иконке
const statusIconPath = computed(() => {
  return props.task.status ? '@/assets/icons/pause-circle.svg' : '@/assets/icons/play-button.png'
})

// Заголовок и текст для модалки смены статуса
const toggleStatusTitle = computed(() => {
  return props.task.status ? 'Приостановить задание?' : 'Возобновить задание?'
})
const toggleStatusMessage = computed(() => {
  return `Вы уверены, что хотите ${props.task.status ? 'приостановить' : 'возобновить'} задание?`
})
const remove = () => {
  taskStore.deleteTask(props.task.id)
  showConfirm.value = false
}
const toggleStatus = () => {
  console.log('Меняю статус с', props.task.status, 'на', !props.task.status)
  taskStore.updateTask(props.task.id, { status: !props.task.status })
}
const confirmToggleStatus = () => {
  toggleStatus()
  showToggleStatusModal.value = false
}
const duplicate = () => {
  taskStore.duplicateTask(props.task.id)
}
const saveEdit = () => {
  taskStore.updateTask(props.task.id, localTask)
  showEdit.value = false
}
</script>

<style scoped>
/* (стили как в предыдущем файле) */
.task-card {
  background-color: var(--tg-section-bg-color, #1e1e1e);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid var(--tg-hint-color, #333);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: var(--tg-link-color, #2487e7);
}
.card-description {
  font-size: 16px;
  font-weight: 700;
  color: var(--tg-text-color, #ffffff);
  line-height: 1.5;
  word-break: break-word;
}
.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--tg-text-color, #ffffff);
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
  color: var(--tg-link-color, #2487e7);
}
.stat-text {
  color: var(--tg-hint-color, #8c8c8c);
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
  background-color: var(--tg-section-bg-color, #1e1e1e);
  border: 1px solid var(--tg-hint-color, #333);
  cursor: pointer;
  transition: all 0.2s ease;
}
.action-btn:hover {
  background-color: var(--tg-secondary-bg-color, #2a2a2a);
  border-color: var(--tg-link-color, #2487e7);
}
.action-icon {
  width: 18px;
  height: 18px;
}
/* Модалка */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}
.modal-content {
  background: var(--tg-bg-color, #1e1e1e);
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--tg-text-color, #ffffff);
}
.input-field {
  background: var(--tg-bg-color, #1e1e1e);
  border: 1px solid var(--tg-hint-color, #333);
  border-radius: 12px;
  padding: 12px 16px;
  color: var(--tg-text-color, #ffffff);
  font-size: 14px;
}
.input-field:focus {
  outline: none;
  border-color: var(--tg-link-color, #2487e7);
}
.modal-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  font-size: 16px;
  transition: background 0.2s ease;
}
.btn-primary {
  background: var(--tg-button-color, #2487e7);
  color: var(--tg-button-text-color, #ffffff);
}
.btn-primary:hover {
  background: #1a75d6;
}
.btn-secondary {
  background: transparent;
  color: var(--tg-text-color, #ffffff);
  border: 1px solid var(--tg-hint-color, #333);
}
.btn-secondary:hover {
  background: var(--tg-secondary-bg-color, #2a2a2a);
}
</style>