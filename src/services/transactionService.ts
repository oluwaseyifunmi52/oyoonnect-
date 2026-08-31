import type {
  Transaction,
  BillFilters,
  TransactionSummary,
} from '../types/bills'

const mockTransactions: Transaction[] = []


export interface GetTransactionsResult {
  transactions: Transaction[]
  total: number
}

export const transactionService = {
  async getTransactions(filters?: BillFilters): Promise<GetTransactionsResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...mockTransactions]

        if (filters?.type) {
          results = results.filter((t) => t.type === filters.type)
        }
        if (filters?.status) {
          results = results.filter((t) => t.status === filters.status)
        }
        if (filters?.provider) {
          results = results.filter((t) => t.provider.toLowerCase().includes(filters.provider!.toLowerCase()))
        }
        if (filters?.dateFrom) {
          results = results.filter((t) => new Date(t.createdAt) >= new Date(filters.dateFrom!))
        }
        if (filters?.dateTo) {
          results = results.filter((t) => new Date(t.createdAt) <= new Date(filters.dateTo!))
        }
        if (filters?.sort) {
          switch (filters.sort) {
            case 'newest':
              results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              break
            case 'oldest':
              results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              break
            case 'amount-high':
              results.sort((a, b) => b.amount - a.amount)
              break
            case 'amount-low':
              results.sort((a, b) => a.amount - b.amount)
              break
          }
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

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTransactions.find((t) => t.id === id))
      }, 100)
    })
  },

  getSummary(): TransactionSummary {
    return {
      totalTransactions: mockTransactions.length,
      successfulTransactions: mockTransactions.filter((t) => t.status === 'success').length,
      failedTransactions: mockTransactions.filter((t) => t.status === 'failed').length,
      totalSpent: mockTransactions.filter((t) => t.type !== 'wallet-funding').reduce((sum, t) => sum + t.amount, 0),
      totalEarned: 0,
      thisMonth: mockTransactions.filter((t) => {
        const d = new Date(t.createdAt)
        const now = new Date()
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).reduce((sum, t) => sum + t.amount, 0),
      lastMonth: mockTransactions.filter((t) => {
        const d = new Date(t.createdAt)
        const now = new Date()
        const lastMonth = now.getMonth() - 1
        return d.getMonth() === lastMonth && d.getFullYear() === now.getFullYear()
      }).reduce((sum, t) => sum + t.amount, 0),
    }
  },
}