import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types/business'
import { authService, AUTH_STORAGE_KEY, USER_STORAGE_KEY } from '../services/authService'
import type { AuthUser, Capability, LoginCredentials, RegisterData } from '../services/authService'

// Check if auth bypass is enabled (only for development).
// Keep explicit and disabled by default — it only skips the login gate for
// local testing and is never used by the real flows.
const isAuthBypassed = import.meta.env.VITE_DISABLE_AUTH === 'true'

type AccountType = 'customer' | 'service_provider' | 'business_owner'

export interface WorkspaceSwitcherItem {
  key: AccountType
  label: string
  description: string
  to: string
  icon: string
  available: boolean
}

interface AuthResult {
  user: AuthUser
  redirectPath: string
}

interface AuthContextType {
  // State
  user: AuthUser | null
  loading: boolean
  isLoading: boolean
  initializing: boolean
  isAuthenticated: boolean
  capabilities: Capability[]
  isAdmin: boolean
  isBusinessOwner: boolean
  isServicesUser: boolean
  isAuthBypassed: boolean

  // Actions — the ONLY place authentication state is updated.
  login: (credentials: LoginCredentials, fromPath?: string, context?: 'main' | 'services' | 'business' | 'help') => Promise<AuthResult>
  signup: (data: RegisterData, fromPath?: string, context?: 'main' | 'services' | 'business' | 'help') => Promise<AuthResult>
  register: (data: RegisterData, fromPath?: string, context?: 'main' | 'services' | 'business' | 'help') => Promise<AuthResult>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<AuthUser | null>
  updateProfile: (data: Partial<User>) => Promise<AuthUser | null>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  refreshUser: () => Promise<void>
  upgradeToBusinessOwner: () => Promise<{ success: boolean; message: string }>

  // Authorization helpers
  hasCapability: (capability: Capability) => boolean
  canAccessServices: () => boolean
  canAccessBusiness: () => boolean
  canAccessProvider: () => boolean
  canAccessAdmin: () => boolean
  getAccountType: () => AccountType | null
  isServiceProvider: boolean
  isCustomer: boolean
  getWorkspaces: () => WorkspaceSwitcherItem[]
  requireServicesAuth: (fromPath?: string) => string | null
  requireBusinessAuth: (fromPath?: string) => string | null
  upgradeToServiceProvider: () => Promise<{ success: boolean; message: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to get redirect path based on user role and context
function getRedirectPathForRole(role: AuthUser['role'] | undefined, fallbackPath: string = '/', context?: 'main' | 'services' | 'business' | 'help'): string {
  // For services context, business owners go to business dashboard, others go to services
  if (context === 'services') {
    switch (role) {
      case 'admin':
        return '/admin'
      case 'business_owner':
        return '/business/dashboard'
      case 'service_provider':
        return '/provider/dashboard'
      case 'user':
      case 'customer':
      default:
        return fallbackPath || '/services/dashboard'
    }
  }

  // For business context, only business owners and admins get access
  if (context === 'business') {
    switch (role) {
      case 'admin':
        return '/admin'
      case 'business_owner':
        return fallbackPath || '/business/dashboard'
      case 'user':
      case 'customer':
      case 'service_provider':
      default:
        return '/business/dashboard'
    }
  }

  // For help context, all roles go to help dashboard
  if (context === 'help') {
    return fallbackPath || '/help'
  }

  // Main context (default) - unified ONE ACCOUNT
  switch (role) {
    case 'admin':
      return fallbackPath && fallbackPath !== '/' ? fallbackPath : '/admin/dashboard'
    case 'business_owner':
      return fallbackPath && fallbackPath !== '/' ? fallbackPath : '/business/dashboard'
    case 'service_provider':
      return fallbackPath && fallbackPath !== '/' ? fallbackPath : '/provider/dashboard'
    case 'user':
    case 'customer':
    default:
      return fallbackPath && fallbackPath !== '/' ? fallbackPath : '/dashboard'
  }
}

// Determine account type from user role
function getAccountTypeFromRole(role: AuthUser['role'] | undefined): AccountType | null {
  switch (role) {
    case 'admin':
      return 'business_owner'
    case 'business_owner':
      return 'business_owner'
    case 'service_provider':
      return 'service_provider'
    case 'user':
    case 'customer':
      return 'customer'
    default:
      return null
  }
}

// Fallback dashboard per role when no original destination is preserved.
function getDefaultDashboard(role: AuthUser['role'] | undefined): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'business_owner':
      return '/business/dashboard'
    case 'service_provider':
      return '/provider/dashboard'
    default:
      return '/dashboard'
  }
}

