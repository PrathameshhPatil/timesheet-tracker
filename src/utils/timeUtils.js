import {
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO,
  format,
} from 'date-fns'

export function calculateDuration(startTime, endTime) {
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  return endMinutes - startMinutes
}

export function formatDuration(minutes) {
  const safeMinutes = Math.max(0, Math.round(minutes))
  const hours = Math.floor(safeMinutes / 60)
  const mins = safeMinutes % 60
  return `${hours}h ${mins}m`
}

export function formatDurationDecimal(minutes) {
  const hours = Math.max(0, minutes) / 60
  return `${hours.toFixed(1)}h`
}

export function getWeekStart(date) {
  return startOfWeek(date, { weekStartsOn: 1 })
}

export function getWeekEnd(date) {
  return endOfWeek(date, { weekStartsOn: 1 })
}

export function isToday(dateString) {
  return isSameDay(parseISO(dateString), new Date())
}

export function isThisWeek(dateString) {
  const date = parseISO(dateString)
  const now = new Date()
  return date >= getWeekStart(now) && date <= getWeekEnd(now)
}

export function formatDisplayDate(dateString) {
  return format(parseISO(dateString), 'EEE, MMM d')
}
