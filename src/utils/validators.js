const normalizeString = (value) => {
  if (typeof value === 'string') return value.trim()
  if (Array.isArray(value)) return value.filter(Boolean).map(s => s.trim()).join(' ')
  return ''
}

export function validateTask(task) {
  const errors = {}

  if (!task.description?.trim()) {
    errors.description = 'Это поле обязательно'
  }

  const region = normalizeString(task.region)
  const keywords = normalizeString(task.keywords)

  if (!region && !keywords) {
    errors.general = 'Укажите регион или ключевые слова'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}