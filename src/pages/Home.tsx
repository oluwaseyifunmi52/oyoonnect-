import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  Briefcase,
  MessageSquare,
  HeartHandshake,
  Search,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Wrench,
  Utensils,
  Sparkles,
  GraduationCap,
  Hammer,
  Shirt,
  Pill,
  Camera,
  Car,
  Home as HomeIcon,
  Stethoscope,
  Laptop,
  Truck,
  Scissors,
  Leaf,
  type LucideIcon,
} from 'lucide-react'
import { siteConfig } from '../config/site'
import { categories } from '../data/categories'
import { businessService } from '../services/businessService'
import { Button, ButtonLink, Card, Badge, Skeleton, SearchInput } from '../components/ui'
import type { Business } from '../types/business'

const QUICK_ACTIONS = [
  { id: 'jobs', label: 'Find Jobs', description: 'Browse opportunities', icon: Briefcase, href: '/jobs' },
  { id: 'report', label: 'Report Issue', description: 'Community reports', icon: MessageSquare, href: '/community/report' },
  { id: 'community', label: 'Community', description: 'Local updates', icon: MessageSquare, href: '/community' },
  { id: 'help', label: 'Request Help', description: 'Get support', icon: HeartHandshake, href: '/help/request' },
  { id: 'businesses', label: 'Businesses', description: 'Local services', icon: Building2, href: '/categories' },
  { id: 'marketplace', label: 'Marketplace', description: 'Buy & sell', icon: Truck, href: '/search' },
  { id: 'services', label: 'Post a Job', description: 'Hire talent', icon: Briefcase, href: '/jobs/post' },
  { id: 'services2', label: 'Find Services', description: 'Local experts', icon: Wrench, href: '/search' },
]

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  plumbing: Wrench,
  electrical: Sparkles,
  catering: Utensils,
  barbing: Scissors,
  makeup: Sparkles,
  'auto-wash': Car,
  carpentry: Hammer,
  'home-repair': HomeIcon,
  healthcare: Stethoscope,
  education: GraduationCap,
  tech: Laptop,
  logistics: Truck,
  cleaning: Leaf,
}

const POPULAR_CATEGORY_SLUGS = [
  'plumbing',
  'electrical',
  'catering',
  'barbing',
  'makeup',
  'auto-wash',
  'carpentry',
  'home-repair',
]

