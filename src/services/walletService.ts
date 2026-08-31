import type {
  Wallet,
  VirtualAccount,
  WalletTransaction,
  WalletStats,
  WalletAccount,
  WalletFundingSource,
} from '../types/bills'

const STORAGE_KEY = 'wallet_data'
const TRANSACTIONS_KEY = 'wallet_transactions'
const ACCOUNT_KEY = 'virtual_account'

function generateVirtualAccount(): VirtualAccount {
  const accountNumber = `0${Math.floor(100000000 + Math.random() * 900000000)}`
  return {
    accountName: 'OyoConnect Escrow Account',
    accountNumber,
    bankName: 'Wema Bank',
    provider: 'Opay',
    accountStatus: 'active',
    isVerified: true,
    createdAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString(),
  }
}

const defaultWallet: Wallet = {
  userId: 'dev-user',
  balance: 125500,
  currency: 'NGN',
  lastUpdated: new Date().toISOString(),
  isVerified: true,
  kycStatus: 'verified',
  kycCompletedAt: new Date().toISOString(),
}

const defaultTransactions: WalletTransaction[] = [
  {
    id: 'wt-001',
    walletId: 'wallet-001',
    type: 'credit',
    amount: 50000,
    balanceBefore: 75500,
    balanceAfter: 125500,
    description: 'Bank transfer funding',
    reference: 'ft_50000_001',
    status: 'completed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'wt-002',
    walletId: 'wallet-001',
    type: 'debit',
    amount: 500,
    balanceBefore: 125500,
    balanceAfter: 125000,
    description: 'Data plan purchase (MTN 5GB)',
    reference: 'txn_mtn5gb_001',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'wt-003',
    walletId: 'wallet-001',
    type: 'debit',
    amount: 50,
    balanceBefore: 125000,
    balanceAfter: 124950,
    description: 'Platform fee - Airtime recharge',
    reference: 'fee_airtime_002',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'wt-004',
    walletId: 'wallet-001',
    type: 'credit',
    amount: 5000,
    balanceBefore: 124950,
    balanceAfter: 129950,
    description: 'Cashback from referral',
    reference: 'ref_cashback_001',
    status: 'completed',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

function getStoredWallet(): Wallet | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function setStoredWallet(wallet: Wallet): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet))
  } catch {}
}

function getStoredTransactions(): WalletTransaction[] {
  try {
    const stored = localStorage.getItem(TRANSACTIONS_KEY)
    return stored ? JSON.parse(stored) : defaultTransactions
  } catch {
    return defaultTransactions
  }
}

function setStoredTransactions(transactions: WalletTransaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
  } catch {}
}

function getStoredVirtualAccount(): VirtualAccount | null {
  try {
    const stored = localStorage.getItem(ACCOUNT_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function setStoredVirtualAccount(account: VirtualAccount): void {
  try {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account))
  } catch {}
}

export const walletService = {
  async getWallet(): Promise<Wallet | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = getStoredWallet()
        resolve(stored ?? defaultWallet)
      }, 100)
    })
  },

  async createVirtualAccount(): Promise<VirtualAccount> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existing = getStoredVirtualAccount()
        if (existing && existing.accountStatus === 'active') {
          resolve(existing)
          return
        }
        const account = generateVirtualAccount()
        setStoredVirtualAccount(account)
        resolve(account)
      }, 200)
    })
  },

  async getTransactions(filters?: {
    page?: number
    limit?: number
    type?: 'credit' | 'debit'
    status?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<{ transactions: WalletTransaction[]; total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = getStoredTransactions()

        if (filters?.type) {
          results = results.filter((t) => t.type === filters.type)
        }
        if (filters?.status) {
          results = results.filter((t) => t.status === filters.status)
        }
        if (filters?.dateFrom) {
          results = results.filter((t) => new Date(t.createdAt) >= new Date(filters.dateFrom!))
        }
        if (filters?.dateTo) {
          results = results.filter((t) => new Date(t.createdAt) <= new Date(filters.dateTo!))
        }

        const total = results.length
        const page = filters?.page ?? 1
        const limit = filters?.limit ?? 10
        const start = (page - 1) * limit
        const paginated = results.slice(start, start + limit)

        resolve({
          transactions: paginated,
          total,
        })
      }, 100)
    })
  },

  async getStats(): Promise<WalletStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wallet = getStoredWallet() ?? defaultWallet
        const transactions = getStoredTransactions()
        const totalCredits = transactions
          .filter((t) => t.type === 'credit')
          .reduce((sum, t) => sum + t.amount, 0)
        const totalDebits = transactions
          .filter((t) => t.type === 'debit')
          .reduce((sum, t) => sum + t.amount, 0)
        const pendingTransactions = transactions.filter(
          (t) => t.status === 'pending',
        ).length

        resolve({
          balance: wallet.balance,
          totalCredits,
          totalDebits,
          pendingTransactions,
        })
      }, 100)
    })
  },

  async getWalletAccounts(): Promise<WalletAccount[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, 100)
    })
  },

  async getFundingSources(): Promise<WalletFundingSource[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, 100)
    })
  },

  async fundWallet(amount: number, paymentMethod: 'bank_transfer' | 'card' | 'ussd'): Promise<{
    success: boolean
    reference: string
    message: string
    redirectUrl?: string
    transactionId?: string
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wallet = getStoredWallet() ?? defaultWallet
        const newBalance = wallet.balance + amount
        setStoredWallet({ ...wallet, balance: newBalance, lastUpdated: new Date().toISOString() })

        const deposit: WalletTransaction = {
          id: `wt-${Date.now()}`,
          walletId: 'wallet-001',
          type: 'credit',
          amount,
          balanceBefore: wallet.balance,
          balanceAfter: newBalance,
          description: `Wallet funding via ${paymentMethod}`,
          reference: `fund_${amount}_${Date.now()}`,
          status: 'completed',
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        }
        const txns = getStoredTransactions()
        txns.unshift(deposit)
        setStoredTransactions(txns)

        resolve({
          success: true,
          reference: `fund_${amount}_${Date.now()}`,
          message: `₦${amount} credited to your wallet successfully`,
          transactionId: deposit.id,
        })
      }, 200)
    })
  },

  async withdraw(amount: number): Promise<{
    success: boolean
    message: string
    transactionId?: string
  }> {
    const wallet = getStoredWallet() ?? defaultWallet

    if (wallet.balance < amount) {
      return { success: false, message: 'Insufficient wallet balance' }
    }

    const newBalance = wallet.balance - amount
    setStoredWallet({ ...wallet, balance: newBalance, lastUpdated: new Date().toISOString() })

    const withdrawal: WalletTransaction = {
      id: `wt-${Date.now()}`,
      walletId: 'wallet-001',
      type: 'debit',
      amount,
      balanceBefore: wallet.balance,
      balanceAfter: newBalance,
      description: 'Wallet withdrawal',
      reference: `withdraw_${amount}_${Date.now()}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    }
    const txns = getStoredTransactions()
    txns.unshift(withdrawal)
    setStoredTransactions(txns)

    return {
      success: true,
      message: `₦${amount} withdrawn successfully`,
      transactionId: withdrawal.id,
    }
  },
}

export { defaultWallet, defaultTransactions }
