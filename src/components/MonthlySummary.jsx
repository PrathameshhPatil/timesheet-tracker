import { useState } from 'react'
import PropTypes from 'prop-types'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addMonths, startOfMonth, endOfMonth } from 'date-fns'

export function MonthlySummary({ getMonthlyData, getCategoryBreakdown }) {
  const [monthAnchor, setMonthAnchor] = useState(new Date())
  const year = monthAnchor.getFullYear()
  const month = monthAnchor.getMonth()
  const data = getMonthlyData(year, month)
  const totalHours = data.reduce((sum, d) => sum + d.hours, 0)
  const breakdown = getCategoryBreakdown(
    format(startOfMonth(monthAnchor), 'yyyy-MM-dd'),
    format(endOfMonth(monthAnchor), 'yyyy-MM-dd')
  )

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setMonthAnchor((d) => addMonths(d, -1))}
          className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{format(monthAnchor, 'MMMM yyyy')}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{totalHours.toFixed(1)}h total this month</p>
        </div>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setMonthAnchor((d) => addMonths(d, 1))}
          className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="currentColor" className="text-xs text-gray-500" interval={4} />
            <YAxis stroke="currentColor" className="text-xs text-gray-500" />
            <Tooltip formatter={(value) => [`${value}h`, 'Hours']} />
            <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs text-gray-500 dark:text-gray-400">
            <th className="py-1.5">Category</th>
            <th className="py-1.5 text-right">Hours</th>
            <th className="py-1.5 text-right">%</th>
          </tr>
        </thead>
        <tbody>
          {breakdown.map((row) => (
            <tr key={row.category} className="border-b border-gray-100 dark:border-gray-700/50">
              <td className="py-1.5 text-gray-700 dark:text-gray-300">{row.category}</td>
              <td className="py-1.5 text-right text-gray-700 dark:text-gray-300">{row.value.toFixed(1)}h</td>
              <td className="py-1.5 text-right text-gray-700 dark:text-gray-300">{row.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

MonthlySummary.propTypes = {
  getMonthlyData: PropTypes.func.isRequired,
  getCategoryBreakdown: PropTypes.func.isRequired,
}
