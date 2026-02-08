<template>
  <div class="empty-state">
    <div class="duck-image">
       img
      <!-- Здесь можно вставить SVG или изображение утки -->
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
        <circle cx="40" cy="40" r="5" fill="#333"/>
        <circle cx="60" cy="40" r="5" fill="#333"/>
        <path d="M 45 60 Q 50 65 55 60" stroke="#333" stroke-width="2" fill="none"/>
      </svg>
    </div>
    <h3>Ещё нет заданий</h3>
    <p>Создайте первое задание и начните поиск лидов</p>
    <button class="btn btn-primary" @click="$emit('createFirst')">
      Создать первое задание
    </button>
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
  color: var(--tg-hint-color, #8c8c8c);
}

.duck-image {
  margin-bottom: 16px;
}

.empty-state h3 {
  color: var(--tg-text-color, #000);
  font-size: 18px;
  margin: 0 0 8px;
}

.empty-state p {
  font-size: 14px;
  margin: 0 0 16px;
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  width: auto;
}

.btn-primary {
  background-color: var(--tg-button-color, #2487e7);
  color: var(--tg-button-text-color, #ffffff);
}
</style>