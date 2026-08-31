import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, SearchX } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { EmptyState } from '../components/ui/EmptyState'
import { ButtonLink } from '../components/ui/Button'
import { transactionService } from '../services/transactionService'
import { formatCurrency } from '../utils/currency'
import type { Transaction, TransactionSummary, BillFilters } from '../types/bills'

const ITEMS_PER_PAGE = 20

function Transactions() {
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const filters: BillFilters = useMemo(() => ({
    sort: 'newest',
  }), [])

  const [results, setResults] = useState<Transaction[]>([])
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    setCurrentPage(1)
    const loadResults = async () => {
      setLoading(true)
      try {
        const result = await transactionService.getTransactions({ ...filters, page: currentPage, limit: ITEMS_PER_PAGE })
        setResults(result.transactions)
        setTotalItems(result.total)
      } catch {
        setResults([])
        setTotalItems(0)
      } finally {
        setLoading(false)
      }
    }
    loadResults()
  }, [currentPage, filters])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
      case 'success': return 'status-badge--success'
      case 'pending': return 'status-badge--pending'
      case 'processing': return 'status-badge--pending'
      case 'failed': return 'status-badge--error'
      case 'refunded': return 'status-badge--neutral'
      default: return 'status-badge--neutral'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Successful'
      case 'pending': return 'Pending'
      case 'processing': return 'Processing'
      case 'failed': return 'Failed'
      case 'refunded': return 'Refunded'
      default: return status
    }
  }

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="page-skeleton">
            <div className="skeleton skeleton--text skeleton--wide" style={{ maxWidth: '400px', margin: '0 auto 16px' }} />
            <div className="skeleton skeleton--text skeleton--mid" style={{ maxWidth: '300px', margin: '0 auto 16px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton skeleton--media" style={{ aspectRatio: '4/3', borderRadius: '12px' }} />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="container">
        <Link to="/wallet" className="back-link">
          <ArrowLeft size={16} /> Back to Wallet
        </Link>

        <SectionHeading
          eyebrow="Transaction History"
          title="All Transactions"
          subtitle="View and manage all your transactions across all services."
        />

        <div className="transactions-toolbar">
          <div className="transactions-info">
            <span className="results-count">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} results
            </span>
          </div>
        </div>

        <div className="transactions-container">
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Service</th>
                  <th>Provider</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map((txn) => (
                    <tr key={txn.id}>
                      <td>
                        <div className="txn-datetime">
                          <span>{formatDate(txn.createdAt)}</span>
                          <span>{formatTime(txn.createdAt)}</span>
                        </div>
                      </td>
                      <td>
                        <span className="txn-service">{txn.service}</span>
                      </td>
                      <td>{txn.provider}</td>
                      <td className="txn-amount">{formatCurrency(txn.amount)}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(txn.status)}`}>{getStatusLabel(txn.status)}</span>
                      </td>
                      <td className="txn-reference">
                        <code>{txn.reference}</code>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px 24px' }}>
                      <EmptyState
                        icon={<SearchX size={36} />}
                        title="No transactions yet"
                        description="Your transaction history will appear here once you start using services."
                        action={
                          <ButtonLink to="/services/data" variant="primary">
                            Explore Services
                          </ButtonLink>
                        }
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Transactions