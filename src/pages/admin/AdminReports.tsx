import { FileText } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'

export function AdminReports() {
  return (
    <section className="admin-section" aria-labelledby="admin-reports-title">
      <AdminPageHeader
        title="Reports"
        subtitle="Review flagged content and user reports."
        icon={<FileText size={20} />}
      />

      <div className="admin-table-card">
        <div className="admin-table-empty">
          <EmptyState
            icon={<FileText size={40} />}
            title="No reports"
            description="Reported content and user reports will appear here when connected to the backend."
          />
        </div>
      </div>
    </section>
  )
}

export default AdminReports
