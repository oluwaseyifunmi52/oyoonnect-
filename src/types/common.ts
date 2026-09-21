/**
 * Shared common types used across the application.
 * Single source of truth for core domain types.
 */

export type Capability =
  | 'user'
  | 'customer'
  | 'service_provider'
  | 'job_seeker'
  | 'employer'
  | 'business_owner'
  | 'community_contributor'
  | 'help_requester'

export type UserRole = 'user' | 'customer' | 'service_provider' | 'business_owner' | 'admin'

export type AccountType = 'customer' | 'service_provider' | 'business_owner'