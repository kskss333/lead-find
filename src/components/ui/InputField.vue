<template>
  <div class="input-wrapper">
    <label v-if="label" class="input-label" :for="id">{{ label }} <span v-if="required" class="required">*</span></label>
    <textarea
      v-if="multiline"
      :id="id"
      v-model="modelValue"
      :placeholder="placeholder"
      class="input-field"
      :class="{ 'has-error': error }"
      rows="4"
    ></textarea>
    <input
      v-else
      :id="id"
      v-model="modelValue"
      :type="type"
      :placeholder="placeholder"
      class="input-field"
      :class="{ 'has-error': error }"
    />
    <small v-if="error" class="error-message">{{ error }}</small>
  </div>
</template>

<script setup>
import { nanoid } from 'nanoid'

const modelValue = defineModel()
const props = defineProps({
  label: String,
  placeholder: String,
  type: { type: String, default: 'text' },
  multiline: Boolean,
  required: Boolean,
  error: String
})

const id = nanoid()
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.input-label {
  font-size: 14px;
  color: var(--tg-text-color, #000);
  font-weight: 500;
}

.required {
  color: red;
}

.input-field {
  padding: 12px 16px;
  border: 1px solid var(--tg-hint-color, #ccc);
  border-radius: 8px;
  background-color: var(--tg-bg-color, #fff);
  color: var(--tg-text-color, #000);
  font-size: 14px;
  resize: vertical;
  width: 100%;
  box-sizing: border-box;
}

.input-field.has-error {
  border-color: #e53e3e;
}

.error-message {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
}
</style>