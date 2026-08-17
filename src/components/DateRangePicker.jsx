import PropTypes from 'prop-types'

export function DateRangePicker({ dateFrom, dateTo, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex flex-col text-xs font-medium text-gray-500 dark:text-gray-400">
        From
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onChange({ dateFrom: e.target.value, dateTo })}
          className="mt-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 transition-all duration-200 focus:border-primary focus:outline-none"
        />
      </label>
      <label className="flex flex-col text-xs font-medium text-gray-500 dark:text-gray-400">
        To
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onChange({ dateFrom, dateTo: e.target.value })}
          className="mt-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 transition-all duration-200 focus:border-primary focus:outline-none"
        />
      </label>
    </div>
  )
}

DateRangePicker.propTypes = {
  dateFrom: PropTypes.string.isRequired,
  dateTo: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
