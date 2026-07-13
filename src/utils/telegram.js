const CSS_VARS = [
  'bg-color',
  'text-color',
  'hint-color',
  'link-color',
  'button-color',
  'button-text-color',
  'secondary-bg-color',
  'section-bg-color'
]

export function applyTelegramTheme() {
  const tg = window.Telegram?.WebApp

  if (!tg) {
    const fallback = {
      'bg-color': '#1c1c1e',
      'text-color': '#ffffff',
      'hint-color': '#aaaaaa',
      'link-color': '#5dade2',
      'button-color': '#5dade2',
      'button-text-color': '#ffffff',
      'secondary-bg-color': '#2c2c2e',
      'section-bg-color': '#2c2c2e'
    }
    applyParams(fallback)
    return () => {}
  }

  applyParams(tg.themeParams)

  const handler = () => applyParams(tg.themeParams)
  tg.onEvent('themeChanged', handler)

  return () => {
    tg.offEvent('themeChanged', handler)
  }
}

function applyParams(params) {
  if (!params) return
  CSS_VARS.forEach(key => {
    const value = params[key] || null
    if (value) {
      document.documentElement.style.setProperty(`--tg-${key}`, value)
    }
  })
}