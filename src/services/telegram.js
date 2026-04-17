export function applyTelegramTheme() {
  const tg = window.Telegram?.WebApp

  if (!tg) {
    console.warn('Telegram WebApp not available. Using fallback dark theme.')
    document.documentElement.style.setProperty('--tg-bg-color', '#1c1c1e')
    document.documentElement.style.setProperty('--tg-text-color', '#ffffff')
    document.documentElement.style.setProperty('--tg-hint-color', '#aaaaaa')
    document.documentElement.style.setProperty('--tg-link-color', '#5dade2')
    document.documentElement.style.setProperty('--tg-button-color', '#5dade2')
    document.documentElement.style.setProperty('--tg-button-text-color', '#ffffff')
    document.documentElement.style.setProperty('--tg-secondary-bg-color', '#2c2c2e')
    document.documentElement.style.setProperty('--tg-section-bg-color', '#2c2c2e')
    return
  }

  console.info('✅ Telegram WebApp detected. Applying theme...')

  const params = tg.themeParams
  if (params) {
    document.documentElement.style.setProperty('--tg-bg-color', params.bg_color || '#ffffff')
    document.documentElement.style.setProperty('--tg-text-color', params.text_color || '#000000')
    document.documentElement.style.setProperty('--tg-hint-color', params.hint_color || '#8c8c8c')
    document.documentElement.style.setProperty('--tg-link-color', params.link_color || '#2487e7')
    document.documentElement.style.setProperty('--tg-button-color', params.button_color || '#2487e7')
    document.documentElement.style.setProperty('--tg-button-text-color', params.button_text_color || '#ffffff')
    document.documentElement.style.setProperty('--tg-secondary-bg-color', params.secondary_bg_color || '#f5f5f5')
    document.documentElement.style.setProperty('--tg-section-bg-color', params.section_bg_color || '#ffffff')
    document.documentElement.style.setProperty('--tg-section-header-text-color', params.header_text_color || '#000000')
  }

  tg.onEvent('themeChanged', () => {
    console.log('🎨 Theme changed')
    applyTelegramTheme()
  })
}