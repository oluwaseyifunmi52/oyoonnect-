export interface Network {
  id: string
  name: string
  code: string
  logo: string
  color: string
  ussdCode: string
  supportsData: boolean
  supportsAirtime: boolean
  supportsSME: boolean
  supportsCorporateGifting: boolean
}

export interface DataPlan {
  id: string
  networkId: string
  name: string
  dataAmount: string
  validity: string
  price: number
  type: 'regular' | 'sme' | 'corporate' | 'gifting'
  description?: string
}

export interface AirtimePurchase {
  networkId: string
  phoneNumber: string
  amount: number
}

export interface DataPurchase {
  networkId: string
  phoneNumber: string
  planId: string
  planName: string
  amount: number
}

export interface TVProvider {
  id: string
  name: string
  code: string
  logo: string
  color: string
  packages: TVPackage[]
}

export interface TVPackage {
  id: string
  providerId: string
  name: string
  price: number
  duration: string
  channels: number
  description?: string
}

export interface TVSubscription {
  providerId: string
  smartCardNumber: string
  packageId: string
  duration: string
  amount: number
}

export interface ElectricityProvider {
  id: string
  name: string
  code: string
  shortName: string
  logo: string
  color: string
  states: string[]
}

export interface ElectricityPayment {
  providerId: string
  meterNumber: string
  meterType: 'prepaid' | 'postpaid'
  amount: number
  customerName?: string
  phoneNumber?: string
  email?: string
}

export interface ElectricityVerification {
  customerName: string
  meterNumber?: string
  provider?: string
  meterType?: string
  address?: string
  outstandingBalance?: number
  smartCardNumber?: string
  package?: string
}

export interface EducationProduct {
  id: string
  name: string
  type: 'waec' | 'neco' | 'nabteb' | 'jamb' | 'other'
  price: number
  description: string
  provider: string
  image?: string
}

export interface EducationPurchase {
  productId: string
  examType: string
  candidateName: string
  phoneNumber: string
  email?: string
  amount: number
}

export interface RechargePinProduct {
  id: string
  networkId: string
  denomination: number
  price: number
  description: string
}

export interface RechargePinPurchase {
  networkId: string
  productId: string
  phoneNumber: string
  quantity: number
  amount: number
}

export interface SocialMediaPlatform {
  id: string
  name: string
  icon: string
  color: string
  services: SocialMediaService[]
}

export interface SocialMediaService {
  id: string
  platformId: string
  name: string
  description: string
  price: number
  unit: string
  minQuantity: number
  maxQuantity: number
  disclaimer?: string
}

export interface SocialMediaPurchase {
  platformId: string
  serviceId: string
  targetUrl: string
  quantity: number
  amount: number
}

export interface DigitalProduct {
  id: string
  name: string
  category: 'design' | 'productivity' | 'writing' | 'video' | 'other'
  provider: string
  price: number
  originalPrice?: number
  duration: string
  description: string
  features: string[]
  image?: string
  badge?: string
}

export interface DigitalProductPurchase {
  productId: string
  email: string
  duration: string
  amount: number
}

export interface GameProduct {
  id: string
  name: string
  platform: 'google-play' | 'apple' | 'playstation' | 'xbox' | 'steam' | 'other'
  denomination: number
  price: number
  currency: string
  image?: string
  description?: string
}

export interface GamePurchase {
  productId: string
  email: string
  amount: number
}

export interface Transaction {
  id: string
  userId: string
  type: 'data' | 'airtime' | 'tv' | 'electricity' | 'education' | 'recharge-pin' | 'social-media' | 'digital-product' | 'game' | 'wallet-funding' | 'affiliate-commission'
  status: 'pending' | 'processing' | 'success' | 'failed' | 'refunded'
  service: string
  provider: string
  amount: number
  fee: number
  total: number
  currency: 'NGN'
  customerDetails: Record<string, string>
  reference: string
  providerReference?: string
  walletBalanceBefore: number
  walletBalanceAfter: number
  createdAt: string
  updatedAt: string
  completedAt?: string
  failureReason?: string
  receiptUrl?: string
}

