import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { DashboardHeader } from './DashboardHeader'
import { DashboardSidebar } from './DashboardSidebar'
import '../../styles/dashboard-home.css'

interface AppShellProps {
  children?: ReactNode
  navigationMode?: 'platform' | 'provider' | 'jobseeker' | 'business' | 'customer' | 'affiliate' | 'messages' | 'wallet' | 'services'
  showWorkspaceSwitcher?: boolean
  workspaceKey?: 'customer' | 'service_provider' | 'business_owner'
}

export function AppLayout({ children, navigationMode = 'platform', showWorkspaceSwitcher = false, workspaceKey }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = () => setDrawerOpen(false)

  useEffect(() => {
    if (!drawerOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [drawerOpen])

  return (
    <div className={`dashboard-app-shell dashboard-app-shell--${navigationMode}`}>
      <DashboardSidebar open={drawerOpen} onClose={closeDrawer} mode={navigationMode} />
      <div className="dashboard-app-content">
        <DashboardHeader onMenuClick={() => setDrawerOpen(true)} showWorkspaceSwitcher={showWorkspaceSwitcher} workspaceKey={workspaceKey} />
        <main className="dashboard-app-outlet" id="main-content">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  )
}

export const AppShell = AppLayout
export default AppLayout
