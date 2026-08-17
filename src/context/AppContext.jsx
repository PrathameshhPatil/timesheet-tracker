import { createContext, useContext, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'
import { useTasks } from '../hooks/useTasks'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useDarkMode } from '../hooks/useDarkMode'
import { useGistSync } from '../hooks/useGistSync'
import { sampleTasks } from '../data/sampleData'

export const DEFAULT_CATEGORIES = [
  'Work',
  'Development',
  'Meeting',
  'Admin',
  'Research',
  'Break',
  'Training',
  'Other',
]

const DEFAULT_WORKING_DAYS = {
  Mon: true,
  Tue: true,
  Wed: true,
  Thu: true,
  Fri: true,
  Sat: false,
  Sun: false,
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const taskApi = useTasks()
  const [customCategories, setCustomCategories] = useLocalStorage('timetrack_custom_categories', [])
  const [dailyTarget, setDailyTarget] = useLocalStorage('timetrack_daily_target', 8)
  const [workingDays, setWorkingDays] = useLocalStorage('timetrack_working_days', DEFAULT_WORKING_DAYS)
  const [isDark, toggleDarkMode] = useDarkMode()
  const gistSync = useGistSync()
  const hasCheckedInit = useRef(false)
  const hasMountedTasks = useRef(false)

  useEffect(() => {
    if (hasCheckedInit.current) return
    hasCheckedInit.current = true

    const initialized = window.localStorage.getItem('timetrack_initialized')
    if (!initialized) {
      window.localStorage.setItem('timetrack_initialized', 'true')
      if (taskApi.tasks.length === 0) {
        taskApi.replaceAllTasks(sampleTasks)
        toast.success('Welcome! Sample data loaded to get you started.')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!hasMountedTasks.current) {
      hasMountedTasks.current = true
      return
    }
    if (gistSync.isConnected) {
      gistSync.pushDebounced(taskApi.tasks)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskApi.tasks])

  const categories = [...DEFAULT_CATEGORIES, ...customCategories]

  const addCategory = (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('That category already exists.')
      return
    }
    setCustomCategories((prev) => [...prev, trimmed])
    toast.success(`Category "${trimmed}" added.`)
  }

  const deleteCategory = (name) => {
    if (DEFAULT_CATEGORIES.includes(name)) {
      toast.error('Default categories cannot be deleted.')
      return
    }
    setCustomCategories((prev) => prev.filter((c) => c !== name))
    toast.success(`Category "${name}" removed.`)
  }

  const value = {
    ...taskApi,
    categories,
    customCategories,
    addCategory,
    deleteCategory,
    dailyTarget,
    setDailyTarget,
    workingDays,
    setWorkingDays,
    isDark,
    toggleDarkMode,
    gistSync,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
