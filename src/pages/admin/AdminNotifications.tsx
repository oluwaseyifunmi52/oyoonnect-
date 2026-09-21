import { useState } from 'react'
import { Search, Filter, Bell, Send } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

type NotificationType = 'system' | 'user' | 'provider' | 'business' | 'job' | 'help'
type NotificationRow = {
  id: string
  title: string
  message: string
  type: NotificationType
  audience: 'all' | 'users' | 'providers' | 'businesses' | 'admins'
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  sentAt: string | null
  createdAt: string
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'sent', label: 'Sent' },
  { value: 'failed', label: 'Failed' },
]

const TYPE_OPTIONS = [
  { value: 'all', label: 'All types' },
  { value: 'system', label: 'System' },
  { value: 'user', label: 'User' },
  { value: 'provider', label: 'Provider' },
  { value: 'business', label: 'Business' },
  { value: 'job', label: 'Job' },
  { value: 'help', label: 'Help' },
]

export function AdminNotifications() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Mock data - will be replaced by backend API
  const totalItems = 0

  const hasActiveFilters = query.trim() !== '' || status !== 'all' || type !== 'all'

  return (
    <section className="admin-section" aria-labelledby="admin-notifications-title">
      <AdminPageHeader
        title="Notifications"
        subtitle="Manage platform notifications and announcements."
        icon={<Bell size={20} />}
        actions={
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Send size={18} aria-hidden="true" />
            Create Notification
          </Button>
        }
      />

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Input
            label="Search notifications"
            placeholder="Search by title or message"
            value={query}
            onChange={(event) => { setQuery(event.target.value); }}
            icon={<Search size={18} />}
          />
        </div>
        <div className="admin-toolbar__filters">
          <Select
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(value) => { setStatus(value); }}
          />
          <Select
            label="Type"
            value={type}
            options={TYPE_OPTIONS}
            onChange={(value) => { setType(value); }}
          />
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-empty">
          <EmptyState
            icon={<Bell size={40} />}
            title={hasActiveFilters ? 'No notifications match your filters' : 'No notifications yet'}
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'Notification data will appear here when connected to the backend.'
            }
            action={
              hasActiveFilters ? (
                <Button type="button" variant="outline" onClick={() => { setQuery(''); setStatus('all'); setType('all'); }}>
                  <Filter size={16} /> Clear filters
                </Button>
              ) : undefined
            }
          />
        </div>
      </div>

      <div className="admin-info-banner">
        <Bell size={18} aria-hidden="true" />
        <p>Notification management will be fully functional when connected to the backend.</p>
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Create Notification</h2>
              <button className="modal__close" onClick={() => setShowCreateModal(false)} aria-label="Close modal">×</button>
            </div>
            <form className="modal__body" onSubmit={(e) => { e.preventDefault(); setShowCreateModal(false); }}>
              <div className="form-group">
                <label htmlFor="notif-title">Title</label>
                <input id="notif-title" type="text" className="input" placeholder="Notification title" required />
              </div>
              <div className="form-group">
                <label htmlFor="notif-message">Message</label>
                <textarea id="notif-message" className="input" rows={4} placeholder="Notification message" required></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="notif-type">Type</label>
                  <select id="notif-type" className="input">
                    <option value="system">System</option>
                    <option value="user">User</option>
                    <option value="provider">Provider</option>
                    <option value="business">Business</option>
                    <option value="job">Job</option>
                    <option value="help">Help</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="notif-audience">Audience</label>
                  <select id="notif-audience" className="input">
                    <option value="all">All Users</option>
                    <option value="users">Customers</option>
                    <option value="providers">Providers</option>
                    <option value="businesses">Businesses</option>
                    <option value="admins">Admins</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="notif-schedule">Schedule</label>
                <select id="notif-schedule" className="input">
                  <option value="now">Send Immediately</option>
                  <option value="schedule">Schedule for Later</option>
                </select>
              </div>
              <div className="modal__footer">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">
                  <Send size={18} aria-hidden="true" />
                  Send Notification
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminNotifications