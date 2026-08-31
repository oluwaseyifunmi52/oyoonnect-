import { Users, Search, Filter } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'

export function AdminCommunity() {
  return (
    <section className="admin-section" aria-labelledby="admin-community-title">
      <AdminPageHeader
        title="Community"
        subtitle="Review and moderate community reports across Oyo State."
        icon={<Users size={20} />}
      />

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <input className="input" style={{ width: '100%' }} type="text" placeholder="Search community reports..." aria-label="Search community reports" disabled />
        </div>
        <button className="btn btn--outline" type="button" disabled>
          <Filter size={16} /> Filter
        </button>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-empty">
          <EmptyState
            icon={<Search size={40} />}
            title="No community reports"
            description="Community reports will appear here when connected to the backend."
          />
        </div>
      </div>
    </section>
  )
}

export default AdminCommunity
