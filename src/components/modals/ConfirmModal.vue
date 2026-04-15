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
        <button class="btn btn-secondary" @click="$emit('cancel')">
          {{ cancelLabel }}
        </button>
        <button class="btn btn-primary" @click="$emit('confirm')">
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
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: var(--tg-bg-color, #1e1e1e);
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
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
  margin: 0;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  min-height: 44px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--tg-button-color, #2487e7);
  color: var(--tg-button-text-color, #ffffff);
}

.btn-primary:hover {
  background: #1a75d6;
}

.btn-secondary {
  background: transparent;
  color: var(--tg-text-color, #ffffff);
  border: 1px solid var(--tg-hint-color, #333);
}

.btn-secondary:hover {
  background: var(--tg-secondary-bg-color, #2a2a2a);
}
</style>