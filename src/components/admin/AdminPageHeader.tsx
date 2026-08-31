import type { ReactNode } from 'react'

interface AdminPageHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  actions?: ReactNode
}

export function AdminPageHeader({ title, subtitle, icon, actions }: AdminPageHeaderProps) {
  return (
    <div className="dashboard-header admin-page-header">
      <div className="admin-page-header__title">
        {icon ? <span className="admin-page-header__icon" aria-hidden="true">{icon}</span> : null}
        <div>
          <h1 className="dashboard-title">{title}</h1>
          {subtitle ? <p className="dashboard-subtitle">{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="admin-page-header__actions">{actions}</div> : null}
    </div>
  )
}

export default AdminPageHeader
