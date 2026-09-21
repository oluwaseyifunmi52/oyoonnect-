import { useState } from 'react'
import { Search, Filter, CreditCard, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'retrying'
type PayoutRow = {
  id: string
  requestId: string
  requesterName: string
  amount: number
  platformFee: number
  payoutAmount: number
  bankName: string
  accountNumber: string
  status: PayoutStatus
  attemptCount: number
  createdAt: string
  completedAt: string | null
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'retrying', label: 'Retrying' },
]

export function AdminPayouts() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  // Mock data - will be replaced by backend API
  const totalItems = 0

  const hasActiveFilters = query.trim() !== '' || status !== 'all'

  const getStatusBadge = (status: PayoutStatus) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'neutral' as const, icon: Clock },
      processing: { label: 'Processing', variant: 'info' as const, icon: Clock },
      completed: { label: 'Completed', variant: 'success' as const, icon: CheckCircle2 },
      failed: { label: 'Failed', variant: 'error' as const, icon: XCircle },
      cancelled: { label: 'Cancelled', variant: 'neutral' as const, icon: XCircle },
      retrying: { label: 'Retrying', variant: 'warning' as const, icon: AlertTriangle },
    }
    return statusConfig[status] ?? statusConfig.pending
  }

  return (
    <section className="admin-section" aria-labelledby="admin-payouts-title">
      <AdminPageHeader
        title="Payouts"
        subtitle="Review and manage payout requests for help requests and services."
        icon={<CreditCard size={20} />}
      />

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Input
            label="Search payouts"
            placeholder="Search by requester, request ID, or bank"
            value={query}
            onChange={(event) => { setQuery(event.target.value); }}
            icon={<Search size={18} />}
          />
        </div>
        <div className="admin-toolbar__filters">
          <Select
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(value) => { setStatus(value); }}
          />
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-empty">
          <EmptyState
            icon={<CreditCard size={40} />}
            title={hasActiveFilters ? 'No payouts match your filters' : 'No payouts yet'}
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'Payout data will appear here when connected to the backend.'
            }
            action={
              hasActiveFilters ? (
                <Button type="button" variant="outline" onClick={() => { setQuery(''); setStatus('all'); }}>
                  <Filter size={16} /> Clear filters
                </Button>
              ) : undefined
            }
          />
        </div>
      </div>

      <div className="admin-info-banner">
        <CreditCard size={18} aria-hidden="true" />
        <p>Payout management will be fully functional when connected to the backend. <strong>No real money movement occurs in this frontend preview.</strong></p>
      </div>
    </section>
  )
}

export default AdminPayouts