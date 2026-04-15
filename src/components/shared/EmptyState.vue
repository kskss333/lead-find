<template>
  <div class="empty-state">
    <div class="duck-image">
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
        <path d="M12 2C7.58 2 4 5.58 4 10c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.42-3.58-8-8-8z"/>
        <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        <path d="M12 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        <path d="M16 12c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"/>
        <path d="M12 18c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
      </svg>
    </div>
    <h3>У вас пока нет созданных заданий:(</h3>
    <p>Создайте первое задание и начните поиск лидов</p>
    <button class="btn btn-primary" @click="$emit('createFirst')">
      Создать первое задание
    </button> <br><br>

    <p>Вы будете получать уведомления о подходящих предложениях прямо в бот. 
      Эта страница для управления заданиями. </p>
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

.duck-image svg {
  fill: var(--tg-secondary-bg-color, #f5f5f5);
  stroke: var(--tg-hint-color, #8c8c8c);
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