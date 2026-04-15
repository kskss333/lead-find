<template>
  <div class="tab-bar" ref="tabBarRef">
    <div class="tab-indicator" :style="indicatorStyle"></div>
    <button
      class="tab-btn"
      :class="{ active: modelValue === 'new' }"
      @click="updateActiveTab('new')"
    >
      Создать задание
    </button>
    <button
      class="tab-btn"
      :class="{ active: modelValue === 'my' }"
      @click="updateActiveTab('my')"
    >
      Мои задания
    </button>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:activeTab'])
const modelValue = defineModel('activeTab')

const tabBarRef = ref(null)

const updateActiveTab = (tab) => {
  modelValue.value = tab
  emit('update:activeTab', tab)
}

const indicatorStyle = computed(() => {
  if (!tabBarRef.value) return {}

  const buttons = tabBarRef.value.querySelectorAll('.tab-btn')
  const activeIndex = props.activeTab === 'new' ? 0 : 1
  if (!buttons[activeIndex]) return {}

  const buttonRect = buttons[activeIndex].getBoundingClientRect()
  const containerRect = tabBarRef.value.getBoundingClientRect()

  return {
    width: `${buttonRect.width}px`,
    left: `${buttonRect.left - containerRect.left}px`,
    transition: 'left 0.3s ease-out, width 0.3s ease-out'
  }
})
</script>

<style scoped>
.tab-bar {
  position: relative;
  display: flex;
  gap: 8px;
  background-color: var(--tg-secondary-bg-color, #f5f5f5);
  border-radius: 24px;
  padding: 4px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.tab-indicator {
  position: absolute;
  top: 4px;
  height: calc(100% - 8px);
  background-color: var(--tg-button-color, #2487e7);
  border-radius: 20px;
  z-index: 0;
  transition: left 0.3s ease-out, width 0.3s ease-out;
}

.tab-btn {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 20px;
  background: transparent;
  color: var(--tg-hint-color, #8c8c8c);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-btn.active {
  color: var(--tg-button-text-color, #ffffff);
}
</style>