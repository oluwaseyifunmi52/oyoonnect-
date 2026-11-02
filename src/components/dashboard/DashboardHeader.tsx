import type { ReactNode } from 'react'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  showUser?: boolean
  userName?: string
}

export function DashboardHeader({ title, subtitle, actions, showUser = true, userName }: DashboardHeaderProps) {
  const displayedName = userName || 'Oluwaseyifunmi'

  return (
    <header className="dashboard__header">
      <div className="dashboard__header-inner">
        <div>
          <h1 className="dashboard__header-title">{title}</h1>
          {subtitle ? <p className="dashboard__header-subtitle">{subtitle}</p> : null}
        </div>

        {showUser && userName && (
          <div className="dashboard__header-user">
            <span className="dashboard__header-user-name">{displayedName}</span>
          </div>
        )}

        {actions ? <div className="dashboard__header-actions">{actions}</div> : null}
      </div>
    </header>
  )
}

export default DashboardHeader