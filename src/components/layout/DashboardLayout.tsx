import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PublicLayout } from '../Layout'
import { AppLayout } from './AppShell'
import '../../styles/dashboard-home.css'

export interface DashboardLayoutProps {
  children?: ReactNode
  navigationMode?: 'platform' | 'provider' | 'jobseeker' | 'business' | 'customer' | 'affiliate' | 'messages' | 'wallet' | 'services'
  showWorkspaceSwitcher?: boolean
  workspaceKey?: 'customer' | 'service_provider' | 'business_owner'
}

export function DashboardLayout({ children, navigationMode = 'platform', showWorkspaceSwitcher = false, workspaceKey }: DashboardLayoutProps) {
  const { isAuthenticated } = useAuth()
  const content = children ?? <Outlet />

  if (!isAuthenticated) {
    return <PublicLayout>{content}</PublicLayout>
  }

  return (
    <AppLayout
      navigationMode={navigationMode}
      showWorkspaceSwitcher={showWorkspaceSwitcher}
      workspaceKey={workspaceKey}
    >
      {content}
    </AppLayout>
  )
}

export default DashboardLayout
