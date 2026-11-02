import type { AuthRepository, AuthUser, Capability, LoginCredentials, RegisterData } from './types'
import { AuthError } from './types'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')
const ACCESS_TOKEN_KEY = 'oyoconnect_vtu_backend_token'
const REFRESH_TOKEN_KEY = 'oyoconnect_vtu_backend_refresh'
const TOKEN_STORAGE_KEY = 'oyoconnect_auth_token_storage'
const PROFILE_STORAGE_KEY = 'oyoconnect_user'
const SESSION_STORAGE_KEY = 'oyoconnect_auth'

interface AuthResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

function tokenStore(): Storage {
  return localStorage.getItem(TOKEN_STORAGE_KEY) === 'local' ? localStorage : sessionStorage
}

function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY)
}

function getRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY)
}

function clearTokens(): void {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(ACCESS_TOKEN_KEY)
    storage.removeItem(REFRESH_TOKEN_KEY)
    storage.removeItem(TOKEN_STORAGE_KEY)
  }
}

function tokenExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number }
    if (payload.exp) return payload.exp * 1000
  } catch {
    // Use a short local snapshot lifetime when the server token is not a JWT.
  }
  return Date.now() + 15 * 60 * 1000
}

function persistAuth(result: AuthResponse, rememberMe = false): AuthUser {
  const storage = rememberMe ? localStorage : sessionStorage
  clearTokens()
  storage.setItem(ACCESS_TOKEN_KEY, result.accessToken)
  storage.setItem(REFRESH_TOKEN_KEY, result.refreshToken)
  storage.setItem(TOKEN_STORAGE_KEY, rememberMe ? 'local' : 'session')
  // Existing services pages read this access token from sessionStorage.
  sessionStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken)
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(result.user))
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ expiresAt: tokenExpiry(result.accessToken) }))
  return result.user
}

async function request<T>(path: string, options: RequestInit = {}, authenticated = false): Promise<T> {
  const send = (token?: string | null) => fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  let response = await send(authenticated ? getAccessToken() : null)
  if (response.status === 401 && authenticated) {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      const refreshResponse = await sendRefresh(refreshToken)
      if (refreshResponse) {
        response = await send(refreshResponse.accessToken)
      }
    }
  }

  const body = await response.json().catch(() => ({})) as Record<string, unknown>
  if (!response.ok) {
    if (response.status === 401 && authenticated) clearTokens()
    const message = typeof body.message === 'string' ? body.message : `Request failed (${response.status})`
    throw new AuthError(typeof body.code === 'string' ? body.code : `HTTP_${response.status}`, message)
  }
  return body as T
}

async function sendRefresh(refreshToken: string): Promise<AuthResponse | null> {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  const body = await response.json().catch(() => ({})) as Partial<AuthResponse>
  if (!response.ok || !body.accessToken || !body.refreshToken || !body.user) return null
  persistAuth(body as AuthResponse, tokenStore() === localStorage)
  return body as AuthResponse
}

function cleanUser(user: AuthUser): AuthUser {
  return {
    ...user,
    capabilities: Array.isArray(user.capabilities) ? user.capabilities as Capability[] : [],
    createdAt: user.createdAt || new Date().toISOString(),
  }
}

export class BackendAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const result = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return persistAuth({ ...result, user: cleanUser(result.user) }, Boolean(credentials.rememberMe))
  }

  async register(data: RegisterData): Promise<AuthUser> {
    const result = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data, termsAccepted: data.termsAccepted === true }),
    })
    return persistAuth({ ...result, user: cleanUser(result.user) }, true)
  }

  async logout(): Promise<void> {
    try {
      if (getAccessToken()) await request('/auth/logout', { method: 'POST', body: JSON.stringify({}) }, true)
    } finally {
      clearTokens()
      sessionStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(PROFILE_STORAGE_KEY)
      localStorage.removeItem(SESSION_STORAGE_KEY)
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    if (!getAccessToken() && !getRefreshToken()) return null
    try {
      const user = await request<AuthUser>('/auth/me', {}, true)
      const normalized = cleanUser(user)
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalized))
      return normalized
    } catch (error) {
      if (error instanceof AuthError && error.code.startsWith('HTTP_401')) return null
      throw error
    }
  }

  async updateProfile(_userId: string, data: Partial<AuthUser>): Promise<AuthUser> {
    const { role } = data
    if (role === 'business_owner' || role === 'service_provider') {
      await request(`/auth/upgrade/${role === 'business_owner' ? 'business-owner' : 'service-provider'}`, {
        method: 'POST',
        body: JSON.stringify({ role }),
      }, true)
    }
    const profileUpdate = Object.fromEntries(
      Object.entries(data).filter(([key]) => ['name', 'email', 'phone', 'avatar'].includes(key)),
    )
    if (Object.keys(profileUpdate).length > 0) {
      await request('/auth/profile', { method: 'PATCH', body: JSON.stringify(profileUpdate) }, true)
    }
    const user = await request<AuthUser>('/auth/me', {}, true)
    const normalized = cleanUser(user)
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalized))
    return normalized
  }

  async refreshSession(): Promise<AuthUser | null> {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return null
    const result = await sendRefresh(refreshToken)
    return result ? cleanUser(result.user) : null
  }

  async changePassword(_userId: string, currentPassword: string, newPassword: string): Promise<void> {
    await request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword: newPassword }),
    }, true)
  }

  async forgotPassword(data: { email: string }): Promise<{ success: boolean; message: string }> {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier: data.email }),
    })
  }

  async resetPassword(data: { token: string; password: string; confirmPassword: string }): Promise<{ success: boolean; message: string }> {
    return request('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) })
  }

  hasAccount(): boolean {
    return Boolean(localStorage.getItem(PROFILE_STORAGE_KEY))
  }

  hasOwnedBusiness(_businessId: string): boolean {
    return false
  }
}

export const backendAuthRepository = new BackendAuthRepository()
