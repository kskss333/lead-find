<template>
  <div class="task-form">
    <div class="form-card">
      <!-- Поле "Опишите ваш бизнес и цель" -->
      <div class="input-group">
        <label class="input-label">Опишите ваш бизнес и цель</label>
        <textarea
          v-model="localTask.description"
          class="input-field large-textarea"
          :class="{ 'has-error': errors.description }"
          placeholder="Например: «Мы туристическая компания, проводим туры по краю. Я — частный бухгалтер, помогаю малому бизнесу в налогах...»"
          rows="3"
        ></textarea>
        <small v-if="errors.description" class="error-message">{{ errors.description }}</small>
      </div>

      <!-- Поле "Город поиска" (необязательно) -->
      <div class="input-group">
        <label class="input-label">Город поиска (необязательно)</label>
        <input
          v-model="localTask.cityString"
          class="input-field"
          placeholder="Введите город"
        />
      </div>

      <!-- Поле "Регион поиска" (необязательно) -->
      <div class="input-group">
        <label class="input-label">Регион поиска (необязательно)</label>
        <input
          v-model="localTask.regionString"
          class="input-field"
          placeholder="Введите через запятую"
        />
      </div>

      <!-- Поле "Ключевые слова для поиска" -->
      <div class="input-group">
        <label class="input-label">Ключевые слова для поиска *</label>
        <input
          v-model="localTask.keywordsString"
          class="input-field"
          :class="{ 'has-error': errors.keywords }"
          placeholder="Основные термины, которые описывают вашу аудиторию"
        />
        <small v-if="errors.keywords" class="error-message">{{ errors.keywords }}</small>
      </div>

      <!-- Кнопки -->
      <div class="form-actions">
        <button
          class="btn btn-primary"
          @click="onSubmit"
          :disabled="isSubmitting || !isValid"
        >
          {{ isSubmitting ? 'Отправка...' : 'Сгенерировать' }}
        </button>
        <button class="btn btn-secondary" type="button" @click="showHelp = true">
          Как писать?
        </button>
      </div>
    </div>

    <!-- Модальные окна -->
    <Teleport to="body">
      <HelpModal v-if="showHelp" @close="showHelp = false" />
      <SuccessModal v-if="showSuccess" @close="closeSuccess" />
      <ErrorModal v-if="showError" :message="showError" @close="showError = null" />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import HelpModal from '../modals/HelpModal.vue'
import SuccessModal from '../modals/SuccessModal.vue'
import ErrorModal from '../modals/ErrorModal.vue'

const taskStore = useTaskStore()

const localTask = reactive({
  description: '',
  cityString: '', // <-- Новое поле
  regionString: '',
  keywordsString: '' // <-- Будет парситься в массив
})

const errors = reactive({})
const isSubmitting = ref(false)
const showHelp = ref(false)
const showSuccess = ref(false)
const showError = ref(null)

// Обновлённая валидация: description и keywords обязательны
const isValid = computed(() => {
  return localTask.description.trim() !== '' && localTask.keywordsString.trim() !== ''
})

const onSubmit = async () => {
  // Сброс ошибок
  Object.keys(errors).forEach(key => delete errors[key])

  // Валидация
  if (!isValid.value) {
    if (!localTask.description.trim()) {
      errors.description = 'Это поле обязательно'
    }
    if (!localTask.keywordsString.trim()) {
      errors.keywords = 'Это поле обязательно'
    }
    return
  }

  isSubmitting.value = true
  try {
    // Парсим строки в нужный формат, как требует ТЗ
    const keywordsArray = localTask.keywordsString
      .split(/[,\s]+/) // Разбиваем по запятой или пробелу
      .map(k => k.trim())
      .filter(Boolean) // Убираем пустые строки

    const taskData = {
      description: localTask.description,
      city: localTask.cityString.trim() || undefined, // <-- Отправляем как city (опционально)
      region: localTask.regionString.trim() || undefined, // <-- Отправляем как region (опционально)
      keywords: keywordsArray, // <-- Теперь это массив, как в ТЗ
      status: true,
      foundLeads: 0
    }

    await taskStore.createTask(taskData)

    // Сброс формы
    localTask.description = ''
    localTask.cityString = ''
    localTask.regionString = ''
    localTask.keywordsString = ''

    showSuccess.value = true
  } catch (error) {
    console.error('Ошибка при создании задания:', error)
    // Обработка ошибки (может пригодиться при подключении API)
    showError.value = error.response?.data?.message || 'Не удалось создать задание. Попробуйте позже.'
  } finally {
    isSubmitting.value = false
  }
}

const closeSuccess = () => {
  showSuccess.value = false
}
</script>

<style scoped>
/* (стили остаются прежними) */
.task-form {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form-card {
  background-color: var(--tg-section-bg-color, #ffffff);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--tg-text-color, #000000);
  margin: 0;
}

.input-field {
  background-color: var(--tg-bg-color, #ffffff);
  border: 1px solid var(--tg-hint-color, #8c8c8c);
  border-radius: 12px;
  padding: 12px 16px;
  color: var(--tg-text-color, #000000);
  font-size: 14px;
  resize: vertical;
  width: 100%;
  box-sizing: border-box;
}

.large-textarea {
  min-height: 80px;
}

.input-field:focus {
  outline: none;
  border-color: var(--tg-link-color, #2487e7);
}

.input-field.has-error {
  border-color: #e53e3e;
}

.error-message {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.btn {
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--tg-button-color, #2487e7);
  color: var(--tg-button-text-color, #ffffff);
}

.btn-secondary {
  background-color: transparent;
  color: var(--tg-link-color, #2487e7);
  border: 1px solid var(--tg-hint-color, #8c8c8c);
}
</style>