// src/services/telegram.js
export function initTelegram() {
  const tg = window.Telegram?.WebApp

  if (!tg) {
    console.warn('Telegram WebApp SDK not available. Running in browser mode.')
    emulateThemeInBrowser()
    return null
  }

  console.info('✅ Telegram WebApp SDK initialized.')

  // Расширяем окно
  tg.ready()
  tg.expand()

  // Применяем тему
  applyTheme(tg.themeParams)

  // Слушаем изменения темы
  tg.onEvent('themeChanged', () => applyTheme(tg.themeParams))

  return tg
}

function applyTheme(themeParams) {
  if (!themeParams) return

  document.documentElement.style.setProperty('--tg-bg-color', themeParams.bg_color || '#ffffff')
  document.documentElement.style.setProperty('--tg-text-color', themeParams.text_color || '#000000')
  document.documentElement.style.setProperty('--tg-hint-color', themeParams.hint_color || '#8c8c8c')
  document.documentElement.style.setProperty('--tg-link-color', themeParams.link_color || '#2487e7')
  document.documentElement.style.setProperty('--tg-button-color', themeParams.button_color || '#2487e7')
  document.documentElement.style.setProperty('--tg-button-text-color', themeParams.button_text_color || '#ffffff')
  document.documentElement.style.setProperty('--tg-secondary-bg-color', themeParams.secondary_bg_color || '#f5f5f5')
  document.documentElement.style.setProperty('--tg-section-bg-color', themeParams.section_bg_color || '#ffffff')
  document.documentElement.style.setProperty('--tg-section-header-text-color', themeParams.header_text_color || '#000000')
}

function emulateThemeInBrowser() {
  // Эмуляция тёмной темы для разработки в браузере
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (prefersDark) {
    document.documentElement.style.setProperty('--tg-bg-color', '#1c1c1e')
    document.documentElement.style.setProperty('--tg-text-color', '#ffffff')
    document.documentElement.style.setProperty('--tg-hint-color', '#aaaaaa')
    document.documentElement.style.setProperty('--tg-link-color', '#5dade2')
    document.documentElement.style.setProperty('--tg-button-color', '#5dade2')
    document.documentElement.style.setProperty('--tg-button-text-color', '#ffffff')
    document.documentElement.style.setProperty('--tg-secondary-bg-color', '#2c2c2e')
    document.documentElement.style.setProperty('--tg-section-bg-color', '#2c2c2e')
  }
}

// Фейковый initData для dev-режима
export function getFakeInitData() {
  return 'query_id=xxx&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Anastasia%22%2C%22last_name%22%3A%22Sorokina%22%2C%22username%22%3A%22anastasia%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1234567890&hash=xxx'
}