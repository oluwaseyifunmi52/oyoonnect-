import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Filter, ChevronDown, ChevronUp, DollarSign, TrendingUp, Clock, CheckCircle2, FileText, AlertCircle, Ban, CreditCard, AlertTriangle, Plus, Eye, SearchX } from 'lucide-react'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { EmptyState } from '../../components/ui/EmptyState'
import { ButtonLink, Button } from '../../components/ui/Button'
import { Select, Input } from '../../components/ui/Input'
import { Modal } from '../../components/common/Modal'
import { affiliateService } from '../../services/affiliateService'
import { formatCurrency } from '../../utils/currency'
import { validateAmount } from '../../utils/validation'
import { combineValidations } from '../../utils/validation'
import { validateRequired } from '../../utils/validation'
import type { Withdrawal, AffiliateStats } from '../../types/bills'

const ITEMS_PER_PAGE = 20

function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingWithdrawal, setDeletingWithdrawal] = useState<Withdrawal | null>(null)
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [stats, setStats] = useState<AffiliateStats | null>(null)

  useEffect(() => {
    setCurrentPage(1)
    const loadWithdrawals = async () => {
      setLoading(true)
      try {
        const result = await affiliateService.getWithdrawals({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          // status: filters.status,
        })
        setWithdrawals(result.withdrawals)
        // setStats removed - API doesn't return stats
      } catch {
        setWithdrawals([])
      } finally {
        setLoading(false)
      }
    }
    loadWithdrawals()
  }, [currentPage])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return {
      items: [],
      totalPages: 0,
    }
  }, [currentPage])

  const activeFiltersCount = useMemo(() => {
    const count = 0
    return count
  }, [])

  const updateFilters = (newFilters: Record<string, string | boolean | undefined>) => {
    // Update filters
  }

  const clearAllFilters = () => {
    // Clear filters
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed': return 'status-badge--success'
      case 'pending': return 'status-badge--pending'
      case 'processing': return 'status-badge--warning'
      case 'rejected': return 'status-badge--error'
      default: return 'status-badge--neutral'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'pending': return 'Pending'
      case 'processing': return 'Processing'
      case 'rejected': return 'Rejected'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const ITEMS_PER_PAGE = 20

  const validateForm = (): boolean => {
    const results = combineValidations(
      validateAmount(withdrawalForm.amount, 1000, 10000000),
      validateRequired(withdrawalForm.bankName, 'bankName'),
      validateRequired(withdrawalForm.accountNumber, 'accountNumber'),
      validateRequired(withdrawalForm.accountName, 'accountName')
    )
    setFormErrors(results.errors)
    return results.isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const result = await affiliateService.requestWithdrawal({
        amount: parseFloat(withdrawalForm.amount),
        bankName: withdrawalForm.bankName,
        accountNumber: withdrawalForm.accountNumber,
        accountName: withdrawalForm.accountName,
      })
      if (result.success) {
        setWithdrawalForm({ amount: '', bankName: '', accountNumber: '', accountName: '' })
        setFormErrors({})
        alert('Withdrawal request submitted successfully')
      } else {
        alert(result.message || 'Failed to submit withdrawal request')
      }
    } catch {
      alert('Failed to submit withdrawal request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page">
      <div className="container">
        <Link to="/affiliate" className="back-link">
          <ArrowLeft size={16} /> Back to Affiliate Dashboard
        </Link>

        <div className="withdrawals-header">
          <SectionHeading
            eyebrow="Share & Earn"
            title="Withdrawals"
            subtitle="Request withdrawals from your available commission balance."
          />
        </div>

        <div className="withdrawals-toolbar">
          <div className="withdrawals-toolbar__info">
            <span className="results-count">
              {withdrawals.length > 0
                ? `Showing ${((currentPage - 1) * ITEMS_PER_PAGE) + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, 0)} of ${0} withdrawals`
                : 'No withdrawals found'}
            </span>
          </div>

          <div className="withdrawals-toolbar__actions">
            <ButtonLink to="/affiliate/withdrawals/new" variant="primary" size="sm">
              <Plus size={18} /> New Withdrawal
            </ButtonLink>
          </div>
        </div>

        <div className="withdrawals-container">
          {withdrawals.length > 0 ? (
            <div className="withdrawals-table">
              <table>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Amount</th>
                    <th>Bank</th>
                    <th>Account</th>
                    <th>Status</th>
                    <th>Requested</th>
                    <th>Processed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id}>
                      <td><span className="txn-reference">{withdrawal.reference}</span></td>
                      <td>{formatCurrency(withdrawal.amount)}</td>
                      <td>{withdrawal.bankName}</td>
                      <td>{withdrawal.accountNumber}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(withdrawal.status)}`}>
                          {getStatusLabel(withdrawal.status)}
                        </span>
                      </td>
                      <td>{formatDate(withdrawal.createdAt)}</td>
                      <td>{withdrawal.processedAt ? formatDate(withdrawal.processedAt) : '—'}</td>
                      <td>
                        <div className="table-actions">
                          <Link to={`/affiliate/withdrawals/${withdrawal.id}`} className="action-btn" title="View">
                            <Eye size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={<SearchX size={36} />}
              title="No withdrawals found"
              description="You haven't requested any withdrawals yet."
              action={
                <ButtonLink to="/affiliate/withdrawals/new" variant="primary">
                  Request Withdrawal
                </ButtonLink>
              }
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default Withdrawals