import { Outlet } from 'react-router-dom'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import type { DashboardNavItem } from '../components/dashboard/DashboardLayout'
import { MessageSquare, Settings } from 'lucide-react'

const MESSAGES_NAV: DashboardNavItem[] = [
  { to: '/messages', label: 'Messages', icon: MessageSquare, end: true },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function MessagesLayout() {
  return (
    <DashboardLayout navItems={MESSAGES_NAV} workspaceLabel="Messages">
      <Outlet />
    </DashboardLayout>
  )
}

export default MessagesLayout