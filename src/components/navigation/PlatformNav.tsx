import {
  Home,
  Building2,
  Briefcase,
  MessageSquare,
  Clapperboard,
  CreditCard,
  Wallet,
} from 'lucide-react'

export interface PlatformNavItem {
  to: string
  label: string
  icon: React.ComponentType<{ size: number }>
  end?: boolean
}

// This is the SINGLE SOURCE OF TRUTH for top-level platform sections.
// Used by: Footer (via siteConfig.nav sync), and any
// cross-layout navigation components.
//
// Keep in sync with siteConfig.nav in src/config/site.ts:
// - Home, Jobs, Businesses, Community, Watch, Messages, Services, Wallet
// - Flat navigation, no submenus
export const PLATFORM_NAV: readonly PlatformNavItem[] = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/jobs', label: 'Jobs', icon: Briefcase, end: true },
  { to: '/business', label: 'Businesses', icon: Building2 },
  { to: '/community', label: 'Community', icon: MessageSquare },
  { to: '/watch', label: 'Watch', icon: Clapperboard },
  { to: '/messages', label: 'Messages', icon: MessageSquare, end: true },
  { to: '/services', label: 'Services', icon: CreditCard },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
]
