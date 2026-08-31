import { LifeBuoy } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'

export function AdminHelp() {
  return (
    <section className="admin-section" aria-labelledby="admin-help-title">
      <AdminPageHeader
        title="Help Requests"
        subtitle="View and respond to user support requests."
        icon={<LifeBuoy size={20} />}
      />

      <div className="admin-table-card">
        <div className="admin-table-empty">
          <EmptyState
            icon={<LifeBuoy size={40} />}
            title="No help requests"
            description="User support requests will appear here when connected to the backend."
          />
        </div>
      </div>
    </section>
  )
}

export default AdminHelp
