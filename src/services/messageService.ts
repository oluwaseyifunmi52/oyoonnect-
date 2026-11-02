/**
 * DEVELOPMENT-ONLY message service.
 *
 * Uses localStorage for local dev state. In production this will be
 * replaced by API calls through apiClient.
 */
import type { Message, Conversation, ConversationPreview } from '../types/messages'

export type { Message, Conversation }

const STORAGE_KEY = 'messages'

function loadFromStorage(): Message[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveToStorage(messages: Message[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // ignore storage errors
  }
}

const demoMessages: Message[] = []

export const messageService = {
  getMessages(): Message[] {
    const stored = loadFromStorage()
    if (stored.length > 0) return stored
    return demoMessages
  },

  getConversations(): Conversation[] {
    const stored = localStorage.getItem('conversations')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return []
      }
    }
    return []
  },

  saveConversation(conversation: Conversation): void {
    const conversations = this.getConversations()
    // Update or add conversation
    const index = conversations.findIndex((c) => c.id === conversation.id)
    if (index >= 0) {
      conversations[index] = conversation
    } else {
      conversations.push(conversation)
    }
    // Sort by lastMessageAt descending
    conversations.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
    localStorage.setItem('conversations', JSON.stringify(conversations))
  },

  getConversation(conversationId: string): Conversation | undefined {
    return this.getConversations().find((c) => c.id === conversationId)
  },

  sendMessage(
    conversationId: string,
    content: string,
    senderId: string,
    receiverId: string,
    participantName?: string,
    context?: 'JOB_APPLICATION' | 'BUSINESS_ENQUIRY',
    applicationId?: string,
    jobTitle?: string,
    applicantName?: string,
    employerName?: string
  ): Message {
    const messages = loadFromStorage ? loadFromStorage() : []
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      receiverId,
      content,
      messageType: 'text',
      status: 'sent',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    messages.push(newMessage)

    // Update conversation's last message
    const conversations = this.getConversations()
    const convIndex = conversations.findIndex((c) => c.id === conversationId)
    if (convIndex >= 0) {
      conversations[convIndex].lastMessage = content
      conversations[convIndex].lastMessageAt = new Date().toISOString()
      // Use provided participantName, fall back to receiverId, then use senderId as last resort
      conversations[convIndex].participantName =
        participantName || receiverId || senderId
      // Store context info
      conversations[convIndex].context = context
      conversations[convIndex].applicationId = applicationId
      conversations[convIndex].jobTitle = jobTitle
      conversations[convIndex].applicantName = applicantName
      conversations[convIndex].employerName = employerName
      // Increment unread count for receiver if not sender
      if (conversations[convIndex].participantId !== senderId) {
        conversations[convIndex].unreadCount += 1
      }
    } else {
      const newConversation: Conversation = {
        id: conversationId,
        participantId: receiverId,
        participantName: participantName || receiverId || senderId,
        participantAvatar: undefined,
        lastMessage: content,
        lastMessageAt: new Date().toISOString(),
        unreadCount: senderId !== receiverId ? 1 : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Store context info
        context: context,
        applicationId: applicationId,
        jobTitle: jobTitle,
        applicantName: applicantName,
        employerName: employerName,
      }
      conversations.push(newConversation)
    }

    saveToStorage(messages)
    localStorage.setItem('conversations', JSON.stringify(conversations))

    return newMessage
  },

  markMessageRead(messageId: string): void {
    const messages = loadFromStorage ? loadFromStorage() : []
    const updated = messages.map((m) =>
      m.id === messageId ? { ...m, status: 'read' as const } : m,
    ) as Message[]
    saveToStorage(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  },

  markConversationRead(conversationId: string): void {
    const conversations = this.getConversations()
    const convIndex = conversations.findIndex((c) => c.id === conversationId)
    if (convIndex >= 0) {
      conversations[convIndex].unreadCount = 0
      localStorage.setItem('conversations', JSON.stringify(conversations))
    }
  },
}