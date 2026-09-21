import { useState, useEffect, useMemo } from 'react'
import { LifeBuoy, Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { StatusBadge } from '../../components/help/StatusBadge'
import { VerificationBadge } from '../../components/help/VerificationBadge'
import { helpService } from '../../services/helpService'
import type { SupportRequest, SupportRequestStatus } from '../../types/help'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'active', label: 'Active' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'rejected', label: 'Rejected' },
]

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'school-fees', label: 'School Fees' },
  { value: 'emergency-rent', label: 'Emergency Rent' },
  { value: 'medical-emergency', label: 'Medical & Emergency' },
  { value: 'small-business', label: 'Small Business' },
  { value: 'tools-equipment', label: 'Tools & Equipment' },
  { value: 'family-emergency', label: 'Family Emergency' },
  { value: 'other-emergency', label: 'Other Emergencies' },
]

export function AdminHelp() {
  const [requests, setRequests] = useState<SupportRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await helpService.search({ limit: 100 })
      setRequests(data)
    } catch {
      setError('Failed to load help requests. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = useMemo(() => {
    let result = [...requests]

    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.requesterName.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q),
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      result = result.filter((r) => r.category === categoryFilter)
    }

    return result
  }, [requests, query, statusFilter, categoryFilter])

  const handleStatusUpdate = async (requestId: string, newStatus: SupportRequestStatus) => {
    setUpdatingStatus(true)
    try {
      // In a real implementation, this would call an API
      // For now, we simulate the update
      await new Promise((resolve) => setTimeout(resolve, 500))

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status: newStatus, updatedAt: new Date().toISOString() }
            : r,
        ),
      )

      if (selectedRequest?.id === requestId) {
        setSelectedRequest((prev) =>
          prev ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() } : null,
        )
      }
    } catch {
      // Handle error silently
    } finally {
      setUpdatingStatus(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const hasActiveFilters = query.trim() !== '' || statusFilter !== 'all' || categoryFilter !== 'all'

  return (
    <section className="admin-section" aria-labelledby="admin-help-title">
      <AdminPageHeader
        title="Help Requests"
        subtitle="View, review, and manage user support requests."
        icon={<LifeBuoy size={20} />}
      />

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Input
            label="Search requests"
            placeholder="Search by title, requester, or description"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <div className="admin-toolbar__filters">
          <Select
            label="Status"
            value={statusFilter}
            options={STATUS_OPTIONS}
            onChange={setStatusFilter}
          />
          <Select
            label="Category"
            value={categoryFilter}
            options={CATEGORY_OPTIONS}
            onChange={setCategoryFilter}
          />
        </div>
      </div>

      <div className="admin-table-card">
        {loading ? (
          <div className="admin-table-skeleton" role="status" aria-label="Loading requests">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="admin-table-row skeleton" />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={<LifeBuoy size={40} />}
            title="Unable to load requests"
            description={error}
            action={
              <Button type="button" variant="outline" onClick={loadRequests}>
                Try Again
              </Button>
            }
          />
        ) : filteredRequests.length === 0 ? (
          <EmptyState
            icon={<LifeBuoy size={40} />}
            title={hasActiveFilters ? 'No requests match your filters' : 'No help requests yet'}
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'User support requests will appear here when users start submitting them.'
            }
            action={
              hasActiveFilters ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setQuery('')
                    setStatusFilter('all')
                    setCategoryFilter('all')
                  }}
                >
                  <Filter size={16} /> Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Request</th>
                <th scope="col">Requester</th>
                <th scope="col">Category</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Verification</th>
                <th scope="col">Created</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <div className="admin-table__title-cell">
                      <span className="admin-table__primary-text">{request.title}</span>
                      <span className="admin-table__secondary-text">{request.requesterLocation}</span>
                    </div>
                  </td>
                  <td>{request.requesterName}</td>
                  <td>
                    <Badge variant="neutral" size="sm">
                      {request.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  </td>
                  <td>{formatCurrency(request.targetAmount)}</td>
                  <td>
                    <StatusBadge status={request.status} size="sm" />
                  </td>
                  <td>
                    <VerificationBadge status={request.verificationStatus} size="sm" />
                  </td>
                  <td>{formatDate(request.createdAt)}</td>
                  <td>
                    <div className="admin-table__actions">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowDetailModal(true)
                        }}
                        aria-label={`View details for ${request.title}`}
                      >
                        <Eye size={16} />
                      </Button>
                      {request.status === 'pending_review' && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusUpdate(request.id, 'active')}
                          disabled={updatingStatus}
                          aria-label={`Approve ${request.title}`}
                        >
                          <CheckCircle size={16} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedRequest(null)
        }}
        title="Request Details"
        size="lg"
      >
        {selectedRequest && (
          <div className="admin-help-detail">
            <div className="admin-help-detail__header">
              <h3>{selectedRequest.title}</h3>
              <div className="admin-help-detail__badges">
                <StatusBadge status={selectedRequest.status} />
                <VerificationBadge status={selectedRequest.verificationStatus} size="sm" showLabel />
              </div>
            </div>

            <dl className="admin-help-detail__info">
              <div className="admin-help-detail__info-row">
                <dt>Requester</dt>
                <dd>{selectedRequest.requesterName}</dd>
              </div>
              <div className="admin-help-detail__info-row">
                <dt>Location</dt>
                <dd>{selectedRequest.requesterLocation}</dd>
              </div>
              <div className="admin-help-detail__info-row">
                <dt>Category</dt>
                <dd>{selectedRequest.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</dd>
              </div>
              <div className="admin-help-detail__info-row">
                <dt>Target Amount</dt>
                <dd>{formatCurrency(selectedRequest.targetAmount)}</dd>
              </div>
              <div className="admin-help-detail__info-row">
                <dt>Amount Raised</dt>
                <dd>{formatCurrency(selectedRequest.amountRaised)}</dd>
              </div>
              <div className="admin-help-detail__info-row">
                <dt>Supporters</dt>
                <dd>{selectedRequest.supportersCount}</dd>
              </div>
              <div className="admin-help-detail__info-row">
                <dt>Created</dt>
                <dd>{formatDate(selectedRequest.createdAt)}</dd>
              </div>
              <div className="admin-help-detail__info-row">
                <dt>Deadline</dt>
                <dd>{formatDate(selectedRequest.deadline)}</dd>
              </div>
            </dl>

            <div className="admin-help-detail__section">
              <h4>Description</h4>
              <p>{selectedRequest.description}</p>
            </div>

            <div className="admin-help-detail__section">
              <h4>Full Story</h4>
              <p>{selectedRequest.fullStory}</p>
            </div>

            <div className="admin-help-detail__actions">
              <h4>Actions</h4>
              <div className="admin-help-detail__action-buttons">
                {selectedRequest.status === 'pending_review' && (
                  <>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => {
                        handleStatusUpdate(selectedRequest.id, 'active')
                        setShowDetailModal(false)
                      }}
                      disabled={updatingStatus}
                    >
                      <CheckCircle size={16} aria-hidden="true" />
                      Approve Request
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => {
                        handleStatusUpdate(selectedRequest.id, 'rejected')
                        setShowDetailModal(false)
                      }}
                      disabled={updatingStatus}
                    >
                      <XCircle size={16} aria-hidden="true" />
                      Reject Request
                    </Button>
                  </>
                )}
                {selectedRequest.status === 'active' && (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      handleStatusUpdate(selectedRequest.id, 'resolved')
                      setShowDetailModal(false)
                    }}
                    disabled={updatingStatus}
                  >
                    <CheckCircle size={16} aria-hidden="true" />
                    Mark Resolved
                  </Button>
                )}
                {(selectedRequest.status === 'resolved' || selectedRequest.status === 'active') && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      handleStatusUpdate(selectedRequest.id, 'closed')
                      setShowDetailModal(false)
                    }}
                    disabled={updatingStatus}
                  >
                    <Clock size={16} aria-hidden="true" />
                    Close Request
                  </Button>
                )}
                <Link
                  to={`/help/requests/${selectedRequest.id}`}
                  className="btn btn--outline btn--md"
                  onClick={() => setShowDetailModal(false)}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}

export default AdminHelp
