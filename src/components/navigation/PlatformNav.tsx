import {
  Home,
  Building2,
  Search,
  Briefcase,
  MessageSquare,
  LifeBuoy,
  CreditCard,
  type LucideIcon,
} from 'lucide-react'

export interface PlatformNavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

/**
 * Single source of truth for OyoConnect platform-level destinations.
 *
 * These are the core modules every authenticated user must be able to reach
 * regardless of their current workspace (Customer / Business Owner / Service
 * Provider / Admin). They are intentionally kept separate from workspace-scoped
 * dashboard links (e.g. /dashboard, /business/dashboard, /provider/dashboard,
 * /admin/dashboard) so that logging in never hides the broader platform.
 *
 * The dashboard sidebar renders a "Platform" section from this list, and the
 * public Navbar (siteConfig.nav) is derived from it, keeping navigation in
 * sync everywhere.
 */
export const PLATFORM_NAV: readonly PlatformNavItem[] = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/business', label: 'Businesses', icon: Building2 },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/jobs', label: 'Jobs', icon: Briefcase, end: true },
  { to: '/community', label: 'Community', icon: MessageSquare, end: true },
  { to: '/help', label: 'Help', icon: LifeBuoy, end: true },
  { to: '/services', label: 'Services', icon: CreditCard, end: true },
]
