export type NotificationCategory = 'account' | 'business' | 'job' | 'rental' | 'community' | 'system'

export type InterviewType = 'VIDEO' | 'PHONE' | 'IN_PERSON'

export interface Interview {
  id: string
  jobId: string
  applicationId: string
  candidateId: string
  employerId: string
  type: InterviewType
  title: string
  scheduledStart: string
  scheduledEnd: string
  timezone: string
  meetingUrl?: string
  location?: string
  notes?: string
  status: 'SCHEDULED' | 'ACCEPTED' | 'DECLINED' | 'RESCHEDULE_REQUESTED' | 'CANCELLED' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  category: NotificationCategory
  title: string
  message: string
  read: boolean
  createdAt: string
  href?: string
}
