import { useState } from 'react'
import { Search, Filter, Users, Flag, MessageSquare, MapPin, Shield, CheckCircle2, XCircle, Eye, AlertTriangle, Clock } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { formatDate } from '../../utils/date'

type ReportStatus = 'pending' | 'verified' | 'resolved' | 'dismissed' | 'urgent'
type ModerationRow = {
  id: string
  category: string
  title: string
  description: string
  location: string
  reporter: string
  status: ReportStatus
  createdAt: string
  moderatedAt: string | null
  moderatedBy: string | null
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
  { value: 'urgent', label: 'Urgent' },
]

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  { value: 'roads', label: 'Road Conditions' },
  { value: 'floods', label: 'Flood Reports' },
  { value: 'traffic', label: 'Traffic Updates' },
  { value: 'power', label: 'Power Reports' },
  { value: 'water', label: 'Water Availability' },
  { value: 'waste', label: 'Waste Reports' },
  { value: 'construction', label: 'Construction Updates' },
  { value: 'security', label: 'Security Alerts' },
  { value: 'transport', label: 'Transport Updates' },
  { value: 'photos', label: 'Community Photos' },
]

export function AdminCommunityModeration() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const itemsPerPage = 20

  // Mock data - will be replaced by backend API
  const allReports: ModerationRow[] = []
  const totalItems = 0

  const hasActiveFilters = query.trim() !== '' || status !== 'all' || category !== 'all'

  const getStatusBadge = (status: ReportStatus) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'warning' as const, icon: Clock },
      verified: { label: 'Verified', variant: 'success' as const, icon: CheckCircle2 },
      resolved: { label: 'Resolved', variant: 'success' as const, icon: CheckCircle2 },
      dismissed: { label: 'Dismissed', variant: 'neutral' as const, icon: XCircle },
      urgent: { label: 'Urgent', variant: 'error' as const, icon: AlertTriangle },
    }
    return statusConfig[status] ?? statusConfig.pending
  }

  return (
    <section className="admin-section" aria-labelledby="admin-community-moderation-title">
      <AdminPageHeader
        title="Community Moderation"
        subtitle="Review, verify, and moderate community reports across Oyo State."
        icon={<Users size={20} />}
      />

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Input
            label="Search reports"
            placeholder="Search by title, location, or reporter"
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
          <Select
            label="Category"
            value={category}
            options={CATEGORY_OPTIONS}
            onChange={(value) => { setCategory(value); setPage(1); }}
          />
        </div>
      </div>

      <div className="admin-table-card">
        {totalItems === 0 ? (
          <div className="admin-table-empty">
            <EmptyState
              icon={<Users size={40} />}
              title={hasActiveFilters ? 'No reports match your filters' : 'No community reports yet'}
              description={
                hasActiveFilters
                  ? 'Try adjusting your search or filters.'
                  : 'Community report data will appear here when connected to the backend.'
              }
              action={
                hasActiveFilters ? (
                  <Button type="button" variant="outline" onClick={() => { setQuery(''); setStatus('all'); setCategory('all'); setPage(1); }}>
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
                  <th>Report</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Reporter</th>
                  <th>Status</th>
                  <th>Reported</th>
                  <th>Moderated</th>
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
        <Users size={18} aria-hidden="true" />
        <p>Community moderation will be fully functional when connected to the backend.</p>
      </div>
    </section>
  )
}

export default AdminCommunityModeration