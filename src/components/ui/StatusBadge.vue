<template>
  <span class="status-badge" :class="badgeClass">
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: [Boolean, String, Number],
    required: true
  }
})

const STATUS_MAP = {
  true: { text: 'Активно', class: 'status-active' },
  false: { text: 'На паузе', class: 'status-paused' },
  pending: { text: 'В обработке', class: 'status-pending' },
}

const getStatusKey = (value) => {
  if (value === true) return 'true'
  if (value === false) return 'false'
  if (value === 'pending' || value === null || value === undefined) return 'pending'
  return null
}

const statusText = computed(() => {
  const key = getStatusKey(props.status)
  return key ? STATUS_MAP[key].text : 'Неизвестно'
})

const badgeClass = computed(() => {
  const key = getStatusKey(props.status)
  return key ? STATUS_MAP[key].class : ''
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