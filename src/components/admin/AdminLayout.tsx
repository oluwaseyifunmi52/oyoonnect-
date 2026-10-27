import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'
import { AppLayout } from '../layout/AppShell'

export function AdminLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth()

  return (
    <AppLayout navigationMode="admin" onSignOut={() => { void logout() }}>
      {children}
    </AppLayout>
  )
}

export default AdminLayout
