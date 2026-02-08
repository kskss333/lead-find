<template>
  <div class="tag-input-wrapper">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="tag-input-field" :class="{ 'has-error': error }" @click="focusInput">
      <span
        v-for="(tag, i) in modelValue"
        :key="i"
        class="tag-item"
      >
        {{ tag }}
        <button @click.stop="removeTag(i)" class="tag-remove">×</button>
      </span>
      <input
        ref="inputRef"
        v-model="inputText"
        @keydown.enter.prevent="addTag"
        @keydown.comma.exact.prevent="addTag"
        @blur="addTag"
        :placeholder="placeholder"
        class="tag-input-inner"
      />
    </div>
    <small v-if="error" class="error-message">{{ error }}</small>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { nanoid } from 'nanoid' // Установите: npm install nanoid

const modelValue = defineModel()
const props = defineProps({
  label: String,
  placeholder: String,
  error: String // Новое свойство для отображения ошибки
})

const inputRef = ref(null)
const inputText = ref('')

const focusInput = () => {
  inputRef.value?.focus()
}

const addTag = () => {
  if (inputText.value.trim()) {
    const tags = inputText.value.split(/[,\s]+/).map(t => t.trim()).filter(Boolean)
    if (tags.some(tag => !modelValue.value.includes(tag))) { // Проверяем, нет ли дубликатов
      modelValue.value = [...modelValue.value, ...tags]
    }
    inputText.value = ''
  }
}

const removeTag = (index) => {
  const newTags = [...modelValue.value]
  newTags.splice(index, 1)
  modelValue.value = newTags
}
</script>

<style scoped>
.tag-input-wrapper {
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

.tag-input-field {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px;
  border: 1px solid var(--tg-hint-color, #ccc);
  border-radius: 8px;
  background-color: var(--tg-bg-color, #fff);
  align-items: center;
  min-height: 40px;
  cursor: text;
  width: 100%;
  box-sizing: border-box;
}

.tag-input-field.has-error {
  border-color: #e53e3e; /* Красная граница при ошибке */
}

.tag-item {
  display: inline-flex;
  align-items: center;
  background-color: var(--tg-secondary-bg-color, #f5f5f5);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.tag-remove {
  margin-left: 6px;
  background: none;
  border: none;
  color: var(--tg-text-color, #000);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.tag-input-inner {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: var(--tg-text-color, #000);
  min-width: 100px;
  padding: 0;
}

.error-message {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
}
</style>