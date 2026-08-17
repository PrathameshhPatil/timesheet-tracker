import PropTypes from 'prop-types'
import { Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { exportToCSV } from '../utils/exportUtils'

export function ExportButton({ tasks, filename = 'timesheet-export.csv', label = 'Export CSV' }) {
  const handleExport = () => {
    if (tasks.length === 0) {
      toast.error('No tasks to export.')
      return
    }
    exportToCSV(tasks, filename)
    toast.success('Export downloaded.')
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      aria-label={label}
      className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <Download size={16} />
      {label}
    </button>
  )
}

ExportButton.propTypes = {
  tasks: PropTypes.array.isRequired,
  filename: PropTypes.string,
  label: PropTypes.string,
}
