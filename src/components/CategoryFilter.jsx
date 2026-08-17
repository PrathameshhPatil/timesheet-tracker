import PropTypes from 'prop-types'

export function CategoryFilter({ categories, tasks, selected, onSelect }) {
  const countFor = (category) =>
    category === 'All' ? tasks.length : tasks.filter((t) => t.category === category).length

  const allOptions = ['All', ...categories]

  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter by category">
      {allOptions.map((category) => {
        const isActive = selected === category
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(category)}
            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category} ({countFor(category)})
          </button>
        )
      })}
    </div>
  )
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  tasks: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
}
