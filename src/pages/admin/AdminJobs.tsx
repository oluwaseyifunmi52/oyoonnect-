import { useState } from 'react'
import { Briefcase, Filter, Search } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending review' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
  { value: 'rejected', label: 'Rejected' },
]

export function AdminJobs() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const hasActiveFilters = query.trim() !== '' || status !== 'all'

  return (
    <section className="admin-section" aria-labelledby="admin-jobs-title">
      <AdminPageHeader
        title="Jobs"
        subtitle="Search, filter, and review job listings when backend data is connected."
        icon={<Briefcase size={20} />}
      />

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Input
            label="Search jobs"
            placeholder="Search by title, employer, or category"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <div className="admin-toolbar__filters">
          <Select label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
        </div>
      </div>

      <div className="admin-table-card">
        <table className="admin-table admin-table--empty-ready">
          <thead>
            <tr>
              <th>Job</th>
              <th>Employer</th>
              <th>Category</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
        </table>
        <div className="admin-table-empty">
          <EmptyState
            icon={<Briefcase size={40} />}
            title={hasActiveFilters ? 'No jobs match your filters' : 'No jobs available'}
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'Job data will appear here when connected to the backend.'
            }
            action={
              hasActiveFilters ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setQuery('')
                    setStatus('all')
                  }}
                >
                  <Filter size={16} /> Clear filters
                </Button>
              ) : undefined
            }
          />
        </div>
      </div>
    </section>
  )
}

export default AdminJobs
