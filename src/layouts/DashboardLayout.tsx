import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header/Header'
import Sidebar from '../components/layout/Sidebar/Sidebar'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const updateViewport = () => {
      setIsMobileViewport(mobileQuery.matches)
      if (!mobileQuery.matches) {
        setIsSidebarOpen(false)
      }
    }

    updateViewport()
    mobileQuery.addEventListener('change', updateViewport)

    return () => mobileQuery.removeEventListener('change', updateViewport)
  }, [])

  useEffect(() => {
    if (!isSidebarOpen) {
      return
    }

    document.body.classList.add('navigation-open')

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.classList.remove('navigation-open')
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isSidebarOpen])

  useEffect(() => {
    if (isMobileViewport) {
      setIsSidebarCollapsed(false)
    }
  }, [isMobileViewport])

  useEffect(() => {
    const syncSidebarPreference = (event: Event) => {
      if (!isMobileViewport) setIsSidebarCollapsed((event as CustomEvent<boolean>).detail)
    }
    window.addEventListener('officepilot-sidebar-preference-change', syncSidebarPreference)
    return () => window.removeEventListener('officepilot-sidebar-preference-change', syncSidebarPreference)
  }, [isMobileViewport])

  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className={`dashboard-layout${isSidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
      <Sidebar
        isOpen={isSidebarOpen}
        isInactive={isMobileViewport && !isSidebarOpen}
        isCollapsed={isSidebarCollapsed && !isMobileViewport}
        onNavigate={closeSidebar}
        onToggleCollapse={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
      />
      {isSidebarOpen && (
        <button
          className="mobile-navigation-overlay"
          type="button"
          aria-label="Close navigation menu"
          onClick={closeSidebar}
        />
      )}
      <div className="app-content">
        <Header
          isSidebarOpen={isSidebarOpen}
          onMenuClick={() => setIsSidebarOpen((open) => !open)}
        />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}