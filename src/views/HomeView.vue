<template>
  <div class="home-view">
    <TabBar v-model:active-tab="activeTab" />
    <div class="tab-content">
      <div v-if="activeTab === 'new'" class="tab-pane">
        <TaskForm />
      </div>
      <div v-else-if="activeTab === 'my'" class="tab-pane">
        <p>Здесь будет список заданий.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TabBar from '@/components/layout/TabBar.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'

const activeTab = ref('new') 
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
}

.tab-pane {
  width: 100%;
  height: 100%;
}
</style>