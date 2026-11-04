import { Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Footer } from '../components/layout/Footer'
import { PlatformSidebar } from './layout/PlatformSidebar'
import './PublicLayout.css'

interface PublicLayoutProps {
  children?: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="public-layout">
      <PlatformSidebar />
      <main id="main-content" className="public-layout__main">
        {children ?? <Outlet />}
      </main>
      <Footer />
    </div>
  )
}

export function Layout() {
  return <PublicLayout />
}

export default Layout
