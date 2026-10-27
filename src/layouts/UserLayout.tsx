import { Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { DashboardLayout } from '../components/layout/DashboardLayout'

export function UserLayout({ children }: { children?: ReactNode } = {}) {
  return (
    <DashboardLayout navigationMode="customer">
      {children ?? <Outlet />}
    </DashboardLayout>
  )
}

export default UserLayout