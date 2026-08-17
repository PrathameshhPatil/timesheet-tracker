import { useState } from 'react'
import PropTypes from 'prop-types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addWeeks } from 'date-fns'
import { getWeekStart, getWeekEnd } from '../utils/timeUtils'
import { useApp } from '../context/AppContext'
import { CHART_CHROME } from '../utils/chartUtils'

const GOOD = '#0ca30c'
const WARNING = '#fab219'

function ChartTooltip({ active, payload, chrome }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg border px-3 py-1.5 text-xs shadow-md"
      style={{ background: chrome.surface, borderColor: chrome.gridline, color: chrome.textPrimary }}
    >
      <span className="font-medium tabular-nums">{payload[0].value}h</span>
    </div>
  )
}

ChartTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  chrome: PropTypes.object.isRequired,
}

export function WeeklySummary({ dailyTargetHours, getWeeklyData }) {
  const { isDark } = useApp()
  const chrome = isDark ? CHART_CHROME.dark : CHART_CHROME.light
  const [weekAnchor, setWeekAnchor] = useState(new Date())
  const weekStart = getWeekStart(weekAnchor)
  const weekEnd = getWeekEnd(weekAnchor)
  const data = getWeeklyData(weekStart)
  const totalHours = data.reduce((sum, d) => sum + d.hours, 0)

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous week"
          onClick={() => setWeekAnchor((d) => addWeeks(d, -1))}
          className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d, yyyy')}
          </p>
          <p className="text-xs tabular-nums text-gray-500 dark:text-gray-400">{totalHours.toFixed(1)}h total this week</p>
        </div>
        <button
          type="button"
          aria-label="Next week"
          onClick={() => setWeekAnchor((d) => addWeeks(d, 1))}
          className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">
            <XAxis
              dataKey="day"
              stroke={chrome.axis}
              tick={{ fill: chrome.textSecondary, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: chrome.axis }}
            />
            <YAxis
              stroke={chrome.axis}
              tick={{ fill: chrome.muted, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <Tooltip content={<ChartTooltip chrome={chrome} />} cursor={{ fill: chrome.gridline, opacity: 0.4 }} />
            <Bar dataKey="hours" radius={[4, 4, 0, 0]} maxBarSize={24}>
              {data.map((entry) => (
                <Cell key={entry.date} fill={entry.hours >= dailyTargetHours ? GOOD : WARNING} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GOOD }} aria-hidden="true" />
          Target met
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: WARNING }} aria-hidden="true" />
          Below target
        </span>
      </div>
    </div>
  )
}

WeeklySummary.propTypes = {
  dailyTargetHours: PropTypes.number.isRequired,
  getWeeklyData: PropTypes.func.isRequired,
}
