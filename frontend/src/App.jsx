import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Onboarding from './components/Onboarding'
import Tasks from './pages/Tasks'
import Rewards from './pages/Rewards'
import History from './pages/History'
import { api } from './api'
import { LanguageProvider } from './context/LanguageContext'
import { ToastProvider } from './context/ToastContext'

function AppInner() {
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem('lq_onboarded'))
  const [totalPoints, setTotalPoints] = useState(0)

  const refreshPoints = useCallback(async () => {
    const data = await api.getPoints()
    setTotalPoints(data.total_points)
  }, [])

  useEffect(() => { refreshPoints() }, [refreshPoints])

  const handleOnboardingComplete = useCallback(() => {
    setOnboarded(true)
    refreshPoints()
  }, [refreshPoints])

  return (
    <>
      {!onboarded && <Onboarding onComplete={handleOnboardingComplete} />}
      <div className="min-h-screen bg-slate-50">
        <Navbar totalPoints={totalPoints} />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks"   element={<Tasks   onPointsChange={refreshPoints} />} />
            <Route path="/rewards" element={<Rewards onPointsChange={refreshPoints} totalPoints={totalPoints} />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </ToastProvider>
    </LanguageProvider>
  )
}
