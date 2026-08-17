import { useState, useCallback, useRef } from 'react'
import toast from 'react-hot-toast'
import { useLocalStorage } from './useLocalStorage'
import { createGist, updateGist, fetchGistTasks } from '../utils/gistApi'

const PUSH_DEBOUNCE_MS = 1500

export function useGistSync() {
  const [token, setToken] = useLocalStorage('timetrack_gist_token', '')
  const [gistId, setGistId] = useLocalStorage('timetrack_gist_id', '')
  const [lastSyncedAt, setLastSyncedAt] = useLocalStorage('timetrack_gist_last_synced', null)
  const [isSyncing, setIsSyncing] = useState(false)
  const pushTimer = useRef(null)

  const isConnected = Boolean(token && gistId)

  const connectNew = useCallback(
    async (newToken, tasks) => {
      setIsSyncing(true)
      try {
        const id = await createGist(newToken, tasks)
        setToken(newToken)
        setGistId(id)
        setLastSyncedAt(Date.now())
        toast.success('Cloud sync enabled — new gist created.')
        return id
      } catch (error) {
        toast.error(error.message || 'Could not create gist.')
        throw error
      } finally {
        setIsSyncing(false)
      }
    },
    [setToken, setGistId, setLastSyncedAt]
  )

  const connectExisting = useCallback(
    async (newToken, existingGistId) => {
      setIsSyncing(true)
      try {
        const tasks = await fetchGistTasks(newToken, existingGistId)
        setToken(newToken)
        setGistId(existingGistId)
        setLastSyncedAt(Date.now())
        toast.success(`Connected — pulled ${tasks.length} tasks from the gist.`)
        return tasks
      } catch (error) {
        toast.error(error.message || 'Could not connect to that gist.')
        throw error
      } finally {
        setIsSyncing(false)
      }
    },
    [setToken, setGistId, setLastSyncedAt]
  )

  const push = useCallback(
    async (tasks) => {
      if (!token || !gistId) return
      setIsSyncing(true)
      try {
        await updateGist(token, gistId, tasks)
        setLastSyncedAt(Date.now())
      } catch (error) {
        toast.error(error.message || 'Sync push failed.')
      } finally {
        setIsSyncing(false)
      }
    },
    [token, gistId, setLastSyncedAt]
  )

  const pushDebounced = useCallback(
    (tasks) => {
      if (!token || !gistId) return
      if (pushTimer.current) clearTimeout(pushTimer.current)
      pushTimer.current = setTimeout(() => push(tasks), PUSH_DEBOUNCE_MS)
    },
    [token, gistId, push]
  )

  const pull = useCallback(async () => {
    if (!token || !gistId) return null
    setIsSyncing(true)
    try {
      const tasks = await fetchGistTasks(token, gistId)
      setLastSyncedAt(Date.now())
      toast.success(`Pulled ${tasks.length} tasks from the cloud.`)
      return tasks
    } catch (error) {
      toast.error(error.message || 'Sync pull failed.')
      return null
    } finally {
      setIsSyncing(false)
    }
  }, [token, gistId, setLastSyncedAt])

  const disconnect = useCallback(() => {
    setToken('')
    setGistId('')
    setLastSyncedAt(null)
    toast.success('Cloud sync disconnected.')
  }, [setToken, setGistId, setLastSyncedAt])

  return {
    isConnected,
    isSyncing,
    gistId,
    lastSyncedAt,
    connectNew,
    connectExisting,
    push,
    pushDebounced,
    pull,
    disconnect,
  }
}
