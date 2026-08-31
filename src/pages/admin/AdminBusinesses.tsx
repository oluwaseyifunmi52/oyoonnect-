import { useState } from 'react'
import { Search, Building2, Filter } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { Input, Select } from '../../components/ui/Input'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button, ButtonLink } from '../../components/ui/Button'

type BusinessRow = {
  id: string
  name: string
  category: string
  location: string
  status: string
  verification: string
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' },
]

const VERIFICATION_OPTIONS = [
  { value: 'all', label: 'All verification' },
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending' },
  { value: 'not_submitted', label: 'Not submitted' },
]

export function AdminBusinesses() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [verification, setVerification] = useState('all')

  // No backend data yet — the table is populated once the backend is connected.
  const businessRows: BusinessRow[] = []

  const hasActiveFilters = query.trim() !== '' || status !== 'all' || verification !== 'all'

  return (
    <section className="admin-section" aria-labelledby="admin-businesses-title">
      <AdminPageHeader
        title="Businesses"
        subtitle="Review and manage businesses registered on OyoConnect."
        icon={<Building2 size={20} />}
      />

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Input
            label="Search businesses"
            placeholder="Search by business name or location"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <div className="admin-toolbar__filters">
          <Select
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={setStatus}
          />
          <Select
            label="Verification"
            value={verification}
            options={VERIFICATION_OPTIONS}
            onChange={setVerification}
          />
        </div>
      </div>

      <div className="admin-table-card">
        <table className="admin-table admin-table--empty-ready">
          <thead>
            <tr>
              <th>Business</th>
              <th>Category</th>
              <th>Location</th>
              <th>Status</th>
              <th>Verification</th>
              <th>Actions</th>
            </tr>
          </thead>
          {businessRows.length > 0 ? (
            <tbody>
              {businessRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.category}</td>
                  <td>{row.location}</td>
                  <td><span className="status--pending">{row.status}</span></td>
                  <td>{row.verification}</td>
                  <td>
                    <ButtonLink to={`/admin/businesses/${row.id}`} variant="outline" size="sm">View</ButtonLink>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>
        {businessRows.length === 0 ? (
          <div className="admin-table-empty">
            <EmptyState
              icon={<Building2 size={40} />}
              title={hasActiveFilters ? 'No businesses match your filters' : 'No businesses available'}
              description={
                hasActiveFilters
                  ? 'Try adjusting your search or filters.'
                  : 'Business data will appear here when connected to the backend.'
              }
              action={
                hasActiveFilters ? (
                  <Button type="button" variant="outline" onClick={() => { setQuery(''); setStatus('all'); setVerification('all') }}>
                    <Filter size={16} /> Clear filters
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          null
        )}
      </div>
    </section>
  )
}

export default AdminBusinesses