export interface VirtualAccount {
  accountName: string
  accountNumber: string
  bankName: string
  provider: string
  accountStatus: 'active' | 'pending' | 'unavailable'
  isVerified?: boolean
  createdAt?: string
  verifiedAt?: string
}

export interface Wallet {
  userId: string
  balance: number
  currency: 'NGN'
  lastUpdated: string
  virtualAccount?: VirtualAccount
  isVerified?: boolean
  kycStatus?: 'unverified' | 'pending' | 'verified' | 'rejected'
  kycCompletedAt?: string
}

export interface WalletAccount {
  id: string
  userId: string
  provider: string
  accountName: string
  accountNumber: string
  bankName: string
  providerAccountId: string
  isVerified: boolean
  isDefault: boolean
  createdAt: string
  verifiedAt?: string
}

export interface WalletFundingSource {
  id: string
  userId: string
  type: 'bank_transfer' | 'card' | 'ussd'
  provider: string
  last4?: string
  bankName?: string
  isDefault: boolean
  isVerified: boolean
  createdAt: string
}

export interface WalletTransaction {
  id: string
  walletId: string
  type: 'credit' | 'debit'
  amount: number
  balanceBefore: number
  balanceAfter: number
  description: string
  reference: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  metadata?: Record<string, unknown>
}

export interface WalletFundingRequest {
  amount: number
  paymentMethod: 'bank_transfer' | 'card' | 'ussd'
  fundingSourceId?: string
}

export interface WalletFundingResponse {
  success: boolean
  reference: string
  message: string
  redirectUrl?: string
  transactionId?: string
}

export interface WalletAccountVerification {
  status: 'unverified' | 'pending' | 'verified' | 'rejected'
  provider: string
  submittedAt?: string
  verifiedAt?: string
  rejectionReason?: string
}

export interface Affiliate {
  id: string
  userId: string
  referralCode: string
  referralLink: string
  totalReferrals: number
  successfulReferrals: number
  totalEarnings: number
  availableCommission: number
  pendingCommission: number
  withdrawableBalance: number
  createdAt: string
}

export interface Referral {
  id: string
  affiliateId: string
  referredUserId: string
  referredUserName: string
  referredUserEmail: string
  status: 'pending' | 'successful' | 'expired'
  commission: number
  createdAt: string
  convertedAt?: string
}

export interface CommissionHistory {
  id: string
  affiliateId: string
  referralId: string
  type: 'signup' | 'first_purchase' | 'milestone'
  amount: number
  status: 'pending' | 'approved' | 'paid'
  createdAt: string
  paidAt?: string
}

export interface Withdrawal {
  id: string
  affiliateId: string
  amount: number
  bankName: string
  accountNumber: string
  accountName: string
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  reference: string
  createdAt: string
  processedAt?: string
  failureReason?: string
}

export interface ServiceCategory {
  id: string
  name: string
  icon: string
  description: string
  color: string
  path: string
  startingPrice?: number
  featured?: boolean
}

export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PurchaseResponse {
  success: boolean
  transaction?: Transaction
  error?: string
  message?: string
  redirectUrl?: string
}

export interface VerificationResponse {
  success: boolean
  data?: ElectricityVerification
  error?: string
}

export interface BillFilters {
  network?: string
  provider?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  sort?: string
  page?: number
  limit?: number
  type?: string
}

export interface TransactionSummary {
  totalTransactions: number
  successfulTransactions: number
  failedTransactions: number
  totalSpent: number
  totalEarned: number
  thisMonth: number
  lastMonth: number
}

export interface WalletStats {
  balance: number
  totalCredits: number
  totalDebits: number
  pendingTransactions: number
}

export interface AffiliateStats {
  totalReferrals: number
  successfulReferrals: number
  totalEarnings: number
  availableCommission: number
  pendingCommission: number
  withdrawableBalance: number
  conversionRate: number
}

export type ServiceType = 
  | 'data' 
  | 'airtime' 
  | 'tv' 
  | 'electricity' 
  | 'education' 
  | 'recharge-pin' 
  | 'social-media' 
  | 'digital-product' 
  | 'game'

export type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed' | 'refunded'

export type WalletTransactionType = 'credit'

export type ReferralStatus = 'pending' | 'successful' | 'expired'

export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'rejected'