import { useState } from 'react'
import { Search, Filter, ClipboardList, User, Briefcase, Mail, MapPin, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { formatDate } from '../../utils/date'

type ApplicationStatus = 'submitted' | 'reviewing' | 'shortlisted' | 'interview' | 'offered' | 'accepted' | 'rejected' | 'withdrawn'
type ApplicationRow = {
  id: string
  jobId: string
  jobTitle: string
  employer: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  status: ApplicationStatus
  appliedAt: string
  reviewedAt: string | null
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'offered', label: 'Offered' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
]

export function AdminJobApplications() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const itemsPerPage = 20

  // Mock data - will be replaced by backend API
  const allApplications: ApplicationRow[] = []
  const totalItems = 0

  const hasActiveFilters = query.trim() !== '' || status !== 'all'

  const getStatusBadge = (status: ApplicationStatus) => {
    const statusConfig = {
      submitted: { label: 'Submitted', variant: 'info' as const, icon: Clock },
      reviewing: { label: 'Reviewing', variant: 'warning' as const, icon: Clock },
      shortlisted: { label: 'Shortlisted', variant: 'info' as const, icon: CheckCircle2 },
      interview: { label: 'Interview', variant: 'warning' as const, icon: User },
      offered: { label: 'Offered', variant: 'success' as const, icon: CheckCircle2 },
      accepted: { label: 'Accepted', variant: 'success' as const, icon: CheckCircle2 },
      rejected: { label: 'Rejected', variant: 'error' as const, icon: XCircle },
      withdrawn: { label: 'Withdrawn', variant: 'neutral' as const, icon: XCircle },
    }
    return statusConfig[status] ?? statusConfig.submitted
  }

  return (
    <section className="admin-section" aria-labelledby="admin-job-applications-title">
      <AdminPageHeader
        title="Job Applications"
        subtitle="Review and oversee job applications across the platform."
        icon={<ClipboardList size={20} />}
      />

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Input
            label="Search applications"
            placeholder="Search by job, applicant, or employer"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1); }}
            icon={<Search size={18} />}
          />
        </div>
        <div className="admin-toolbar__filters">
          <Select
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(value) => { setStatus(value); setPage(1); }}
          />
        </div>
      </div>

      <div className="admin-table-card">
        {totalItems === 0 ? (
          <div className="admin-table-empty">
            <EmptyState
              icon={<ClipboardList size={40} />}
              title={hasActiveFilters ? 'No applications match your filters' : 'No job applications yet'}
              description={
                hasActiveFilters
                  ? 'Try adjusting your search or filters.'
                  : 'Job application data will appear here when connected to the backend.'
              }
              action={
                hasActiveFilters ? (
                  <Button type="button" variant="outline" onClick={() => { setQuery(''); setStatus('all'); setPage(1); }}>
                    <Filter size={16} /> Clear filters
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Job</th>
                  <th>Employer</th>
                  <th>Applicant</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Reviewed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Data rows will be rendered when backend is connected */}
              </tbody>
            </table>
            {/* Pagination would go here */}
          </>
        )}
      </div>

      <div className="admin-info-banner">
        <ClipboardList size={18} aria-hidden="true" />
        <p>Job application oversight will be fully functional when connected to the backend.</p>
      </div>
    </section>
  )
}

export default AdminJobApplications