import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, UserCog, Briefcase, Inbox, Briefcase as WorkIcon } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import type { DashboardNavItem } from '../../components/dashboard/DashboardLayout'

const NAV: DashboardNavItem[] = [
  { to: '/provider/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/provider/profile', label: 'My Profile', icon: UserCog },
  { to: '/provider/services', label: 'My Services', icon: Briefcase },
  { to: '/provider/requests', label: 'Service Requests', icon: Inbox },
  { to: '/jobs', label: 'Work Opportunities', icon: WorkIcon },
]

export default function ProviderLayout() {
  return (
    <DashboardLayout navItems={NAV} workspaceLabel="Professional">
      <Outlet />
    </DashboardLayout>
  )
}
