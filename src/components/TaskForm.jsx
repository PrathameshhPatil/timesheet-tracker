import { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { useApp } from '../context/AppContext'
import { calculateDuration, formatDuration } from '../utils/timeUtils'
import { validateTask } from '../utils/validators'

function buildInitialState(editingTask) {
  if (editingTask) {
    return {
      date: editingTask.date,
      taskName: editingTask.taskName,
      category: editingTask.category,
      startTime: editingTask.startTime,
      endTime: editingTask.endTime,
      notes: editingTask.notes || '',
      status: editingTask.status,
    }
  }
  return {
    date: format(new Date(), 'yyyy-MM-dd'),
    taskName: '',
    category: '',
    startTime: '',
    endTime: '',
    notes: '',
    status: 'in-progress',
  }
}

export function TaskForm({ editingTask = null, onCancel, onSuccess }) {
  const { categories, addTask, updateTask } = useApp()
  const [formData, setFormData] = useState(() => buildInitialState(editingTask))
  const [errors, setErrors] = useState({})
  const endTimeRef = useRef(null)

  useEffect(() => {
    setFormData(buildInitialState(editingTask))
    setErrors({})
  }, [editingTask])

  const durationMinutes =
    formData.startTime && formData.endTime && formData.startTime !== formData.endTime
      ? calculateDuration(formData.startTime, formData.endTime)
      : null

  const handleChange = useCallback((field) => (event) => {
    const value = event.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === 'startTime' && value) {
      endTimeRef.current?.focus()
    }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const { isValid, errors: validationErrors } = validateTask(formData)
    setErrors(validationErrors)
    if (!isValid) return

    const result = editingTask ? updateTask(editingTask.id, formData) : addTask(formData)
    if (result.success) {
      setFormData(buildInitialState(null))
      onSuccess?.()
    }
  }

  const isMidnightCrossing =
    formData.startTime && formData.endTime && formData.endTime < formData.startTime

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="taskDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date
        </label>
        <input
          id="taskDate"
          type="date"
          value={formData.date}
          onChange={handleChange('date')}
          className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 transition-all duration-200 focus:border-primary focus:outline-none"
        />
        {errors.date ? <p className="mt-1 text-xs text-danger">{errors.date}</p> : null}
      </div>

      <div>
        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Task Name
        </label>
        <input
          id="taskName"
          type="text"
          value={formData.taskName}
          onChange={handleChange('taskName')}
          placeholder="What did you work on?"
          className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 transition-all duration-200 focus:border-primary focus:outline-none"
        />
        {errors.taskName ? <p className="mt-1 text-xs text-danger">{errors.taskName}</p> : null}
      </div>

      <div>
        <label htmlFor="taskCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          id="taskCategory"
          value={formData.category}
          onChange={handleChange('category')}
          className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 transition-all duration-200 focus:border-primary focus:outline-none"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category ? <p className="mt-1 text-xs text-danger">{errors.category}</p> : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Time
          </label>
          <input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={handleChange('startTime')}
            className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 transition-all duration-200 focus:border-primary focus:outline-none"
          />
          {errors.startTime ? <p className="mt-1 text-xs text-danger">{errors.startTime}</p> : null}
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Time
          </label>
          <input
            id="endTime"
            ref={endTimeRef}
            type="time"
            value={formData.endTime}
            onChange={handleChange('endTime')}
            className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 transition-all duration-200 focus:border-primary focus:outline-none"
          />
          {errors.endTime ? <p className="mt-1 text-xs text-danger">{errors.endTime}</p> : null}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration</span>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {durationMinutes !== null && durationMinutes > 0
            ? formatDuration(durationMinutes)
            : '—'}
        </p>
        {isMidnightCrossing ? (
          <p className="mt-1 text-xs text-accent">
            Heads up: end time is earlier than start time (crosses midnight).
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="taskNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes
        </label>
        <textarea
          id="taskNotes"
          value={formData.notes}
          onChange={handleChange('notes')}
          placeholder="Any notes..."
          rows={3}
          className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 transition-all duration-200 focus:border-primary focus:outline-none"
        />
        {errors.notes ? <p className="mt-1 text-xs text-danger">{errors.notes}</p> : null}
      </div>

      <div>
        <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <select
          id="taskStatus"
          value={formData.status}
          onChange={handleChange('status')}
          className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 transition-all duration-200 focus:border-primary focus:outline-none"
        >
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200 ${
            editingTask ? 'bg-primary hover:bg-blue-600' : 'bg-secondary hover:bg-emerald-600'
          }`}
        >
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}

TaskForm.propTypes = {
  editingTask: PropTypes.object,
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
}
