import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './theme'
import { ServicesProvider } from './context/ServicesContext'
import { queryClient } from './lib/queryClient'
import { trackPageview } from './utils/analytics'
import { HomePage } from './pages/HomePage'
import { PokerStatsPage } from './pages/poker/PokerStatsPage'
import { ChristmasCardPage } from './pages/ChristmasCardPage'
import { WifiPage } from './pages/WifiPage'
import { PokerYearInReviewPage } from './pages/poker/PokerYearInReviewPage'

function getRouterBasename(): string {
  const base = import.meta.env.BASE_URL
  return base.endsWith('/') ? base.slice(0, -1) : base
}

function RouteAnalytics() {
  const location = useLocation()

  useEffect(() => {
    trackPageview()
  }, [location.pathname])

  return null
}

function HashRedirect() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const raw = location.hash
    if (!raw.startsWith('#/')) return
    navigate(raw.slice(1), { replace: true })
  }, [location.hash, navigate])

  return null
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ServicesProvider>
          <BrowserRouter basename={getRouterBasename() || undefined}>
            <RouteAnalytics />
            <HashRedirect />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/poker/stats" element={<PokerStatsPage />} />
              <Route path="/christmas-card" element={<ChristmasCardPage />} />
              <Route path="/poker/review/:name" element={<PokerYearInReviewPage />} />
              <Route path="/wifi" element={<WifiPage />} />
            </Routes>
          </BrowserRouter>
        </ServicesProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
