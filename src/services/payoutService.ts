import type { PayoutDetails } from '../types/business'
import { nigerianBanks } from '../data/banks'

const STORAGE_KEY = 'payout_details'
const BANK_ACCOUNTS_KEY = 'bank_accounts'

interface BankAccountVerification {
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
}

export const payoutService = {
  getPayoutDetails(userId: string): PayoutDetails | null {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  },

  async verifyAccountNumber(accountNumber: string, bankCode: string): Promise<{
    success: boolean
    accountName?: string
    bankName?: string
    error?: string
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!accountNumber || accountNumber.length !== 10) {
          resolve({ success: false, error: 'Please enter a valid 10-digit account number' })
          return
        }

        if (!bankCode) {
          resolve({ success: false, error: 'Please select a bank' })
          return
        }

        const bank = nigerianBanks.find((b) => b.code === bankCode)
        resolve({
          success: true,
          accountName: '',
          bankName: bank?.name || 'Bank',
        })
      }, 300)
    })
  },

  savePayoutDetails(userId: string, details: PayoutDetails): void {
    try {
      localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(details))
    } catch {
      // ignore storage errors
    }
  },

  getBankAccounts(userId: string): BankAccountVerification[] {
    try {
      const stored = localStorage.getItem(`${BANK_ACCOUNTS_KEY}_${userId}`)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  saveBankAccount(userId: string, account: BankAccountVerification & { id: string; verified: boolean; verifiedAt?: string }): void {
    try {
      const accounts = this.getBankAccounts(userId)
      const idx = accounts.findIndex((a: any) => a.id === account.id)
      if (idx !== -1) {
        accounts[idx] = account
      } else {
        accounts.push(account)
      }
      localStorage.setItem(`${BANK_ACCOUNTS_KEY}_${userId}`, JSON.stringify(accounts))
    } catch {
      // ignore storage errors
    }
  },
}
