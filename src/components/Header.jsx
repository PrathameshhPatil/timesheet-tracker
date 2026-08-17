import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Clock, Sun, Moon, Menu, X, LayoutDashboard, ListChecks, BarChart3, Settings as SettingsIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useApp } from '../context/AppContext'

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

function navClass({ isActive }) {
  return `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-primary text-white'
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
  }`
}

export function Header() {
  const { isDark, toggleDarkMode } = useApp()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Clock className="text-primary" size={22} />
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">TimeTrack</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleDarkMode}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav className="flex flex-col gap-1 border-t border-gray-200 dark:border-gray-700 px-4 py-2 lg:hidden">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navClass} onClick={() => setIsMenuOpen(false)} end={to === '/'}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      ) : null}

      <div className="hidden items-center justify-between px-6 py-3 lg:flex">
        <div className="flex items-center gap-2">
          <Clock className="text-primary" size={22} />
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">TimeTrack</span>
        </div>
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navClass} end={to === '/'}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(), 'EEE, MMM d, yyyy')}</span>
          <button
            type="button"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleDarkMode}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
