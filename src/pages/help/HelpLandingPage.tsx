import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, HeartHandshake, Flag, ShieldCheck } from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import type { SupportRequest, HelpCategoryType } from '../../types/help'
import { HELP_CATEGORIES, SUGGESTED_SUPPORT_AMOUNTS } from '../../types/help'
import {
  SupportCategoryCard,
  SupportRequestCard,
  LoadingState,
  ErrorState,
  HelpIcon,
  StatusBadge,
} from '../../components/help'
import { ButtonLink } from '../../components/ui/Button'
import { SearchInput } from '../../components/ui/SearchInput'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { helpService } from '../../services/helpService'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Posted' },
  { value: 'almost-funded', label: 'Closing Soon' },
  { value: 'most-supported', label: 'Most Supported' },
  { value: 'verified', label: 'Verified' },
  { value: 'urgent', label: 'Urgent' },
] as const

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Reviewed Before Publication',
    description:
      'Every request is reviewed before publication. Supporting information and request details are checked before approval.',
  },
  {
    icon: Flag,
    title: 'Community Reporting',
    description:
      'Users can report suspicious or misleading requests for review. Our team investigates every report promptly.',
  },
  {
    icon: HeartHandshake,
    title: 'Transparent Support',
    description:
      'Support amounts, fees, and transaction details are clearly explained before any contribution is made.',
  },
]

const HOW_IT_WORKS_STEPS = [
  {
    icon: 'graduation-cap',
    title: 'Request Help',
    description: 'Choose a category, share your story, and provide the required supporting information.',
  },
  {
    icon: 'shield-check',
    title: 'Review & Verification',
    description: 'Requests are reviewed before publication based on the platform verification process.',
  },
  {
    icon: 'heart',
    title: 'Community Support',
    description: 'Approved requests can receive support from members of the community.',
  },
  {
    icon: 'heart-handshake',
    title: 'Secure Completion',
    description: 'Support and payout processes follow the platform payment and verification rules.',
  },
]

