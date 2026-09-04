export type HelpCategoryType =
  | 'school-fees'
  | 'emergency-rent'
  | 'medical-emergency'
  | 'small-business'
  | 'tools-equipment'
  | 'family-emergency'
  | 'other-emergency'

export interface HelpCategory {
  id: HelpCategoryType
  name: string
  icon: string
  description: string
  color: string
  value: HelpCategoryType
  label: string
}

export type SupportRequestStatus =
  | 'draft'
  | 'pending_review'
  | 'rejected'
  | 'active'
  | 'goal_reached_processing'
  | 'payout_pending'
  | 'payout_processing'
  | 'funded_and_paid_out'
  | 'payout_failed'
  | 'paused'
  | 'closed'

export type VerificationStatus = 'unverified' | 'verification_pending' | 'verified' | 'failed'

export type BankVerificationStatus = 'unverified' | 'verification_pending' | 'verified' | 'failed'

export interface BankAccount {
  id: string
  userId: string
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
  verificationStatus: BankVerificationStatus
  verificationTimestamp?: string
  verifiedAt?: string
  verificationReference?: string
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}

export interface BankVerificationRequest {
  accountNumber: string
  bankCode: string
  accountName: string
}

export interface BankVerificationResponse {
  success: boolean
  accountName?: string
  bankName?: string
  error?: string
  reference?: string
}

export interface SupportRequest {
  id: string
  requesterId: string
  requesterName: string
  requesterAvatar?: string
  requesterLocation: string
  category: HelpCategoryType
  title: string
  description: string
  fullStory: string
  targetAmount: number
  amountRaised: number
  currency: 'NGN'
  deadline: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  goalReachedAt?: string
  paidOutAt?: string
  status: SupportRequestStatus
  verificationStatus: VerificationStatus
  bankVerificationStatus: BankVerificationStatus
  bankAccountId?: string
  bankAccount?: BankAccount
  verificationDocuments?: string[]
  supportersCount: number
  updates?: SupportUpdate[]
  reviewNotes?: string
  rejectedReason?: string
  adminReviewedBy?: string
  adminReviewedAt?: string
}

export interface SupportUpdate {
  id: string
  requestId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
}

export interface SupportContribution {
  id: string
  requestId: string
  supporterId: string
  supporterName: string
  supporterAvatar?: string
  amount: number
  currency: 'NGN'
  message?: string
  isAnonymous: boolean
  paymentReference: string
  paymentProvider: string
  paymentStatus: 'pending' | 'processing' | 'success' | 'failed' | 'refunded'
  verifiedAt?: string
  createdAt: string
}

export interface Payout {
  id: string
  helpRequestId: string
  requesterId: string
  amountRaised: number
  platformFee: number
  payoutAmount: number
  currency: 'NGN'
  bankAccount: BankAccount
  status: PayoutStatus
  attemptCount: number
  maxAttempts: number
  providerReference?: string
  failureReason?: string
  failureCode?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  nextRetryAt?: string
}

export type PayoutStatus =
  | 'pending'
  | 'processing'
  | 'success'
  | 'failed'
  | 'retrying'
  | 'paused'

