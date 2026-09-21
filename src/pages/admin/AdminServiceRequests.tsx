import { useState } from 'react'
import { Search, Filter, ClipboardList } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

type ServiceRequestStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
type ServiceRequestRow = {
  id: string
  service: string
  customer: string
  provider: string
  location: string
  status: ServiceRequestStatus
  scheduledAt: string
  createdAt: string
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'disputed', label: 'Disputed' },
]

export function AdminServiceRequests() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  // Mock data - will be replaced by backend API
  const totalItems = 0

  const hasActiveFilters = query.trim() !== '' || status !== 'all'

  return (
    <section className="admin-section" aria-labelledby="admin-service-requests-title">
      <AdminPageHeader
        title="Service Requests"
        subtitle="View and manage customer service requests and assignments."
        icon={<ClipboardList size={20} />}
      />

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Input
            label="Search requests"
            placeholder="Search by service, customer, or provider"
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
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-empty">
          <EmptyState
            icon={<ClipboardList size={40} />}
            title={hasActiveFilters ? 'No requests match your filters' : 'No service requests yet'}
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'Service request data will appear here when connected to the backend.'
            }
            action={
              hasActiveFilters ? (
                <Button type="button" variant="outline" onClick={() => { setQuery(''); setStatus('all'); }}>
                  <Filter size={16} /> Clear filters
                </Button>
              ) : undefined
            }
          />
        </div>
      </div>

      <div className="admin-info-banner">
        <ClipboardList size={18} aria-hidden="true" />
        <p>Service request management will be fully functional when connected to the backend.</p>
      </div>
    </section>
  )
}

export default AdminServiceRequests