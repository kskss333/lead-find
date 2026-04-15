<template>
  <span class="status-badge" :class="badgeClass">
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: [Boolean, String],
    required: true
  }
})

const statusText = computed(() => {
  if (props.status === true) return 'Активно'
  if (props.status === false) return 'На паузе'
  if (props.status === 'pending' || props.status === null || props.status === undefined) return 'Создаём чудо...'
  return 'Неизвестно'
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
  background-color: #d4f8e8;
  color: #22c55e;
}

.status-paused {
  background-color: #f8f9fa;
  color: #6b7280;
}

.status-pending {
  background-color: #fffbeb;
  color: #f59e0b;
}
</style>