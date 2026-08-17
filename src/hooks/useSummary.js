import { useMemo } from 'react'
import { format } from 'date-fns'
import { generateWeeklyBarData, generateMonthlyLineData, generateCategoryPieData } from '../utils/chartUtils'

export function useSummary(tasks, dailyTargetHours = 8, isDark = false) {
  return useMemo(() => {
    const getDailyTotal = (date) => {
      const dateStr = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd')
      return tasks
        .filter((t) => t.date === dateStr)
        .reduce((sum, t) => sum + t.duration, 0)
    }

    const getWeeklyData = (weekStart) => generateWeeklyBarData(tasks, weekStart)

    const getMonthlyData = (year, month) => generateMonthlyLineData(tasks, year, month)

    const getCategoryBreakdown = (dateFrom, dateTo) =>
      generateCategoryPieData(tasks, dateFrom, dateTo, isDark)

    const getProductivityScore = (date) => {
      const minutes = getDailyTotal(date)
      const targetMinutes = dailyTargetHours * 60
      if (targetMinutes <= 0) return 0
      return Math.min(100, Math.round((minutes / targetMinutes) * 100))
    }

    return {
      getDailyTotal,
      getWeeklyData,
      getMonthlyData,
      getCategoryBreakdown,
      getProductivityScore,
    }
  }, [tasks, dailyTargetHours, isDark])
}
