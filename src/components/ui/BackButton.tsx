import { useNavigate, useLocation } from 'react-router-dom'
import { useCallback, useRef, useEffect } from 'react'

export interface BackButtonOptions {
  /** Custom fallback route when history is not available or should be overridden */
  fallback?: string
  /** Map of routes to their fallback parent routes */
  fallbackMap?: Record<string, string>
  /** Custom label for the back button */
  label?: string
  /** Whether to show the label or just the icon */
  showLabel?: boolean
  /** Additional CSS classes */
  className?: string
  /** Icon component (defaults to ArrowLeft) */
  icon?: React.ReactNode
  /** Whether the button is disabled */
  disabled?: boolean
  /** Button variant from design system */
  variant?: 'ghost' | 'outline' | 'secondary'
  /** Button size */
  size?: 'sm' | 'md'
  /** onClick handler override */
  onClick?: () => void
  /** ARIA label override */
  ariaLabel?: string
}

export interface BackButtonProps extends Omit<BackButtonOptions, 'fallbackMap'> {
  /** Map of routes to their fallback parent routes */
  fallbackMap?: Record<string, string>
}

/**
 * Hook that provides intelligent back navigation with fallback support
 */
export function useBackNavigation(fallbackMap: Record<string, string> = {}) {
  const navigate = useNavigate()
  const location = useLocation()
  const historyRef = useRef<number>(window.history.length)

  // Track history length changes
  useEffect(() => {
    historyRef.current = window.history.length
  }, [location])

  const goBack = useCallback((fallback?: string) => {
    const currentPath = location.pathname
    
    // If we have a specific fallback, use it
    if (fallback) {
      navigate(fallback, { replace: false })
      return
    }

    // Check if we have a mapped fallback for the current route
    const mappedFallback = fallbackMap[currentPath]
    if (mappedFallback) {
      navigate(mappedFallback, { replace: false })
      return
    }

    // If history length hasn't changed since mount, we're likely at the entry point
    // Use a sensible default based on current route
    if (window.history.length <= historyRef.current) {
      const defaultFallback = getDefaultFallback(currentPath)
      if (defaultFallback) {
        navigate(defaultFallback, { replace: false })
        return
      }
    }

    // Default: use browser history
    navigate(-1)
  }, [location.pathname, navigate, fallbackMap])

  return { goBack }
}

/**
 * Get a sensible default fallback route for a given path
 */
function getDefaultFallback(pathname: string): string | null {
  // Business routes
  if (pathname.startsWith('/business/')) {
    return '/search'
  }
  
  // Job routes
  if (pathname.startsWith('/jobs/')) {
    if (pathname.match(/\/jobs\/[^/]+\/applicants/)) {
      return pathname.replace(/\/applicants.*/, '')
    }
    if (pathname.match(/\/jobs\/[^/]+\/apply/)) {
      return pathname.replace(/\/apply.*/, '')
    }
    return '/jobs'
  }
  
  // Community routes
  if (pathname.startsWith('/community/')) {
    if (pathname.match(/\/community\/report\/[^/]+/)) {
      return '/community'
    }
    if (pathname.match(/\/community\/[^/]+/)) {
      return '/community'
    }
    return '/community'
  }
  
  // Help routes
  if (pathname.startsWith('/help/')) {
    if (pathname.match(/\/help\/requests?\/[^/]+/)) {
      return '/help/requests'
    }
    if (pathname === '/help/request' || pathname === '/help/request/success') {
      return '/help'
    }
    return '/help'
  }
  
  // Services routes
  if (pathname.startsWith('/services/')) {
    if (pathname.match(/\/services\/request/)) {
      return '/services'
    }
    return '/services'
  }
  
  // Provider routes
  if (pathname.startsWith('/provider/')) {
    return '/provider'
  }
  
  // Job seeker routes
  if (pathname.startsWith('/job-seeker/')) {
    return '/job-seeker'
  }
  
  // Settings routes
  if (pathname.startsWith('/settings/')) {
    return '/settings'
  }
  if (pathname === '/settings') {
    return '/dashboard'
  }
  
  // Dashboard routes
  if (pathname.startsWith('/dashboard/') || pathname.startsWith('/user/dashboard/')) {
    return '/dashboard'
  }
  if (pathname.startsWith('/business/dashboard/') || pathname.startsWith('/business/')) {
    return '/business/dashboard'
  }
  
  // Admin routes
  if (pathname.startsWith('/admin/')) {
    if (pathname.match(/\/admin\/users\/[^/]+/)) {
      return '/admin/users'
    }
    if (pathname.match(/\/admin\/businesses\/[^/]+/)) {
      return '/admin/businesses'
    }
    if (pathname.match(/\/admin\/jobs\/[^/]+/)) {
      return '/admin/jobs'
    }
    if (pathname.match(/\/admin\/community\/[^/]+/)) {
      return '/admin/community'
    }
    if (pathname.match(/\/admin\/help\/[^/]+/)) {
      return '/admin/help'
    }
    if (pathname.match(/\/admin\/providers\/[^/]+/)) {
      return '/admin/providers'
    }
    if (pathname.match(/\/admin\/services\/[^/]+/)) {
      return '/admin/services'
    }
    if (pathname.match(/\/admin\/service-requests\/[^/]+/)) {
      return '/admin/service-requests'
    }
    if (pathname.match(/\/admin\/audit-logs\/[^/]+/)) {
      return '/admin/audit-logs'
    }
    if (pathname.match(/\/admin\/payouts\/[^/]+/)) {
      return '/admin/payouts'
    }
    if (pathname.match(/\/admin\/job-applications\/[^/]+/)) {
      return '/admin/job-applications'
    }
    if (pathname.match(/\/admin\/categories\/[^/]+/)) {
      return '/admin/categories'
    }
    if (pathname.match(/\/admin\/verification\/[^/]+/)) {
      return '/admin/verification'
    }
    if (pathname.match(/\/admin\/notifications\/[^/]+/)) {
      return '/admin/notifications'
    }
    return '/admin/dashboard'
  }
  
  // Profile routes
  if (pathname.startsWith('/profile/') || pathname.startsWith('/user/profile/')) {
    return '/profile'
  }
  
  // Account page
  if (pathname === '/account') {
    return '/dashboard'
  }
  
  // Saved/favorites
  if (pathname === '/saved' || pathname === '/favorites') {
    return '/dashboard'
  }
  
  // Notifications
  if (pathname === '/notifications') {
    return '/dashboard'
  }
  
  // My requests
  if (pathname === '/my-requests') {
    return '/services'
  }
  
  // Default: no fallback
  return null
}

export function BackButton({
  fallback,
  fallbackMap = {},
  label = 'Back',
  showLabel = true,
  className = '',
  icon,
  disabled = false,
  variant = 'ghost',
  size = 'sm',
  onClick,
  ariaLabel,
}: BackButtonProps) {
  const { goBack } = useBackNavigation(fallbackMap)
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      goBack(fallback)
    }
  }
  
  const ariaLabelValue = ariaLabel || (showLabel ? label : `Back to ${label}`)
  
  return (
    <button
      type="button"
      className={`btn btn--${variant} btn--${size} back-btn ${className}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabelValue}
    >
      {icon || (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      )}
      {showLabel && <span className="back-btn__label">{label}</span>}
    </button>
  )
}

export default BackButton