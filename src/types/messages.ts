export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  messageType: 'text' | 'system'
  status: 'sent' | 'delivered' | 'read'
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar?: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  createdAt: string
  updatedAt: string
  context?: 'JOB_APPLICATION' | 'BUSINESS_ENQUIRY'
  applicationId?: string
  jobTitle?: string
  applicantName?: string
  employerName?: string
}

export interface ConversationPreview {
  conversation: Conversation
  lastMessagePreview: string
}