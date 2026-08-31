import { useState, useEffect } from 'react'
import { Bell, CheckCheck, Inbox, ExternalLink } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { EmptyState } from '../components/ui/EmptyState'
import { useAuth } from '../context/AuthContext'
import { notificationService } from '../services/notificationService'
import type { Notification } from '../types/notifications'

const CATEGORY_LABELS: Record<string, string> = {
  account: 'Account',
  business: 'Businesses',
  job: 'Jobs',
  rental: 'Rentals',
  community: 'Community',
  system: 'System',
}

export function Notifications() {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    let mounted = true
    notificationService.fetchFromApi().then((items) => {
      if (mounted) setNotifications(items)
    }).catch(() => {
      if (mounted) setNotifications(notificationService.getNotifications())
    })
    return () => {
      mounted = false
    }
  }, [])

  if (!isAuthenticated) {
    return (
      <main className="page auth-page">
        <div className="container container--narrow">
          <div className="auth-card">
            <h1>Please sign in</h1>
            <p>You need to be logged in to view your notifications.</p>
          </div>
        </div>
      </main>
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id)
    setNotifications(notificationService.getNotifications())
  }

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead()
    setNotifications(notificationService.getNotifications())
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })
  }

  return (
    <main className="page">
      <div className="container container--narrow">
        <header className="settings-page-header">
          <h1>Notifications</h1>
          <p>Important updates about your account and OyoConnect activity will appear here.</p>
        </header>

        {notifications.length > 0 && (
          <div className="notifications-actions">
            {unreadCount > 0 && (
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck size={16} aria-hidden="true" />
                Mark all as read
              </button>
            )}
          </div>
        )}

        {notifications.length === 0 ? (
          <EmptyState
            icon={<Inbox size={36} />}
            title="No notifications yet"
            description="Important updates from OyoConnect will appear here."
          />
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.read ? '' : 'notification-item--unread'}`}
              >
                <div className={`notification-icon notification-icon--${notification.category}`}>
                  <Bell size={18} aria-hidden="true" />
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <span className="notification-category">{CATEGORY_LABELS[notification.category] || notification.category}</span>
                    <span className="notification-time">{formatTime(notification.createdAt)}</span>
                  </div>
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">{notification.message}</p>
                </div>
                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      aria-label={`Mark "${notification.title}" as read`}
                    >
                      Mark read
                    </button>
                  )}
                  {notification.href && (
                    <a href={notification.href} className="btn btn--ghost btn--sm" aria-label="Open related page">
                      <ExternalLink size={16} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Notifications