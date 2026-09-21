import { useState } from 'react'
import { Search, Filter, Activity, Badge } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

type AuditLogRow = {
  id: string
  actorId: string
  actorName: string
  actorRole: string
  action: string
  entityType: string
  entityId: string
  metadata: Record<string, unknown>
  createdAt: string
}

const ACTION_OPTIONS = [
  { value: 'all', label: 'All actions' },
  { value: 'create', label: 'Created' },
  { value: 'update', label: 'Updated' },
  { value: 'delete', label: 'Deleted' },
  { value: 'approve', label: 'Approved' },
  { value: 'reject', label: 'Rejected' },
  { value: 'verify', label: 'Verified' },
  { value: 'suspend', label: 'Suspended' },
  { value: 'activate', label: 'Activated' },
  { value: 'moderate', label: 'Moderated' },
]

const ENTITY_OPTIONS = [
  { value: 'all', label: 'All entities' },
  { value: 'business', label: 'Business' },
  { value: 'user', label: 'User' },
  { value: 'job', label: 'Job' },
  { value: 'service', label: 'Service' },
  { value: 'help_request', label: 'Help Request' },
  { value: 'community_report', label: 'Community Report' },
  { value: 'category', label: 'Category' },
  { value: 'settings', label: 'Settings' },
]

const ROLE_OPTIONS = [
  { value: 'all', label: 'All roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'system', label: 'System' },
]

export function AdminAuditLogs() {
  const [query, setQuery] = useState('')
  const [action, setAction] = useState('all')
  const [entity, setEntity] = useState('all')
  const [actorRole, setActorRole] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Mock data - will be replaced by backend API
  const totalItems = 0

  const hasActiveFilters = query.trim() !== '' || action !== 'all' || entity !== 'all' || actorRole !== 'all' || dateFrom !== '' || dateTo !== ''

  return (
    <section className="admin-section" aria-labelledby="admin-audit-logs-title">
      <AdminPageHeader
        title="Audit Logs"
        subtitle="Review administrative actions and system events for compliance and debugging."
        icon={<Activity size={20} />}
      />

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Input
            label="Search audit logs"
            placeholder="Search by action, entity, or actor"
            value={query}
            onChange={(event) => { setQuery(event.target.value); }}
            icon={<Search size={18} />}
          />
        </div>
        <div className="admin-toolbar__filters">
          <Select
            label="Action"
            value={action}
            options={ACTION_OPTIONS}
            onChange={(value) => { setAction(value); }}
          />
          <Select
            label="Entity"
            value={entity}
            options={ENTITY_OPTIONS}
            onChange={(value) => { setEntity(value); }}
          />
          <Select
            label="Actor Role"
            value={actorRole}
            options={ROLE_OPTIONS}
            onChange={(value) => { setActorRole(value); }}
          />
          <div className="admin-toolbar__date-filters">
            <Input
              label="From"
              type="date"
              value={dateFrom}
              onChange={(event) => { setDateFrom(event.target.value); }}
              placeholder="Start date"
            />
            <Input
              label="To"
              type="date"
              value={dateTo}
              onChange={(event) => { setDateTo(event.target.value); }}
              placeholder="End date"
            />
          </div>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-empty">
          <EmptyState
            icon={<Activity size={40} />}
            title={hasActiveFilters ? 'No audit logs match your filters' : 'No audit logs yet'}
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'Audit log data will appear here when connected to the backend.'
            }
            action={
              hasActiveFilters ? (
                <Button type="button" variant="outline" onClick={() => { setQuery(''); setAction('all'); setEntity('all'); setActorRole('all'); setDateFrom(''); setDateTo(''); }}>
                  <Filter size={16} /> Clear filters
                </Button>
              ) : undefined
            }
          />
        </div>
      </div>

      <div className="admin-info-banner">
        <Activity size={18} aria-hidden="true" />
        <p>Audit logs will be fully functional when connected to the backend.</p>
      </div>
    </section>
  )
}

export default AdminAuditLogs