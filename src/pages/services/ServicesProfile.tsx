import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bell, LockKeyhole } from 'lucide-react'
import './ServicesProfile.css'

export default function ServicesProfile({ children }: { children: ReactNode }) {
  return (
    <div className="services-profile">
      <nav className="services-profile__settings-links" aria-label="More account settings">
        <Link to="/settings/security">
          <span><LockKeyhole size={18} aria-hidden="true" /></span>
          <span><strong>Password and security</strong><small>Manage your password and security options.</small></span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link to="/settings/notifications">
          <span><Bell size={18} aria-hidden="true" /></span>
          <span><strong>Notification preferences</strong><small>Review the notification settings already supported by your account.</small></span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </nav>
      {children}
    </div>
  )
}