// Synchronous snapshot of any persisted session so the UI (e.g. the navbar)
// reflects "logged in" on the very first render instead of after the async
// init. After initialization the AuthContext state is the single source of truth.
function readPersistedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    const user = raw ? (JSON.parse(raw) as AuthUser) : null
    if (!user) return null
    const sessionRaw = localStorage.getItem(AUTH_STORAGE_KEY)
    const session = sessionRaw ? (JSON.parse(sessionRaw) as { expiresAt: number }) : null
    if (!session || Date.now() >= session.expiresAt) return null
    return user
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readPersistedUser)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      // If auth bypass is enabled for development, don't auto-login
      if (isAuthBypassed) {
        if (mounted) {
          setUser(null)
          setInitializing(false)
        }
        return
      }

      try {
        const currentUser = await authService.getCurrentUser()
        if (mounted) setUser(currentUser)
      } catch {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setInitializing(false)
      }
    }

    initializeAuth()

    return () => {
      mounted = false
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials, fromPath?: string, context?: 'main' | 'services' | 'business' | 'help') => {
    setLoading(true)
    try {
      const authUser = await authService.login(credentials)
      setUser(authUser)
      const dest = fromPath && fromPath !== '/' ? fromPath : getRedirectPathForRole(authUser.role, undefined, context)
      return { user: authUser, redirectPath: dest }
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (data: RegisterData, fromPath?: string, context?: 'main' | 'services' | 'business' | 'help') => {
    setLoading(true)
    try {
      const authUser = await authService.register(data)
      setUser(authUser)
      const dest = fromPath && fromPath !== '/' ? fromPath : getRedirectPathForRole(authUser.role, undefined, context)
      return { user: authUser, redirectPath: dest }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = signup

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await authService.logout()
    } finally {
      setUser(null)
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (data: Partial<User>) => {
    setLoading(true)
    try {
      const updated = await authService.updateProfile(data)
      if (updated) {
        setUser(updated)
      }
      return updated
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (data: Partial<User>) => {
    return updateUser(data)
  }, [updateUser])

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setLoading(true)
    try {
      await authService.changePassword(currentPassword, newPassword)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    setLoading(true)
    try {
      const refreshedUser = await authService.refreshUser()
      if (refreshedUser) {
        setUser(refreshedUser)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const upgradeToBusinessOwner = useCallback(async () => {
    setLoading(true)
    try {
      const result = await authService.upgradeToBusinessOwner()
      const current = await authService.getCurrentUser()
      if (current) setUser(current)
      return result
    } finally {
      setLoading(false)
    }
  }, [])

  const upgradeToServiceProvider = useCallback(async () => {
    setLoading(true)
    try {
      const result = await authService.upgradeToServiceProvider()
      const current = await authService.getCurrentUser()
      if (current) setUser(current)
      return result
    } finally {
      setLoading(false)
    }
  }, [])

  // Authorization helpers
  const hasCapability = useCallback((capability: Capability): boolean => {
    if (!user) return false
    return Boolean(user.capabilities?.includes(capability))
  }, [user])

  const canAccessServices = useCallback((): boolean => {
    if (!user) return false
    return user.role === 'user' || user.role === 'customer' || user.role === 'service_provider' || user.role === 'business_owner' || user.role === 'admin'
  }, [user])

  const canAccessBusiness = useCallback((): boolean => {
    if (!user) return false
    return user.role === 'business_owner' || user.role === 'admin'
  }, [user])

  const canAccessProvider = useCallback((): boolean => {
    if (!user) return false
    return user.role === 'service_provider' || user.role === 'admin'
  }, [user])

  const canAccessAdmin = useCallback((): boolean => {
    if (!user) return false
    return user.role === 'admin'
  }, [user])

  const getAccountType = useCallback((): AccountType | null => {
    if (!user) return null
    return getAccountTypeFromRole(user.role)
  }, [user])

  const getWorkspaces = useCallback((): WorkspaceSwitcherItem[] => {
    const role = user?.role
    return [
      {
        key: 'customer',
        label: 'Customer',
        description: 'Find workers, services, jobs & request help',
        to: '/dashboard',
        icon: 'user',
        available: !!user,
      },
      {
        key: 'service_provider',
        label: 'Service Provider',
        description: 'Offer your skills, manage leads & requests',
        to: '/provider/dashboard',
        icon: 'briefcase',
        available: role === 'service_provider' || role === 'admin',
      },
      {
        key: 'business_owner',
        label: 'Business Owner',
        description: 'Manage your business profile & services',
        to: '/business/dashboard',
        icon: 'building',
        available: role === 'business_owner' || role === 'admin',
      },
    ]
  }, [user])

  const requireServicesAuth = useCallback((fromPath?: string): string | null => {
    if (!user) return '/login?redirect=' + encodeURIComponent(fromPath || '/services/dashboard')
    if (!canAccessServices()) return '/login?redirect=' + encodeURIComponent(fromPath || '/services/dashboard')
    return null
  }, [user, canAccessServices])

  const requireBusinessAuth = useCallback((fromPath?: string): string | null => {
    if (!user) return '/login?redirect=' + encodeURIComponent(fromPath || '/business/dashboard')
    if (!canAccessBusiness()) return '/login?redirect=' + encodeURIComponent(fromPath || '/business/dashboard')
    return null
  }, [user, canAccessBusiness])

  const authValue = useMemo(() => ({
    user,
    loading,
    isLoading: loading,
    initializing,
    isAuthenticated: !!user,
    capabilities: user?.capabilities ?? [],
    isAdmin: user?.role === 'admin',
    isBusinessOwner: user?.role === 'business_owner' || user?.role === 'admin',
    isServiceProvider: user?.role === 'service_provider' || user?.role === 'admin',
    isCustomer: user?.role === 'user' || user?.role === 'customer' || user?.role === 'admin',
    isServicesUser: !!user,
    isAuthBypassed,
    login,
    signup,
    register,
    logout,
    updateUser,
    updateProfile,
    changePassword,
    refreshUser,
    upgradeToBusinessOwner,
    upgradeToServiceProvider,
    hasCapability,
    canAccessServices,
    canAccessBusiness,
    canAccessProvider,
    canAccessAdmin,
    getAccountType,
    getWorkspaces,
    requireServicesAuth,
    requireBusinessAuth,
  }), [user, loading, initializing, login, signup, register, logout, updateUser, updateProfile, changePassword, refreshUser, upgradeToBusinessOwner, upgradeToServiceProvider, hasCapability, canAccessServices, canAccessBusiness, canAccessProvider, canAccessAdmin, getAccountType, getWorkspaces, requireServicesAuth, requireBusinessAuth])

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Exported for components that only need a safe default dashboard target.
export { getDefaultDashboard }

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}