import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { messageService, type Message, type Conversation } from '../services/messageService'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { MessageSquare, Send, Controller } from 'lucide-react'

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [sending, setSending] = useState(false)
  const [participantName, setParticipantName] = useState('')
  const [showGames, setShowGames] = useState(false)

  useEffect(() => {
    if (!conversationId || !isAuthenticated) {
      navigate('/messages')
      return
    }
    const conversations = messageService.getConversations()
    const conv = conversations.find((c) => c.id === conversationId)

    if (conv) {
      setConversation(conv)
      // Use conversation's participantName, or fall back to auth user's name
      const storedName = conv.participantName
      setParticipantName(storedName || (user?.name || 'Unknown'))

      // Mark conversation as read when opened
      messageService.markConversationRead(conversationId)

      // Load messages for this conversation
      const allMessages = messageService.getMessages()
      const convMessages = allMessages.filter((m) => m.conversationId === conversationId)
      setMessages(convMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))
    } else {
      // Create new conversation for this application
      const newConversation: Conversation = {
        id: conversationId,
        participantId: user!.id,
        participantName: user!.name || 'Unknown',
        participantAvatar: undefined,
        lastMessage: '',
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        context: 'JOB_APPLICATION',
        applicationId: conversationId,
      }
      messageService.saveConversation(newConversation)
      setConversation(newConversation)

      // Mark as read since we just created it
      messageService.markConversationRead(conversationId)
    }
  }, [conversationId, isAuthenticated, user, navigate])

  useEffect(() => {
    if (!conversation || !user) return

    // Update last message in conversation list when new message is sent
    const conversations = messageService.getConversations()
    const convIndex = conversations.findIndex((c) => c.id === conversation.id)
    if (convIndex >= 0) {
      conversations[convIndex].lastMessage = messages[messages.length - 1]?.content || ''
      conversations[convIndex].lastMessageAt = new Date().toISOString()
      if (conversations[convIndex].participantId !== user.id) {
        conversations[convIndex].unreadCount += 1
      }
      // Preserve the participant name when updating
      const updatedName = participantName || user?.name || conversations[convIndex].participantName
      conversations[convIndex].participantName = updatedName
      localStorage.setItem('conversations', JSON.stringify(conversations))
    }
  }, [conversation, messages, user, participantName])

  const sendMessage = async (content: string) => {
    if (!content.trim() || !user || !conversation) return

    setSending(true)
    try {
      const sentMessage = messageService.sendMessage(
        conversation.id,
        content.trim(),
        user.id,
        conversation.participantId,
        participantName || user?.name || conversation.participantName,
        conversation.context,
        conversation.applicationId,
        conversation.jobTitle,
        conversation.applicantName,
        conversation.employerName
      )

      setMessages((prev) => [...prev, sentMessage])

      // Scroll to bottom logic would go here
    } catch {
      // error handling
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="p-4">
      {!conversation ? (
        <EmptyState
          icon={<MessageSquare size={32} />}
          title="Loading conversation..."
          description="Please wait while we load the conversation."
        />
      ) : (
        <>
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-muted/10">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-muted/30">
          {participantName ? participantName.split(' ')[0][0] : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium">{participantName || 'Unknown'}</p>
        </div>
        <Badge
          variant="neutral"
          size="sm"
          className="text-xs"
        >
          {conversation.unreadCount > 0 ? `${conversation.unreadCount} new` : ''}
        </Badge>
      </div>

      <div className="mb-4 text-sm text-muted/60">
        {conversation.context === 'JOB_APPLICATION' && conversation.jobTitle && conversation.applicantName ? (
          <div>
            <strong>{conversation.jobTitle}</strong>{' '}
            - {conversation.applicantName}
          </div>
        ) : conversation.context === 'BUSINESS_ENQUIRY' && conversation.employerName ? (
          <div>
            <strong>{conversation.employerName}</strong>
          </div>
        ) : (
          <div />
        )}
      </div>

      <div className="max-h-[500px] overflow-y-auto space-y-2">
        {messages.map((msg) => {
          const isOwnMessage = msg.senderId === user?.id
          return (
            <div
              key={msg.id}
              className={`message ${isOwnMessage ? 'message--own' : 'message--other'}`}>
              <p className={`message-text ${isOwnMessage ? 'text-right' : ''}`}>{msg.content}</p>
              <p className="message-meta text-xs text-muted/60">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )
        })}

        {messages.length === 0 && (
          <EmptyState
            icon={<MessageSquare size={28} />}
            title="Start the conversation."
            description="Send the first message to get started."
          />
        )}
      </div>

{conversation && isAuthenticated && user && (
        <div className="mt-4 flex gap-2 items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const content = formData.get('message') as string
              if (content?.trim()) sendMessage(content.trim())
            }}
            className="flex-1"
          >
            <Input
              name="message"
              placeholder="Type a message..."
              className="flex-1"
              disabled={sending}
            />
          </form>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open games menu"
            onClick={() => setShowGames(true)}
          >
            <Controller size={20} />
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={sending}>
            <Send size={16} aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
    {showGames && (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm hidden">
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md m-4 p-6 shadow-xl">
            <h3 className="text-lg font-medium mb-4">Games</h3>
            <div className="space-y-3">
              <button
                className="w-full flex items-center gap-3 rounded-lg p-3 hover:bg-surface/50 transition-colors cursor-pointer"
                onClick={() => setGameCategory('quiz')}
              >
                <span className="text-indigo-600">Knowledge Quiz</span>
              </button>
              <button
                className="w-full flex items-center gap-3 rounded-lg p-3 hover:bg-surface/50 transition-colors cursor-pointer"
                onClick={() => setGameCategory('yoruba')}
              >
                <span className="text-indigo-600">Yorubaâ€“English Challenge</span>
              </button>
              <button
                className="w-full flex items-center gap-3 rounded-lg p-3 hover:bg-surface/50 transition-colors cursor-pointer"
                onClick={() => setGameCategory('word')}
              >
                <span className="text-indigo-600">Word & Brain Games</span>
              </button>
              <button
                className="w-full flex items-center gap-3 rounded-lg p-3 hover:bg-surface/50 transition-colors cursor-pointer"
                onClick={() => setGameCategory('civic')}
              >
                <span className="text-indigo-600">Civic & Oyo Community</span>
              </button>
              <button
                className="w-full flex items-center gap-3 rounded-lg p-3 hover:bg-surface/50 transition-colors cursor-pointer"
                onClick={() => setGameCategory('safety')}
              >
                <span className="text-indigo-600">Digital Safety</span>
              </button>
              <button
                className="w-full flex items-center gap-3 rounded-lg p-3 hover:bg-surface/50 transition-colors cursor-pointer"
                onClick={() => setGameCategory('career')}
              >
                <span className="text-indigo-600">Money & Career Skills</span>
              </button>
              <button
                className="w-full flex items-center gap-3 rounded-lg p-3 hover:bg-surface/50 transition-colors cursor-pointer"
                onClick={() => setGameCategory('coding')}
              >
                <span className="text-indigo-600">Coding Basics</span>
              </button>
              <button
                className="w-full flex items-center gap-3 rounded-lg p-3 hover:bg-surface/50 transition-colors cursor-pointer"
                onClick={() => setGameCategory('environment')}
              >
                <span className="text-indigo-600">Environmental & Road Safety</span>
              </button>
            </div>
            <button
              className="mt-4 w-full rounded-lg py-2 text-sm font-medium transition-colors"
              onClick={() => setShowGames(false)}
            >
              Close
            </button>
          </div>
        </div>
      )
    )}
  )
}
