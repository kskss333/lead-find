<template>
  <div class="tab-bar" ref="tabBarRef">
    <div class="tab-indicator" :style="indicatorStyle"></div>
    <button
      v-for="tab in tabs"
      :key="tab.value"
      ref="tabRefs"
      class="tab-btn"
      :class="{ active: modelValue === tab.value }"
      @click="modelValue = tab.value"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'

const tabs = [
  { value: 'new', label: 'Создать задание' },
  { value: 'my', label: 'Мои задания' }
]

const modelValue = defineModel('activeTab', { required: true })

const tabBarRef = ref(null)
const tabRefs = ref([])
const indicatorWidth = ref(0)
const indicatorLeft = ref(0)

const updateIndicator = () => {
  const buttons = tabRefs.value
  const activeIndex = tabs.findIndex(t => t.value === modelValue.value)
  const activeButton = buttons[activeIndex]

  if (!activeButton || !tabBarRef.value) return

  const buttonRect = activeButton.getBoundingClientRect()
  const containerRect = tabBarRef.value.getBoundingClientRect()

  indicatorWidth.value = buttonRect.width
  indicatorLeft.value = buttonRect.left - containerRect.left
}

const indicatorStyle = computed(() => ({
  width: `${indicatorWidth.value}px`,
  left: `${indicatorLeft.value}px`,
  transition: 'left 0.3s ease-out, width 0.3s ease-out'
}))

watch(modelValue, () => {
  nextTick(updateIndicator)
})

onMounted(() => {
  nextTick(updateIndicator)
})
</script>

<style scoped>
.tab-bar {
  position: relative;
  display: flex;
  gap: 8px;
  background-color: var(--tg-secondary-bg-color);
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
  background-color: var(--tg-button-color);
  border-radius: 20px;
  z-index: 0;
}

.tab-btn {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 20px;
  background: transparent;
  color: var(--tg-hint-color);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-btn.active {
  color: var(--tg-button-text-color);
}
</style>