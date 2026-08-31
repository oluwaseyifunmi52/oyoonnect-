export type NotificationCategory = 'account' | 'business' | 'job' | 'rental' | 'community' | 'system'

export interface Notification {
  id: string
  category: NotificationCategory
  title: string
  message: string
  read: boolean
  createdAt: string
  href?: string
}
