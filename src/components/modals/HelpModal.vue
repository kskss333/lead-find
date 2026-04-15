<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Как описать бизнес и выбрать ключевые слова?</h3>
      </div>

      <div class="modal-body">
        <p>
          Хорошее описание помогает нам точнее найти вашу аудиторию.
        </p>

        <div class="hint-list">
          <div class="hint-item">
            <span class="bullet">•</span>
            <span class="hint-text"><strong>Чем</strong> вы занимаетесь?</span>
          </div>
          <div class="hint-item">
            <span class="bullet">•</span>
            <span class="hint-text"><strong>Для кого</strong> вы это делаете?</span>
          </div>
          <div class="hint-item">
            <span class="bullet">•</span>
            <span class="hint-text"><strong>Что</strong> делает вас уникальным?</span>
          </div>
        </div>

        <p>
          <br><strong>Ключевые слова</strong> — это то, что ищут ваши клиенты:<br>
          — Услуги: «бухгалтерия для ИП», «детское программирование»
        </p>

        <div class="example-box">
          «Мы онлайн-школа программирования для детей 7–14 лет. Обучаем Python, Scratch и робототехнике через игры. Наши ученики получают сертификаты и участвуют в хакатонах».
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-primary" @click="$emit('close')">
          Все понятно!
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  box-sizing: border-box;
}

.modal-content {
  background-color: var(--tg-bg-color, #1e1e1e);
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--tg-text-color, #ffffff);
  margin: 0;
}

.modal-body p {
  font-size: 14px;
  color: var(--tg-text-color, #ffffff);
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.hint-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hint-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.bullet {
  color: var(--tg-link-color, #2487e7);
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 2px;
}

.hint-text {
  font-size: 14px;
  color: var(--tg-text-color, #ffffff);
  line-height: 1.5;
}

.example-box {
  border: 1px solid var(--tg-hint-color, #333);
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
  color: var(--tg-text-color, #ffffff);
  line-height: 1.5;
  background-color: transparent;
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.btn-primary {
  background-color: var(--tg-button-color, #2487e7);
  color: var(--tg-button-text-color, #ffffff);
  border: 1px solid #ffffff;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #1a75d6;
}
</style>