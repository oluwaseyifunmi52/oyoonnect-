import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, Filter, ChevronDown, ChevronUp, CheckCircle2, Clock, XCircle, User, Mail } from 'lucide-react'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { EmptyState } from '../../components/ui/EmptyState'
import { ButtonLink, Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Input'
import { Pagination } from '../../components/common/Pagination'
import { affiliateService } from '../../services/affiliateService'
import { formatCurrency } from '../../utils/currency'
import type { Referral, AffiliateStats } from '../../types/bills'

const ITEMS_PER_PAGE = 20

function Referrals() {
  const [referrals, setReferrals] = useState<Referral[]>([])
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
    const loadReferrals = async () => {
      setLoading(true)
      try {
        const result = await affiliateService.getReferrals({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          // status: filters.status,
        })
        setReferrals(result.referrals)
        // setStats removed - API doesn't return stats
      } catch {
        setReferrals([])
      } finally {
        setLoading(false)
      }
    }
    loadReferrals()
  }, [currentPage])

  const paginated = useMemo(() => {
    // In a real app, this would be handled by the API
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return {
      items: referrals.slice(0, ITEMS_PER_PAGE),
      totalPages: Math.ceil(referrals.length / ITEMS_PER_PAGE),
    }
  }, [referrals, currentPage])

  const updateFilters = (newFilters: Record<string, string | boolean | undefined>) => {
    // Update filters
  }

  const clearAllFilters = () => {
    // Clear filters
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'successful': return 'status-badge--success'
      case 'pending': return 'status-badge--pending'
      case 'expired': return 'status-badge--error'
      default: return 'status-badge--neutral'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'successful': return 'Successful'
      case 'pending': return 'Pending'
      case 'expired': return 'Expired'
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

  return (
    <main className="page">
      <div className="container">
        <Link to="/affiliate" className="back-link">
          <ArrowLeft size={16} /> Back to Affiliate Dashboard
        </Link>

        <div className="referrals-header">
          <SectionHeading
            eyebrow="Share & Earn"
            title="My Referrals"
            subtitle="Track all your referrals and their status."
          />
        </div>

        <div className="referrals-toolbar">
          <div className="referrals-filters">
            <div className="filters-group">
              <label className="filters__label" htmlFor="filter-status">
                Status
              </label>
              <Select
                label="Status"
                id="filter-status"
                value={filters.status ?? ''}
                onChange={(value) => updateFilters({ status: value || undefined })}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'successful', label: 'Successful' },
                  { value: 'expired', label: 'Expired' },
                ]}
                placeholder="All statuses"
              />
            </div>

            <div className="filters__group">
              <label className="filters__label" htmlFor="filter-date-from">
                Date From
              </label>
              <input
                id="filter-date-from"
                name="dateFrom"
                type="date"
                className="input"
                value=""
                onChange={(event) => updateFilters({ dateFrom: event.target.value || undefined })}
              />
            </div>

            <div className="filters__group">
              <label className="filters__label" htmlFor="filter-date-to">
                Date To
              </label>
              <input
                id="filter-date-to"
                name="dateTo"
                type="date"
                className="input"
                value=""
                onChange={(event) => updateFilters({ dateTo: event.target.value || undefined })}
              />
            </div>

            <div className="filters__group filters__group--inline">
              <input
                id="filter-verified"
                type="checkbox"
                className="filters__checkbox"
                checked={false}
                onChange={(event) => updateFilters({ verified: event.target.checked })}
              />
              <label className="filters__label filters__label--check" htmlFor="filter-verified">
                Verified only
              </label>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Referrals