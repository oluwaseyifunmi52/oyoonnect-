import type { ReactNode } from 'react'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function DashboardHeader({ title, subtitle, actions }: DashboardHeaderProps) {
  return (
    <header className="dash-header">
      <div>
        <h1 className="dash-header__title">{title}</h1>
        {subtitle ? <p className="dash-header__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="dash-header__actions">{actions}</div> : null}
    </header>
  )
}
