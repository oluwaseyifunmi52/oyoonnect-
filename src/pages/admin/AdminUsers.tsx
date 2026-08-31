import { useState } from 'react'
import { Filter, Search, User as UserIcon } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Input'

const ROLE_OPTIONS = [
  { value: 'all', label: 'All roles' },
  { value: 'user', label: 'Users' },
  { value: 'business_owner', label: 'Business owners' },
  { value: 'admin', label: 'Admins' },
]

function AdminUsers() {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('all')
  const hasActiveFilters = query.trim() !== '' || role !== 'all'

  return (
    <section className="admin-section" aria-labelledby="admin-users-title">
      <AdminPageHeader
        title="Users"
        subtitle="View and manage platform users after backend account data is connected."
        icon={<UserIcon size={20} />}
      />

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Input
            label="Search users"
            placeholder="Search by name or email"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <div className="admin-toolbar__filters">
          <Select label="Role" value={role} options={ROLE_OPTIONS} onChange={setRole} />
        </div>
      </div>

      <div className="admin-table-card">
        <table className="admin-table admin-table--empty-ready">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
        </table>
        <div className="admin-table-empty">
          <EmptyState
            icon={<UserIcon size={40} />}
            title={hasActiveFilters ? 'No users match your filters' : 'No users available'}
            description={
              hasActiveFilters
                ? 'Try adjusting your search or role filter.'
                : 'User account data will appear here when connected to the backend.'
            }
            action={
              hasActiveFilters ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setQuery('')
                    setRole('all')
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

export default AdminUsers
