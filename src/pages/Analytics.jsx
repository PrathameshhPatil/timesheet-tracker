import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format, subDays, startOfMonth, endOfMonth, subMonths, eachDayOfInterval } from 'date-fns'
import { useApp } from '../context/AppContext'
import { useSummary } from '../hooks/useSummary'
import { formatDuration } from '../utils/timeUtils'
import { EmptyState } from '../components/EmptyState'

const RANGE_OPTIONS = ['This Week', 'This Month', 'Last Month', 'Custom Range']

function resolveRange(rangeType, customFrom, customTo) {
  const today = new Date()
  switch (rangeType) {
    case 'This Week':
      return { from: subDays(today, 6), to: today }
    case 'This Month':
      return { from: startOfMonth(today), to: today }
    case 'Last Month': {
      const lastMonth = subMonths(today, 1)
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
    }
    case 'Custom Range':
    default:
      return {
        from: customFrom ? new Date(customFrom) : subDays(today, 6),
        to: customTo ? new Date(customTo) : today,
      }
  }
}

export function Analytics() {
  const { tasks, dailyTarget, isDark } = useApp()
  const { getCategoryBreakdown } = useSummary(tasks, dailyTarget, isDark)
  const [rangeType, setRangeType] = useState('This Week')
  const [customFrom, setCustomFrom] = useState(format(subDays(new Date(), 6), 'yyyy-MM-dd'))
  const [customTo, setCustomTo] = useState(format(new Date(), 'yyyy-MM-dd'))

  const { from, to } = resolveRange(rangeType, customFrom, customTo)
  const fromStr = format(from, 'yyyy-MM-dd')
  const toStr = format(to, 'yyyy-MM-dd')

  const rangeTasks = useMemo(
    () => tasks.filter((t) => t.date >= fromStr && t.date <= toStr),
    [tasks, fromStr, toStr]
  )

  const totalMinutes = rangeTasks.reduce((sum, t) => sum + t.duration, 0)
  const totalHours = totalMinutes / 60

  const dailyTrend = useMemo(() => {
    return eachDayOfInterval({ start: from, end: to }).map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const minutes = tasks.filter((t) => t.date === dateStr).reduce((sum, t) => sum + t.duration, 0)
      return { date: format(day, 'MMM d'), hours: Math.round((minutes / 60) * 100) / 100 }
    })
  }, [tasks, from, to])

  const categoryBreakdown = getCategoryBreakdown(fromStr, toStr)

  const topTasks = useMemo(
    () => [...rangeTasks].sort((a, b) => b.duration - a.duration).slice(0, 5),
    [rangeTasks]
  )

  const daysInRange = Math.max(1, eachDayOfInterval({ start: from, end: to }).length)
  const productivityScore = Math.min(
    100,
    Math.round((totalHours / (dailyTarget * daysInRange)) * 100)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setRangeType(opt)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                rangeType === opt
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {rangeType === 'Custom Range' ? (
        <div className="flex items-center gap-3">
          <label className="flex flex-col text-xs text-gray-500 dark:text-gray-400">
            From
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="mt-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100"
            />
          </label>
          <label className="flex flex-col text-xs text-gray-500 dark:text-gray-400">
            To
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="mt-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100"
            />
          </label>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Hours</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{formatDuration(totalMinutes)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Productivity Score</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{productivityScore}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">vs {dailyTarget}h/day target</p>
        </div>
      </div>

      {rangeTasks.length === 0 ? (
        <EmptyState variant="no-data" />
      ) : (
        <>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Daily Hours Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrend}>
                  <XAxis dataKey="date" stroke="currentColor" className="text-xs text-gray-500" />
                  <YAxis stroke="currentColor" className="text-xs text-gray-500" />
                  <Tooltip formatter={(value) => [`${value}h`, 'Hours']} />
                  <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Hours by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBreakdown}>
                    <XAxis dataKey="category" stroke="currentColor" className="text-xs text-gray-500" />
                    <YAxis stroke="currentColor" className="text-xs text-gray-500" />
                    <Tooltip formatter={(value) => [`${value}h`, 'Hours']} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {categoryBreakdown.map((entry) => (
                        <Cell key={entry.category} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Category Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryBreakdown} dataKey="value" nameKey="name" outerRadius={80} paddingAngle={2}>
                      {categoryBreakdown.map((entry) => (
                        <Cell key={entry.category} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}h`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Top 5 Most Time-Consuming Tasks</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs text-gray-500 dark:text-gray-400">
                  <th className="py-1.5">Task</th>
                  <th className="py-1.5">Category</th>
                  <th className="py-1.5">Date</th>
                  <th className="py-1.5 text-right">Duration</th>
                </tr>
              </thead>
              <tbody>
                {topTasks.map((task) => (
                  <tr key={task.id} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-1.5 text-gray-900 dark:text-gray-100">{task.taskName}</td>
                    <td className="py-1.5 text-gray-700 dark:text-gray-300">{task.category}</td>
                    <td className="py-1.5 text-gray-700 dark:text-gray-300">{task.date}</td>
                    <td className="py-1.5 text-right text-gray-700 dark:text-gray-300">
                      {formatDuration(task.duration)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
