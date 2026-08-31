import { Tags } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'

export function AdminJobCategories() {
  return (
    <section className="admin-section" aria-labelledby="admin-job-categories-title">
      <AdminPageHeader
        title="Job Categories"
        subtitle="Manage the categories used for job listings."
        icon={<Tags size={20} />}
      />

      <div className="admin-table-card">
        <div className="admin-table-empty">
          <EmptyState
            icon={<Tags size={40} />}
            title="No job categories available"
            description="Job categories will appear here when connected to the backend."
          />
        </div>
      </div>
    </section>
  )
}

export default AdminJobCategories
