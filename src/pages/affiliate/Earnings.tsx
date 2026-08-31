import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Filter, ChevronDown, ChevronUp, DollarSign, TrendingUp, Clock, CheckCircle2, FileText, X } from 'lucide-react'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { EmptyState } from '../../components/ui/EmptyState'
import { ButtonLink } from '../../components/ui/Button'
import { Select } from '../../components/ui/Input'
import { Pagination } from '../../components/common/Pagination'
import { affiliateService } from '../../services/affiliateService'
import { formatCurrency } from '../../utils/currency'
import type { CommissionHistory, AffiliateStats } from '../../types/bills'

const ITEMS_PER_PAGE = 20

function Earnings() {
  const [commissions, setCommissions] = useState<CommissionHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [stats, setStats] = useState<AffiliateStats | null>(null)

  const filters = {
    status: '',
    dateFrom: '',
    dateTo: '',
  }

  useEffect(() => {
    setCurrentPage(1)
    const loadCommissions = async () => {
      setLoading(true)
      try {
        const result = await affiliateService.getCommissionHistory({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          // status: filters.status,
        })
        setCommissions(result.commissions)
      } catch {
        setCommissions([])
      } finally {
        setLoading(false)
      }
    }
    loadCommissions()
  }, [currentPage])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return {
      items: [],
      totalPages: 0,
    }
  }, [currentPage])

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    // Update filters
  }

  const clearAllFilters = () => {
    // Clear filters
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid': return 'status-badge--success'
      case 'approved': return 'status-badge--success'
      case 'pending': return 'status-badge--pending'
      default: return 'status-badge--neutral'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid'
      case 'approved': return 'Approved'
      case 'pending': return 'Pending'
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

  return (
    <main className="page">
      <div className="container">
        <Link to="/affiliate" className="back-link">
          <ArrowLeft size={16} /> Back to Affiliate Dashboard
        </Link>

        <div className="earnings-header">
          <SectionHeading
            eyebrow="Share & Earn"
            title="Commission Earnings"
            subtitle="Track all your commission earnings and payouts."
          />
        </div>

        <div className="earnings-toolbar">
          <div className="earnings-filters">
            <div className="filters-group">
              <label className="filters__label" htmlFor="filter-status">Status</label>
              <Select
                label="Status"
                id="filter-status"
                value={filters.status ?? ''}
                onChange={(value) => updateFilters({ status: value || undefined })}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'paid', label: 'Paid' },
                ]}
                placeholder="All statuses"
              />
            </div>

            <div className="filters-group">
              <label className="filters__label" htmlFor="filter-date-from">
                From Date
              </label>
              <input
                id="filter-date-from"
                name="dateFrom"
                type="date"
                className="input"
                value=""
                onChange={() => {}}
                placeholder="From"
              />
            </div>

            <div className="filters-group">
              <label className="filters__label" htmlFor="filter-date-to">
                To Date
              </label>
              <input
                id="filter-date-to"
                name="dateTo"
                type="date"
                className="input"
                value=""
                onChange={() => {}}
                placeholder="To"
              />
            </div>
          </div>

          <div className="filters-actions">
            <ButtonLink to="/affiliate" variant="outline" size="sm" onClick={clearAllFilters}>
              <X size={16} /> Clear all
            </ButtonLink>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Earnings