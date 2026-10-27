import { Outlet } from 'react-router-dom'
import { DashboardLayout } from '../components/layout/DashboardLayout'

export function AffiliateLayout() {
  return (
    <DashboardLayout navigationMode="affiliate">
      <Outlet />
    </DashboardLayout>
  )
}

export default AffiliateLayout