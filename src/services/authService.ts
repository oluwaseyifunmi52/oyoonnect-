import { devAuthRepository } from './auth/devAuthRepository'
import type { AuthUser, LoginCredentials, RegisterData, Capability } from './auth/types'
import { AuthError } from './auth/types'

export const AUTH_STORAGE_KEY = 'oyoconnect_auth'
export const USER_STORAGE_KEY = 'oyoconnect_user'
export const AUTH_PROVIDER = 'dev'

export type { AuthUser, Capability, LoginCredentials, RegisterData }

class AuthService {
  private repository = devAuthRepository

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    return this.repository.login(credentials)
  }

  async register(data: RegisterData): Promise<AuthUser> {
    return this.repository.register(data)
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.repository.getCurrentUser()
  }

  async logout(): Promise<void> {
    await this.repository.logout()
  }

  async updateProfile(data: Partial<AuthUser>): Promise<AuthUser | null> {
    const user = await this.repository.getCurrentUser()
    if (!user) return null
    return this.repository.updateProfile(user.id, data)
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.repository.getCurrentUser()
    if (!user) throw new AuthError('NO_ACCOUNT', 'No authenticated user')
    await this.repository.changePassword(user.id, currentPassword, newPassword)
  }

  async refreshUser(): Promise<AuthUser | null> {
    return this.repository.refreshSession()
  }

  async upgradeToBusinessOwner(): Promise<{ success: boolean; message: string }> {
    const user = await this.repository.getCurrentUser()
    if (!user) {
      return { success: false, message: 'No authenticated user' }
    }
    try {
      await this.repository.updateProfile(user.id, {
        role: 'business_owner',
        capabilities: Array.from(new Set<Capability>([...user.capabilities, 'business_owner'])),
      })
      return { success: true, message: 'Account upgraded to business owner' }
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Upgrade failed' }
    }
  }

  async upgradeToServiceProvider(): Promise<{ success: boolean; message: string }> {
    const user = await this.repository.getCurrentUser()
    if (!user) {
      return { success: false, message: 'No authenticated user' }
    }
    try {
      await this.repository.updateProfile(user.id, {
        role: 'service_provider',
        capabilities: Array.from(new Set<Capability>([...user.capabilities, 'service_provider'])),
      })
      return { success: true, message: 'Account upgraded to service provider' }
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Upgrade failed' }
    }
  }

  async forgotPassword(data: { email: string }): Promise<{ success: boolean; message: string }> {
    return this.repository.forgotPassword(data)
  }
}

export const authService = new AuthService()
