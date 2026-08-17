import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Plus, CalendarDays, CheckCircle2, Tag } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useSummary } from '../hooks/useSummary'
import { StatsCard } from '../components/StatsCard'
import { DailySummary } from '../components/DailySummary'
import { WeeklySummary } from '../components/WeeklySummary'
import { Modal } from '../components/Modal'
import { TaskForm } from '../components/TaskForm'
import { getWeekStart } from '../utils/timeUtils'
import { CHART_CHROME } from '../utils/chartUtils'

export function Dashboard() {
  const { tasks, dailyTarget, deleteTask, isDark } = useApp()
  const { getWeeklyData, getCategoryBreakdown } = useSummary(tasks, dailyTarget, isDark)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const chrome = isDark ? CHART_CHROME.dark : CHART_CHROME.light

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const todaysTasks = useMemo(() => tasks.filter((t) => t.date === todayStr), [tasks, todayStr])

  const weeklyData = getWeeklyData(getWeekStart(new Date()))
  const weeklyHours = weeklyData.reduce((sum, d) => sum + d.hours, 0)
  const completedToday = todaysTasks.filter((t) => t.status === 'completed').length

  const topCategoryToday = useMemo(() => {
    if (todaysTasks.length === 0) return '—'
    const totals = {}
    todaysTasks.forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.duration
    })
    return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0]
  }, [todaysTasks])

  const categoryData = getCategoryBreakdown(
    format(getWeekStart(new Date()), 'yyyy-MM-dd'),
    format(new Date(), 'yyyy-MM-dd')
  )

  const openAddModal = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const openEditModal = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-emerald-600 hover:shadow"
        >
          <Plus size={16} />
          Quick Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard icon={CalendarDays} title="This Week's Hours" value={`${weeklyHours.toFixed(1)}h`} accent="violet" />
        <StatsCard icon={CheckCircle2} title="Tasks Completed Today" value={completedToday} accent="green" />
        <StatsCard icon={Tag} title="Top Category Today" value={topCategoryToday} accent="orange" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DailySummary
          tasks={tasks}
          dailyTargetHours={dailyTarget}
          onEdit={openEditModal}
          onDelete={deleteTask}
        />
        <WeeklySummary dailyTargetHours={dailyTarget} getWeeklyData={getWeeklyData} />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
        <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Category Breakdown (This Week)</h3>
        {categoryData.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">No tasks logged this week yet.</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={2}
                  stroke={chrome.surface}
                  strokeWidth={2}
                >
                  {categoryData.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}h`, name]}
                  contentStyle={{
                    background: chrome.surface,
                    border: `1px solid ${chrome.gridline}`,
                    borderRadius: 8,
                    color: chrome.textPrimary,
                    fontSize: 12,
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ color: chrome.textSecondary, fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTask ? 'Edit Task' : 'Add Task'}>
        <TaskForm
          editingTask={editingTask}
          onCancel={() => setIsModalOpen(false)}
          onSuccess={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
