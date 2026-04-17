<template>
  <div class="app-container home-view">
    <TabBar v-model:active-tab="activeTab" />
    <div class="tab-content">
      <Transition name="slide-fade" mode="out-in">
        <div v-if="activeTab === 'new'" key="new" class="tab-pane">
          <TaskForm />
        </div>
        <div v-else-if="activeTab === 'my'" key="my" class="tab-pane">
          <TaskList @switch-to-new="activeTab = 'new'" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import TabBar from '@/components/layout/TabBar.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import TaskList from '@/components/tasks/TaskList.vue'

const TAB_STORAGE_KEY = 'lead-find-active-tab'

const activeTab = ref('new')

onMounted(() => {
  const savedTab = localStorage.getItem(TAB_STORAGE_KEY)
  if (savedTab === 'my') {
    activeTab.value = 'my'
  } else {
    activeTab.value = 'new' 
  }
})

watch(activeTab, (value) => {
  localStorage.setItem(TAB_STORAGE_KEY, value)
})
</script>

<style scoped>
.home-view {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tab-content {
  flex: 1;
  margin-top: 16px;
  position: relative;
}

.tab-pane {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.25s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>