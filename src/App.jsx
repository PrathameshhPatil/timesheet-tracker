import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import { Header } from './components/Header'
import { Dashboard } from './pages/Dashboard'
import { Tasks } from './pages/Tasks'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AppProvider>
  )
}
