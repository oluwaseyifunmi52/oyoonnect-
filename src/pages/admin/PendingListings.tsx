import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, CheckCircle2, XCircle, Eye, MoreVertical } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Input'
import { Pagination } from '../../components/common/Pagination'
import { Modal } from '../../components/common/Modal'
import { businessService } from '../../services/businessService'
import type { Business } from '../../types/business'

const ITEMS_PER_PAGE = 15
const STATUS_FILTERS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
]

function PendingListings() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [showActionModal, setShowActionModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<'approve' | 'verify' | 'reject'>('approve')
  const [allListings, setAllListings] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadListings = async () => {
      try {
        const data = await businessService.getAll()
        setAllListings(data)
      } catch {
        setAllListings([])
      } finally {
        setLoading(false)
      }
    }
    loadListings()
  }, [])

  const filteredListings = useMemo(() => {
    let listings = allListings

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      listings = listings.filter((b) =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        (b.ownerId && b.ownerId.toLowerCase().includes(q))
      )
    }

    if (statusFilter) {
      listings = listings.filter((b) => b.status === statusFilter)
    }

    switch (sortBy) {
      case 'name':
        listings.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'oldest':
        listings.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
        break
      case 'rating':
        listings.sort((a, b) => b.rating - a.rating)
        break
      default:
        listings.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    }

    return listings
  }, [allListings, searchQuery, statusFilter, sortBy])

  const paginated = useMemo(() => {
    const totalItems = filteredListings.length
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return {
      items: filteredListings.slice(start, end),
      totalPages,
      totalItems,
    }
  }, [filteredListings, currentPage])

  const handleAction = (action: 'approve' | 'verify' | 'reject', business: Business) => {
    setSelectedBusiness(business)
    setPendingAction(action)
    setShowActionModal(true)
  }

  const confirmAction = () => {
    if (!selectedBusiness) return

    switch (pendingAction) {
      case 'approve':
        businessService.approve(selectedBusiness.id)
        break
      case 'verify':
        businessService.verify(selectedBusiness.id)
        break
      case 'reject':
        businessService.reject(selectedBusiness.id)
        break
    }

    setShowActionModal(false)
    setSelectedBusiness(null)
  }

  const actionLabels = {
    approve: { title: 'Approve listing', text: 'This will publish the listing on the platform.' },
    verify: { title: 'Verify listing', text: 'This will mark the listing as verified and publish it.' },
    reject: { title: 'Reject listing', text: 'This will reject the listing. The owner will be notified.' },
  }

  if (loading) {
    return (
      <main className="page admin-listings">
        <div className="container">
          <div className="page-skeleton">
            <div className="skeleton skeleton--text skeleton--wide" style={{ maxWidth: '300px', margin: '0 auto 16px' }} />
            <div className="skeleton skeleton--text skeleton--mid" style={{ maxWidth: '200px', margin: '0 auto 16px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton skeleton--media" style={{ aspectRatio: '1', borderRadius: '12px' }} />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page admin-listings">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Pending Listings</h1>
            <p className="page-subtitle">Review and manage business listing submissions</p>
          </div>
        </div>

        <div className="listings-toolbar">
          <div className="toolbar-search">
            <Search size={18} aria-hidden="true" />
            <input
              id="search-listings"
              name="search"
              type="search"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="search-input"
            />
          </div>

          <div className="toolbar-filters">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(value: string) => setStatusFilter(value)}
              options={STATUS_FILTERS}
              placeholder="All statuses"
              className="filter-select"
            />
            <Select
              label="Sort"
              value={sortBy}
              onChange={(value: string) => setSortBy(value)}
              options={[
                { value: 'newest', label: 'Newest first' },
                { value: 'oldest', label: 'Oldest first' },
                { value: 'name', label: 'Name (A-Z)' },
                { value: 'rating', label: 'Highest rated' },
              ]}
              placeholder="Sort by"
              className="filter-select"
            />
          </div>
        </div>

        <div className="listings-table-container">
          {paginated.items.length > 0 ? (
            <>
              <div className="listings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Business</th>
                      <th>Owner</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.items.map((listing: Business) => (
                      <tr key={listing.id}>
                        <td>
                          <div className="listing-cell">
                            <img src={listing.image} alt="" className="listing-thumb" />
                            <div>
                              <span className="listing-name">{listing.name}</span>
                              <span className="listing-category">{listing.category}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="owner-id">{listing.ownerId || 'Unknown'}</span>
                        </td>
                        <td>{listing.category}</td>
                        <td>{listing.location}</td>
                        <td>
                          <StatusBadge status={listing.status} />
                        </td>
                        <td>{new Date(listing.createdAt || 0).toLocaleDateString()}</td>
                        <td>
                          <div className="listing-actions">
                            <Link to={`/business/${listing.id}`} className="action-btn" title="View" target="_blank">
                              <Eye size={16} />
                            </Link>
                            <div className="action-dropdown">
                              <button className="action-btn dropdown-trigger" aria-label="More actions">
                                <MoreVertical size={16} />
                              </button>
                              <div className="dropdown-menu">
                                {listing.status === 'pending' && (
                                  <>
                                    <button onClick={() => handleAction('approve', listing)} className="dropdown-item">
                                      <CheckCircle2 size={14} /> Approve
                                    </button>
                                    <button onClick={() => handleAction('verify', listing)} className="dropdown-item">
                                      <CheckCircle2 size={14} /> Verify
                                    </button>
                                  </>
                                )}
                                {(listing.status === 'approved' || listing.status === 'pending') && (
                                  <button onClick={() => handleAction('verify', listing)} className="dropdown-item">
                                    <CheckCircle2 size={14} /> Verify
                                  </button>
                                )}
                                {listing.status !== 'rejected' && (
                                  <button onClick={() => handleAction('reject', listing)} className="dropdown-item dropdown-item--danger">
                                    <XCircle size={14} /> Reject
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={paginated.totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="empty-state">
              <p>No listings found matching your criteria.</p>
            </div>
          )}
        </div>

        <Modal
          isOpen={showActionModal}
          onClose={() => {
            setShowActionModal(false)
            setSelectedBusiness(null)
          }}
          title={actionLabels[pendingAction].title}
          size="sm"
        >
          <p>{actionLabels[pendingAction].text}</p>
          <p><strong>Business:</strong> {selectedBusiness?.name}</p>
          <p><strong>Category:</strong> {selectedBusiness?.category}</p>
          <p><strong>Location:</strong> {selectedBusiness?.location}</p>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setShowActionModal(false)}>
              Cancel
            </Button>
            <Button
              variant={pendingAction === 'reject' ? 'primary' : 'primary'}
              className={pendingAction === 'reject' ? 'btn--danger' : ''}
              onClick={confirmAction}
            >
              {pendingAction.charAt(0).toUpperCase() + pendingAction.slice(1)}
            </Button>
          </div>
        </Modal>
      </div>
    </main>
  )
}

function StatusBadge({ status }: { status: Business['status'] }) {
  const statusConfig = {
    pending: { label: 'Pending', className: 'status-badge--pending' },
    approved: { label: 'Approved', className: 'status-badge--approved' },
    verified: { label: 'Verified', className: 'status-badge--verified' },
    rejected: { label: 'Rejected', className: 'status-badge--rejected' },
  }

  const config = statusConfig[status ?? 'pending']

  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  )
}

export default PendingListings