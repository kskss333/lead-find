<template>
  <div class="task-form">
    <div class="form-card">
      <div class="input-group">
        <label class="input-label">Опишите ваш бизнес и цель</label>
        <textarea
          v-model="localTask.description"
          class="input-field large-textarea"
          :class="{ 'has-error': errors.description }"
          placeholder="Например: «Мы туристическая компания, проводим туры по краю...»"
          rows="3"
        />
        <small v-if="errors.description" class="error-message">{{ errors.description }}</small>
      </div>

      <div class="input-group">
        <label class="input-label">Город поиска (необязательно)</label>
        <input
          v-model="localTask.city"
          class="input-field"
          placeholder="Введите город"
        />
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
        <label class="input-label">Ключевые слова для поиска *</label>
        <input
          v-model="localTask.keywords"
          class="input-field"
          :class="{ 'has-error': errors.keywords }"
          placeholder="Основные термины, которые описывают вашу аудиторию"
        />
        <small v-if="errors.keywords" class="error-message">{{ errors.keywords }}</small>
        <small v-if="errors.general" class="error-message">{{ errors.general }}</small>
      </div>

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

    <Teleport to="body">
      <HelpModal v-if="showHelp" @close="showHelp = false" />
      <SuccessModal v-if="showSuccess" @close="showSuccess = false" />
      <ErrorModal v-if="showError" :message="showError" @close="showError = null" />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import { validateTask } from '../../utils/validators'
import HelpModal from '../modals/HelpModal.vue'
import SuccessModal from '../modals/SuccessModal.vue'
import ErrorModal from '../modals/ErrorModal.vue'

const taskStore = useTaskStore()

const localTask = reactive({
  description: '',
  city: '',
  region: '',
  keywords: ''
})

const errors = reactive({})
const isSubmitting = ref(false)
const showHelp = ref(false)
const showSuccess = ref(false)
const showError = ref(null)

const isValid = computed(() => {
  const result = validateTask({
    description: localTask.description,
    region: localTask.region,
    keywords: localTask.keywords
  })
  return result.isValid
})

const onSubmit = async () => {
  Object.keys(errors).forEach(key => delete errors[key])

  const result = validateTask({
    description: localTask.description,
    region: localTask.region,
    keywords: localTask.keywords
  })

  if (!result.isValid) {
    Object.assign(errors, result.errors)
    return
  }

  isSubmitting.value = true
  try {
    const taskData = {
      description: localTask.description.trim(),
      city: localTask.city.trim() || null,
      region: localTask.region.trim() || null,
      keywords: localTask.keywords.trim() || null,
      status: true,
      foundLeads: 0
    }

    await taskStore.createTask(taskData)

    localTask.description = ''
    localTask.city = ''
    localTask.region = ''
    localTask.keywords = ''

    showSuccess.value = true
  } catch (error) {
    showError.value = error.response?.data?.message || 'Не удалось создать задание. Попробуйте позже.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.task-form {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form-card {
  background-color: var(--tg-section-bg-color);
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
  color: var(--tg-text-color);
  margin: 0;
}

.input-field {
  background-color: var(--tg-bg-color);
  border: 1px solid var(--tg-hint-color);
  border-radius: 12px;
  padding: 12px 16px;
  color: var(--tg-text-color);
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
  border-color: var(--tg-link-color);
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
  background-color: var(--tg-button-color);
  color: var(--tg-button-text-color);
}

.btn-secondary {
  background-color: transparent;
  color: var(--tg-link-color);
  border: 1px solid var(--tg-hint-color);
}
</style>