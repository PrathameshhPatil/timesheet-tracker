import { addDays, format, isSameDay, parseISO, getDaysInMonth } from 'date-fns'

// Validated categorical palette (dataviz skill) — fixed hue order, never cycled.
// Slot order: blue, orange, aqua, yellow, magenta, green, violet, red.
const CATEGORY_ORDER = [
  'Work',
  'Development',
  'Meeting',
  'Admin',
  'Research',
  'Break',
  'Training',
  'Other',
]

export const CATEGORY_COLORS = {
  Work: '#2a78d6',
  Development: '#eb6834',
  Meeting: '#1baf7a',
  Admin: '#eda100',
  Research: '#e87ba4',
  Break: '#008300',
  Training: '#4a3aa7',
  Other: '#e34948',
}

export const CATEGORY_COLORS_DARK = {
  Work: '#3987e5',
  Development: '#d95926',
  Meeting: '#199e70',
  Admin: '#c98500',
  Research: '#d55181',
  Break: '#008300',
  Training: '#9085e9',
  Other: '#e66767',
}

// Status palette (fixed — never themed, never reused for series identity).
export const STATUS_COLORS = {
  completed: { light: '#0ca30c', dark: '#0ca30c' }, // good
  'in-progress': { light: '#fab219', dark: '#fab219' }, // warning
  paused: { light: '#898781', dark: '#898781' }, // muted, not a status hue
}

// Chart chrome & ink (palette.md) — surfaces, gridlines, ink tokens per mode.
export const CHART_CHROME = {
  light: {
    surface: '#fcfcfb',
    gridline: '#e1e0d9',
    axis: '#c3c2b7',
    textPrimary: '#0b0b0b',
    textSecondary: '#52514e',
    muted: '#898781',
  },
  dark: {
    surface: '#1a1a19',
    gridline: '#2c2c2a',
    axis: '#383835',
    textPrimary: '#ffffff',
    textSecondary: '#c3c2b7',
    muted: '#898781',
  },
}

export function getCategoryColor(category, isDark = false) {
  const map = isDark ? CATEGORY_COLORS_DARK : CATEGORY_COLORS
  return map[category] || (isDark ? '#c3c2b7' : '#898781')
}

export function getCategoryOrder() {
  return CATEGORY_ORDER
}

export function generateWeeklyBarData(tasks, weekStart) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  return days.map((day) => {
    const dayTasks = tasks.filter((t) => isSameDay(parseISO(t.date), day))
    const minutes = dayTasks.reduce((sum, t) => sum + t.duration, 0)
    return {
      day: format(day, 'EEE'),
      date: format(day, 'yyyy-MM-dd'),
      hours: Math.round((minutes / 60) * 100) / 100,
    }
  })
}

export function generateCategoryPieData(tasks, dateFrom, dateTo, isDark = false) {
  const inRange = tasks.filter((t) => {
    if (!dateFrom || !dateTo) return true
    return t.date >= dateFrom && t.date <= dateTo
  })
  const totals = {}
  inRange.forEach((t) => {
    totals[t.category] = (totals[t.category] || 0) + t.duration
  })
  const totalMinutes = Object.values(totals).reduce((a, b) => a + b, 0)
  return CATEGORY_ORDER.filter((category) => totals[category])
    .map((category) => ({
      category,
      name: category,
      value: Math.round((totals[category] / 60) * 100) / 100,
      percentage: totalMinutes > 0 ? Math.round((totals[category] / totalMinutes) * 1000) / 10 : 0,
      color: getCategoryColor(category, isDark),
    }))
}

export function generateMonthlyLineData(tasks, year, month) {
  const daysInMonth = getDaysInMonth(new Date(year, month))
  return Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
    const dayTasks = tasks.filter((t) => t.date === dateStr)
    const minutes = dayTasks.reduce((sum, t) => sum + t.duration, 0)
    return {
      date: format(new Date(year, month, dayNum), 'MMM d'),
      hours: Math.round((minutes / 60) * 100) / 100,
    }
  })
}
