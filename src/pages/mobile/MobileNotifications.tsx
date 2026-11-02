import { useState, useEffect } from 'react'
import { Bell, CheckCircle, Menu, Home, MessageSquare } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { notificationService } from '../../services/notificationService'
import type { Notification } from '../../types/notifications'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'

export function MobileNotifications() {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return

    const load = async () => {
      setLoading(true)
      try {
        const items = await notificationService.fetchFromApi()
        setNotifications(items)
        const uc = items.filter((n) => !n.read).length
        setUnreadCount(uc)
      } catch (err) {
        console.error('Failed to load notifications:', err)
        setNotifications(notificationService.getNotifications())
        setUnreadCount(notificationService.getNotifications().filter((n) => !n.read).length)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAuthenticated])

  const filtered = notifications.filter((n) =>
    filter === 'unread' ? !n.read : true
  )

  const unreadVisible = filter === 'unread' ? filtered.length : 0

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="mobile-notifications skeleton">
        <div className="skeleton skeleton--text" style={{ width: '100%', height: 20 }} />
      </div>
    )
  }

  return (
    <div className="mobile-notifications">
      {/* === MOBILE HEADER === */}
      <header className="mobile-header">
        <div className="mobile-header__left">
          <button
            className="mobile-header__hamburger"
            onClick={() => window.dispatchEvent(new Event('mobile-menu-toggle'))}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="mobile-header__center">
          <img
            src="/logo-oyo-connect.svg"
            alt="OyoConnect"
            className="mobile-header__logo"
          />
        </div>

        <div className="mobile-header__right">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => window.dispatchEvent(new Event('navigate-to-notifications'))}
          >
            <Bell size={24} />
            <span className="mobile-header__notification-badge">
              {unreadCount > 0 ? unreadCount : ''}
            </span>
          </Button>
        </div>
      </header>

      {/* === PAGE CONTENT === */}
      <main className="mobile-content">
        <div className="mobile-content__inner"
          style={{ padding: '0 var(--space-4)' }}>

          {/* Small green eyebrow/status */}
          <p className="mobile-content__eyebrow"
            style={{ color: 'var(--success)', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-medium)', marginBottom: 'var(--space-1)' }}>
            Active
          </p>

          {/* Large page title */}
          <h1 className="mobile-content__title"
            style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--fw-bold)', color: 'var(--ink)', marginBottom: 'var(--space-2)' }}>
            Notifications
          </h1>

          {/* Supporting description */}
          <p className="mobile-content__description"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--subtle)', lineHeight: 'var(--lh-normal)', marginBottom: 'var(--space-4)' }}>
            Important updates about your requests, bookings, and account.
          </p>

          {/* === PRIMARY ACTION === */}
          <div className="mobile-content__primary-action"
            style={{ marginBottom: 'var(--space-4)' }}>
            <Button
              variant="outline"
              size="lg"
              style={{
                padding: 'var(--space-4) var(--space-6)',
                textAlign: 'center',
                margin: '0 auto',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                borderColor: 'var(--success)',
                color: 'var(--success)',
              }}
            >
              <CheckCircle size={20} />
              <span>Mark all as read</span>
            </Button>
          </div>

          {/* === CONTENT CARD === */}
          <Card padding="md" style={{ marginBottom: 'var(--space-4)' }}>

            <CardHeader className="mobile-notifications__card-header">
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <Button
                  variant={filter === 'all' ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--fw-medium)',
                    borderRadius: 'var(--radius-md)',
                    minWidth: '60px',
                  }}
                >
                  All
                  <Badge
                    style={{
                      marginLeft: 'var(--space-1)',
                      fontSize: 'var(--text-xs)',
                      background: filter === 'all' ? 'var(--success)' : 'transparent',
                      color: filter === 'all' ? 'white' : 'var(--ink)',
                      width: '20px',
                      height: '20px',
                      borderRadius: 'var(--radius-full)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {unreadVisible > 0 ? unreadVisible : ''}
                  </Badge>
                </Button>

                <Button
                  variant={filter === 'unread' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--fw-medium)',
                    borderRadius: 'var(--radius-md)',
                    minWidth: '70px',
                    color: filter === 'unread' ? 'var(--success)' : 'var(--ink)',
                  }}
                >
                  Unread
                  <Badge
                    style={{
                      marginLeft: 'var(--space-1)',
                      fontSize: 'var(--text-xs)',
                      background: filter === 'unread' ? 'var(--success)' : 'transparent',
                      color: filter === 'unread' ? 'white' : 'var(--subtle)',
                      width: '24px',
                      height: '24px',
                      borderRadius: 'var(--radius-full)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {unreadVisible}
                  </Badge>
                </Button>
              </div>
            </CardHeader>

            <CardBody className="mobile-notifications__card-body">
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <span style={{
                  fontSize: 'var(--text-xs)',
                  textTransform: 'uppercase',
                  color: 'var(--subtle)',
                  fontWeight: 'var(--fw-semibold)',
                }}>
                  TODAY
                </span>
              </div>

              {/* Notification Items */}
              {filtered.length === 0 ? (
                <EmptyState
                  icon={<Bell size={32} />}
                  title="You're all caught up"
                  description="No new notifications at this time."
                />
              ) : (
                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                  {filtered.map((notification, index) => {
                    const isUnread = !notification.read
                    const timeAgo = formatTimeAgo(notification.createdAt)

                    return (
                      <div
                        key={notification.id}
                        style={{
                          padding: 'var(--space-3) var(--space-4)',
                          borderBottom: '1px solid var(--line)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 'var(--space-3)',
                        }}
                      >
                        {/* Slim green indicator for unread */}
                        <div
                          style={{
                            width: '3px',
                            height: '20px',
                            borderRadius: 0,
                            background: isUnread ? 'var(--success)' : 'transparent',
                            marginTop: '2px',
                          }}
                        />

                        {/* Icon */}
                        <Bell size={18}
                          style={{ color: isUnread ? 'var(--success)' : 'var(--subtle)' }} />

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--fw-semibold)',
                            color: isUnread ? 'var(--ink)' : 'var(--subtle)',
                            marginBottom: 'var(--space-1)',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                          }}>
                            {notification.title}
                          </p>
                          <p style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--subtle)',
                            lineHeight: '1.5',
                          }}>
                            {notification.message}
                          </p>
                        </div>

                        {/* Time ago */}
                        <span style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--subtle)',
                          marginLeft: 'auto',
                        }}>
                          {timeAgo}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardBody>
          </Card>

        </div>
      </main>

      {/* === MOBILE BOTTOM NAVIGATION === */}
      <nav className="mobile-bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--z-dropdown)',
          background: 'white',
          borderTop: '1px solid var(--line)',
          padding: 'var(--space-3) 0',
        }}
      >
        <div className="mobile-bottom-nav__inner"
          style={{ maxWidth: 'calc(100% - var(--space-8))', margin: '0 auto', display: 'flex', justifyContent: 'space-around' }}>
          <button
            className="mobile-bottom-nav__item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'var(--subtle)',
              textDecoration: 'none',
              fontSize: 'var(--text-xs)',
              padding: 'var(--space-1) 0',
            }}
            onClick={() => window.dispatchEvent(new Event('navigate-to-home'))}
          >
            <Home size={24} />
            <span>Home</span>
          </button>

          <button
            className="mobile-bottom-nav__item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'var(--subtle)',
              textDecoration: 'none',
              fontSize: 'var(--text-xs)',
              padding: 'var(--space-1) 0',
            }}
            onClick={() => window.dispatchEvent(new Event('navigate-to-requests'))}
          >
            <MessageSquare size={24} />
            <span>Messages</span>
          </button>

          <button
            className="mobile-bottom-nav__item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'var(--subtle)',
              textDecoration: 'none',
              fontSize: 'var(--text-xs)',
              padding: 'var(--space-1) 0',
            }}
            onClick={() => window.dispatchEvent(new Event('navigate-to-notifications'))}
          >
            <Bell size={24} />
            <span>Notifications</span>
          </button>

          <button
            className="mobile-bottom-nav__item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'var(--subtle)',
              textDecoration: 'none',
              fontSize: 'var(--text-xs)',
              padding: 'var(--space-1) 0',
            }}
            onClick={() => window.dispatchEvent(new Event('navigate-to-messages'))}
          >
            <MessageSquare size={24} />
            <span>Messages</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

function formatTimeAgo(createdAt: string): string {
  const date = new Date(createdAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMs < 0) return 'Just now'
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })
}

export default MobileNotifications