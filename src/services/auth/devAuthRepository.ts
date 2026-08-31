import type { AuthRepository, AuthUser, LoginCredentials, RegisterData, Capability } from './types'
import { AuthError, AUTH_MESSAGES } from './types'
import {
  normalizeEmail,
  normalizePhone,
  isValidEmail,
  isValidNigerianPhone,
  validatePassword,
} from './validation'

export const DEV_USERS_STORAGE_KEY = 'oyoconnect_users'
export const DEV_USER_STORAGE_KEY = 'oyoconnect_user'
export const DEV_SESSION_STORAGE_KEY = 'oyoconnect_auth'

const DEFAULT_CAPABILITIES: Capability[] = ['user']

const SESSION_TTL_REMEMBERED_MS = 30 * 24 * 60 * 60 * 1000
const SESSION_TTL_DEFAULT_MS = 24 * 60 * 60 * 1000

interface StoredAccount {
  id: string
  name: string
  email: string
  phone: string
  role: 'user' | 'customer' | 'service_provider' | 'business_owner' | 'admin'
  capabilities: Capability[]
  avatar?: string
  createdAt: string
  loginCount: number
  passwordHash: string
}

interface StoredSession {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `user_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

function getStored<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.warn(`[dev auth] failed to save to localStorage (${key})`)
  }
}

function removeStored(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
  }
}

const DEV_SALT = 'oyoconnect-local-development'

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${DEV_SALT}:${password}`)
  try {
    if (globalThis.crypto?.subtle) {
      const digest = await crypto.subtle.digest('SHA-256', data)
      const hex = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      return `sha256$${hex}`
    }
  } catch {
  }
  let hash = 0
  for (const byte of data) {
    hash = ((hash << 5) - hash + byte) | 0
  }
  return `fallback$${Math.abs(hash).toString(36)}`
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (storedHash.startsWith('hash_')) {
    const parts = storedHash.split('_')
    const legacyLength = Number(parts[parts.length - 1])
    if (password.length !== legacyLength) return false
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return `hash_${Math.abs(hash).toString(36)}_${password.length}` === storedHash
  }
  const computed = await hashPassword(password)
  return computed === storedHash
}

function readAccounts(): StoredAccount[] {
  return getStored<StoredAccount[]>(DEV_USERS_STORAGE_KEY, [])
}

function writeAccounts(accounts: StoredAccount[]): void {
  setStored(DEV_USERS_STORAGE_KEY, accounts)
}

function isEmailIdentifier(identifier: string): boolean {
  return identifier.includes('@') && isValidEmail(identifier)
}

function findAccountByIdentifier(accounts: StoredAccount[], identifier: string): StoredAccount | null {
  if (isEmailIdentifier(identifier)) {
    const email = normalizeEmail(identifier)
    return accounts.find((a) => a.email === email) ?? null
  }
  const phone = normalizePhone(identifier)
  return accounts.find((a) => a.phone === phone) ?? null
}

function toAuthUser(account: StoredAccount): AuthUser {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    phone: account.phone,
    role: account.role,
    capabilities: account.capabilities,
    avatar: account.avatar,
    createdAt: account.createdAt,
  }
}

function readSession(): StoredSession | null {
  return getStored<StoredSession | null>(DEV_SESSION_STORAGE_KEY, null)
}

function readSessionUser(): AuthUser | null {
  return getStored<AuthUser | null>(DEV_USER_STORAGE_KEY, null)
}

function clearSession(): void {
  removeStored(DEV_SESSION_STORAGE_KEY)
  removeStored(DEV_USER_STORAGE_KEY)
}

function sessionIsExpired(session: StoredSession): boolean {
  return Date.now() >= session.expiresAt
}

export function isDevSessionValid(): boolean {
  const session = readSession()
  const user = readSessionUser()
  if (!session || !user) return false
  return !sessionIsExpired(session)
}