export function HelpLandingPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<HelpCategoryType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<string>('recent')

  const loadRequests = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await helpService.getRecent(6)
      setRequests(data)
    } catch {
      setError('Failed to load support requests. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const filteredRequests = useMemo(() => {
    let result = [...requests]

    if (selectedCategory !== 'all') {
      result = result.filter((r) => r.category === selectedCategory)
    }

    if (searchQuery) {
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.fullStory.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return result
  }, [requests, searchQuery, selectedCategory])

  const handleCategoryClick = (categoryId: HelpCategoryType) => {
    setSelectedCategory(categoryId)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
  }

  return (
    <div className="help-page">
      <div className="help-page__container">
        <section className="help-hero section--padding">
          <div className="help-hero__content">
            <div className="help-hero__trust-indicator">
              <ShieldCheck size={16} aria-hidden="true" />
              <span>Requests reviewed before publication</span>
            </div>

            <h1 className="help-hero__title">OyoConnect Help</h1>

            <p className="help-hero__subtitle">
              Communities are stronger when we help each other. Connect with verified
              people in need across Oyo State and make a direct difference.
            </p>

            <div className="help-hero__actions">
              <ButtonLink to="/help/request" variant="primary" size="lg">
                <HelpIcon name="heart" size={20} aria-hidden="true" />
                Request Help
              </ButtonLink>
              <ButtonLink to="/help/requests" variant="secondary" size="lg">
                <HelpIcon name="users" size={20} aria-hidden="true" />
                Support Someone
              </ButtonLink>
            </div>
          </div>

          <div className="help-hero__stats">
            <Card variant="elevated" padding="md" className="help-stat-card">
              <div className="help-stat-card__icon">
                <HelpIcon name="alert-circle" size={24} aria-hidden="true" />
              </div>
              <div className="help-stat-card__value">—</div>
              <div className="help-stat-card__label">Active Requests</div>
            </Card>
            <Card variant="elevated" padding="md" className="help-stat-card">
              <div className="help-stat-card__icon">
                <HelpIcon name="heart" size={24} aria-hidden="true" />
              </div>
              <div className="help-stat-card__value">{formatCurrency(0, { compact: true, showDecimals: false })}</div>
              <div className="help-stat-card__label">Total Support Raised</div>
            </Card>
            <Card variant="elevated" padding="md" className="help-stat-card">
              <div className="help-stat-card__icon">
                <HelpIcon name="users" size={24} aria-hidden="true" />
              </div>
              <div className="help-stat-card__value">—</div>
              <div className="help-stat-card__label">Community Supporters</div>
            </Card>
            <Card variant="elevated" padding="md" className="help-stat-card">
              <div className="help-stat-card__icon">
                <HelpIcon name="shield-check" size={24} aria-hidden="true" />
              </div>
              <div className="help-stat-card__value">—</div>
              <div className="help-stat-card__label">Verified Requests</div>
            </Card>
          </div>
        </section>

        <section className="help-trust section--no-pad" aria-labelledby="trust-heading">
          <div className="help-trust-grid">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} variant="default" padding="md" className="help-trust-item">
                  <div className="help-trust-icon">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3 className="help-trust__title">{item.title}</h3>
                  <p className="help-trust__description">{item.description}</p>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="help-categories section" aria-labelledby="categories-heading">
          <header className="section-heading section-heading--center">
            <h2 id="categories-heading" className="section-heading__title">Ways to Help</h2>
            <p className="section-heading__subtitle">
              Choose a category that matters to you and support verified needs in your community.
            </p>
          </header>

          <div className="help-categories__grid" role="list" aria-label="Help categories">
            {HELP_CATEGORIES.map((category) => (
              <SupportCategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>

          <div className="section__action">
            <Link to="/help/requests" className="btn btn--outline btn--lg help-view-all">
              Browse All Requests <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="help-requests section--tinted" aria-labelledby="requests-heading">
          <div className="help-requests__header">
            <div>
              <h2 id="requests-heading" className="section-heading__title">Featured Support Requests</h2>
              <p className="section-heading__subtitle">
                Verified requests that currently need community support.
              </p>
            </div>

            <div className="help-requests__controls">
              <div className="help-requests__search-wrapper">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search support requests..."
                  ariaLabel="Search support requests"
                />
              </div>

              <div className="help-requests__filters">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="help-requests__sort-select"
                  aria-label="Sort requests"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="help-requests__grid" role="list" aria-label="Support requests">
              {[...Array(6)].map((_, i) => (
                <Card key={i} variant="skeleton" className="skeleton-card">
                  <Skeleton className="skeleton--media" />
                  <div className="card__body">
                    <Skeleton className="skeleton--text skeleton--wide" />
                    <Skeleton className="skeleton--text skeleton--mid" />
                    <Skeleton className="skeleton--text" />
                    <div className="card__actions">
                      <Skeleton className="skeleton--btn" />
                      <Skeleton className="skeleton--btn" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title="Unable to Load Requests"
              message={error}
              onRetry={loadRequests}
            />
          ) : filteredRequests.length === 0 ? (
            <div className="help-empty-state">
              <div className="help-empty-state__icon">
                <HelpIcon name="heart" size={48} aria-hidden="true" />
              </div>
              <h3 className="help-empty-state__title">No active support requests right now</h3>
              <p className="help-empty-state__description">
                New verified requests will appear here when available.
              </p>
              <div className="help-empty-state__actions">
                <Link to="/help/categories" className="btn btn--outline btn--lg">
                  Browse Categories
                </Link>
                <Link to="/help/request" className="btn btn--primary btn--lg">
                  Request Help
                </Link>
              </div>
            </div>
          ) : (
            <div className="help-requests__grid" role="list" aria-label="Support requests">
              {filteredRequests.slice(0, 6).map((request) => (
                <SupportRequestCard
                  key={request.id}
                  request={request}
                  onSupportClick={(req) => {
                    window.location.href = `/help/requests/${req.id}?support=true`
                  }}
                />
              ))}
            </div>
          )}

          {filteredRequests.length > 6 && (
            <div className="section__action">
              <Link to="/help/requests" className="btn btn--primary btn--lg">
                View All Requests <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          )}
        </section>

        <section className="help-how section" aria-labelledby="how-it-works-heading">
          <header className="section-heading section-heading--center">
            <h2 id="how-it-works-heading" className="section-heading__title">How It Works</h2>
            <p className="section-heading__subtitle">
              A clear process designed to help protect both requesters and supporters.
            </p>
          </header>

          <div className="help-steps" role="list">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <Card key={step.title} variant="default" padding="md" className="help-step" role="listitem">
                <div className="help-step__icon">
                  <span className="help-step__number">{index + 1}</span>
                </div>
                <h3 className="help-step__title">{step.title}</h3>
                <p className="help-step__description">{step.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="help-final-cta section--no-pad" aria-labelledby="cta-heading">
          <Card variant="elevated" padding="lg" className="help-final-cta__card">
            <div className="help-final-cta__content">
              <h2 id="cta-heading" className="help-final-cta__title">Ready to Make a Difference?</h2>
              <p className="help-final-cta__description">
                Explore verified support requests, contribute to a cause that matters to you,
                or submit a genuine request for review.
              </p>
            </div>
            <div className="help-final-cta__actions">
              <Link to="/help/requests" className="btn btn--primary btn--lg">
                Browse Requests <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/help/request" className="btn btn--outline btn--lg">
                Request Help
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default HelpLandingPage