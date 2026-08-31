import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User, Briefcase, Building2, ChevronDown, Check, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ButtonLink } from '../components/ui/Button'

const ICONS: Record<string, typeof User> = {
  user: User,
  briefcase: Briefcase,
  building: Building2,
}

export function WorkspaceSwitcher() {
  const { getWorkspaces, upgradeToServiceProvider, upgradeToBusinessOwner, isServiceProvider, isBusinessOwner } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const workspaces = getWorkspaces()
  const active = workspaces.find((w) => location.pathname.startsWith(w.to.split('/').slice(0, 2).join('/'))) ?? workspaces[0]

  const handleUpgrade = async (type: 'provider' | 'business') => {
    setOpen(false)
    if (type === 'provider') {
      await upgradeToServiceProvider()
      navigate('/provider/dashboard')
    } else {
      await upgradeToBusinessOwner()
      navigate('/business/dashboard')
    }
  }

  return (
    <div className="workspace-switcher">
      <button
        type="button"
        className="workspace-switcher__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Switch workspace"
      >
        <span className="workspace-switcher__icon">
          {active && (() => {
            const Icon = ICONS[active.icon] ?? User
            return <Icon size={16} />
          })()}
        </span>
        <span className="workspace-switcher__label">{active?.label ?? 'Workspace'}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <>
          <div className="workspace-switcher__overlay" onClick={() => setOpen(false)} />
          <div className="workspace-switcher__menu" role="menu">
            <p className="workspace-switcher__heading">Switch workspace</p>
            {workspaces.map((w) => {
              const Icon = ICONS[w.icon] ?? User
              const isActive = w.key === active?.key
              const isLocked = !w.available

              if (isLocked) {
                const upgradeType = w.key === 'service_provider' ? 'provider' : 'business'
                return (
                  <button
                    key={w.key}
                    type="button"
                    className="workspace-switcher__item is-locked"
                    onClick={() => handleUpgrade(upgradeType)}
                    role="menuitem"
                  >
                    <span className="workspace-switcher__item-icon"><Icon size={16} /></span>
                    <span className="workspace-switcher__item-text">
                      <span className="workspace-switcher__item-title">{w.label}</span>
                      <span className="workspace-switcher__item-desc">{w.description}</span>
                    </span>
                    <span className="workspace-switcher__upgrade">
                      <Lock size={14} aria-hidden="true" />
                      <span>Upgrade</span>
                      <ArrowRight size={12} />
                    </span>
                  </button>
                )
              }

              return (
                <button
                  key={w.key}
                  type="button"
                  className={`workspace-switcher__item ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    setOpen(false)
                    navigate(w.to)
                  }}
                  role="menuitem"
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="workspace-switcher__item-icon"><Icon size={16} /></span>
                  <span className="workspace-switcher__item-text">
                    <span className="workspace-switcher__item-title">{w.label}</span>
                    <span className="workspace-switcher__item-desc">{w.description}</span>
                  </span>
                  {isActive && <Check size={16} />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}