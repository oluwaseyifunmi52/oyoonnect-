import { Outlet } from 'react-router-dom'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import type { DashboardNavItem } from '../components/dashboard/DashboardLayout'
import { LayoutDashboard, User, Bell, Heart, Settings, FileText, HelpCircle } from 'lucide-react'

const USER_NAV: DashboardNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/profile', label: 'My Profile', icon: User },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/saved', label: 'Saved Businesses', icon: Heart },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/account', label: 'Account', icon: User },
  { to: '/my-requests', label: 'My Requests', icon: FileText },
  { to: '/help/requests', label: 'Support Requests', icon: HelpCircle },
]

export function UserLayout() {
  return (
    <DashboardLayout navItems={USER_NAV} workspaceLabel="Account">
      <Outlet />
    </DashboardLayout>
  )
}

export default UserLayout