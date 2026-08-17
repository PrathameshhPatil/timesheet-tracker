import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { formatDuration } from '../utils/timeUtils'
import { TaskCard } from './TaskCard'
import { EmptyState } from './EmptyState'

export function DailySummary({ tasks, dailyTargetHours, onEdit, onDelete }) {
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const todaysTasks = tasks.filter((t) => t.date === todayStr)
  const totalMinutes = todaysTasks.reduce((sum, t) => sum + t.duration, 0)
  const targetMinutes = dailyTargetHours * 60
  const progress = targetMinutes > 0 ? Math.min(100, Math.round((totalMinutes / targetMinutes) * 100)) : 0
  const targetMet = progress >= 100

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {format(new Date(), 'EEEE, MMMM d')}
      </h3>
      <p className="mt-1 text-[2.75rem] font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100">
        {formatDuration(totalMinutes)}
      </p>

      {/* Meter: fill carries progress severity, unfilled track is a lighter step of the same ramp */}
      <div
        className={`mt-4 h-2 w-full overflow-hidden rounded-full ${
          targetMet ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-200 ${
            targetMet ? 'bg-[#0ca30c]' : 'bg-[#2a78d6] dark:bg-[#3987e5]'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs tabular-nums text-gray-500 dark:text-gray-400">
        {progress}% of {dailyTargetHours}h target
      </p>

      <div className="mt-5 space-y-2">
        {todaysTasks.length === 0 ? (
          <EmptyState variant="no-tasks" />
        ) : (
          todaysTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} compact />
          ))
        )}
      </div>
    </div>
  )
}

DailySummary.propTypes = {
  tasks: PropTypes.array.isRequired,
  dailyTargetHours: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}
