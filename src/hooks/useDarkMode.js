import { useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useDarkMode() {
  const [isDark, setIsDark] = useLocalStorage('timetrack_dark_mode', false)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev)
  }, [setIsDark])

  return [isDark, toggleDarkMode]
}
