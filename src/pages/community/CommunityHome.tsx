import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react'
import { communityCategories } from '../../data/communityCategories'
import { communityReportsService } from '../../services/communityReportsService'
import type { CommunityReportStats, CommunityCategory } from '../../types/community'
import { Button, ButtonLink, Card, Badge, Skeleton, SearchInput } from '../../components/ui'
import { SectionHeading } from '../../components/ui/SectionHeading'

const STAT_CARDS = [
  { key: 'totalReports', icon: MapPin, label: 'Total Reports', color: 'brand' },
  { key: 'reportsThisWeek', icon: Clock, label: 'This Week', color: 'info' },
  { key: 'verifiedReports', icon: Shield, label: 'Verified', color: 'success' },
  { key: 'resolvedReports', icon: CheckCircle, label: 'Resolved', color: 'warning' },
] as const

export function CommunityHome() {
  const [stats, setStats] = useState<CommunityReportStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [reports, setReports] = useState<CommunityCategory[]>([])
  const [reportsLoading, setReportsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await communityReportsService.getStats()
        setStats(data)
      } catch {
        setStats(null)
      } finally {
        setStatsLoading(false)
      }
    }
    loadStats()
  }, [])

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await communityReportsService.search({ limit: 6 })
        setReports(data)
      } catch {
        setReports([])
      } finally {
        setReportsLoading(false)
      }
    }
    loadReports()
  }, [])

  const filteredReports = useMemo(() => {
    if (!searchQuery) return reports
    const q = searchQuery.toLowerCase()
    return reports.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.location.lga.toLowerCase().includes(q) ||
        r.location.town.toLowerCase().includes(q)
    )
  }, [reports, searchQuery])

  const handleSearch = (value: string) => {
    if (value.trim()) {
      window.location.href = `/community?search=${encodeURIComponent(value.trim())}`
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="community-hero">
        <div className="community-hero__content">
          <div className="community-hero__badge">
            <AlertCircle size={16} aria-hidden="true" />
            <span>Stay informed about your neighborhood</span>
          </div>

          <h1 className="community-hero__title">Community Updates</h1>

          <p className="community-hero__description">
            Stay informed about what's happening in your neighborhood across Oyo State.
            Report issues, share updates, and help your community stay connected.
          </p>

          <div className="community-hero__actions">
            <ButtonLink to="/community/report" variant="primary" size="lg" className="community-hero__btn" fullWidth>
              <Plus size={20} aria-hidden="true" />
              Report an Issue
            </ButtonLink>
            <ButtonLink to="/community" variant="outline" size="lg" className="community-hero__btn" fullWidth>
              <Search size={20} aria-hidden="true" />
              Browse All Reports
            </ButtonLink>
          </div>

          <div className="community-hero__search">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search community reports..."
              ariaLabel="Search community reports"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="community-stats-section">
        <div className="container">
          <div className="community-stats" role="list" aria-label="Community statistics">
            {statsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} variant="skeleton" className="community-stat-skeleton">
                  <div />
                </Card>
              ))
            ) : (
              STAT_CARDS.map((stat) => {
                const Icon = stat.icon
                const value = stats ? String(stats[stat.key as keyof CommunityReportStats]).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '—'
                return (
                  <Card
                    key={stat.key}
                    variant="default"
                    padding="md"
                    className="community-stat-card"
                    role="listitem"
                  >
                    <div className="community-stat-card__icon">
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <div className="community-stat-card__content">
                      <div className="community-stat-card__value">{value}</div>
                      <div className="community-stat-card__label">{stat.label}</div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="community-section">
        <div className="container">
          <SectionHeading
            eyebrow="Report Categories"
            title="What's Happening Near You"
            subtitle="Select a category to view recent community reports"
            className="community-section__heading"
          />

          <div className="community-category-grid" role="list" aria-label="Report categories">
            {communityCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/community/${category.slug}`}
                className="community-category-card"
                role="listitem"
              >
                <span className="community-category-card__icon" aria-hidden="true" style={{ background: `${category.color}15`, color: category.color }}>
                  <category.icon size={24} />
                </span>
                <div className="community-category-card__content">
                  <span className="community-category-card__name">{category.name}</span>
                  <span className="community-category-card__desc">{category.description}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="community-section community-section--tinted">
        <div className="container">
          <SectionHeading
            eyebrow="Recent Activity"
            title="Latest Community Reports"
            subtitle="Recent updates from communities across Oyo State"
            className="community-section__heading"
          />

          {reportsLoading ? (
            <div className="community-report-skeleton-grid" role="status" aria-label="Loading reports">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} variant="skeleton" className="community-report-skeleton">
                  <div />
                </Card>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="community-empty-state" role="status">
              <div className="community-empty-state__icon" aria-hidden="true">
                <Search size={48} />
              </div>
              <h3 className="community-empty-state__title">
                {searchQuery ? 'No reports match your search' : 'No community reports yet'}
              </h3>
              <p className="community-empty-state__description">
                {searchQuery
                  ? 'Try a different search term or clear your filters.'
                  : 'Be the first person to report an issue in your area.'}
              </p>
              <ButtonLink to="/community/report" variant="primary" size="lg" className="community-empty-state__btn">
                <Plus size={18} aria-hidden="true" />
                Report an Issue
              </ButtonLink>
            </div>
          ) : (
            <>
              <div className="community-report-grid" role="list" aria-label="Latest community reports">
                {filteredReports.slice(0, 3).map((report) => (
                  <article key={report.id} className="community-report-card" role="listitem">
                    <div className="community-report-card__header">
                      <Badge
                        variant={report.status === 'urgent' ? 'error' : report.status === 'verified' ? 'success' : report.status === 'resolved' ? 'warning' : 'neutral'}
                        size="sm"
                        className="community-report-card__status"
                      >
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('-', ' ')}
                      </Badge>
                      <span className="community-report-card__time">
                        {new Date(report.createdAt).toLocaleDateString('en-NG', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h3 className="community-report-card__title">{report.title}</h3>
                    <p className="community-report-card__description">{report.description}</p>
                    <div className="community-report-card__meta">
                      <span className="community-report-card__location">
                        <MapPin size={14} aria-hidden="true" />
                        {report.location.town}, {report.location.lga}
                      </span>
                      {report.upvotes > 0 && (
                        <span className="community-report-card__upvotes">
                          <span aria-hidden="true">▲</span>
                          {report.upvotes}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/community/report/${report.id}`}
                      className="community-report-card__link"
                    >
                      View details <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                ))}
              </div>
              <div className="community-section__action">
                <ButtonLink to="/community" variant="outline" size="md">
                  View All Reports <Search size={16} aria-hidden="true" />
                </ButtonLink>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="community-section community-section--tinted">
        <div className="container">
          <Card variant="elevated" padding="lg" className="community-cta-card">
            <div className="community-cta-card__content">
              <h2 className="community-cta-card__title">See something? Say something.</h2>
              <p className="community-cta-card__description">
                Help keep your neighborhood safe and informed. Report issues like potholes,
                broken streetlights, waste dumping, and more.
              </p>
            </div>
            <ButtonLink to="/community/report" variant="primary" size="lg" className="community-cta-card__btn" fullWidth>
              <Plus size={20} aria-hidden="true" />
              Report an Issue Now
            </ButtonLink>
          </Card>
        </div>
      </section>
    </>
  )
}

export default CommunityHome