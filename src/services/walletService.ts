import type {
  Wallet,
  VirtualAccount,
  WalletTransaction,
  WalletStats,
  WalletAccount,
  WalletFundingSource,
} from '../types/bills'
import { ApiError, apiClient } from './apiClient'

type BackendWallet = Omit<Wallet, 'balance'> & { balance: number }
type BackendTransaction = Omit<WalletTransaction, 'amount' | 'balanceBefore' | 'balanceAfter'> & {
  amount: number
  balanceBefore?: number
  balanceAfter?: number
}
type BackendVirtualAccount = Record<string, unknown> & { id?: string; _id?: string; createdAt?: string }

function unwrap<T>(value: unknown): T {
  if (value && typeof value === 'object' && 'success' in value) {
    const result = value as { success?: boolean; data?: T; message?: string; error?: string }
    if (result.success === false) throw new Error(result.message || result.error || 'Wallet request failed.')
    if ('data' in result) return result.data as T
  }
  return value as T
}

function fromKobo(value: number | undefined): number | undefined {
  return value === undefined ? undefined : value / 100
}

function normalizeWallet(wallet: BackendWallet): Wallet {
  return { ...wallet, balance: wallet.balance / 100 }
}

function normalizeTransaction(transaction: BackendTransaction): WalletTransaction {
  return {
    ...transaction,
    amount: transaction.amount / 100,
    balanceBefore: fromKobo(transaction.balanceBefore) ?? 0,
    balanceAfter: fromKobo(transaction.balanceAfter) ?? 0,
  }
}

function normalizeAccount(account: BackendVirtualAccount): VirtualAccount {
  return {
    ...account,
    id: account.id || account._id || '',
    createdAt: account.createdAt || new Date().toISOString(),
  } as unknown as VirtualAccount
}

export const walletService = {
  async getWallet(): Promise<Wallet | null> {
    const response = await apiClient.get<BackendWallet>('/wallet')
    const wallet = unwrap<BackendWallet | null>(response)
    return wallet ? normalizeWallet(wallet) : null
  },

  async getVirtualAccount(): Promise<VirtualAccount | null> {
    try {
      const response = await apiClient.get<BackendVirtualAccount>('/wallet/virtual-account')
      const account = unwrap<BackendVirtualAccount | null>(response)
      return account ? normalizeAccount(account) : null
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null
      throw error
    }
  },

  async createVirtualAccount(): Promise<VirtualAccount> {
    const response = await apiClient.post<BackendVirtualAccount>('/wallet/virtual-account', { provider: 'paystack' })
    return normalizeAccount(unwrap<BackendVirtualAccount>(response))
  },

  async getTransactions(filters?: {
    page?: number
    limit?: number
    type?: 'credit' | 'debit'
    status?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<{ transactions: WalletTransaction[]; total: number }> {
    const params = new URLSearchParams()
    if (filters?.page) params.set('page', String(filters.page))
    if (filters?.limit) params.set('limit', String(filters.limit))
    if (filters?.type) params.set('type', filters.type)
    if (filters?.status) params.set('status', filters.status)
    if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom)
    if (filters?.dateTo) params.set('dateTo', filters.dateTo)
    const response = await apiClient.get<{ items?: BackendTransaction[]; total?: number }>(`/wallet/transactions?${params.toString()}`)
    const result = unwrap<{ items?: BackendTransaction[]; total?: number }>(response)
    return {
      transactions: (result.items || []).map(normalizeTransaction),
      total: result.total || 0,
    }
  },

  async getStats(): Promise<WalletStats> {
    const response = await apiClient.get<WalletStats>('/wallet/stats')
    const stats = unwrap<WalletStats>(response)
    return {
      ...stats,
      balance: stats.balance / 100,
      totalCredits: stats.totalCredits / 100,
      totalDebits: stats.totalDebits / 100,
    }
  },

  async getWalletAccounts(): Promise<WalletAccount[]> {
    const response = await apiClient.get<WalletAccount[]>('/wallet/virtual-accounts')
    return unwrap<WalletAccount[]>(response)
  },

  async getFundingSources(): Promise<WalletFundingSource[]> {
    const response = await apiClient.get<WalletFundingSource[]>('/wallet/funding-sources')
    return unwrap<WalletFundingSource[]>(response)
  },

  async fundWallet(amount: number, paymentMethod: 'bank_transfer' | 'card' | 'ussd'): Promise<{
    success: boolean
    reference: string
    message: string
    redirectUrl?: string
    transactionId?: string
  }> {
    const idempotencyKey = `web-wallet-fund-${crypto.randomUUID()}`
    const response = await apiClient.post<Record<string, unknown>>('/wallet/fund', {
      amount: Math.round(amount * 100),
      paymentMethod,
    }, { 'Idempotency-Key': idempotencyKey })
    const result = unwrap<Record<string, unknown>>(response)
    return {
      success: result.success === true,
      reference: typeof result.reference === 'string' ? result.reference : '',
      message: typeof result.message === 'string' ? result.message : 'Funding request submitted.',
      redirectUrl: typeof result.redirectUrl === 'string' ? result.redirectUrl : undefined,
      transactionId: typeof result.transactionId === 'string' ? result.transactionId : undefined,
    }
  },

  async withdraw(): Promise<{ success: boolean; message: string }> {
    return { success: false, message: 'A verified bank account is required before withdrawals can be enabled.' }
  },
}
