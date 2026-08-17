import PropTypes from 'prop-types'

const MESSAGES = {
  'no-tasks': {
    icon: '📝',
    title: 'No tasks yet',
    description: 'Log your first task to start tracking your time.',
  },
  'no-results': {
    icon: '🔍',
    title: 'No matching tasks',
    description: 'Try adjusting or clearing your filters.',
  },
  'no-data': {
    icon: '📊',
    title: 'Nothing to show yet',
    description: 'Log some tasks to see analytics for this period.',
  },
}

export function EmptyState({ variant = 'no-tasks', actionLabel, onAction }) {
  const content = MESSAGES[variant] || MESSAGES['no-tasks']

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-12 px-6 text-center">
      <span className="text-4xl" aria-hidden="true">
        {content.icon}
      </span>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{content.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{content.description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

EmptyState.propTypes = {
  variant: PropTypes.oneOf(['no-tasks', 'no-results', 'no-data']),
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
}
