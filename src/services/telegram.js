export function initTelegram() {
  const tg = window.Telegram?.WebApp

  if (!tg) {
    console.info('Telegram WebApp SDK not available. Running in browser mode.')
    emulateThemeInBrowser()
    return null
  }

  console.info('Telegram WebApp SDK initialized.')

  tg.ready()
  tg.expand()

  applyTheme(tg.themeParams)

  tg.onEvent('themeChanged', () => applyTheme(tg.themeParams))

  return tg
}

function applyTheme(params) {
  if (!params) return

  const root = document.documentElement
  const toHex = (hex) => '#' + (hex?.length === 3 ? hex.replace(/./g, '$&$&') : hex)

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

function emulateThemeInBrowser() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  const root = document.documentElement

  if (isDark) {
    root.style.setProperty('--tg-bg-color', '#1c1c1e')
    root.style.setProperty('--tg-text-color', '#ffffff')
    root.style.setProperty('--tg-hint-color', '#aaaaaa')
    root.style.setProperty('--tg-link-color', '#5dade2')
    root.style.setProperty('--tg-button-color', '#5dade2')
    root.style.setProperty('--tg-button-text-color', '#ffffff')
    root.style.setProperty('--tg-secondary-bg-color', '#2c2c2e')
    root.style.setProperty('--tg-accent-text-color', '#5dade2')
    root.style.setProperty('--tg-section-bg-color', '#2c2c2e')
    root.style.setProperty('--tg-section-header-text-color', '#ffffff')
    root.style.setProperty('--tg-subtitle-text-color', '#aaaaaa')
  } else {
    root.style.setProperty('--tg-bg-color', '#ffffff')
    root.style.setProperty('--tg-text-color', '#000000')
    root.style.setProperty('--tg-hint-color', '#8c8c8c')
    root.style.setProperty('--tg-link-color', '#2487e7')
    root.style.setProperty('--tg-button-color', '#2487e7')
    root.style.setProperty('--tg-button-text-color', '#ffffff')
    root.style.setProperty('--tg-secondary-bg-color', '#f5f5f5')
    root.style.setProperty('--tg-accent-text-color', '#2487e7')
    root.style.setProperty('--tg-section-bg-color', '#ffffff')
    root.style.setProperty('--tg-section-header-text-color', '#000000')
    root.style.setProperty('--tg-subtitle-text-color', '#8c8c8c')
  }
}

export function getFakeInitData() {
  return 'query_id=xxx&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Anastasia%22%2C%22last_name%22%3A%22Sorokina%22%2C%22username%22%3A%22anastasia%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1234567890&hash=xxx'
}