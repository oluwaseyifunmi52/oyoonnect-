import type {
  SupportRequest,
  BankVerificationRequest,
  BankVerificationResponse,
  RequestHelpFormData,
  HelpCategoryType,
  BankAccount,
} from '../types/help'
import { HELP_CATEGORIES } from '../types/help'
import { helpRequests } from '../data/helpRequests'

export const helpService = {
  async verifyBankAccount(bankRequest: BankVerificationRequest): Promise<BankVerificationResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { accountNumber, bankCode } = bankRequest

        if (!accountNumber || accountNumber.length !== 10) {
          resolve({
            success: false,
            error: 'Please enter a valid 10-digit account number',
          })
          return
        }

        if (!bankCode) {
          resolve({
            success: false,
            error: 'Please select a bank',
          })
          return
        }

        resolve({
          success: true,
          accountName: bankRequest.accountName,
          bankName: bankRequest.bankCode,
          reference: `verify_${Date.now()}`,
        })
      }, 300)
    })
  },

  async createRequest(requestData: Partial<SupportRequest>): Promise<SupportRequest> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRequest: SupportRequest = {
          id: `req-${Date.now()}`,
          requesterId: requestData.requesterId || '',
          requesterName: requestData.requesterName || 'Community Member',
          requesterAvatar: requestData.requesterAvatar,
          requesterLocation: requestData.requesterLocation || '',
          category: requestData.category || 'other-emergency',
          title: requestData.title || '',
          description: requestData.description || '',
          fullStory: requestData.fullStory || requestData.description || '',
          targetAmount: requestData.targetAmount || 0,
          amountRaised: requestData.amountRaised || 0,
          currency: 'NGN',
          deadline: requestData.deadline || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'pending_review',
          verificationStatus: 'unverified',
          bankVerificationStatus: 'unverified',
          bankAccountId: requestData.bankAccountId,
          bankAccount: requestData.bankAccount,
          verificationDocuments: requestData.verificationDocuments,
          supportersCount: requestData.supportersCount || 0,
        }
        helpRequests.push(newRequest)
        resolve(newRequest)
      }, 200)
    })
  },

  async submitForReview(id: string): Promise<SupportRequest | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const request = helpRequests.find((r) => r.id === id)
        if (request) {
          request.status = 'pending_review'
          request.updatedAt = new Date().toISOString()
          resolve(request)
        } else {
          resolve(null)
        }
      }, 200)
    })
  },

  async getRequestById(id: string): Promise<SupportRequest | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(helpRequests.find((r) => r.id === id))
      }, 100)
    })
  },

  async search(filters?: {
    category?: HelpCategoryType
    location?: string
    status?: SupportRequest['status']
    verificationStatus?: SupportRequest['verificationStatus']
    sort?: 'recent' | 'almost-funded' | 'verified' | 'deadline'
    limit?: number
  }): Promise<SupportRequest[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...helpRequests]

        if (filters?.category) {
          results = results.filter((r) => r.category === filters.category)
        }
        if (filters?.location) {
          results = results.filter((r) =>
            r.requesterLocation.toLowerCase().includes(filters.location!.toLowerCase()),
          )
        }
        if (filters?.status) {
          results = results.filter((r) => r.status === filters.status)
        }
        if (filters?.verificationStatus) {
          results = results.filter((r) => r.verificationStatus === filters.verificationStatus)
        }

        switch (filters?.sort) {
          case 'recent':
            results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            break
          case 'almost-funded':
            results.sort((a, b) => {
              const aProgress = a.targetAmount > 0 ? a.amountRaised / a.targetAmount : 0
              const bProgress = b.targetAmount > 0 ? b.amountRaised / b.targetAmount : 0
              return bProgress - aProgress
            })
            break
          case 'verified':
            results.sort((a, b) => {
              if (a.verificationStatus === 'verified' && b.verificationStatus !== 'verified') return -1
              if (a.verificationStatus !== 'verified' && b.verificationStatus === 'verified') return 1
              return 0
            })
            break
          case 'deadline':
            results.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
            break
        }

        if (filters?.limit) {
          results = results.slice(0, filters.limit)
        }

        resolve(results)
      }, 100)
    })
  },

  async getRecent(limit: number = 10): Promise<SupportRequest[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sorted = [...helpRequests].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        resolve(sorted.slice(0, limit))
      }, 100)
    })
  },

  getCategories() {
    return HELP_CATEGORIES
  },
}
