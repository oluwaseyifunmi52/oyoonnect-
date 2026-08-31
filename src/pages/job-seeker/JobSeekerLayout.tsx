import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, FileText, Heart, User, Settings, Briefcase } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import type { DashboardNavItem } from '../../components/dashboard/DashboardLayout'

const NAV: DashboardNavItem[] = [
  { to: '/job-seeker', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/job-seeker#applications', label: 'My Applications', icon: FileText },
  { to: '/job-seeker#saved', label: 'Saved Jobs', icon: Heart },
  { to: '/job-seeker#profile', label: 'My Profile', icon: User },
  { to: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function JobSeekerLayout() {
  return (
    <DashboardLayout navItems={NAV} workspaceLabel="Job Seeker">
      <Outlet />
    </DashboardLayout>
  )
}