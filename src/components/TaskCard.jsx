import { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { Pencil, Trash2, Check, X, CheckCircle2, CircleDashed, PauseCircle } from 'lucide-react'
import { formatDisplayDate, formatDuration } from '../utils/timeUtils'
import { getCategoryColor } from '../utils/chartUtils'
import { useApp } from '../context/AppContext'

const STATUS_STYLES = {
  'in-progress': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  completed: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  paused: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
}

const STATUS_ICONS = {
  'in-progress': CircleDashed,
  completed: CheckCircle2,
  paused: PauseCircle,
}

const STATUS_LABELS = {
  'in-progress': 'In Progress',
  completed: 'Completed',
  paused: 'Paused',
}

function TaskCardBase({ task, onEdit, onDelete, compact = false }) {
  const { isDark } = useApp()
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const categoryColor = getCategoryColor(task.category, isDark)
  const StatusIcon = STATUS_ICONS[task.status]

  return (
    <article className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-gray-50 dark:bg-gray-900/40 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: categoryColor }}
            aria-hidden="true"
          />
          {task.category}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{task.taskName}</p>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {formatDisplayDate(task.date)} · {task.startTime}–{task.endTime}
            {!compact ? ` · ${formatDuration(task.duration)}` : null}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs font-medium tabular-nums text-gray-600 dark:text-gray-300">
          {formatDuration(task.duration)}
        </span>
        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}>
          <StatusIcon size={12} />
          {STATUS_LABELS[task.status]}
        </span>

        {confirmingDelete ? (
          <>
            <button
              type="button"
              aria-label="Confirm delete"
              onClick={() => {
                onDelete(task.id)
                setConfirmingDelete(false)
              }}
              className="rounded-full p-1.5 text-danger hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
            >
              <Check size={16} />
            </button>
            <button
              type="button"
              aria-label="Cancel delete"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              aria-label="Edit task"
              onClick={() => onEdit(task)}
              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              aria-label="Delete task"
              onClick={() => setConfirmingDelete(true)}
              className="rounded-full p-1.5 text-gray-500 hover:bg-red-50 hover:text-danger dark:hover:bg-red-900/30 transition-all duration-200"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </article>
  )
}

TaskCardBase.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    taskName: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  compact: PropTypes.bool,
}

export const TaskCard = memo(TaskCardBase)