export class DevAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const { identifier, password, rememberMe } = credentials
    if (!identifier.trim() || !password) {
      throw new AuthError('INVALID_INPUT', 'Enter your email or phone and your password.')
    }

    const accounts = readAccounts()
    const account = findAccountByIdentifier(accounts, identifier)

    if (!account) {
      throw new AuthError('NO_ACCOUNT', AUTH_MESSAGES.NO_ACCOUNT)
    }

    if (!(await verifyPassword(password, account.passwordHash))) {
      throw new AuthError('WRONG_PASSWORD', AUTH_MESSAGES.WRONG_PASSWORD)
    }

    account.loginCount += 1
    writeAccounts(accounts)

    return this.startSession(account, Boolean(rememberMe))
  }

  async register(data: RegisterData): Promise<AuthUser> {
    const name = data.name.trim()
    const email = normalizeEmail(data.email)
    const phone = normalizePhone(data.phone)

    if (!name) throw new AuthError('INVALID_INPUT', 'Full name is required')
    if (!isValidEmail(data.email)) throw new AuthError('INVALID_INPUT', 'Please enter a valid email address')
    if (!isValidNigerianPhone(data.phone)) throw new AuthError('INVALID_INPUT', 'Please enter a valid Nigerian phone number')
    const passwordError = data.password ? validatePassword(data.password) : 'Password is required'
    if (passwordError) throw new AuthError('INVALID_INPUT', passwordError)
    if (data.password !== data.confirmPassword) {
      throw new AuthError('INVALID_INPUT', 'Passwords do not match')
    }

    const accounts = readAccounts()
    if (accounts.some((a) => a.email === email)) {
      throw new AuthError('DUPLICATE_EMAIL', AUTH_MESSAGES.DUPLICATE_EMAIL)
    }
    if (accounts.some((a) => a.phone === phone)) {
      throw new AuthError('DUPLICATE_PHONE', AUTH_MESSAGES.DUPLICATE_PHONE)
    }

    const role: StoredAccount['role'] =
      data.role === 'service_provider' || data.role === 'business_owner'
        ? data.role
        : 'customer'

    const capabilities: Capability[] =
      role === 'business_owner'
        ? Array.from(new Set<Capability>([...DEFAULT_CAPABILITIES, 'business_owner']))
        : role === 'service_provider'
          ? Array.from(new Set<Capability>([...DEFAULT_CAPABILITIES, 'service_provider']))
          : Array.from(new Set<Capability>([...DEFAULT_CAPABILITIES, 'customer']))

    const account: StoredAccount = {
      id: uid(),
      name,
      email,
      phone,
      role,
      capabilities,
      createdAt: new Date().toISOString(),
      loginCount: 1,
      passwordHash: await hashPassword(data.password),
    }

    writeAccounts([account, ...accounts])

    return this.startSession(account, true)
  }

  async logout(): Promise<void> {
    clearSession()
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const session = readSession()
    const sessionUser = readSessionUser()
    if (!session || !sessionUser) return null
    if (sessionIsExpired(session)) {
      clearSession()
      return null
    }

    const account = readAccounts().find((a) => a.id === sessionUser.id)
    if (!account) {
      clearSession()
      return null
    }

    const fresh = toAuthUser(account)
    setStored(DEV_USER_STORAGE_KEY, fresh)
    return fresh
  }

  async updateProfile(userId: string, data: Partial<AuthUser>): Promise<AuthUser> {
    const accounts = readAccounts()
    const index = accounts.findIndex((a) => a.id === userId)
    if (index === -1) throw new AuthError('UNEXPECTED', 'Account not found')

    const current = accounts[index]
    const next: StoredAccount = { ...current }

    if (data.name !== undefined) next.name = data.name.trim() || current.name
    if (data.avatar !== undefined) next.avatar = data.avatar
    if (data.capabilities !== undefined) next.capabilities = data.capabilities

    if (data.role !== undefined && data.role !== current.role) {
      next.role = data.role
      const added: Capability[] = []
      if (data.role === 'business_owner' || data.role === 'admin') added.push('business_owner')
      if (data.role === 'service_provider') added.push('service_provider')
      if (data.role === 'customer' || data.role === 'user') added.push('customer')
      if (added.length) {
        next.capabilities = Array.from(new Set([...next.capabilities, ...added]))
      }
    }

    if (data.email !== undefined) {
      const email = normalizeEmail(data.email)
      if (email !== current.email) {
        if (!isValidEmail(email)) throw new AuthError('INVALID_INPUT', 'Please enter a valid email address')
        if (accounts.some((a) => a.id !== userId && a.email === email)) {
          throw new AuthError('DUPLICATE_EMAIL', AUTH_MESSAGES.DUPLICATE_EMAIL)
        }
        next.email = email
      }
    }

    if (data.phone !== undefined) {
      const phone = normalizePhone(data.phone)
      if (phone !== current.phone) {
        if (!isValidNigerianPhone(phone)) {
          throw new AuthError('INVALID_INPUT', 'Please enter a valid Nigerian phone number')
        }
        if (accounts.some((a) => a.id !== userId && a.phone === phone)) {
          throw new AuthError('DUPLICATE_PHONE', AUTH_MESSAGES.DUPLICATE_PHONE)
        }
        next.phone = phone
      }
    }

    accounts[index] = next
    writeAccounts(accounts)

    const fresh = toAuthUser(next)
    setStored(DEV_USER_STORAGE_KEY, fresh)
    return fresh
  }

  async refreshSession(): Promise<AuthUser | null> {
    return this.getCurrentUser()
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const accounts = readAccounts()
    const account = accounts.find((a) => a.id === userId)
    if (!account) throw new AuthError('UNEXPECTED', 'Account not found')
    if (!currentPassword) throw new AuthError('INVALID_INPUT', 'Enter your current password')
    if (!(await verifyPassword(currentPassword, account.passwordHash))) {
      throw new AuthError('WRONG_PASSWORD', 'Current password is incorrect')
    }
    const passwordError = validatePassword(newPassword)
    if (passwordError) throw new AuthError('INVALID_INPUT', passwordError)

    account.passwordHash = await hashPassword(newPassword)
    writeAccounts(accounts)
  }

  async forgotPassword(data: { email: string }): Promise<{ success: boolean; message: string }> {
    void data
    return {
      success: false,
      message: "Password recovery will be available when OyoConnect's backend authentication system is connected.",
    }
  }

  async resetPassword(data: { token: string; password: string; confirmPassword: string }): Promise<{ success: boolean; message: string }> {
    void data
    return {
      success: false,
      message: "Password recovery will be available when OyoConnect's backend authentication system is connected.",
    }
  }

  hasAccount(): boolean {
    return readAccounts().length > 0
  }

  hasOwnedBusiness(businessId: string): boolean {
    const user = readSessionUser()
    if (!user) return false
    if (user.role === 'admin') return true
    const businesses = getStored<Array<{ id: string; ownerId: string }>>('oyoconnect_businesses', [])
    return businesses.some((b) => b.id === businessId && b.ownerId === user.id)
  }

  private startSession(account: StoredAccount, rememberMe: boolean): AuthUser {
    const now = Date.now()
    const ttl = rememberMe ? SESSION_TTL_REMEMBERED_MS : SESSION_TTL_DEFAULT_MS
    const session: StoredSession = {
      accessToken: `dev_access_${now}_${Math.random().toString(36).slice(2)}`,
      refreshToken: `dev_refresh_${now}_${Math.random().toString(36).slice(2)}`,
      expiresAt: now + ttl,
    }
    const authUser = toAuthUser(account)
    setStored(DEV_USER_STORAGE_KEY, authUser)
    setStored(DEV_SESSION_STORAGE_KEY, session)
    return authUser
  }
}

export const devAuthRepository = new DevAuthRepository()
