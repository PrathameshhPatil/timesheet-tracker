import PropTypes from 'prop-types'
import { TaskCard } from './TaskCard'
import { EmptyState } from './EmptyState'

function LoadingSkeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
        />
      ))}
    </div>
  )
}

export function TaskList({ tasks, onEdit, onDelete, isLoading = false, emptyVariant = 'no-tasks' }) {
  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (tasks.length === 0) {
    return <EmptyState variant={emptyVariant} />
  }

  return (
    <div>
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
        {tasks.length} task{tasks.length === 1 ? '' : 's'} found
      </p>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  emptyVariant: PropTypes.oneOf(['no-tasks', 'no-results', 'no-data']),
}
