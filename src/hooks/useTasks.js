import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import { useLocalStorage } from './useLocalStorage'
import { calculateDuration } from '../utils/timeUtils'
import { validateTask } from '../utils/validators'

export const TASKS_STORAGE_KEY = 'timetrack_tasks'

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage(TASKS_STORAGE_KEY, [])

  const addTask = useCallback(
    (taskData) => {
      const { isValid, errors } = validateTask(taskData)
      if (!isValid) {
        toast.error(Object.values(errors)[0] || 'Please fix the errors in the form.')
        return { success: false, errors }
      }

      const now = Date.now()
      const newTask = {
        id: uuidv4(),
        date: taskData.date,
        taskName: taskData.taskName.trim(),
        category: taskData.category,
        startTime: taskData.startTime,
        endTime: taskData.endTime,
        duration: calculateDuration(taskData.startTime, taskData.endTime),
        notes: taskData.notes?.trim() || '',
        status: taskData.status || 'in-progress',
        createdAt: now,
        updatedAt: now,
      }

      setTasks((prev) => [...prev, newTask])
      toast.success('Task added successfully!')
      return { success: true, task: newTask }
    },
    [setTasks]
  )

  const updateTask = useCallback(
    (id, taskData) => {
      const { isValid, errors } = validateTask(taskData)
      if (!isValid) {
        toast.error(Object.values(errors)[0] || 'Please fix the errors in the form.')
        return { success: false, errors }
      }

      let updated = null
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== id) return task
          updated = {
            ...task,
            date: taskData.date,
            taskName: taskData.taskName.trim(),
            category: taskData.category,
            startTime: taskData.startTime,
            endTime: taskData.endTime,
            duration: calculateDuration(taskData.startTime, taskData.endTime),
            notes: taskData.notes?.trim() || '',
            status: taskData.status,
            updatedAt: Date.now(),
          }
          return updated
        })
      )
      toast.success('Task updated successfully!')
      return { success: true, task: updated }
    },
    [setTasks]
  )

  const deleteTask = useCallback(
    (id) => {
      setTasks((prev) => prev.filter((task) => task.id !== id))
      toast.success('Task deleted.')
    },
    [setTasks]
  )

  const deleteTasks = useCallback(
    (ids) => {
      const idSet = new Set(ids)
      setTasks((prev) => prev.filter((task) => !idSet.has(task.id)))
      toast.success(`${ids.length} task${ids.length === 1 ? '' : 's'} deleted.`)
    },
    [setTasks]
  )

  const deleteAllTasks = useCallback(() => {
    setTasks([])
    toast.success('All tasks cleared.')
  }, [setTasks])

  const replaceAllTasks = useCallback(
    (newTasks) => {
      setTasks(newTasks)
    },
    [setTasks]
  )

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    deleteTasks,
    deleteAllTasks,
    replaceAllTasks,
  }
}
