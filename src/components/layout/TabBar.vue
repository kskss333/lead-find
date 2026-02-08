<template>
  <div class="tab-bar">
    <button
      class="tab-btn"
      :class="{ active: modelValue === 'new' }"
      @click="$emit('update:activeTab', 'new')"
    >
      Новое задание
    </button>
    <button
      class="tab-btn"
      :class="{ active: modelValue === 'my' }"
      @click="$emit('update:activeTab', 'my')"
    >
      Мои задания
    </button>
  </div>
</template>

<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

defineEmits(['update:activeTab'])

// Используем v-model:active-tab в родителе
const modelValue = defineModel('activeTab')
</script>

<style scoped>
.tab-bar {
  display: flex;
  gap: 8px;
  background-color: var(--tg-secondary-bg-color, #f5f5f5);
  border-radius: 12px;
  padding: 4px;
  width: 100%; /* Убедимся, что ширина 100% */
  box-sizing: border-box;
}

.tab-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--tg-hint-color, #8c8c8c);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background-color: var(--tg-button-color, #2487e7);
  color: var(--tg-button-text-color, #ffffff);
}
</style>