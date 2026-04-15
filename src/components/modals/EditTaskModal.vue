<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Редактировать задание</h3>
        <button class="modal-close" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <div class="input-group">
          <label class="input-label">Опишите ваш бизнес и цель</label>
          <textarea
            v-model="localTask.description"
            class="input-field"
            placeholder="Например: «Мы туристическая компания...»"
            rows="3"
          ></textarea>
        </div>

        <div class="input-group">
          <label class="input-label">Регион поиска (необязательно)</label>
          <input
            v-model="localTask.region"
            class="input-field"
            placeholder="Введите через запятую"
          />
        </div>

        <div class="input-group">
          <label class="input-label">Ключевые слова для поиска</label>
          <input
            v-model="localTask.keywords"
            class="input-field"
            placeholder="Основные термины, которые описывают вашу аудиторию"
          />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">
          Отмена
        </button>
        <button class="btn btn-primary" @click="saveChanges">
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const localTask = reactive({
  description: props.task.description,
  region: props.task.region,
  keywords: props.task.keywords
})

const saveChanges = () => {
  emit('save', { ...localTask })
  emit('close')

  console.log('Сохраняю...')
  emit('save', { ...localTask })
  emit('close')
  console.log('Вызвал close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  box-sizing: border-box;
}

.modal-content {
  background-color: var(--tg-bg-color, #1e1e1e);
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--tg-text-color, #ffffff);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--tg-text-color, #ffffff);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  margin: 0;
}

.input-field {
  background-color: var(--tg-bg-color, #1e1e1e);
  border: 1px solid var(--tg-hint-color, #333);
  border-radius: 12px;
  padding: 12px 16px;
  color: var(--tg-text-color, #ffffff);
  font-size: 14px;
  resize: vertical;
  width: 100%;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: var(--tg-link-color, #2487e7);
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  min-height: 44px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--tg-button-color, #2487e7);
  color: var(--tg-button-text-color, #ffffff);
}

.btn-primary:hover {
  background-color: #1a75d6;
}

.btn-secondary {
  background-color: transparent;
  color: var(--tg-text-color, #ffffff);
  border: 1px solid var(--tg-hint-color, #333);
}

.btn-secondary:hover {
  background-color: var(--tg-secondary-bg-color, #2a2a2a);
}
</style>