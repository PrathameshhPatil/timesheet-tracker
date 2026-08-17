import { memo } from 'react'
import PropTypes from 'prop-types'

const ACCENT_STYLES = {
  blue: 'bg-blue-50 text-[#2a78d6] dark:bg-blue-500/10 dark:text-[#3987e5]',
  green: 'bg-green-50 text-[#0ca30c] dark:bg-green-500/10 dark:text-[#0ca30c]',
  orange: 'bg-orange-50 text-[#eb6834] dark:bg-orange-500/10 dark:text-[#d95926]',
  violet: 'bg-violet-50 text-[#4a3aa7] dark:bg-violet-500/10 dark:text-[#9085e9]',
}

function StatsCardBase({ icon: Icon, title, value, subtitle, accent = 'blue' }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        {Icon ? (
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${ACCENT_STYLES[accent]}`}>
            <Icon size={18} />
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p> : null}
    </div>
  )
}

StatsCardBase.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  accent: PropTypes.oneOf(['blue', 'green', 'orange', 'violet']),
}

export const StatsCard = memo(StatsCardBase)
