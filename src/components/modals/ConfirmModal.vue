<template>
  <div class="modal-overlay" @click="$emit('cancel')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
      </div>

      <div class="modal-body">
        <p>{{ message }}</p>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('cancel')">
          {{ cancelLabel }}
        </button>
        <button class="btn-primary" @click="$emit('confirm')">
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmLabel: { type: String, default: 'Подтвердить' },
  cancelLabel: { type: String, default: 'Отмена' }
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: var(--tg-bg-color);
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--tg-text-color);
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
  gap: 12px;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  min-height: 44px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn-primary {
  background: var(--tg-button-color);
  color: var(--tg-button-text-color);
}

.btn-secondary {
  background: transparent;
  color: var(--tg-text-color);
  border: 1px solid var(--tg-hint-color);
}

.btn-primary:hover,
.btn-secondary:hover {
  opacity: 0.85;
}
</style>