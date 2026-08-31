import { BadgeCheck, Building2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'

function VerificationEmpty({ status, icon }: { status: 'Pending' | 'Approved' | 'Rejected'; icon: React.ReactNode }) {
  const hint =
    status === 'Pending'
      ? 'Businesses awaiting verification will appear here.'
      : status === 'Approved'
        ? 'Verified businesses will appear here.'
        : 'Rejected verification requests will appear here.'
  return (
    <div className="verification-section__empty">
      <EmptyState
        icon={icon}
        title={`No ${status.toLowerCase()} businesses`}
        description={hint}
      />
    </div>
  )
}

export function AdminVerification() {
  return (
    <section className="admin-section" aria-labelledby="admin-verification-title">
      <AdminPageHeader
        title="Business Verification"
        subtitle="Approve or reject business verification requests."
        icon={<BadgeCheck size={20} />}
      />

      <div className="verification-panels">
        <section className="verification-panel">
          <header className="verification-panel__header verification-panel__header--pending">
            <Clock size={18} aria-hidden="true" />
            <h2>Pending</h2>
          </header>
          <VerificationEmpty status="Pending" icon={<Clock size={40} />} />
        </section>

        <section className="verification-panel">
          <header className="verification-panel__header verification-panel__header--approved">
            <CheckCircle2 size={18} aria-hidden="true" />
            <h2>Approved</h2>
          </header>
          <VerificationEmpty status="Approved" icon={<CheckCircle2 size={40} />} />
        </section>

        <section className="verification-panel">
          <header className="verification-panel__header verification-panel__header--rejected">
            <XCircle size={18} aria-hidden="true" />
            <h2>Rejected</h2>
          </header>
          <VerificationEmpty status="Rejected" icon={<XCircle size={40} />} />
        </section>
      </div>

      <div className="admin-info-banner">
        <Building2 size={18} aria-hidden="true" />
        <p>Verification requests will be listed here once connected to the backend. No fake businesses are shown.</p>
      </div>
    </section>
  )
}

export default AdminVerification
