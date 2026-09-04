import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, HeartHandshake, Flag, ShieldCheck, Users, AlertCircle } from 'lucide-react'
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
import { Button, ButtonLink, Card, Badge, Skeleton, SearchInput } from '../../components/ui'
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
    <>
      {/* Hero Section */}
      <section className="help-hero">
        <div className="help-hero__content">
          <div className="help-hero__badge">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Requests reviewed before publication</span>
          </div>

          <h1 className="help-hero__title">OyoConnect Help</h1>

          <p className="help-hero__description">
            Connect with verified people in need across Oyo State and make a direct difference.
          </p>

          <div className="help-hero__actions">
            <ButtonLink to="/help/request" variant="primary" size="lg" className="help-hero__btn" fullWidth>
              <HelpIcon name="heart" size={20} aria-hidden="true" />
              Request Help
            </ButtonLink>
            <ButtonLink to="/help/requests" variant="secondary" size="lg" className="help-hero__btn" fullWidth>
              <HelpIcon name="users" size={20} aria-hidden="true" />
              Support Someone
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="help-section">
        <div className="container">
          <div className="help-trust-grid" role="list" aria-label="Trust indicators">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} variant="default" padding="md" className="help-trust-card" role="listitem">
                  <div className="help-trust-card__icon">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3 className="help-trust-card__title">{item.title}</h3>
                  <p className="help-trust-card__description">{item.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="help-section help-section--tinted">
        <div className="container">
          <header className="help-section__header">
            <div>
              <span className="help-section__eyebrow">Ways to Help</span>
              <h2 className="help-section__title">Choose a category</h2>
              <p className="help-section__subtitle">
                Choose a category that matters to you and support verified needs in your community.
              </p>
            </div>
          </header>

          <div className="help-categories-grid" role="list" aria-label="Help categories">
            {HELP_CATEGORIES.map((category) => (
              <SupportCategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>

          <div className="help-section__action">
            <Link to="/help/requests" className="help-view-all-link">
              Browse All Requests <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Requests */}
      <section className="help-section">
        <div className="container">
          <header className="help-section__header">
            <div>
              <h2 className="help-section__title">Featured Support Requests</h2>
              <p className="help-section__subtitle">
                Verified requests that currently need community support.
              </p>
            </div>
            <Link to="/help/requests" className="help-section__link">
              View all <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </header>

          <div className="help-requests-toolbar">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search support requests..."
              ariaLabel="Search support requests"
            />

            <select
              value={sortBy}
              onChange={handleSortChange}
              className="help-sort-select"
              aria-label="Sort requests"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="help-requests-grid" role="list" aria-label="Support requests">
              {[...Array(6)].map((_, i) => (
                <Card key={i} variant="skeleton" className="help-request-skeleton">
                  <div />
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
            <>
              <div className="help-requests-grid" role="list" aria-label="Support requests">
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

              {filteredRequests.length > 6 && (
                <div className="help-section__action">
                  <ButtonLink to="/help/requests" variant="primary" size="lg">
                    View All Requests <ArrowRight size={18} aria-hidden="true" />
                  </ButtonLink>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="help-section help-section--tinted">
        <div className="container">
          <header className="help-section__header">
            <div>
              <span className="help-section__eyebrow">How It Works</span>
              <h2 className="help-section__title">A clear, safe process</h2>
              <p className="help-section__subtitle">
                Designed to help protect both requesters and supporters.
              </p>
            </div>
          </header>

          <div className="help-steps" role="list">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <Card key={step.title} variant="default" padding="md" className="help-step" role="listitem">
                <div className="help-step__number">{index + 1}</div>
                <h3 className="help-step__title">{step.title}</h3>
                <p className="help-step__description">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="help-section help-section--tinted">
        <div className="container">
          <Card variant="elevated" padding="lg" className="help-cta-card">
            <div className="help-cta-card__content">
              <h2 className="help-cta-card__title">Ready to Make a Difference?</h2>
              <p className="help-cta-card__description">
                Explore verified support requests, contribute to a cause that matters to you,
                or submit a genuine request for review.
              </p>
            </div>
            <div className="help-cta-card__actions">
              <ButtonLink to="/help/requests" variant="primary" size="lg">
                Browse Requests <ArrowRight size={18} aria-hidden="true" />
              </ButtonLink>
              <ButtonLink to="/help/request" variant="outline" size="lg">
                Request Help
              </ButtonLink>
            </div>
          </Card>
        </div>
      </section>
    </>
  )
}

export default HelpLandingPage