export function Home() {
  const [featured, setFeatured] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredData, counts] = await Promise.all([
          businessService.getFeatured(),
          businessService.getCategoryCounts(),
        ])
        setFeatured(featuredData)
        setCategoryCounts(counts)
      } catch {
        setFeatured([])
        setCategoryCounts({})
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const popularCategories = useMemo(() => {
    return POPULAR_CATEGORY_SLUGS
      .map((slug) => categories.find((c) => c.slug === slug))
      .filter((c): c is typeof categories[0] => c !== undefined)
  }, [])

  const handleSearch = (value: string) => {
    if (value.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(value.trim())}`
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero__content">
          <div className="home-hero__badge">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Trusted local directory for {siteConfig.state}</span>
          </div>

          <h1 className="home-hero__title">
            OyoConnect
          </h1>
          <p className="home-hero__subtitle">
            Oyo State, Nigeria
          </p>

          <p className="home-hero__description">
            Find trusted businesses, jobs, community updates, and support across all 33 LGAs in Oyo State.
          </p>

          <div className="home-hero__search">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search businesses, jobs, services..."
              ariaLabel="Search OyoConnect"
              autoFocus
            />
          </div>

          <div className="home-hero__quick-actions" role="list" aria-label="Quick actions">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.id}
                to={action.href}
                className="home-action-card"
                role="listitem"
              >
                <span className="home-action-card__icon" aria-hidden="true">
                  <action.icon size={24} />
                </span>
                <div className="home-action-card__content">
                  <span className="home-action-card__title">{action.label}</span>
                  <span className="home-action-card__desc">{action.description}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="home-section">
        <div className="container">
          <header className="home-section__header">
            <div>
              <span className="home-section__eyebrow">Browse by category</span>
              <h2 className="home-section__title">Popular categories</h2>
            </div>
            <Link to="/categories" className="home-section__link">
              View all <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </header>

          <div className="home-category-grid" role="list" aria-label="Popular categories">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} variant="skeleton" className="home-category-skeleton">
                  <div />
                </Card>
              ))
            ) : popularCategories.map((category) => {
              const Icon = CATEGORY_ICONS[category.icon] ?? Sparkles
              const count = categoryCounts[category.name] ?? 0
              return (
                <Link
                  key={category.id}
                  to={`/search?category=${category.slug}`}
                  className="home-category-card"
                  role="listitem"
                >
                  <span className="home-category-card__icon" aria-hidden="true">
                    <Icon size={24} />
                  </span>
                  <div className="home-category-card__content">
                    <span className="home-category-card__name">{category.name}</span>
                    {count > 0 && (
                      <span className="home-category-card__meta">
                        {count} {count === 1 ? 'business' : 'businesses'}
                      </span>
                    )}
                  </div>
                  <ArrowRight size={18} className="home-category-card__arrow" aria-hidden="true" />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="home-section home-section--tinted">
        <div className="container">
          <header className="home-section__header">
            <div>
              <span className="home-section__eyebrow">Hand-picked</span>
              <h2 className="home-section__title">Featured businesses</h2>
              <p className="home-section__subtitle">Trusted, top-rated providers our community keeps coming back to.</p>
            </div>
          </header>

          {loading ? (
            <div className="home-business-skeleton-grid" role="status" aria-label="Loading featured businesses">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} variant="skeleton" className="home-business-skeleton">
                  <div />
                </Card>
              ))}
            </div>
          ) : featured.length === 0 ? (
            <Card variant="elevated" padding="lg" className="home-empty-state">
              <div className="home-empty-state__icon" aria-hidden="true">
                <Building2 size={48} />
              </div>
              <h3 className="home-empty-state__title">Be one of our first featured businesses</h3>
              <p className="home-empty-state__description">
                Get your business in front of thousands of customers across Oyo State.
                List your business today and unlock the featured spotlight.
              </p>
              <ButtonLink to="/business/register" variant="primary" size="lg" className="home-empty-state__btn">
                List your business
              </ButtonLink>
            </Card>
          ) : (
            <>
              <div className="home-business-grid" role="list" aria-label="Featured businesses">
                {featured.slice(0, 3).map((business) => (
                  <article key={business.id} className="home-business-card" role="listitem">
                    <div className="home-business-card__media">
                      {business.image ? (
                        <img
                          src={business.image}
                          alt=""
                          loading="lazy"
                          className="home-business-card__image"
                        />
                      ) : (
                        <div className="home-business-card__placeholder" aria-hidden="true">
                          <Building2 size={32} />
                        </div>
                      )}
                      {business.verified && (
                        <Badge variant="success" size="sm" className="home-business-card__badge">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="home-business-card__content">
                      <div className="home-business-card__header">
                        <h3 className="home-business-card__name">{business.name}</h3>
                        {business.rating && (
                          <div className="home-business-card__rating" aria-label={`Rated ${business.rating} out of 5`}>
                            <span aria-hidden="true">★</span>
                            <span>{business.rating.toFixed(1)}</span>
                            <span className="home-business-card__reviews">({business.reviewCount ?? 0})</span>
                          </div>
                        )}
                      </div>
                      <p className="home-business-card__category">{business.category}</p>
                      <p className="home-business-card__location">
                        <MapPin size={14} aria-hidden="true" />
                        {business.location}, {business.state}
                      </p>
                      <div className="home-business-card__actions">
                        <ButtonLink
                          to={`/business/${business.id}`}
                          variant="primary"
                          size="sm"
                          className="home-business-card__btn"
                        >
                          View Business
                        </ButtonLink>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="home-section__action">
                <ButtonLink to="/search" variant="outline" size="md">
                  Explore all businesses <ArrowRight size={16} aria-hidden="true" />
                </ButtonLink>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="home-section">
        <div className="container">
          <header className="home-section__header">
            <span className="home-section__eyebrow">Simple by design</span>
            <h2 className="home-section__title">How OyoConnect works</h2>
            <p className="home-section__subtitle">Three easy steps from search to service.</p>
          </header>

          <div className="home-steps" role="list">
            {[
              {
                icon: Search,
                title: 'Search',
                description: 'Search by service or category and narrow results by location across Oyo State.',
              },
              {
                icon: ShieldCheck,
                title: 'Compare',
                description: 'Review ratings, verified badges, services and opening hours side by side.',
              },
              {
                icon: MessageSquare,
                title: 'Contact',
                description: 'Reach providers instantly by call or WhatsApp.',
              },
            ].map((step, index) => (
              <Card key={step.title} variant="default" padding="md" className="home-step" role="listitem">
                <div className="home-step__icon" aria-hidden="true">
                  <step.icon size={26} />
                </div>
                <h3 className="home-step__title">{step.title}</h3>
                <p className="home-step__description">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="home-section home-section--tinted">
        <div className="container">
          <div className="home-stats" role="list" aria-label="Platform statistics">
            <div className="home-stat" role="listitem">
              <Building2 size={28} className="home-stat__icon" aria-hidden="true" />
              <div className="home-stat__value">10,000+</div>
              <div className="home-stat__label">Businesses & services</div>
            </div>
            <div className="home-stat" role="listitem">
              <ShieldCheck size={28} className="home-stat__icon" aria-hidden="true" />
              <div className="home-stat__value">Verified</div>
              <div className="home-stat__label">Business discovery</div>
            </div>
            <div className="home-stat" role="listitem">
              <MapPin size={28} className="home-stat__icon" aria-hidden="true" />
              <div className="home-stat__value">33</div>
              <div className="home-stat__label">LGAs across Oyo State</div>
            </div>
            <div className="home-stat" role="listitem">
              <HeartHandshake size={28} className="home-stat__icon" aria-hidden="true" />
              <div className="home-stat__value">Active</div>
              <div className="home-stat__label">Community support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-section home-section--tinted">
        <div className="container">
          <Card variant="elevated" padding="lg" className="home-cta-card">
            <div className="home-cta-card__content">
              <h2 className="home-cta-card__title">Ready to get started?</h2>
              <p className="home-cta-card__description">
                Join thousands of users finding trusted businesses, jobs, and community support across Oyo State.
              </p>
            </div>
            <div className="home-cta-card__actions">
              <ButtonLink to="/business/register" variant="primary" size="lg">
                List Your Business <ArrowRight size={18} aria-hidden="true" />
              </ButtonLink>
              <ButtonLink to="/jobs/post" variant="outline" size="lg">
                Post a Job
              </ButtonLink>
            </div>
          </Card>
        </div>
      </section>
    </>
  )
}

export default Home