import { formatDurationDecimal } from './timeUtils'

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeCsvValue(value) {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportToCSV(tasks, filename = 'timesheet-export.csv') {
  const headers = [
    'Date',
    'Task Name',
    'Category',
    'Start Time',
    'End Time',
    'Duration (hours)',
    'Notes',
    'Status',
  ]
  const rows = tasks.map((t) => [
    t.date,
    t.taskName,
    t.category,
    t.startTime,
    t.endTime,
    formatDurationDecimal(t.duration).replace('h', ''),
    t.notes || '',
    t.status,
  ])
  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n')
  downloadFile(csv, filename, 'text/csv;charset=utf-8;')
}

export function exportToJSON(tasks, filename = 'timesheet-backup.json') {
  const json = JSON.stringify(tasks, null, 2)
  downloadFile(json, filename, 'application/json')
}

export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        if (!Array.isArray(parsed)) {
          reject(new Error('Invalid backup file: expected an array of tasks.'))
          return
        }
        const isValidShape = parsed.every(
          (item) => item && typeof item === 'object' && 'id' in item && 'taskName' in item
        )
        if (!isValidShape) {
          reject(new Error('Invalid backup file: tasks are missing required fields.'))
          return
        }
        resolve(parsed)
      } catch {
        reject(new Error('Could not parse JSON file.'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read file.'))
    reader.readAsText(file)
  })
}
