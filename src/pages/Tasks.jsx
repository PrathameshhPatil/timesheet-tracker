import { useState } from 'react'
import { ArrowUpDown, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useFilters } from '../hooks/useFilters'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'
import { CategoryFilter } from '../components/CategoryFilter'
import { DateRangePicker } from '../components/DateRangePicker'
import { ExportButton } from '../components/ExportButton'
import { Modal } from '../components/Modal'

const PAGE_SIZE = 10

const SORT_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'duration', label: 'Duration' },
  { value: 'category', label: 'Category' },
  { value: 'status', label: 'Status' },
]

export function Tasks() {
  const { tasks, categories, deleteTask, deleteTasks } = useApp()
  const { filteredTasks, filters, setFilters, resetFilters } = useFilters(tasks)
  const [editingTask, setEditingTask] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [confirmingBulkDelete, setConfirmingBulkDelete] = useState(false)

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageTasks = filteredTasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleEdit = (task) => {
    setEditingTask(task)
    setIsEditModalOpen(true)
  }

  const toggleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc',
    }))
  }

  const toggleSelected = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleBulkDelete = () => {
    deleteTasks(selectedIds)
    setSelectedIds([])
    setConfirmingBulkDelete(false)
    setSelectMode(false)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Add a Task</h2>
        <TaskForm onSuccess={() => {}} />
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <DateRangePicker
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            onChange={({ dateFrom, dateTo }) => {
              setFilters((prev) => ({ ...prev, dateFrom, dateTo }))
              setPage(1)
            }}
          />

          <select
            value={filters.status}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, status: e.target.value }))
              setPage(1)
            }}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100"
          >
            <option value="All">All Statuses</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>

          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search task name..."
            className="flex-1 min-w-[160px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100"
          />

          <button
            type="button"
            onClick={() => {
              resetFilters()
              setPage(1)
            }}
            className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Clear Filters
          </button>

          <ExportButton tasks={filteredTasks} />
        </div>

        <CategoryFilter
          categories={categories}
          tasks={tasks}
          selected={filters.category}
          onSelect={(category) => {
            setFilters((prev) => ({ ...prev, category }))
            setPage(1)
          }}
        />

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-500 dark:text-gray-400">Sort by:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleSort(opt.value)}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-medium transition-all duration-200 ${
                filters.sortBy === opt.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {opt.label}
              {filters.sortBy === opt.value ? <ArrowUpDown size={12} /> : null}
            </button>
          ))}

          <span className="ml-auto" />

          <button
            type="button"
            onClick={() => {
              setSelectMode((prev) => !prev)
              setSelectedIds([])
            }}
            className="rounded-full px-2.5 py-1 font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
          >
            {selectMode ? 'Cancel Select' : 'Bulk Select'}
          </button>
          {selectMode && selectedIds.length > 0 ? (
            <button
              type="button"
              onClick={() => setConfirmingBulkDelete(true)}
              className="flex items-center gap-1 rounded-full bg-danger px-2.5 py-1 font-medium text-white transition-all duration-200 hover:bg-red-600"
            >
              <Trash2 size={12} />
              Delete {selectedIds.length} Selected
            </button>
          ) : null}
        </div>
      </div>

      {selectMode ? (
        <div className="space-y-2">
          {pageTasks.map((task) => (
            <label
              key={task.id}
              className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(task.id)}
                onChange={() => toggleSelected(task.id)}
                className="h-4 w-4"
              />
              <span className="text-sm text-gray-900 dark:text-gray-100">{task.taskName}</span>
              <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{task.date}</span>
            </label>
          ))}
        </div>
      ) : (
        <TaskList
          tasks={pageTasks}
          onEdit={handleEdit}
          onDelete={deleteTask}
          emptyVariant={tasks.length === 0 ? 'no-tasks' : 'no-results'}
        />
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3 text-sm">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-gray-700 dark:text-gray-200 disabled:opacity-40 transition-all duration-200"
          >
            Previous
          </button>
          <span className="text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-gray-700 dark:text-gray-200 disabled:opacity-40 transition-all duration-200"
          >
            Next
          </button>
        </div>
      ) : null}

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
        <TaskForm
          editingTask={editingTask}
          onCancel={() => setIsEditModalOpen(false)}
          onSuccess={() => setIsEditModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={confirmingBulkDelete}
        onClose={() => setConfirmingBulkDelete(false)}
        title="Delete selected tasks?"
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This will permanently delete {selectedIds.length} task{selectedIds.length === 1 ? '' : 's'}. This cannot be undone.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={handleBulkDelete}
            className="flex-1 rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-600"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setConfirmingBulkDelete(false)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  )
}
