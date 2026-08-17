import { v4 as uuidv4 } from 'uuid'
import { subDays, format } from 'date-fns'
import { calculateDuration } from '../utils/timeUtils'

const TASK_TEMPLATES = [
  { name: 'Sprint planning meeting', category: 'Meeting' },
  { name: 'Code review for PR #42', category: 'Development' },
  { name: 'Quarterly report preparation', category: 'Admin' },
  { name: '1:1 with manager', category: 'Meeting' },
  { name: 'API documentation update', category: 'Development' },
  { name: 'Competitive landscape research', category: 'Research' },
  { name: 'Fix login page regression', category: 'Development' },
  { name: 'Team standup', category: 'Meeting' },
  { name: 'Expense report submission', category: 'Admin' },
  { name: 'Onboarding new hire walkthrough', category: 'Training' },
  { name: 'Coffee break', category: 'Break' },
  { name: 'Client requirements call', category: 'Meeting' },
  { name: 'Refactor authentication module', category: 'Development' },
  { name: 'Read industry whitepaper', category: 'Research' },
  { name: 'Lunch break', category: 'Break' },
  { name: 'Security training module', category: 'Training' },
  { name: 'Draft project proposal', category: 'Work' },
  { name: 'Inbox cleanup', category: 'Admin' },
  { name: 'Pair programming session', category: 'Development' },
  { name: 'Market analysis deep dive', category: 'Research' },
  { name: 'All-hands meeting', category: 'Meeting' },
  { name: 'Update project roadmap', category: 'Work' },
  { name: 'Debug production incident', category: 'Development' },
  { name: 'Vendor call', category: 'Other' },
  { name: 'Walk / stretch break', category: 'Break' },
]

const STATUSES = ['completed', 'completed', 'completed', 'in-progress', 'paused']

function pad(n) {
  return String(n).padStart(2, '0')
}

function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${pad(h)}:${pad(m)}`
}

function generateSampleTasks() {
  const tasks = []
  const now = Date.now()

  for (let i = 0; i < TASK_TEMPLATES.length; i += 1) {
    const daysAgo = 13 - Math.round((i / (TASK_TEMPLATES.length - 1)) * 13)
    const date = subDays(new Date(), daysAgo)
    const dayOfWeek = date.getDay()

    // Skip roughly half of weekend slots so some days have no tasks.
    if ((dayOfWeek === 0 || dayOfWeek === 6) && i % 2 === 0) {
      continue
    }

    const template = TASK_TEMPLATES[i]
    const startMinutes = 8 * 60 + ((i * 37) % (10 * 60)) // spread across 08:00-18:00
    const durationMinutes = [30, 45, 60, 90, 120, 180][i % 6]
    const endMinutes = Math.min(startMinutes + durationMinutes, 18 * 60)
    const startTime = minutesToTime(startMinutes)
    const endTime = minutesToTime(endMinutes)
    const status = STATUSES[i % STATUSES.length]
    const createdAt = now - daysAgo * 24 * 60 * 60 * 1000

    tasks.push({
      id: uuidv4(),
      date: format(date, 'yyyy-MM-dd'),
      taskName: template.name,
      category: template.category,
      startTime,
      endTime,
      duration: calculateDuration(startTime, endTime),
      notes: '',
      status,
      createdAt,
      updatedAt: createdAt,
    })
  }

  return tasks
}

export const sampleTasks = generateSampleTasks()

export function loadSampleData(storageKey = 'timetrack_tasks') {
  const existing = localStorage.getItem(storageKey)
  if (!existing) {
    localStorage.setItem(storageKey, JSON.stringify(sampleTasks))
    return true
  }
  return false
}