export interface PayoutAttempt {
  id: string
  payoutId: string
  attemptNumber: number
  status: PayoutStatus
  providerReference?: string
  errorCode?: string
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

export interface RequestHelpFormData {
  category: HelpCategoryType | ''
  title: string
  description: string
  fullStory: string
  targetAmount: number
  deadline: string
  location: string
  supportingInfo?: string
  documents: File[]
  bankAccount?: BankVerificationRequest
}

export interface HelpFilters {
  query?: string
  category?: HelpCategoryType
  location?: string
  minAmount?: number
  maxAmount?: number
  sort?: 'recent' | 'almost-funded' | 'verified' | 'deadline'
  verificationStatus?: VerificationStatus
  status?: SupportRequestStatus
  page?: number
  limit?: number
}

export interface PayoutFilters {
  status?: PayoutStatus
  requesterId?: string
  helpRequestId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface FinancialAuditLog {
  id: string
  actorId: string
  actorName: string
  actorRole: string
  action: string
  entityType: 'help_request' | 'donation' | 'payout' | 'bank_verification' | 'admin_review'
  entityId: string
  metadata: Record<string, unknown>
  createdAt: string
}

export interface EscrowTransparencyInfo {
  collectionAccountName: string
  collectionAccountNumber: string
  collectionBankName: string
  message: string
}

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'school-fees',
    name: 'School Fees',
    icon: 'graduation-cap',
    description: 'Help students cover tuition, school charges, books, or other approved education expenses.',
    color: '#3b82f6',
    value: 'school-fees',
    label: 'School Fees'
  },
  {
    id: 'emergency-rent',
    name: 'Emergency Rent',
    icon: 'home',
    description: 'Support someone facing an urgent housing or rent situation.',
    color: '#f59e0b',
    value: 'emergency-rent',
    label: 'Emergency Rent'
  },
  {
    id: 'medical-emergency',
    name: 'Medical & Emergency Support',
    icon: 'heart-pulse',
    description: 'Help with verified medical expenses or urgent emergency needs.',
    color: '#ef4444',
    value: 'medical-emergency',
    label: 'Medical & Emergency Support'
  },
  {
    id: 'small-business',
    name: 'Small Business Support',
    icon: 'briefcase',
    description: 'Help someone start or restart a small business and become financially independent.',
    color: '#10b981',
    value: 'small-business',
    label: 'Small Business Support'
  },
  {
    id: 'tools-equipment',
    name: 'Tools & Work Equipment',
    icon: 'wrench',
    description: 'Help skilled workers get the tools or equipment they need to work and earn.',
    color: '#8b5cf6',
    value: 'tools-equipment',
    label: 'Tools & Work Equipment'
  },
  {
    id: 'family-emergency',
    name: 'Family Emergency',
    icon: 'users',
    description: 'Support families facing genuine unexpected financial difficulties.',
    color: '#ec4899',
    value: 'family-emergency',
    label: 'Family Emergency'
  },
  {
    id: 'other-emergency',
    name: 'Other Genuine Emergencies',
    icon: 'alert-triangle',
    description: 'Request community support for another serious and genuine emergency.',
    color: '#64748b',
    value: 'other-emergency',
    label: 'Other Genuine Emergencies'
  }
]

export function getCategoryById(id: HelpCategoryType): HelpCategory | undefined {
  return HELP_CATEGORIES.find((cat) => cat.id === id)
}

export const REQUEST_HELP_STEPS = [
  { id: 'category', label: 'Category', description: 'Choose a category' },
  { id: 'details', label: 'Details', description: 'Tell your story' },
  { id: 'bank', label: 'Bank Details', description: 'Add verified payout account' },
  { id: 'evidence', label: 'Evidence', description: 'Add documents' },
  { id: 'review', label: 'Review', description: 'Confirm & submit' }
] as const

export type RequestHelpStepId = typeof REQUEST_HELP_STEPS[number]['id']

export const SUGGESTED_SUPPORT_AMOUNTS = [500, 1000, 5000, 10000] as const

export const PLATFORM_FEE_PERCENTAGE = 5 // 5% platform fee for help requests
export const PAYMENT_GATEWAY_FEE_PERCENTAGE = 1.5
export const DIGITAL_SERVICE_PLATFORM_FEE = 50 // ₦50 flat fee for digital services
export const MIN_DONATION_AMOUNT = 100
export const MAX_DONATION_AMOUNT = 1000000

export const STATUS_LABELS: Record<SupportRequestStatus, string> = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  rejected: 'Rejected',
  active: 'Active',
  goal_reached_processing: 'Goal Reached — Processing Payout',
  payout_pending: 'Payout Pending',
  payout_processing: 'Payout Processing',
  funded_and_paid_out: 'Paid Out',
  payout_failed: 'Payout Failed',
  paused: 'Paused',
  closed: 'Closed'
}

export const PAYOUT_STATUS_LABELS: Record<PayoutStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  success: 'Completed',
  failed: 'Failed',
  retrying: 'Retrying',
  paused: 'Paused'
}

export const BANK_VERIFICATION_STATUS_LABELS: Record<BankVerificationStatus, string> = {
  unverified: 'Unverified',
  verification_pending: 'Verification Pending',
  verified: 'Verified',
  failed: 'Failed'
}

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  unverified: 'Unverified',
  verification_pending: 'Verification Pending',
  verified: 'Verified',
  failed: 'Failed'
}