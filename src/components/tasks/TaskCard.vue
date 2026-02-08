<template>
  <div class="task-card">
    <div class="card-header">
      <div class="card-description">
        <p>{{ truncatedDescription }}</p>
        <button class="expand-btn" v-if="shouldTruncate" @click="expanded = !expanded">
          {{ expanded ? 'Свернуть' : 'Читать далее' }}
        </button>
      </div>
      <StatusBadge :status="task.status" />
    </div>

    <div class="card-tags">
      <div v-if="task.region" class="tag-region">
        <span class="tag-icon">📍</span>
        <span class="tag-text">Регион: {{ task.region }}</span>
      </div>
      <div v-if="task.keywords" class="tag-keywords">
        <span class="tag-icon">🏷️</span>
        <span class="tag-text">Теги: {{ task.keywords }}</span>
      </div>
    </div>

    <div class="card-stats">
      <div class="stat-item">
        <span class="stat-label">Найдено:</span>
        <span class="stat-value">{{ task.foundLeads || 0 }}</span>
      </div>
    </div>

    <div class="card-actions">
      <button class="action-btn" @click="$emit('edit', task)" title="Редактировать">
        ✏️
      </button>
      <button class="action-btn" @click="$emit('duplicate', task)" title="Дублировать">
        📋
      </button>
      <button class="action-btn" @click="toggleMenu" title="Еще">
        …
      </button>
    </div>

    <!-- Контекстное меню -->
    <Teleport to="body">
      <div v-if="showMenu" class="menu-overlay" @click="closeMenu"></div>
      <div v-if="showMenu" class="action-menu" :style="menuStyle">
        <button class="menu-item" @click="toggleStatus">
          {{ task.status ? '⏸️ Приостановить' : '▶️ Возобновить' }}
        </button>
        <button class="menu-item" @click="$emit('duplicate', task)">
          📋 Дублировать
        </button>
        <button class="menu-item menu-item-danger" @click="confirmDelete">
          🗑️ Удалить
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StatusBadge from '../ui/StatusBadge.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete', 'duplicate'])

const expanded = ref(false)
const showMenu = ref(false)
const menuStyle = ref({ top: '0px', left: '0px' })

// Обрезка описания
const shouldTruncate = computed(() => props.task.description.length > 100)
const truncatedDescription = computed(() => {
  if (expanded.value || !shouldTruncate.value) {
    return props.task.description
  }
  return props.task.description.substring(0, 100) + '...'
})

const toggleMenu = (event) => {
  const rect = event.target.getBoundingClientRect()
  menuStyle.value = {
    top: rect.bottom + window.scrollY + 4 + 'px',
    left: rect.left + window.scrollX - 100 + 'px' // Пример ширины меню
  }
  showMenu.value = !showMenu.value
}

const closeMenu = () => {
  showMenu.value = false
}

const toggleStatus = async () => {
  // TODO: вызвать action из store для обновления статуса
  console.log('Переключить статус', props.task.id, !props.task.status)
  closeMenu()
}

const confirmDelete = () => {
  if (confirm('Удалить это задание?')) {
    $emit('delete', props.task)
  }
  closeMenu()
}
</script>

<style scoped>
.task-card {
  background-color: var(--tg-section-bg-color, #fff);
  border: 1px solid var(--tg-hint-color, #ccc);
  border-radius: 12px;
  padding: 16px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.card-description {
  flex: 1;
  margin-right: 12px;
}

.card-description p {
  color: var(--tg-text-color, #000);
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}

.expand-btn {
  background: none;
  border: none;
  color: var(--tg-link-color, #2487e7);
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  margin-top: 4px;
}

.card-tags {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.tag-region, .tag-keywords {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--tg-hint-color, #8c8c8c);
}

.tag-icon {
  font-size: 14px;
}

.card-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.stat-label {
  color: var(--tg-hint-color, #8c8c8c);
}

.stat-value {
  font-weight: 500;
  color: var(--tg-text-color, #000);
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: var(--tg-text-color, #000);
}

.action-btn:hover {
  background-color: var(--tg-secondary-bg-color, #f5f5f5);
}

/* Стили контекстного меню */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.action-menu {
  position: absolute;
  z-index: 1000;
  background-color: var(--tg-bg-color, #fff);
  border: 1px solid var(--tg-hint-color, #ccc);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  min-width: 160px;
}

.menu-item {
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  color: var(--tg-text-color, #000);
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-item:hover {
  background-color: var(--tg-secondary-bg-color, #f5f5f5);
}

.menu-item-danger {
  color: #e53e3e;
}

.menu-item-danger:hover {
  background-color: #fee2e2;
}
</style>