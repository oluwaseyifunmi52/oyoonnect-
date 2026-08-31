import type { SupportRequest, HelpCategoryType } from '../types/help'

export const helpRequests: SupportRequest[] = []

export function getHelpRequests(filters?: {
  category?: HelpCategoryType
  status?: SupportRequest['status']
  verificationStatus?: SupportRequest['verificationStatus']
  limit?: number
}): SupportRequest[] {
  let requests = [...helpRequests]

  if (filters?.category) {
    requests = requests.filter((r) => r.category === filters.category)
  }

  if (filters?.status) {
    requests = requests.filter((r) => r.status === filters.status)
  }

  if (filters?.verificationStatus) {
    requests = requests.filter((r) => r.verificationStatus === filters.verificationStatus)
  }

  requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (filters?.limit) {
    requests = requests.slice(0, filters.limit)
  }

  return requests
}

export function getHelpRequestById(id: string): SupportRequest | undefined {
  return helpRequests.find((r) => r.id === id)
}