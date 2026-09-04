import { Outlet } from 'react-router-dom'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import type { DashboardNavItem } from '../components/dashboard/DashboardLayout'
import { LayoutDashboard, Users, DollarSign, Banknote, Settings } from 'lucide-react'

const AFFILIATE_NAV: DashboardNavItem[] = [
  { to: '/affiliate', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/affiliate/referrals', label: 'Referrals', icon: Users },
  { to: '/affiliate/earnings', label: 'Earnings', icon: DollarSign },
  { to: '/affiliate/withdrawals', label: 'Withdrawals', icon: Banknote },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AffiliateLayout() {
  return (
    <DashboardLayout navItems={AFFILIATE_NAV} workspaceLabel="Affiliate">
      <Outlet />
    </DashboardLayout>
  )
}

export default AffiliateLayout