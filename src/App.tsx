import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '@/pages/Landing/LandingPage'
import MarketplacePage from '@/pages/Marketplace/MarketplacePage'
import WorkflowDetailPage from '@/pages/WorkflowDetail/WorkflowDetailPage'
import InstallPage from '@/pages/Install/InstallPage'
import DashboardPage from '@/pages/Dashboard/DashboardPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<LandingPage />} />
        <Route path="/marketplace"    element={<MarketplacePage />} />
        <Route path="/workflow/:slug" element={<WorkflowDetailPage />} />
        <Route path="/install/:slug"  element={<InstallPage />} />
        <Route path="/dashboard"      element={<DashboardPage />} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
