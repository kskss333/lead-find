<template>
  <div class="task-form">
    <h2 class="form-title">Опишите вашего клиента</h2>

    <InputField
      v-model="localTask.description"
      label="Род деятельности"
      placeholder="Например: «Мы туристическая компания...»"
      :required="true"
      :error="errors.description"
      multiline
    />

    <TagInput
      v-model="localTask.region"
      label="Регион поиска"
      placeholder="Введите регион, например: Москва, Санкт-Петербург"
      :error="errors.region"
    />

    <TagInput
      v-model="localTask.keywords"
      label="Ключевые слова"
      placeholder="Введите слова через запятую"
      :error="errors.keywords"
    />

    <div class="form-actions">
      <button class="btn btn-primary" @click="onSubmit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Отправка...' : 'Сгенерировать' }}
      </button>
      <button class="btn btn-secondary" type="button" @click="showHelp = true">
        Как правильно писать?
      </button>
    </div>

    <!-- Модальное окно "Как правильно писать?" -->
    <Teleport to="body">
      <div v-if="showHelp" class="modal-overlay" @click="closeHelp">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Как правильно писать?</h3>
            <button class="modal-close" @click="closeHelp">×</button>
          </div>
          <div class="modal-body">
            <p>Чтобы система могла эффективно искать лидов, важно грамотно описать ваш бизнес:</p>
            <ul>
              <li><strong>Род деятельности:</strong> Укажите, чем занимается ваша компания. Чем точнее — тем лучше.</li>
              <li><strong>Регион поиска:</strong> Укажите города или регионы, где ищете клиентов.</li>
              <li><strong>Ключевые слова:</strong> Укажите слова, по которым потенциальные клиенты могут искать вас.</li>
            </ul>
            <p>Пример:</p>
            <blockquote>
              <p>Мы туристическая компания, специализируемся на организации экскурсий по России. Ищем клиентов в Москве и Санкт-Петербурге. Ключевые слова: туры, экскурсии, путешествия, отдых.</p>
            </blockquote>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="closeHelp">Понятно</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Модальное окно успеха -->
    <Teleport to="body">
      <div v-if="showSuccess" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>✅ Задание отправлено!</h3>
          </div>
          <div class="modal-body">
            <p>Мы начали поиск лидов. Результаты появятся в разделе «Мои задания».</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="closeSuccess">Спасибо!</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import InputField from '../ui/InputField.vue'
import TagInput from '../ui/TagInput.vue'

const taskStore = useTaskStore()

// Локальное состояние формы
const localTask = reactive({
  description: '',
  region: [],
  keywords: []
})

// Состояния UI
const errors = reactive({})
const isSubmitting = ref(false)
const showHelp = ref(false)
const showSuccess = ref(false)

// Валидация
const validate = () => {
  let isValid = true
  // Сброс ошибок
  Object.keys(errors).forEach(key => delete errors[key])

  if (!localTask.description.trim()) {
    errors.description = 'Это поле обязательно'
    isValid = false
  }

  // Проверка, что хотя бы один тег есть в регионе или ключевых словах
  if (localTask.region.length === 0 && localTask.keywords.length === 0) {
    errors.region = 'Укажите регион или ключевые слова'
    errors.keywords = 'Укажите регион или ключевые слова'
    isValid = false
  }

  return isValid
}

const onSubmit = async () => {
  if (!validate()) return

  isSubmitting.value = true

  try {
    const taskData = {
      description: localTask.description,
      region: localTask.region.join(', '), // Преобразуем в строку, если бэкенд принимает строку
      keywords: localTask.keywords.join(', '), // Преобразуем в строку
      status: true // Новое задание по умолчанию активно
    }

    await taskStore.createTask(taskData)

    // Сброс формы
    localTask.description = ''
    localTask.region = []
    localTask.keywords = []

    // Показываем сообщение об успехе
    showSuccess.value = true
  } catch (error) {
    console.error('Ошибка при создании задания:', error)
    // Здесь можно добавить вывод ошибки из бэкенда
    if (error.response?.data?.message) {
      alert('Ошибка: ' + error.response.data.message)
    } else {
      alert('Не удалось создать задание. Попробуйте позже.')
    }
  } finally {
    isSubmitting.value = false
  }
}

const closeHelp = () => {
  showHelp.value = false
}

const closeSuccess = () => {
  showSuccess.value = false
}
</script>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--tg-section-header-text-color, #000);
  margin-bottom: 8px;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.btn {
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  width: 100%;
  box-sizing: border-box;
}

.btn:disabled {
  opacity: 0.6;
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

/* Стили модального окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  box-sizing: border-box;
}

.modal-content {
  background-color: var(--tg-bg-color, #fff);
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--tg-text-color, #000);
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--tg-text-color, #000);
}

.modal-body {
  flex: 1;
  margin-bottom: 16px;
  color: var(--tg-text-color, #000);
}

.modal-body ul {
  padding-left: 20px;
  margin: 8px 0;
}

.modal-body blockquote {
  background-color: var(--tg-secondary-bg-color, #f5f5f5);
  padding: 12px;
  border-radius: 8px;
  font-style: italic;
  margin: 8px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.modal-footer .btn {
  width: auto;
}
</style>