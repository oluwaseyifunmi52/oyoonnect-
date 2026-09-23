import { useLocation, useNavigate } from 'react-router-dom'
import React from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { siteConfig } from '../../config/site'
import { PLATFORM_NAV } from '../navigation/PlatformNav'

const DrawerWidth = 280

function isActivePath(to: string, pathname: string): boolean {
  const normalizedTo = to === '/' ? '' : to
  const activePath = `/${normalizedTo}`
  return pathname === activePath || pathname.startsWith(`${activePath}/`)
}

// Map PLATFORM_NAV labels to their submenu items from siteConfig.nav
function getSubmenuItems(mainLabel: string): readonly { label: string; to: string }[] {
  const labelMap: Record<string, readonly { label: string; to: string }[]> = {
    Businesses: siteConfig.nav.filter(
      (item) => item.to.startsWith('/business') && item.label !== 'Businesses'
    ),
    Jobs: siteConfig.nav.filter(
      (item) => item.to.startsWith('/jobs') && item.label !== 'Jobs'
    ),
    Community: siteConfig.nav.filter(
      (item) => item.to.startsWith('/community') && item.label !== 'Community'
    ),
    Help: siteConfig.nav.filter(
      (item) => item.to.startsWith('/help') && item.label !== 'Help'
    ),
    Services: siteConfig.nav.filter(
      (item) => item.to.startsWith('/services') && item.label !== 'Services'
    ),
  }

  return labelMap[mainLabel] || []
}

export interface MobileDrawerProps {
  open: boolean
  onToggle: () => void
}

export function MobileDrawer({ open, onToggle }: MobileDrawerProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  const pathname = location.pathname

  const toggleSection = (sectionKey: string) => {
    setExpanded(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const handleSelect = (to: string) => {
    navigate(to)
    onToggle()
  }

  // The 5 main sections from PLATFORM_NAV (excluding Home)
  const mainSections = PLATFORM_NAV.filter(
    (item) => item.label !== 'Home'
  ).map((item) => ({
    label: item.label,
    to: item.to,
    key: item.to,
    icon: item.icon,
  }))

  const renderDrawer = open && (
    <div className="mobile-drawer" style={{ width: DrawerWidth }}>
      <header className="mobile-drawer__header">
        <button
          className="mobile-drawer__hamburger"
          onClick={() => onToggle()}
          aria-label="Open menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <nav className="mobile-drawer__nav">
        {mainSections.map((section) => (
          <div key={section.key} className="mobile-drawer__section">
            <NavLink
              to={section.to}
              className={({ isActive }) =>
                `button mobile-drawer__section-toggle ${isActive ? 'active' : ''}`
              }
              onClick={() => handleSelect(section.to)}
            >
              <span className="mobile-drawer__section-icon">
                {section.icon && <section.icon aria-hidden="true" size={20} />}
              </span>
              <span className="mobile-drawer__section-label">{section.label}</span>
            </NavLink>

            {expanded[section.to] && (
              <div className="mobile-drawer__submenu">
                {getSubmenuItems(section.label).map((item) => {
                  const isActive = isActivePath(item.to, pathname)
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `mobile-drawer__submenu-link ${isActive ? 'mobile-drawer__submenu-link--active' : ''}`
                      }
                      onClick={() => handleSelect(item.to)}
                    >
                      <span className="mobile-drawer__submenu-label">{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )

  return renderDrawer
}