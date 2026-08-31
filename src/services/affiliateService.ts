import type {
  Affiliate,
  Referral,
  CommissionHistory,
  AffiliateStats,
  Withdrawal,
} from '../types/bills'
import { nigerianBanks } from '../data/banks'

const STORAGE_KEY = 'affiliate_withdrawals'
const REFERRAL_KEY = 'affiliate_referrals'
const COMMISSION_KEY = 'affiliate_commissions'

const defaultAffiliate: Affiliate = {} as Affiliate
const defaultReferrals: Referral[] = []
const defaultCommissions: CommissionHistory[] = []
const defaultWithdrawals: Withdrawal[] = []


function getStoredWithdrawals(): Withdrawal[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultWithdrawals
  } catch {
    return defaultWithdrawals
  }
}

function saveWithdrawals(withdrawals: Withdrawal[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withdrawals))
  } catch {}
}

export { defaultAffiliate, defaultReferrals, defaultCommissions, defaultWithdrawals }

export const affiliateService = {
  getAffiliateInfo(): Affiliate {
    return defaultAffiliate
  },

  getStats(): AffiliateStats {
    const totalReferrals = defaultReferrals.length
    const successfulReferrals = defaultReferrals.filter((r) => r.status === 'successful').length
    const totalEarnings = defaultCommissions.reduce((sum, c) => sum + c.amount, 0)
    const availableCommission = defaultCommissions.filter((c) => c.status === 'approved' || c.status === 'paid').reduce((sum, c) => sum + c.amount, 0)
    const pendingCommission = defaultCommissions.filter((c) => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0)

    return {
      totalReferrals,
      successfulReferrals,
      totalEarnings,
      availableCommission,
      pendingCommission,
      withdrawableBalance: availableCommission,
      conversionRate: totalReferrals > 0 ? (successfulReferrals / totalReferrals) * 100 : 0,
    }
  },

  async getWithdrawals(filters?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<{ withdrawals: Withdrawal[]; total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = getStoredWithdrawals()

        if (filters?.status) {
          results = results.filter((w) => w.status === filters.status)
        }

        const total = results.length
        const page = filters?.page ?? 1
        const limit = filters?.limit ?? 10
        const start = (page - 1) * limit
        const paginated = results.slice(start, start + limit)

        resolve({
          withdrawals: paginated,
          total,
        })
      }, 100)
    })
  },

  async requestWithdrawal(request: {
    amount: number
    bankName: string
    accountNumber: string
    accountName: string
  }): Promise<{ success: boolean; message?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const amount = parseFloat(String(request.amount))
        if (amount <= 0) {
          resolve({ success: false, message: 'Invalid amount' })
          return
        }

        const bank = nigerianBanks.find((b) => b.name === request.bankName)
        if (!bank) {
          resolve({ success: false, message: 'Bank not recognized' })
          return
        }

        const newWithdrawal: Withdrawal = {
          id: `wd-${Date.now()}`,
          affiliateId: defaultAffiliate.id,
          amount,
          bankName: request.bankName,
          accountNumber: request.accountNumber,
          accountName: request.accountName,
          status: 'pending',
          reference: `wd_${Date.now()}`,
          createdAt: new Date().toISOString(),
        }

        const withdrawals = getStoredWithdrawals()
        withdrawals.unshift(newWithdrawal)
        saveWithdrawals(withdrawals)

        resolve({
          success: true,
          message: 'Withdrawal request submitted successfully',
        })
      }, 200)
    })
  },

  async getReferrals(filters?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<{ referrals: Referral[]; total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...defaultReferrals]

        if (filters?.status) {
          results = results.filter((r) => r.status === filters.status)
        }

        const total = results.length
        const page = filters?.page ?? 1
        const limit = filters?.limit ?? 10
        const start = (page - 1) * limit
        const paginated = results.slice(start, start + limit)

        resolve({
          referrals: paginated,
          total,
        })
      }, 100)
    })
  },

  async getCommissionHistory(filters?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<{ commissions: CommissionHistory[]; total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...defaultCommissions]

        if (filters?.status) {
          results = results.filter((c) => c.status === filters.status)
        }

        const total = results.length
        const page = filters?.page ?? 1
        const limit = filters?.limit ?? 10
        const start = (page - 1) * limit
        const paginated = results.slice(start, start + limit)

        resolve({
          commissions: paginated,
          total,
        })
      }, 100)
    })
  },
}