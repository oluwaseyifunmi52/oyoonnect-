import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Skeleton } from '../ui/Skeleton'

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, loading, initializing, isAuthenticated, isAuthBypassed } = useAuth()
  const location = useLocation()

  if (initializing || loading) {
    return <AuthLoadingSkeleton />
  }

  // If auth is bypassed, allow access (with appropriate demo user)
  if (isAuthBypassed) {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />
  }

  return <>{children}</>
}

export function OwnerRoute({ children }: { children: React.ReactNode }) {
  const { user, initializing, loading, isAuthenticated, isBusinessOwner, isAuthBypassed } = useAuth()
  const location = useLocation()

  if (initializing || loading) {
    return <AuthLoadingSkeleton />
  }

  // If auth is bypassed, allow access
  if (isAuthBypassed) {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isBusinessOwner) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />
  }

  return <>{children}</>
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, initializing, loading, isAuthenticated, isAdmin, isAuthBypassed } = useAuth()
  const location = useLocation()

  if (initializing || loading) {
    return <AuthLoadingSkeleton />
  }

  // If auth is bypassed, allow access
  if (isAuthBypassed) {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />
  }

  return <>{children}</>
}

export function ServicesRoute({ children }: { children: React.ReactNode }) {
  const { user, initializing, loading, isAuthenticated, canAccessServices, isAuthBypassed } = useAuth()
  const location = useLocation()

  if (initializing || loading) {
    return <AuthLoadingSkeleton />
  }

  // If auth is bypassed, allow access
  if (isAuthBypassed) {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!canAccessServices()) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />
  }

  return <>{children}</>
}

export function BusinessRoute({ children }: { children: React.ReactNode }) {
  const { user, initializing, loading, isAuthenticated, canAccessBusiness, isAuthBypassed } = useAuth()
  const location = useLocation()

  if (initializing || loading) {
    return <AuthLoadingSkeleton />
  }

  // If auth is bypassed, allow access
  if (isAuthBypassed) {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!canAccessBusiness()) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />
  }

  return <>{children}</>
}

export function ProviderRoute({ children }: { children: React.ReactNode }) {
  const { user, initializing, loading, isAuthenticated, canAccessProvider, isAuthBypassed } = useAuth()
  const location = useLocation()

  if (initializing || loading) {
    return <AuthLoadingSkeleton />
  }

  if (isAuthBypassed) {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!canAccessProvider()) {
    return <Navigate to="/provider/onboarding" replace state={{ from: location }} />
  }

  return <>{children}</>
}

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, initializing, loading, isAuthBypassed } = useAuth()
  const location = useLocation()

  if (initializing || loading) {
    return <AuthLoadingSkeleton />
  }

  // If auth is bypassed, still allow access to auth pages (for testing)
  if (isAuthBypassed) {
    return <>{children}</>
  }

  if (isAuthenticated) {
    const role = user?.role
    const dest =
      role === 'business_owner'
        ? '/business/dashboard'
        : role === 'service_provider'
          ? '/provider/dashboard'
          : role === 'admin'
            ? '/admin/dashboard'
            : '/dashboard'
    return <Navigate to={dest} replace state={{ from: location }} />
  }

  return <>{children}</>
}

export function ServicesPublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, canAccessServices, initializing, loading, isAuthBypassed } = useAuth()
  const location = useLocation()

  if (initializing || loading) {
    return <AuthLoadingSkeleton />
  }

  if (isAuthBypassed) {
    return <>{children}</>
  }

  if (isAuthenticated && canAccessServices()) {
    return <Navigate to="/services/dashboard" replace />
  }

  return <>{children}</>
}

export function BusinessPublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, canAccessBusiness, initializing, loading, isAuthBypassed } = useAuth()
  const location = useLocation()

  if (initializing || loading) {
    return <AuthLoadingSkeleton />
  }

  if (isAuthBypassed) {
    return <>{children}</>
  }

  if (isAuthenticated && canAccessBusiness()) {
    return <Navigate to="/business/dashboard" replace />
  }

  return <>{children}</>
}

function AuthLoadingSkeleton() {
  return (
    <div className="auth-loading-skeleton" role="status" aria-label="Loading authentication">
      <Skeleton className="skeleton--text skeleton--wide skeleton--center" />
      <Skeleton className="skeleton--text skeleton--mid skeleton--center" />
      <div className="auth-loading-actions">
        <Skeleton className="skeleton--btn" />
        <Skeleton className="skeleton--btn" />
      </div>
    </div>
  )
}