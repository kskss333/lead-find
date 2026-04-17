// src/utils/useTelegramTheme.js
export function useTelegramTheme() {
  let tg = null

  // Ищем Telegram WebApp
  const checkTg = () => {
    tg = window.Telegram?.WebApp
    if (tg) {
      console.log('✅ Telegram WebApp найден')
      applyTheme(tg.themeParams)
      tg.onEvent('themeChanged', () => {
        console.log('🎨 Тема изменилась')
        applyTheme(tg.themeParams)
      })
    } else {
      console.warn('⚠️ Telegram WebApp не найден. Используем fallback.')
      applyFallbackTheme()
    }
  }

  const applyTheme = (params) => {
    if (!params) return
    document.documentElement.style.setProperty('--tg-bg-color', params.bg_color)
    document.documentElement.style.setProperty('--tg-text-color', params.text_color)
    document.documentElement.style.setProperty('--tg-hint-color', params.hint_color)
    document.documentElement.style.setProperty('--tg-link-color', params.link_color)
    document.documentElement.style.setProperty('--tg-button-color', params.button_color)
    document.documentElement.style.setProperty('--tg-button-text-color', params.button_text_color)
    document.documentElement.style.setProperty('--tg-secondary-bg-color', params.secondary_bg_color)
    document.documentElement.style.setProperty('--tg-section-bg-color', params.section_bg_color)
  }

  const applyFallbackTheme = () => {
    // Не трогаем — пусть CSS сам решит по prefers-color-scheme
    // Мы НЕ задаём статичную тему — оставляем её динамической через CSS
  }

  // Запускаем проверку сразу
  if (typeof window !== 'undefined') {
    setTimeout(checkTg, 100)
  }

  return { tg }
}