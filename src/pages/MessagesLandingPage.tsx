import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, CheckCheck, Clock, MessageCircle, Search, Send, UserRound, UsersRound } from 'lucide-react'
import { messageService, type Conversation, type Message } from '../services/messageService'
import { useToast } from '../components/ui/Toast/Toast'
import './messages/MessagesWorkspace.css'

type InboxFilter = 'all' | 'unread' | 'personal' | 'business' | 'jobs'
type SocialSection = 'inbox' | 'people' | 'groups' | 'status' | 'requests'

function loadMessagesFor(conversationId: string): Message[] {
  try {
    const stored = localStorage.getItem('messages')
    const all: Message[] = stored ? JSON.parse(stored) : []
    return all.filter((message) => message.conversationId === conversationId)
  } catch {
    return []
  }
}

function personInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U'
}

export default function MessagesLandingPage() {
  const { conversationId } = useParams<{ conversationId?: string }>()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [loadError, setLoadError] = useState('')
  const [filter, setFilter] = useState<InboxFilter>('all')
  const [section, setSection] = useState<SocialSection>('inbox')

  const reload = useCallback(() => {
    try {
      setConversations(messageService.getConversations())
      if (conversationId) setMessages(loadMessagesFor(conversationId))
      setLoadError('')
    } catch {
      setConversations([])
      setMessages([])
      setLoadError('Your conversations could not be loaded.')
    }
  }, [conversationId])

  useEffect(() => { reload() }, [reload])

  const activeConversation = conversationId
    ? conversations.find((conversation) => conversation.id === conversationId) ?? null
    : null
  const filteredConversations = useMemo(() => conversations.filter((conversation) => {
    const matchesSearch = `${conversation.participantName} ${conversation.lastMessage}`.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all'
      || (filter === 'unread' && conversation.unreadCount > 0)
      || (filter === 'personal' && !conversation.context)
      || (filter === 'business' && conversation.context === 'BUSINESS_ENQUIRY')
      || (filter === 'jobs' && conversation.context === 'JOB_APPLICATION')
    return matchesSearch && matchesFilter
  }), [conversations, filter, search])

  useEffect(() => {
    if (!activeConversation?.unreadCount || !conversationId) return
    messageService.markConversationRead(conversationId)
    setConversations((current) => current.map((conversation) => conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation))
    showToast({ title: 'Conversation marked read', message: 'You have read the conversation.', type: 'success' })
  }, [activeConversation?.unreadCount, conversationId, showToast])

  const submitMessage = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.trim() || !conversationId || !activeConversation) return
    try {
      const sent = messageService.sendMessage(
        conversationId,
        draft.trim(),
        activeConversation.participantId,
        activeConversation.participantId,
        activeConversation.participantName,
        activeConversation.context,
        activeConversation.applicationId,
        activeConversation.jobTitle,
        activeConversation.applicantName,
        activeConversation.employerName,
      )
      messageService.markConversationRead(conversationId)
      setMessages((current) => [...current, sent])
      setDraft('')
      setConversations((current) => current.map((conversation) => conversation.id === conversationId ? { ...conversation, lastMessage: sent.content, lastMessageAt: sent.createdAt, unreadCount: 0 } : conversation))
    } catch {
      setLoadError('Your message could not be sent. Please try again.')
      showToast({ title: 'Error sending message', message: 'Failed to send message. Please try again.', type: 'error' })
    }
  }

  const displayConversation = activeConversation ?? (conversationId ? null : conversations[0] ?? null)
  const displayMessages = activeConversation && activeConversation.id === displayConversation?.id
    ? messages
    : displayConversation ? loadMessagesFor(displayConversation.id) : []

  return (
    <div className={`messages-workspace${conversationId ? ' has-open-chat' : ''}`}>
      <div className="messages-workspace__heading"><div><span>YOUR INBOX</span><h1>Messages</h1><p>Stay in touch with businesses and support teams.</p></div><div className="messages-unread-summary"><MessageCircle size={17} /><strong>{conversations.reduce((total, conversation) => total + conversation.unreadCount, 0)}</strong><span>unread</span></div></div>
      <div className="messages-demo-notice" role="note"><strong>Local demo inbox</strong><span>Messages on this screen are saved in this browser. They are not delivered to another OyoConnect user.</span></div>
      <nav className="messages-social-nav" aria-label="Messaging and social sections">{([
        ['inbox', 'Inbox'], ['people', 'People'], ['groups', 'Groups'], ['status', 'Status'], ['requests', 'Requests'],
      ] as const).map(([value, label]) => <button key={value} type="button" aria-current={section === value ? 'page' : undefined} className={section === value ? 'is-active' : ''} onClick={() => setSection(value)}>{label}</button>)}</nav>
      {section === 'inbox' ? <div className="messages-workspace__card">
        <aside className="messages-list-pane" aria-label="Conversations">
          <div className="messages-list-heading"><h2>Conversations</h2><span>{conversations.length}</span></div>
          <label className="messages-list-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages" aria-label="Search messages" /></label>
          <div className="messages-filter-row" role="group" aria-label="Filter conversations">{([
            ['all', 'All'], ['unread', 'Unread'], ['personal', 'Personal'], ['business', 'Business'], ['jobs', 'Jobs'],
          ] as const).map(([value, label]) => <button key={value} type="button" className={filter === value ? 'is-active' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
          {loadError && !conversations.length ? <div className="messages-empty"><MessageCircle size={22} /><p>{loadError}</p><button onClick={reload}>Try again</button></div> : filteredConversations.length ? <div className="messages-conversation-list">{filteredConversations.map((conversation) => <button key={conversation.id} className={`messages-conversation${conversationId === conversation.id ? ' is-selected' : ''}`} onClick={() => navigate(`/messages/${conversation.id}`)}>
            <span className="messages-avatar">{conversation.participantAvatar ? <img src={conversation.participantAvatar} alt="" /> : personInitials(conversation.participantName)}</span><span className="messages-conversation__copy"><strong>{conversation.participantName || 'Unknown'}</strong><small>{conversation.lastMessage || 'Start the conversation.'}</small></span><span className="messages-conversation__meta"><time>{conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }) : ''}</time>{conversation.unreadCount > 0 && <em>{conversation.unreadCount}</em>}</span>
          </button>)}</div> : <div className="messages-empty"><MessageCircle size={22} /><strong>{search ? 'No matching conversations' : 'No conversations yet'}</strong><p>{search ? 'Try another name or keyword.' : 'When you contact a business or receive a message, it will show up here.'}</p>{search && <button onClick={() => setSearch('')}>Clear search</button>}</div>}
          <Link to="/businesses" className="messages-start-link"><ArrowUpRight size={15} /> Find a business to contact</Link>
        </aside>

        <section className="messages-chat-pane" aria-label="Open conversation">
          {displayConversation ? <>
            <header className="messages-chat-header"><button className="messages-back" onClick={() => navigate('/messages')} aria-label="Back to conversations"><ArrowLeft size={18} /></button><span className="messages-avatar">{displayConversation.participantAvatar ? <img src={displayConversation.participantAvatar} alt="" /> : personInitials(displayConversation.participantName)}</span><div><strong>{displayConversation.participantName || 'Conversation'}</strong><small>{displayConversation.context === 'BUSINESS_ENQUIRY' ? 'Business conversation' : displayConversation.context === 'JOB_APPLICATION' ? 'Job application' : 'OyoConnect conversation'}</small></div></header>
            <div className="messages-chat-context">{displayConversation.jobTitle && <span>{displayConversation.jobTitle}</span>}{displayConversation.employerName && <span>{displayConversation.employerName}</span>}{!displayConversation.jobTitle && !displayConversation.employerName && <span>Local demo conversation · not delivered</span>}</div>
            <div className="messages-chat-history" aria-live="polite">{displayMessages.length ? displayMessages.map((message) => { const sent = message.senderId === displayConversation.participantId; return <div key={message.id} className={`messages-bubble-row${sent ? ' is-sent' : ''}`}><span className={`messages-bubble${sent ? ' is-sent' : ''}`}>{message.content}<time>{new Date(message.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}{sent && <CheckCheck size={12} />}</time></span></div> }) : <div className="messages-chat-empty"><span><MessageCircle size={19} /></span><strong>No messages yet</strong><p>Start the conversation with a message below.</p></div>}</div>
            <form className="messages-send-form" onSubmit={submitMessage}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message…" aria-label="Write a message" /><button type="submit" disabled={!draft.trim()}><span>Send</span><Send size={15} /></button></form>
            {loadError && <p className="messages-inline-error">{loadError}</p>}
          </> : conversationId ? <div className="messages-empty messages-empty--chat"><UserRound size={26} /><strong>Conversation not found</strong><p>This conversation may have been removed.</p><button onClick={() => navigate('/messages')}>Back to messages</button></div> : <div className="messages-empty messages-empty--chat"><span><MessageCircle size={24} /></span><strong>{conversations.length ? 'Select a conversation' : 'Your conversations will appear here'}</strong><p>{conversations.length ? 'Choose a conversation on the left to see its messages.' : 'Contact a business or reply to a message to start a conversation.'}</p></div>}
        </section>
      </div> : <section className="messages-social-panel" aria-live="polite">
        <div className="messages-social-panel__icon">{section === 'people' ? <UserRound size={22} /> : section === 'groups' ? <UsersRound size={22} /> : section === 'status' ? <Clock size={22} /> : <MessageCircle size={22} />}</div>
        <p className="messages-social-panel__eyebrow">{section === 'people' ? 'PEOPLE DISCOVERY' : section === 'groups' ? 'GROUPS & COMMUNITIES' : section === 'status' ? 'STATUS UPDATES' : 'MESSAGE REQUESTS'}</p>
        <h2>{section === 'people' ? 'Find people to connect with' : section === 'groups' ? 'Groups for your community' : section === 'status' ? 'Share a status update' : 'Requests from new contacts'}</h2>
        <p>{section === 'people' ? 'Profile search, connection requests and mutual connections need a live people service. No sample users are shown here.' : section === 'groups' ? 'Group discovery, membership, invitations and moderation need a group service. No groups or members are fabricated.' : section === 'status' ? 'Status publishing, viewing, replies and expiry need a status service. Upload and sharing controls stay unavailable until it is connected.' : 'There is no message-request feed connected yet. Incoming requests will appear here when the account service provides them.'}</p>
        <div className="messages-social-panel__availability"><span className="messages-social-panel__dot" />{section === 'status' ? 'Status service unavailable' : section === 'groups' ? 'Group service unavailable' : section === 'people' ? 'People search unavailable' : 'Request feed unavailable'}</div>
        <div className="messages-social-panel__actions">{section === 'people' ? <Link to="/community" className="messages-social-panel__link">Explore community <ArrowUpRight size={15} /></Link> : section === 'groups' ? <Link to="/community" className="messages-social-panel__link">Visit community <ArrowUpRight size={15} /></Link> : section === 'requests' ? <Link to="/notifications" className="messages-social-panel__link">Open notifications <ArrowUpRight size={15} /></Link> : null}<button type="button" disabled title="Unavailable until the messaging service supports this action">{section === 'people' ? 'Search people' : section === 'groups' ? 'Create a group' : section === 'status' ? 'Add status' : 'Manage requests'}</button></div>
      </section>}
    </div>
  )
}
