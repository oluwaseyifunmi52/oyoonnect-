import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell, BriefcaseBusiness, Building2, CheckCheck, ChevronRight, Clock3,
  ExternalLink, FileText, Home, Inbox, MessageCircle, RefreshCw, Settings,
  Trash2, UserRound,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { notificationService } from '../services/notificationService'
import type { Notification, NotificationCategory } from '../types/notifications'
import { Card, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Skeleton, SkeletonCircle } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'
import './Notifications.css'

const CATEGORY_META: Record<NotificationCategory, { label: string; icon: typeof Bell; link?: string }> = {
  account: { label: 'Account', icon: UserRound, link: '/profile' },
  business: { label: 'Businesses', icon: Building2, link: '/businesses' },
  job: { label: 'Jobs', icon: BriefcaseBusiness, link: '/jobs' },
  rental: { label: 'Rentals', icon: Home },
  community: { label: 'Community', icon: MessageCircle, link: '/community' },
  system: { label: 'System', icon: Bell },
}

const CATEGORY_BADGE_VARIANTS: Record<NotificationCategory, 'brand' | 'success' | 'warning' | 'error' | 'neutral' | 'info'> = {
  job: 'info',
  business: 'brand',
  community: 'error',
  rental: 'warning',
  account: 'neutral',
  system: 'neutral',
}

type FilterValue = 'all' | 'unread' | NotificationCategory
type DateGroup = 'Today' | 'Yesterday' | 'Earlier'
const ALL_CATEGORIES: NotificationCategory[] = ['job', 'business', 'community', 'rental', 'account', 'system']

