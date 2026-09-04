import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export function PublicLayout() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="app__main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default PublicLayout