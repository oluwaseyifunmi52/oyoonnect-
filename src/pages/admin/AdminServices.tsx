import { useState } from 'react'
import { Search, Filter, Briefcase } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

type ServiceStatus = 'pending' | 'active' | 'inactive' | 'flagged'
type ServiceRow = {
  id: string
  name: string
  provider: string
  category: string
  location: string
  price: string
  status: ServiceStatus
  verified: boolean
  createdAt: string
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'flagged', label: 'Flagged' },
]

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'transport', label: 'Transport' },
]

export function AdminServices() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')

  // Mock data - will be replaced by backend API
  const totalItems = 0

  const hasActiveFilters = query.trim() !== '' || status !== 'all' || category !== 'all'

  return (
    <section className="admin-section" aria-labelledby="admin-services-title">
      <AdminPageHeader
        title="Services"
        subtitle="Manage services offered by providers on the platform."
        icon={<Briefcase size={20} />}
      />

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Input
            label="Search services"
            placeholder="Search by name, provider, or category"
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
            label="Category"
            value={category}
            options={CATEGORY_OPTIONS}
            onChange={(value) => { setCategory(value); }}
          />
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-empty">
          <EmptyState
            icon={<Briefcase size={40} />}
            title={hasActiveFilters ? 'No services match your filters' : 'No services yet'}
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'Service data will appear here when connected to the backend.'
            }
            action={
              hasActiveFilters ? (
                <Button type="button" variant="outline" onClick={() => { setQuery(''); setStatus('all'); setCategory('all'); }}>
                  <Filter size={16} /> Clear filters
                </Button>
              ) : undefined
            }
          />
        </div>
      </div>

      <div className="admin-info-banner">
        <Briefcase size={18} aria-hidden="true" />
        <p>Service management will be fully functional when connected to the backend.</p>
      </div>
    </section>
  )
}

export default AdminServices