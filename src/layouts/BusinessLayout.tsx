import { Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { DashboardLayout } from '../components/layout/DashboardLayout'

export function BusinessLayout({ children }: { children?: ReactNode } = {}) {
  return (
    <DashboardLayout navigationMode="business">
      {children ?? <Outlet />}
    </DashboardLayout>
  )
}

export default BusinessLayout