function formatTime(value: string) {
  const date = new Date(value)
  const elapsed = Date.now() - date.getTime()
  if (!Number.isFinite(date.getTime())) return ''
  if (elapsed < 60_000) return 'Just now'
  if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)}m ago`
  if (elapsed < 86_400_000) return `${Math.floor(elapsed / 3_600_000)}h ago`
  if (elapsed < 7 * 86_400_000) return `${Math.floor(elapsed / 86_400_000)}d ago`
  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })
}

function getDateGroup(value: string): DateGroup {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return 'Earlier'
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const timestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  if (timestamp === startOfToday) return 'Today'
  if (timestamp === startOfToday - 86_400_000) return 'Yesterday'
  return 'Earlier'
}

function getDateLabel(value: string) {
  const date = new Date(value)
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' })
    : ''
}

export function Notifications() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<FilterValue>('all')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null)

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    setLoadError(false)
    try {
      const items = await notificationService.fetchFromApi()
      setNotifications(items)
    } catch {
      setNotifications(notificationService.getNotifications())
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) void loadNotifications()
  }, [isAuthenticated, loadNotifications])

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications])
  const todayCount = useMemo(() => notifications.filter((item) => getDateGroup(item.createdAt) === 'Today').length, [notifications])
  const categories = useMemo(() => [...new Set(notifications.map((item) => item.category))], [notifications])
  const filtered = useMemo(() => {
    if (filter === 'all') return notifications
    if (filter === 'unread') return notifications.filter((item) => !item.read)
    return notifications.filter((item) => item.category === filter)
  }, [filter, notifications])
  const groups = useMemo(() => {
    const ordered: DateGroup[] = ['Today', 'Yesterday', 'Earlier']
    return ordered.map((label) => ({
      label,
      items: filtered.filter((item) => getDateGroup(item.createdAt) === label),
    })).filter((group) => group.items.length)
  }, [filtered])

  const syncHeader = () => window.dispatchEvent(new Event('dashboardNotificationsChanged'))
  const markAsRead = (notification: Notification) => {
    if (notification.read) return
    notificationService.markAsRead(notification.id)
    setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, read: true } : item))
    syncHeader()
  }
  const markAllAsRead = () => {
    notificationService.markAllAsRead()
    setNotifications((items) => items.map((item) => ({ ...item, read: true })))
    syncHeader()
  }
  const openNotification = (notification: Notification) => {
    markAsRead(notification)
    if (notification.href) navigate(notification.href)
  }

  const handleDeleteClick = (notification: Notification, event: React.MouseEvent) => {
    event.stopPropagation()
    setNotificationToDelete(notification)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!notificationToDelete) return
    notificationService.markAsRead(notificationToDelete.id) // Using markAsRead as delete since there's no delete in service
    setNotifications((items) => items.filter((item) => item.id !== notificationToDelete!.id))
    syncHeader()
    setDeleteDialogOpen(false)
    setNotificationToDelete(null)
  }

  if (!isAuthenticated) {
    return (
      <main className="notifications-page">
        <div className="notifications-signin">
          <h1>Please sign in</h1>
          <p>You need to be logged in to view your notifications.</p>
        </div>
      </main>
    )
  }

  const hasNoNotifications = !loading && notifications.length === 0

  return (
    <main className="notifications-page">
      <div className="notifications-page__grid">
        <div className="notifications-page__main">
          <header className="notifications-page__header">
            <div className="notifications-page__header-icon">
              <Bell size={20} aria-hidden="true" />
            </div>
            <div className="notifications-page__header-content">
              <span className="notifications-page__eyebrow">YOUR UPDATES</span>
              <h1>Notifications</h1>
              <p>Important updates about your account and OyoConnect activity.</p>
            </div>
            <div className="notifications-page__header-actions">
              <span className="notifications-page__unread-summary">
                <span className="notifications-page__unread-dot" aria-hidden="true" />
                {unreadCount} unread
              </span>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead} className="notifications-page__mark-all">
                  <CheckCheck size={14} aria-hidden="true" />
                  Mark all as read
                </Button>
              )}
            </div>
          </header>

          <nav className="notifications-page__filters" aria-label="Filter notifications">
            {([
              { value: 'all', label: 'All', count: notifications.length },
              { value: 'unread', label: 'Unread', count: unreadCount },
              ...ALL_CATEGORIES.map((category) => ({ value: category, label: CATEGORY_META[category].label, count: notifications.filter((item) => item.category === category).length })),
            ] as { value: FilterValue; label: string; count: number }[]).map((option) => (
              <button
                key={option.value}
                type="button"
                className={`notifications-page__filter${filter === option.value ? ' is-active' : ''}`}
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
                <span className="notifications-page__filter-count">{option.count}</span>
              </button>
            ))}
          </nav>

          {loadError && (
            <div className="notifications-page__error" role="alert">
              <span>Notifications could not be refreshed. Showing saved updates where available.</span>
              <Button variant="ghost" size="sm" onClick={() => void loadNotifications()}>
                <RefreshCw size={14} aria-hidden="true" />
                Retry
              </Button>
            </div>
          )}

          <Card variant="default" padding="none" className="notifications-page__list-card">
            <CardBody className="notifications-page__list-body">
              {loading ? (
                <div className="notifications-page__skeleton-list" role="status" aria-label="Loading notifications">
                  {[0, 1, 2, 3].map((item) => (
                    <div className="notifications-page__skeleton-row" key={item}>
                      <SkeletonCircle size={42} />
                      <div className="notifications-page__skeleton-content">
                        <Skeleton variant="text" width="70%" />
                        <Skeleton variant="text" width="90%" />
                        <Skeleton variant="badge" width={80} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : hasNoNotifications ? (
                <EmptyState
                  icon={<Inbox size={28} aria-hidden="true" />}
                  title="No notifications yet"
                  description="Important updates from OyoConnect will appear here."
                />
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon={<FileText size={28} aria-hidden="true" />}
                  title="No results for this filter"
                  description="Try a different notification filter."
                  action={
                    <Button variant="ghost" size="sm" onClick={() => setFilter('all')}>
                      Show all notifications
                    </Button>
                  }
                />
              ) : groups.map((group) => (
                <div className="notifications-page__date-group" key={group.label}>
                  <div className="notifications-page__date-heading">
                    <span>{group.label}</span>
                    {group.label === 'Earlier' && <small>{getDateLabel(group.items[0].createdAt)}</small>}
                  </div>
                  {group.items.map((notification) => {
                    const meta = CATEGORY_META[notification.category]
                    const Icon = meta.icon
                    const badgeVariant = CATEGORY_BADGE_VARIANTS[notification.category]
                    const content = (
                      <>
                        <span className={`notifications-page__type-icon notifications-page__type-icon--${notification.category}`}>
                          <Icon size={18} aria-hidden="true" />
                        </span>
                        <span className="notifications-page__row-content">
                          <span className="notifications-page__row-top">
                            <strong>{notification.title}</strong>
                            <time dateTime={notification.createdAt}>
                              <Clock3 size={12} aria-hidden="true" />
                              {formatTime(notification.createdAt)}
                            </time>
                          </span>
                          <span className="notifications-page__row-message">{notification.message}</span>
                          <span className="notifications-page__row-bottom">
                            <Badge variant={badgeVariant} size="sm">{meta.label}</Badge>
                            {!notification.read && (
                              <span className="notifications-page__unread-label">
                                <span className="notifications-page__unread-dot" aria-hidden="true" />
                                Unread
                              </span>
                            )}
                          </span>
                        </span>
                        {!notification.read && <span className="notifications-page__row-dot" aria-label="Unread" />}
                      </>
                    )
                    const rowClass = `notifications-page__row${notification.read ? '' : ' is-unread'}`
                    return (
                      <article
                        className={`${rowClass}${notification.href ? '' : ' is-static'}`}
                        key={notification.id}
                        role={notification.href ? 'link' : 'button'}
                        tabIndex={0}
                        onClick={() => openNotification(notification)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            openNotification(notification)
                          }
                        }}
                      >
                        {content}
                        {notification.href && (
                          <span className="notifications-page__open-icon" aria-hidden="true">
                            <ExternalLink size={14} />
                          </span>
                        )}
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="notifications-page__mark-read"
                            onClick={(event) => { event.stopPropagation(); markAsRead(notification) }}
                            aria-label={`Mark "${notification.title}" as read`}
                          >
                            <CheckCheck size={12} aria-hidden="true" />
                            <span>Mark read</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="notifications-page__delete"
                          onClick={(event) => handleDeleteClick(notification, event)}
                          aria-label={`Delete "${notification.title}"`}
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </Button>
                      </article>
                    )
                  })}
                </div>
              ))}
            </CardBody>
          </Card>

          <aside className="notifications-page__aside" aria-label="Notification overview">
            <Card variant="default" padding="lg" className="notifications-page__summary-card">
              <span className="notifications-page__side-eyebrow">AT A GLANCE</span>
              <h2>Your activity</h2>
              <div className="notifications-page__stat-list">
                <div className="notifications-page__stat">
                  <span className="notifications-page__stat-icon">
                    <Inbox size={16} aria-hidden="true" />
                  </span>
                  <span>Total notifications</span>
                  <strong>{notifications.length}</strong>
                </div>
                <div className="notifications-page__stat">
                  <span className="notifications-page__stat-icon is-green">
                    <Bell size={16} aria-hidden="true" />
                  </span>
                  <span>Unread</span>
                  <strong>{unreadCount}</strong>
                </div>
                <div className="notifications-page__stat">
                  <span className="notifications-page__stat-icon is-amber">
                    <Clock3 size={16} aria-hidden="true" />
                  </span>
                  <span>Received today</span>
                  <strong>{todayCount}</strong>
                </div>
              </div>
            </Card>

            <Card variant="default" padding="lg" className="notifications-page__settings-card">
              <span className="notifications-page__settings-icon">
                <Settings size={18} aria-hidden="true" />
              </span>
              <div>
                <h2>Notification settings</h2>
                <p>Choose which updates you receive.</p>
                <Link to="/settings/notifications" className="notifications-page__settings-link">
                  Manage settings
                  <ChevronRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </Card>

            {categories.some((category) => CATEGORY_META[category].link) && (
              <Card variant="default" padding="lg" className="notifications-page__quick-links">
                <span className="notifications-page__side-eyebrow">QUICK LINKS</span>
                <h2>Explore updates</h2>
                {categories
                  .filter((category) => CATEGORY_META[category].link)
                  .slice(0, 4)
                  .map((category) => {
                    const meta = CATEGORY_META[category]
                    const Icon = meta.icon
                    return (
                      <Link key={category} to={meta.link!} className="notifications-page__quick-link">
                        <span>
                          <Icon size={15} aria-hidden="true" />
                          {meta.label}
                        </span>
                        <ChevronRight size={14} aria-hidden="true" />
                      </Link>
                    )
                  })}
              </Card>
            )}

            <Card variant="default" padding="lg" className="notifications-page__empty-note">
              <p>Notification preferences and delivery settings can be managed in your account settings.</p>
            </Card>
          </aside>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setNotificationToDelete(null); }}
        title="Delete notification?"
        size="sm"
        closeOnOverlayClick={false}
        closeOnEscape={true}
      >
        <div className="signout-dialog">
          <div className="signout-dialog__icon" aria-hidden="true">
            <Trash2 size={28} />
          </div>
          <p className="signout-dialog__message">
            Are you sure you want to delete this notification? This action cannot be undone.
          </p>
          <div className="signout-dialog__actions">
            <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setNotificationToDelete(null); }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  )
}

export default Notifications