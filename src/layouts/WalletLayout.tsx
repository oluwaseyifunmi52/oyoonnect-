import { Outlet } from 'react-router-dom'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import type { DashboardNavItem } from '../components/dashboard/DashboardLayout'
import { CreditCard, Wallet, Receipt, Settings } from 'lucide-react'

const WALLET_NAV: DashboardNavItem[] = [
  { to: '/wallet', label: 'Wallet', icon: Wallet, end: true },
  { to: '/wallet/fund', label: 'Add Funds', icon: CreditCard },
  { to: '/wallet/transactions', label: 'Transactions', icon: Receipt },
  { to: '/transactions', label: 'All Transactions', icon: Receipt },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function WalletLayout() {
  return (
    <DashboardLayout navItems={WALLET_NAV} workspaceLabel="Wallet">
      <Outlet />
    </DashboardLayout>
  )
}

export default WalletLayout