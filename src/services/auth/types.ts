export type Capability =
  | 'user'
  | 'customer'
  | 'service_provider'
  | 'business_owner'
  | 'job_seeker'
  | 'employer'
  | 'community_contributor'
  | 'help_requester'

export type AccountType = 'customer' | 'service_provider' | 'business_owner'

export type UserRole = 'user' | 'customer' | 'service_provider' | 'business_owner' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  phone: string
  /** Primary role / account purpose. `user` is treated as a `customer` for backwards compatibility. */
  role: UserRole
  /** Optional primary account type for richer modelling. */
  primaryAccountType?: AccountType
  capabilities: Capability[]
  avatar?: string
  createdAt: string
}

export interface LoginCredentials {
  identifier: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  role?: UserRole
  primaryAccountType?: AccountType
  referralCode?: string
  termsAccepted?: boolean
}

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthUser>
  register(data: RegisterData): Promise<AuthUser>
  logout(): Promise<void>
  getCurrentUser(): Promise<AuthUser | null>
  updateProfile(userId: string, data: Partial<AuthUser>): Promise<AuthUser>
  refreshSession(): Promise<AuthUser | null>
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>
  forgotPassword(data: { email: string }): Promise<{ success: boolean; message: string }>
  resetPassword(data: { token: string; password: string; confirmPassword: string }): Promise<{ success: boolean; message: string }>
  hasAccount(): boolean
  hasOwnedBusiness(businessId: string): boolean
}

export class AuthError extends Error {
  constructor(public code: string, message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export const AUTH_MESSAGES = {
  NO_ACCOUNT: 'No account found with that email or phone number.',
  WRONG_PASSWORD: 'Incorrect password. Please try again.',
  DUPLICATE_EMAIL: 'An account with this email already exists.',
  DUPLICATE_PHONE: 'An account with this phone number already exists.',
}
