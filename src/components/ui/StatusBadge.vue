<template>
  <span class="status-badge" :class="badgeClass">
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: [Boolean, String], // Может быть true, false или строка типа 'pending'
    required: true
  }
})

const statusText = computed(() => {
  if (props.status === true) return 'Активно'
  if (props.status === false) return 'На паузе'
  if (props.status === 'pending' || props.status === null || props.status === undefined) return 'Создаём чудо...'
  return 'Неизвестно' // На всякий случай
})

const badgeClass = computed(() => {
  if (props.status === true) return 'status-active'
  if (props.status === false) return 'status-paused'
  if (props.status === 'pending' || props.status === null || props.status === undefined) return 'status-pending'
  return ''
})
</script>

<style scoped>
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  display: inline-block;
  min-width: 80px;
}

.status-active {
  background-color: #d4f8e8; /* Зелёный фон */
  color: #22c55e; /* Зелёный текст */
}

.status-paused {
  background-color: #f8f9fa; /* Серый фон */
  color: #6b7280; /* Серый текст */
}

.status-pending {
  background-color: #fffbeb; /* Жёлтый фон */
  color: #f59e0b; /* Жёлтый текст */
}
</style>