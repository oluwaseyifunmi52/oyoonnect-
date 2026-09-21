import { useState } from 'react'
import { Search, Filter, Truck, BadgeCheck, Building2, MapPin } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

type ProviderStatus = 'pending' | 'active' | 'suspended' | 'verified'
type ProviderRow = {
  id: string
  name: string
  email: string
  phone: string
  category: string
  location: string
  status: ProviderStatus
  verified: boolean
  joinedDate: string
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'verified', label: 'Verified' },
]

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'transport', label: 'Transport' },
]

export function AdminProviders() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')

  // Mock data - will be replaced by backend API
  const totalItems = 0

  const hasActiveFilters = query.trim() !== '' || status !== 'all' || category !== 'all'

  return (
    <section className="admin-section" aria-labelledby="admin-providers-title">
      <AdminPageHeader
        title="Service Providers"
        subtitle="Manage service provider accounts, verification, and status."
        icon={<Truck size={20} />}
      />

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Input
            label="Search providers"
            placeholder="Search by name, email, or category"
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
            icon={<Truck size={40} />}
            title={hasActiveFilters ? 'No providers match your filters' : 'No service providers yet'}
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'Service provider data will appear here when connected to the backend.'
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
        <Truck size={18} aria-hidden="true" />
        <p>Service provider management will be fully functional when connected to the backend.</p>
      </div>
    </section>
  )
}

export default AdminProviders