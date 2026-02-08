// src/services/telegram.js
export function initTelegram() {
  const tg = window.Telegram?.WebApp

  if (!tg) {
    console.warn('Telegram WebApp SDK not available. Running in browser mode.')
    // Для тестирования в браузере можно задать тему вручную
    if (import.meta.env.DEV) {
      document.documentElement.style.setProperty('--tg-bg-color', '#ffffff')
      document.documentElement.style.setProperty('--tg-text-color', '#000000')
      document.documentElement.style.setProperty('--tg-hint-color', '#8c8c8c')
      document.documentElement.style.setProperty('--tg-link-color', '#2487e7')
      document.documentElement.style.setProperty('--tg-button-color', '#2487e7')
      document.documentElement.style.setProperty('--tg-button-text-color', '#ffffff')
      document.documentElement.style.setProperty('--tg-secondary-bg-color', '#f5f5f5')
      document.documentElement.style.setProperty('--tg-accent-text-color', '#2487e7')
      document.documentElement.style.setProperty('--tg-section-bg-color', '#ffffff')
      document.documentElement.style.setProperty('--tg-section-header-text-color', '#000000')
      document.documentElement.style.setProperty('--tg-subtitle-text-color', '#8c8c8c')
    }
    return null
  }

  tg.ready()
  tg.expand()

  // Применяем тему
  applyTheme(tg.themeParams)

  // Слушаем изменения темы
  tg.onEvent('themeChanged', () => applyTheme(tg.themeParams))

  // Слушаем закрытие (опционально)
  tg.onEvent('mainButtonClicked', () => {
    tg.close()
  })

  return tg
}

function applyTheme(params) {
  if (!params) return

  const root = document.documentElement
  const toHex = (hex) => '#' + (hex?.length === 3 ? hex.replace(/./g, '$&$&') : hex)

  // Убедимся, что все параметры существуют, прежде чем устанавливать
  if (params.bg_color) root.style.setProperty('--tg-bg-color', toHex(params.bg_color))
  if (params.text_color) root.style.setProperty('--tg-text-color', toHex(params.text_color))
  if (params.hint_color) root.style.setProperty('--tg-hint-color', toHex(params.hint_color))
  if (params.link_color) root.style.setProperty('--tg-link-color', toHex(params.link_color))
  if (params.button_color) root.style.setProperty('--tg-button-color', toHex(params.button_color))
  if (params.button_text_color) root.style.setProperty('--tg-button-text-color', toHex(params.button_text_color))
  if (params.secondary_bg_color) root.style.setProperty('--tg-secondary-bg-color', toHex(params.secondary_bg_color))
  if (params.accent_text_color) root.style.setProperty('--tg-accent-text-color', toHex(params.accent_text_color))
  if (params.section_bg_color) root.style.setProperty('--tg-section-bg-color', toHex(params.section_bg_color))
  if (params.section_header_text_color) root.style.setProperty('--tg-section-header-text-color', toHex(params.section_header_text_color))
  if (params.subtitle_text_color) root.style.setProperty('--tg-subtitle-text-color', toHex(params.subtitle_text_color))
}