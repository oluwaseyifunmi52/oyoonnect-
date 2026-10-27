import { Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Navbar } from './layout/Navbar'
import { Footer } from '../components/layout/Footer'
import './PublicLayout.css'

interface PublicLayoutProps {
  children?: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="public-layout">
      <Navbar />
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
