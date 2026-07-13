<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <span class="error-icon">⚠️</span>
        <h3>Ошибка</h3>
      </div>

      <div class="modal-body">
        <p>{{ message }}</p>
      </div>

      <div class="modal-footer">
        <button class="btn-primary" @click="$emit('close')">
          Понятно
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  }
})

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
  background-color: var(--tg-bg-color);
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.error-icon {
  font-size: 28px;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #f59e0b;
  margin: 0;
}

.modal-body p {
  font-size: 14px;
  color: var(--tg-text-color);
  line-height: 1.5;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.btn-primary {
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  width: 100%;
  background-color: var(--tg-button-color);
  color: var(--tg-button-text-color);
  transition: opacity 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.85;
}
</style>