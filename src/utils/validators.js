import { calculateDuration } from './timeUtils'

export function validateTaskName(name) {
  return typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 100
}

export function validateTimeRange(startTime, endTime) {
  if (!startTime || !endTime) return false
  return calculateDuration(startTime, endTime) > 0
}

export function validateTask(taskData) {
  const errors = {}

  if (!validateTaskName(taskData.taskName || '')) {
    errors.taskName = 'Task name must be between 2 and 100 characters.'
  }

  if (!taskData.date) {
    errors.date = 'Date is required.'
  }

  if (!taskData.category) {
    errors.category = 'Category is required.'
  }

  if (!taskData.startTime) {
    errors.startTime = 'Start time is required.'
  }

  if (!taskData.endTime) {
    errors.endTime = 'End time is required.'
  }

  if (taskData.startTime && taskData.endTime) {
    if (taskData.startTime === taskData.endTime) {
      errors.endTime = 'End time cannot be the same as start time.'
    } else if (!validateTimeRange(taskData.startTime, taskData.endTime)) {
      errors.endTime = 'End time must be after start time.'
    }
  }

  if (taskData.notes && taskData.notes.length > 500) {
    errors.notes = 'Notes must be 500 characters or fewer.'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}
