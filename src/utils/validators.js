export function validateTask(task) {
  const errors = {}

  if (!task.description?.trim()) {
    errors.description = 'Это поле обязательно'
  }

  if (task.region?.length === 0 && task.keywords?.length === 0) {
    errors.region = 'Укажите регион или ключевые слова'
    errors.keywords = 'Укажите регион или ключевые слова'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}