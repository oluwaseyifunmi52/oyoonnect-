import { Outlet } from 'react-router-dom'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import type { DashboardNavItem } from '../components/dashboard/DashboardLayout'
import { LayoutDashboard, Building2, Settings, Search, Briefcase, MessageSquare, BarChart2, Image, Star, ShieldCheck } from 'lucide-react'

const BUSINESS_NAV: DashboardNavItem[] = [
  { to: '/business/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/business/profile', label: 'Business Profile', icon: Building2 },
  { to: '/business/services', label: 'Services', icon: Settings },
  { to: '/business/photos', label: 'Photos', icon: Image },
  { to: '/business/reviews', label: 'Reviews', icon: Star },
  { to: '/business/enquiries', label: 'Enquiries', icon: MessageSquare },
  { to: '/business/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/business/verification', label: 'Verification', icon: ShieldCheck },
  { to: '/business/settings', label: 'Settings', icon: Settings },
  { to: '/services', label: 'Find Workers', icon: Search },
  { to: '/jobs/post', label: 'Post a Job', icon: Briefcase },
]

export function BusinessLayout() {
  return (
    <DashboardLayout navItems={BUSINESS_NAV} workspaceLabel="Business">
      <Outlet />
    </DashboardLayout>
  )
}

export default BusinessLayout