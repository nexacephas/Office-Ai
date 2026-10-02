export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const themePreferenceKey = 'officepilot_theme_preference'

export function getThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(themePreferenceKey)
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'light'
  } catch {
    return 'light'
  }
}

export function saveThemePreference(preference: ThemePreference): void {
  try {
    localStorage.setItem(themePreferenceKey, preference)
  } catch {
    return
  }
}

export function resolveThemePreference(preference = getThemePreference()): ResolvedTheme {
  if (preference === 'system' && typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return preference === 'dark' ? 'dark' : 'light'
}