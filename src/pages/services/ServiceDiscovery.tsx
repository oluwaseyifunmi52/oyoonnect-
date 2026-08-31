import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Tag, ArrowRight, Megaphone } from 'lucide-react'
import { categories } from '../../data/categories'
import { Card, CardBody } from '../../components/ui/Card'
import { ButtonLink } from '../../components/ui/Button'
import { SearchInput } from '../../components/ui/SearchInput'
import { EmptyState } from '../../components/ui/EmptyState'

export default function ServiceDiscovery() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.description?.toLowerCase().includes(q) ?? false),
    )
  }, [query])

  return (
    <main className="page services-page">
      <header className="services-hero">
        <h1 className="services-hero__title">Find trusted services in Oyo State</h1>
        <p className="services-hero__subtitle">Browse by category or search for the help you need.</p>
        <div className="services-hero__search">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search services — plumbing, solar, catering…"
            ariaLabel="Search services"
          />
        </div>
        <div className="services-hero__cta">
          <ButtonLink to="/services/request" variant="primary">Request a service <ArrowRight size={16} /></ButtonLink>
          <ButtonLink to="/my-requests" variant="ghost">My requests</ButtonLink>
        </div>
      </header>

      <section className="services-section">
        <h2 className="services-section__title">Categories</h2>
        {filtered.length === 0 ? (
          <EmptyState icon={<Tag size={28} />} title="No matching categories" description="Try a different search term." />
        ) : (
          <div className="services-grid">
            {filtered.map((c) => (
              <Link key={c.id} to={`/services/request?category=${c.slug}`} className="service-card">
                <span className="service-card__icon"><Tag size={18} /></span>
                <span className="service-card__name">{c.name}</span>
                {c.description && <span className="service-card__desc">{c.description}</span>}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="services-section">
        <Card variant="elevated">
          <CardBody className="services-promo">
            <Megaphone size={20} />
            <div>
              <h3>Are you a skilled professional?</h3>
              <p>Offer your services and get discovered by customers near you.</p>
            </div>
            <ButtonLink to="/provider/onboarding" variant="secondary" size="sm">Become a provider</ButtonLink>
          </CardBody>
        </Card>
      </section>
    </main>
  )
}
