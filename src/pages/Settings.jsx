import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { Sun, Moon, Download, Upload, Trash2, UploadCloud, DownloadCloud, Cloud, CloudOff } from 'lucide-react'
import { useApp, DEFAULT_CATEGORIES } from '../context/AppContext'
import { Modal } from '../components/Modal'
import { exportToJSON, importFromJSON } from '../utils/exportUtils'

const APP_VERSION = '1.0.0'
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function Settings() {
  const {
    isDark,
    toggleDarkMode,
    customCategories,
    addCategory,
    deleteCategory,
    dailyTarget,
    setDailyTarget,
    workingDays,
    setWorkingDays,
    tasks,
    replaceAllTasks,
    deleteAllTasks,
    gistSync,
  } = useApp()

  const [newCategory, setNewCategory] = useState('')
  const [confirmStep, setConfirmStep] = useState(0)
  const fileInputRef = useRef(null)
  const [syncToken, setSyncToken] = useState('')
  const [existingGistId, setExistingGistId] = useState('')
  const [syncMode, setSyncMode] = useState('new')

  const handleConnectNew = async (e) => {
    e.preventDefault()
    if (!syncToken.trim()) return
    try {
      await gistSync.connectNew(syncToken.trim(), tasks)
      setSyncToken('')
    } catch {
      // toast already shown by the hook
    }
  }

  const handleConnectExisting = async (e) => {
    e.preventDefault()
    if (!syncToken.trim() || !existingGistId.trim()) return
    try {
      const remoteTasks = await gistSync.connectExisting(syncToken.trim(), existingGistId.trim())
      replaceAllTasks(remoteTasks)
      setSyncToken('')
      setExistingGistId('')
    } catch {
      // toast already shown by the hook
    }
  }

  const handlePull = async () => {
    const remoteTasks = await gistSync.pull()
    if (remoteTasks) replaceAllTasks(remoteTasks)
  }

  const handleAddCategory = (e) => {
    e.preventDefault()
    addCategory(newCategory)
    setNewCategory('')
  }

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const imported = await importFromJSON(file)
      replaceAllTasks(imported)
      toast.success(`Imported ${imported.length} tasks.`)
    } catch (error) {
      toast.error(error.message || 'Import failed.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Dark Mode</span>
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300"
            >
              {cat}
            </span>
          ))}
          {customCategories.map((cat) => (
            <span
              key={cat}
              className="flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-primary"
            >
              {cat}
              <button
                type="button"
                aria-label={`Remove category ${cat}`}
                onClick={() => deleteCategory(cat)}
                className="text-primary hover:text-blue-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <form onSubmit={handleAddCategory} className="mt-3 flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600"
          >
            Add
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Daily Target</h2>
        <label className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          Target hours per day
          <input
            type="number"
            min={1}
            max={24}
            step={0.5}
            value={dailyTarget}
            onChange={(e) => setDailyTarget(Number(e.target.value) || 8)}
            className="w-24 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100"
          />
        </label>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Working Days</h2>
        <div className="flex flex-wrap gap-3">
          {WEEKDAYS.map((day) => (
            <label key={day} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={Boolean(workingDays[day])}
                onChange={() =>
                  setWorkingDays((prev) => ({ ...prev, [day]: !prev[day] }))
                }
                className="h-4 w-4"
              />
              {day}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Data</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => exportToJSON(tasks)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download size={16} />
            Export Backup (JSON)
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Upload size={16} />
            Import Backup (JSON)
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
          <button
            type="button"
            onClick={() => setConfirmStep(1)}
            className="flex items-center gap-2 rounded-lg bg-danger px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-red-600"
          >
            <Trash2 size={16} />
            Clear All Data
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {gistSync.isConnected ? <Cloud size={16} /> : <CloudOff size={16} />}
          Cloud Sync (GitHub Gist)
        </h2>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          Syncs your tasks to a private GitHub Gist so you can pick up the same data on another
          device or browser. Needs a{' '}
          <a
            href="https://github.com/settings/tokens?type=beta"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline"
          >
            fine-grained personal access token
          </a>{' '}
          scoped to <strong>Gists: Read and write</strong> only. The token is stored only in this
          browser's local storage — never commit it anywhere, and revoke it on GitHub if you stop
          using sync.
        </p>

        {gistSync.isConnected ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Connected to gist <code className="rounded bg-gray-100 dark:bg-gray-700 px-1 py-0.5 text-xs">{gistSync.gistId}</code>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {gistSync.lastSyncedAt
                ? `Last synced ${new Date(gistSync.lastSyncedAt).toLocaleString()}`
                : 'Not synced yet.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => gistSync.push(tasks)}
                disabled={gistSync.isSyncing}
                className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <UploadCloud size={16} />
                Push Now
              </button>
              <button
                type="button"
                onClick={handlePull}
                disabled={gistSync.isSyncing}
                className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <DownloadCloud size={16} />
                Pull Latest
              </button>
              <button
                type="button"
                onClick={gistSync.disconnect}
                className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-danger transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <CloudOff size={16} />
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-3 flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSyncMode('new')}
                className={`rounded-full px-2.5 py-1 font-medium transition-all duration-200 ${
                  syncMode === 'new'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                First device (create new)
              </button>
              <button
                type="button"
                onClick={() => setSyncMode('existing')}
                className={`rounded-full px-2.5 py-1 font-medium transition-all duration-200 ${
                  syncMode === 'existing'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Another device (connect existing)
              </button>
            </div>

            {syncMode === 'new' ? (
              <form onSubmit={handleConnectNew} className="flex gap-2">
                <input
                  type="password"
                  value={syncToken}
                  onChange={(e) => setSyncToken(e.target.value)}
                  placeholder="GitHub personal access token"
                  className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100"
                />
                <button
                  type="submit"
                  disabled={gistSync.isSyncing}
                  className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600 disabled:opacity-50"
                >
                  {gistSync.isSyncing ? 'Connecting…' : 'Create Gist & Enable Sync'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConnectExisting} className="space-y-2">
                <input
                  type="password"
                  value={syncToken}
                  onChange={(e) => setSyncToken(e.target.value)}
                  placeholder="GitHub personal access token"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={existingGistId}
                    onChange={(e) => setExistingGistId(e.target.value)}
                    placeholder="Gist ID (shown on your first device)"
                    className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100"
                  />
                  <button
                    type="submit"
                    disabled={gistSync.isSyncing}
                    className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600 disabled:opacity-50"
                  >
                    {gistSync.isSyncing ? 'Connecting…' : 'Connect'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This pulls the gist's tasks and replaces what's currently on this device.
                </p>
              </form>
            )}
          </div>
        )}
      </section>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500">TimeTrack v{APP_VERSION}</p>

      <Modal isOpen={confirmStep === 1} onClose={() => setConfirmStep(0)} title="Clear all data?">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This will permanently delete all {tasks.length} logged tasks. This action cannot be undone.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => setConfirmStep(2)}
            className="flex-1 rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-600"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={() => setConfirmStep(0)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal isOpen={confirmStep === 2} onClose={() => setConfirmStep(0)} title="Are you absolutely sure?">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Last chance — clicking "Delete Everything" removes all tasks permanently.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => {
              deleteAllTasks()
              setConfirmStep(0)
            }}
            className="flex-1 rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-600"
          >
            Delete Everything
          </button>
          <button
            type="button"
            onClick={() => setConfirmStep(0)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  )
}
