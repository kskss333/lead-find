<template>
  <div class="empty-state">
    <div class="empty-icon">🦆</div>
    <h3>У вас пока нет созданных заданий</h3>
    <p>Создайте первое задание и начните поиск лидов</p>
    <button class="btn-primary" @click="$emit('createFirst')">
      Создать первое задание
    </button>
    <p class="hint">
      Вы будете получать уведомления о подходящих предложениях прямо в бот.
      Эта страница для управления заданиями.
    </p>
  </div>
</template>

<script setup>
defineEmits(['createFirst'])
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: var(--tg-hint-color);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  color: var(--tg-text-color);
  font-size: 18px;
  margin: 0 0 8px;
}

.empty-state p {
  font-size: 14px;
  margin: 0 0 16px;
}

.hint {
  margin-top: 16px !important;
  font-size: 12px !important;
  color: var(--tg-hint-color);
  max-width: 280px;
}

.btn-primary {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background-color: var(--tg-button-color);
  color: var(--tg-button-text-color);
  transition: background 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.85;
}
</style>