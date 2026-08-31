import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Filter, ChevronDown, ChevronUp, Search, RefreshCw, SearchX, Receipt, Plus } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { EmptyState } from '../components/ui/EmptyState'
import { Button, ButtonLink } from '../components/ui/Button'
import { Select } from '../components/ui/Input'
import { Pagination } from '../components/common/Pagination'
import { walletService } from '../services/walletService'
import { formatCurrency } from '../utils/currency'
import type { WalletTransaction } from '../types/bills'

const ITEMS_PER_PAGE = 20

function WalletTransactions() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({ status: '', dateFrom: '', dateTo: '' })
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    setCurrentPage(1)
    const loadTransactions = async () => {
      setLoading(true)
      try {
        const result = await walletService.getTransactions({
          ...filters,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        })
        setTransactions(result.transactions)
        setTotalItems(result.total)
      } catch {
        setTransactions([])
        setTotalItems(0)
      } finally {
        setLoading(false)
      }
    }
    loadTransactions()
  }, [filters, currentPage])

  const paginated = useMemo(() => ({
    items: transactions,
    totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
  }), [transactions, totalItems])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.status) count++
    if (filters.dateFrom) count++
    if (filters.dateTo) count++
    return count
  }, [filters])

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setFilters({ status: '', dateFrom: '', dateTo: '' })
  }

  const hasAnyFilters = filters.status || filters.dateFrom || filters.dateTo

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed': return 'status-badge--success'
      case 'pending': return 'status-badge--pending'
      case 'failed': return 'status-badge--error'
      default: return 'status-badge--neutral'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'pending': return 'Pending'
      case 'failed': return 'Failed'
      default: return status
    }
  }

  if (loading) {
    return (
      <main className="wallet-page">
        <div className="container">
          <div className="page-skeleton">
            <div className="skeleton skeleton--text skeleton--wide" style={{ maxWidth: '400px', margin: '0 auto 16px' }} />
            <div className="skeleton skeleton--text skeleton--mid" style={{ maxWidth: '300px', margin: '0 auto 16px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton skeleton--media" style={{ aspectRatio: '4/3', borderRadius: '12px' }} />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="wallet-page">
      <div className="container">
        <Link to="/wallet" className="back-link">
          <ArrowLeft size={16} /> Back to Wallet
        </Link>

        <header className="wallet-page__header">
          <h1 className="wallet-page__title">Transaction History</h1>
          <p className="wallet-page__description">View and manage all your wallet transactions.</p>
        </header>

        <div className="transactions-toolbar">
          <div className="transactions-filters">
            <div className="filters-group">
              <label className="filters__label" htmlFor="filter-status">
                Status
              </label>
              <Select
                label="Status"
                id="filter-status"
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
                options={[
                  { value: '', label: 'Any Status' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'failed', label: 'Failed' },
                ]}
                placeholder="Any Status"
              />
            </div>

            <div className="filters-group">
              <label className="filters__label" htmlFor="filter-date-from">
                Date From
              </label>
              <input
                id="filter-date-from"
                name="dateFrom"
                type="date"
                className="input"
                placeholder="From"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>

            <div className="filters-group">
              <label className="filters__label" htmlFor="filter-date-to">
                Date To
              </label>
              <input
                id="filter-date-to"
                name="dateTo"
                type="date"
                className="input"
                placeholder="To"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
          </div>

          <div className="filters-actions">
            {hasAnyFilters && (
              <Button variant="ghost" size="sm" onClick={() => setFilters({ status: '', dateFrom: '', dateTo: '' })}>
                <Filter size={16} /> Clear all
              </Button>
            )}
            <button
              className="mobile-filter-toggle"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              aria-expanded={showMobileFilters}
              aria-controls="transaction-filters"
            >
              <Filter size={18} aria-hidden="true" />
              <span>Filters</span>
              {activeFiltersCount > 0 && <span className="filter-badge">{activeFiltersCount}</span>}
              {showMobileFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>

        {showMobileFilters && (
          <div id="transaction-filters" className="transactions-filters transactions-filters--open">
            <div className="filters-group">
              <label className="filters__label" htmlFor="filter-status">
                Status
              </label>
              <Select
                label="Status"
                id="filter-status"
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
                options={[
                  { value: '', label: 'Any Status' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'failed', label: 'Failed' },
                ]}
                placeholder="Any Status"
              />
            </div>

            <div className="filters-group">
              <label className="filters__label" htmlFor="filter-date-from">
                Date From
              </label>
              <input
                id="filter-date-from"
                name="dateFrom"
                type="date"
                className="input"
                placeholder="From"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>

            <div className="filters-group">
              <label className="filters__label" htmlFor="filter-date-to">
                Date To
              </label>
              <input
                id="filter-date-to"
                name="dateTo"
                type="date"
                className="input"
                placeholder="To"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>

            {hasAnyFilters && (
              <Button variant="ghost" size="sm" onClick={() => setFilters({ status: '', dateFrom: '', dateTo: '' })}>
                <Filter size={16} /> Clear all
              </Button>
            )}
          </div>
        )}

        <section className="transaction-section" aria-labelledby="transactions-heading">
          <h2 id="transactions-heading" className="transaction-section__title">Transactions</h2>
          <p className="transaction-section__description">Your complete transaction history.</p>

          {loading ? (
            <div className="transactions-skeleton">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="transaction-skeleton">
                  <div className="skeleton skeleton--text" style={{ width: '30%', height: '16px' }} />
                  <div className="skeleton skeleton--text" style={{ width: '20%', height: '16px' }} />
                  <div className="skeleton skeleton--text" style={{ width: '15%', height: '16px' }} />
                  <div className="skeleton skeleton--text" style={{ width: '20%', height: '16px' }} />
                </div>
              ))}
            </div>
          ) : totalItems > 0 ? (
            <div className="transactions-table">
              <table>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.items.map((txn) => (
                    <tr key={txn.id}>
                      <td>
                        <div className="txn-datetime">
                          <span className="txn-datetime__date">{formatDate(txn.createdAt)}</span>
                          <span className="txn-datetime__time">{formatTime(txn.createdAt)}</span>
                        </div>
                      </td>
                      <td>
                        <span className="txn-service">{txn.description}</span>
                      </td>
                      <td className="txn-amount positive">
                        +{formatCurrency(txn.amount)}
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(txn.status)}`}>
                          {getStatusLabel(txn.status)}
                        </span>
                      </td>
                      <td>
                        <span className="txn-reference">{txn.reference}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="transaction-empty">
              <div className="transaction-empty__icon" aria-hidden="true">
                <Receipt size={48} />
              </div>
              <h3 className="transaction-empty__title">{hasAnyFilters ? 'No transactions match your filters' : 'No transactions yet'}</h3>
              <p className="transaction-empty__description">
                {hasAnyFilters
                  ? 'Try adjusting your filters to see more results.'
                  : 'Your transaction history will appear here once you make transactions.'}
              </p>
              {!hasAnyFilters && (
                <ButtonLink to="/wallet/fund" variant="primary" className="transaction-empty__action">
                  <Plus size={16} aria-hidden="true" />
                  Fund Your Wallet
                </ButtonLink>
              )}
            </div>
          )}
          {totalItems > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={paginated.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </section>
      </div>
    </main>
  )
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'completed': return 'status-badge--success'
    case 'pending': return 'status-badge--pending'
    case 'failed': return 'status-badge--error'
    default: return 'status-badge--neutral'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'completed': return 'Completed'
    case 'pending': return 'Pending'
    case 'failed': return 'Failed'
    default: return status
  }
}

export default WalletTransactions