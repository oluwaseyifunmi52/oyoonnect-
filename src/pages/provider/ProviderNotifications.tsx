import { useState, useEffect, useMemo } from 'react'
import { Bell, CheckCircle, AlertCircle, Menu, ExternalLink } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { notificationService } from '../../services/notificationService'
import type { Notification, NotificationCategory } from '../../types/notifications'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'

const FILTER_OPTIONS = [
  { value: 'all' as const, label: 'All' },
  { value: 'unread' as const, label: 'Unread' },
  { value: 'system' as const, label: 'System' },
  { value: 'rental' as const, label: 'Rental' },
  { value: 'job' as const, label: 'Job' },
] as const

type FilterValue = typeof FILTER_OPTIONS[number]['value']

function getFilterIcon(value: FilterValue) {
  if (value === 'rental') return Menu
  if (value === 'job') return CheckCircle
  return null
}

export function ProviderNotifications() {
  const { user, isAuthenticated, isServiceProvider } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<FilterValue>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !isServiceProvider) return

    const load = async () => {
      setLoading(true)
      try {
        const items = await notificationService.fetchFromApi()
        setNotifications(items)
      } catch (err) {
        console.error('Failed to load notifications:', err)
        setNotifications(notificationService.getNotifications())
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAuthenticated, isServiceProvider])

  const unreadNotifications = useMemo(() =>
    notifications.filter((n) => !n.read), [notifications]
  )

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return notifications
    if (filter === 'unread') return unreadNotifications
    const categoryFilter = filter as NotificationCategory
    return notifications.filter((n) => n.category === categoryFilter)
  }, [notifications, filter])

  const categoryLabel = (cat: NotificationCategory): string => {
    const map: Record<NotificationCategory, string> = {
      rental: 'Rental',
      job: 'Job',
      system: 'System',
      account: 'Account',
      business: 'Business',
      community: 'Community',
    }
    return map[cat] || cat
  }

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id)
    setNotifications(notificationService.getNotifications())
  }

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead()
    setNotifications(notificationService.getNotifications())
  }

  const handleDelete = (id: string) => {
    notificationService.markAsRead(id)
    setNotifications(notificationService.getNotifications())
  }

  if (!isAuthenticated || !isServiceProvider) {
    return null
  }

  if (loading) {
    return (
      <div className="dash-panel">
        <div className="skeleton skeleton--text" style={{ width: '100%', height: 20 }} />
      </div>
    )
  }

  const unreadCount = unreadNotifications.length

  return (
    <div className="dash-panel">
      <SectionHeading
        eyebrow="Notifications"
        title="Notifications"
        subtitle="Stay updated on bookings, payments, and system activity"
      />

      <div className="notifications-filter-bar">
        {FILTER_OPTIONS.map((option) => {
          const isActive = filter === option.value
          const Icon = getFilterIcon(option.value)
          return (
            <Button
              key={option.value}
              variant={isActive ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(option.value)}
            >
              {Icon && <Icon className="filter-icon" />}
              <span className="filter-label">{option.label}</span>
            </Button>
          )
        })}
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllAsRead}
          style={{ marginLeft: 'auto' }}
        >
          <CheckCircle size={16} aria-hidden="true" />
          Mark all as read
        </Button>
      </div>

      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={<Bell size={48} />}
          title="You're all caught up"
          description="No new notifications at this time."
        />
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map((notification) => {
            const isUnread = !notification.read
            const timeAgo = formatTimeAgo(notification.createdAt)

            return (
              <Card
                key={notification.id}
                className={`notification-card ${isUnread ? 'notification-card--unread' : ''}`}
              >
                <CardHeader className="notification-card__header">
                  <div className="notification-card__icon-wrapper">
                    <span
                      className={`notification-card__icon notification-card__icon--${notification.category}`}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="notification-card__unread-dot"
                    aria-hidden="true"
                  />
                  <div className="notification-card__actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Mark as read"
                    >
                      Mark read
                    </Button>
                    {notification.href && (
                      <a
                        href={notification.href}
                        target="_blank"
                        rel="noopener"
                        className="btn btn--ghost btn--sm"
                        aria-label="Open related page"
                      >
                        <ExternalLink size={16} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </CardHeader>

                <CardBody className="notification-card__body">
                  <h3 className="notification-card__title">{notification.title}</h3>
                  <p className="notification-card__description">{notification.message}</p>
                  <div className="notification-card__meta">
                    <span className="notification-card__time">{timeAgo}</span>
                    <span className="notification-card__category">
                      {categoryLabel(notification.category)}
                    </span>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
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

export default ProviderNotifications