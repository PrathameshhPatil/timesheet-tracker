import { useState, useMemo, useEffect } from 'react'

const DEFAULT_FILTERS = {
  dateFrom: '',
  dateTo: '',
  category: 'All',
  status: 'All',
  searchQuery: '',
  sortBy: 'date',
  sortOrder: 'desc',
}

export function useFilters(tasks) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [debouncedSearch, setDebouncedSearch] = useState(filters.searchQuery)

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(filters.searchQuery)
    }, 300)
    return () => clearTimeout(handle)
  }, [filters.searchQuery])

  const filteredTasks = useMemo(() => {
    let result = [...tasks]

    if (filters.dateFrom) {
      result = result.filter((t) => t.date >= filters.dateFrom)
    }
    if (filters.dateTo) {
      result = result.filter((t) => t.date <= filters.dateTo)
    }
    if (filters.category !== 'All') {
      result = result.filter((t) => t.category === filters.category)
    }
    if (filters.status !== 'All') {
      result = result.filter((t) => t.status === filters.status)
    }
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.trim().toLowerCase()
      result = result.filter((t) => t.taskName.toLowerCase().includes(query))
    }

    const direction = filters.sortOrder === 'asc' ? 1 : -1
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'duration':
          return (a.duration - b.duration) * direction
        case 'category':
          return a.category.localeCompare(b.category) * direction
        case 'status':
          return a.status.localeCompare(b.status) * direction
        case 'date':
        default:
          if (a.date === b.date) {
            return a.startTime.localeCompare(b.startTime) * direction
          }
          return a.date.localeCompare(b.date) * direction
      }
    })

    return result
  }, [tasks, filters, debouncedSearch])

  const resetFilters = () => setFilters(DEFAULT_FILTERS)

  return { filteredTasks, filters, setFilters, resetFilters }
}
