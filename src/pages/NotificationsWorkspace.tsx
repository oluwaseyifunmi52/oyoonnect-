import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DashboardLayout as WorkspaceLayout } from '../components/layout/DashboardLayout'
import { AdminLayout } from '../components/admin/AdminLayout'
import { BusinessLayout } from '../layouts/BusinessLayout'
import { UserLayout } from '../layouts/UserLayout'
import Notifications from './Notifications'

type WorkspaceNavigationState = { workspaceKey?: 'customer' | 'service_provider' | 'business_owner' }

function PageFrame({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  const workspaceKey = (location.state as WorkspaceNavigationState | null)?.workspaceKey
  const role = user?.role

  if (role === 'admin') return <AdminLayout>{children}</AdminLayout>
  if (role === 'business_owner' || workspaceKey === 'business_owner') return <BusinessLayout>{children}</BusinessLayout>
  if (role === 'service_provider' || workspaceKey === 'service_provider') {
    return <WorkspaceLayout navigationMode="provider" showWorkspaceSwitcher workspaceKey="service_provider">{children}</WorkspaceLayout>
  }
  if ((role === 'user' || role === 'customer') && workspaceKey === 'customer') {
    return <WorkspaceLayout navigationMode="jobseeker" showWorkspaceSwitcher workspaceKey="customer">{children}</WorkspaceLayout>
  }
  return <UserLayout>{children}</UserLayout>
}

export function NotificationsWorkspace() {
  return <PageFrame><Notifications /></PageFrame>
}

export default NotificationsWorkspace
