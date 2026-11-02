import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  CreditCard,
  Gamepad2,
  GraduationCap,
  KeyRound,
  Lightbulb,
  Monitor,
  Search,
  Share2,
  Smartphone,
  Tag,
  Tv,
  UserRound,
  WalletCards,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { categories } from '../../data/categories'
import { EmptyState } from '../../components/ui/EmptyState'
import { SearchInput } from '../../components/ui/SearchInput'
import { ButtonLink } from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { formatVtuMoney, vtuService, type VTUOrder } from '../../services/vtuService'
import './ServicesHome.css'

type ServiceLink = {
  label: string
  description: string
  path: string
  icon: LucideIcon
  availability: 'available' | 'account' | 'unavailable'
}

const serviceLinks: ServiceLink[] = [
  { label: 'Data bundles', description: 'Browse network plans and validity options.', path: '/services/data', icon: Wifi, availability: 'available' },
  { label: 'Airtime', description: 'Recharge any supported Nigerian network.', path: '/services/airtime', icon: Smartphone, availability: 'available' },
  { label: 'Electricity', description: 'Electricity payments are not connected yet.', path: '/services/electricity', icon: Zap, availability: 'unavailable' },
  { label: 'TV subscriptions', description: 'TV packages are not connected yet.', path: '/services/tv', icon: Tv, availability: 'unavailable' },
  { label: 'Education', description: 'Education products are not connected yet.', path: '/services/education', icon: GraduationCap, availability: 'unavailable' },
  { label: 'Recharge PIN', description: 'Recharge PIN orders are not connected yet.', path: '/services/recharge-pin', icon: KeyRound, availability: 'unavailable' },
  { label: 'Digital products', description: 'Digital product orders are not connected yet.', path: '/services/digital-products', icon: Monitor, availability: 'unavailable' },
  { label: 'Games', description: 'Game credits and gift cards are not connected yet.', path: '/services/games', icon: Gamepad2, availability: 'unavailable' },
  { label: 'Social media', description: 'Social media orders are not connected yet.', path: '/services/social-media', icon: Share2, availability: 'unavailable' },
  { label: 'Wallet', description: 'Open your OyoConnect wallet and account activity.', path: '/services/wallet', icon: WalletCards, availability: 'account' },
  { label: 'Profile', description: 'Manage your account details and preferences.', path: '/services/profile', icon: UserRound, availability: 'account' },
]

function orderLabel(order: VTUOrder) {
  return order.type === 'airtime' ? 'Airtime' : order.planName || 'Data bundle'
}

function orderStatusClass(status: VTUOrder['status']) {
  if (status === 'success') return 'is-success'
  if (status === 'failed' || status === 'refunded') return 'is-error'
  return 'is-pending'
}

export default function ServiceDiscovery() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [accountLoading, setAccountLoading] = useState(true)
  const [accountError, setAccountError] = useState(false)
  const [balanceKobo, setBalanceKobo] = useState<number | null>(null)
  const [orders, setOrders] = useState<VTUOrder[]>([])

  useEffect(() => {
    let active = true
    const token = sessionStorage.getItem('oyoconnect_vtu_backend_token')
    if (!token) {
      setAccountLoading(false)
      return () => { active = false }
    }

    Promise.all([vtuService.wallet(token), vtuService.history(token)])
      .then(([wallet, history]) => {
        if (!active) return
        setBalanceKobo(wallet.balance)
        setOrders(history)
        setAccountError(false)
      })
      .catch(() => {
        if (!active) return
        setBalanceKobo(null)
        setOrders([])
        setAccountError(true)
      })
      .finally(() => { if (active) setAccountLoading(false) })

    return () => { active = false }
  }, [])

  const normalizedQuery = query.trim().toLowerCase()
  const filteredServices = useMemo(() => {
    if (!normalizedQuery) return serviceLinks
    return serviceLinks.filter((service) =>
      `${service.label} ${service.description}`.toLowerCase().includes(normalizedQuery),
    )
  }, [normalizedQuery])
  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) return categories
    return categories.filter((category) =>
      `${category.name} ${category.description || ''}`.toLowerCase().includes(normalizedQuery),
    )
  }, [normalizedQuery])

  const firstName = user?.name?.trim().split(/\s+/)[0]

  return (
    <main className="services-home">
      <header className="services-home__intro">
        <div>
          <span className="services-home__eyebrow">OyoConnect Services</span>
          <h1>{firstName ? `Good to see you, ${firstName}` : 'Services for everyday needs'}</h1>
          <p>Pay for supported services and find trusted professionals across Oyo State.</p>
        </div>
        <div className="services-home__search">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search services or local professionals"
            ariaLabel="Search services and professional categories"
          />
        </div>
      </header>

      <section className="services-home__summary-grid" aria-label="Wallet and payment information">
        <article className="services-home__wallet-card">
          <div className="services-home__wallet-copy">
            <span className="services-home__wallet-label"><WalletCards size={17} /> OyoConnect wallet</span>
            <strong aria-live="polite">
              {accountLoading ? 'Loading balance…' : balanceKobo === null ? '—' : formatVtuMoney(balanceKobo)}
            </strong>
            <span className="services-home__wallet-note">
              {accountError
                ? 'Reconnect your account on Data or Airtime to refresh wallet details.'
                : balanceKobo === null
                  ? 'Connect your account on Data or Airtime to view your live balance.'
                  : 'Balance returned by your OyoConnect account.'}
            </span>
          </div>
          <div className="services-home__wallet-actions">
            <Link to="/services/wallet" className="services-home__wallet-primary">Open wallet <ArrowRight size={16} /></Link>
            <Link to="/services/transactions" className="services-home__wallet-secondary">Transaction history</Link>
          </div>
        </article>

        <aside className="services-home__payment-note">
          <span className="services-home__note-icon"><CreditCard size={20} /></span>
          <div>
            <h2>Payments you can verify</h2>
            <p>Data and airtime orders use the connected provider. Check your order history if a payment is still pending before retrying.</p>
          </div>
        </aside>
      </section>

      <section className="services-home__section" aria-labelledby="services-home-quick-title">
        <div className="services-home__section-heading">
          <div>
            <span className="services-home__section-kicker">Start here</span>
            <h2 id="services-home-quick-title">Quick actions</h2>
          </div>
          <Link to="/services/transactions">View activity <ArrowRight size={15} /></Link>
        </div>
        <div className="services-home__quick-grid">
          {[
            serviceLinks[0],
            serviceLinks[1],
            serviceLinks[2],
            serviceLinks[3],
            serviceLinks[4],
            serviceLinks[7],
          ].map((service) => {
            const Icon = service.icon
            return (
              <Link to={service.path} className="services-home__quick-card" key={service.path}>
                <span className="services-home__quick-icon"><Icon size={21} /></span>
                <span className="services-home__quick-label">{service.label}</span>
                <ArrowRight className="services-home__quick-arrow" size={16} />
              </Link>
            )
          })}
        </div>
      </section>

      <section className="services-home__section" aria-labelledby="services-home-all-title">
        <div className="services-home__section-heading">
          <div>
            <span className="services-home__section-kicker">Explore</span>
            <h2 id="services-home-all-title">Services</h2>
          </div>
          <span className="services-home__muted-count">{filteredServices.length} options</span>
        </div>
        {filteredServices.length ? (
          <div className="services-home__service-grid">
            {filteredServices.map((service) => {
              const Icon = service.icon
              const availabilityLabel = service.availability === 'available'
                ? 'Available'
                : service.availability === 'account' ? 'Account' : 'Not connected'
              return (
                <Link to={service.path} className="services-home__service-card" key={service.path}>
                  <span className="services-home__service-icon"><Icon size={21} /></span>
                  <span className={`services-home__availability services-home__availability--${service.availability}`}>
                    {service.availability === 'available' ? <CheckCircle2 size={13} /> : null}
                    {availabilityLabel}
                  </span>
                  <strong>{service.label}</strong>
                  <span className="services-home__service-description">{service.description}</span>
                  <span className="services-home__service-link">Open service <ArrowRight size={15} /></span>
                </Link>
              )
            })}
          </div>
        ) : (
          <EmptyState icon={<Search size={24} />} title="No matching services" description="Try a different search term." />
        )}
      </section>

      <section className="services-home__activity-and-help" aria-label="Recent orders and professional services">
        <article className="services-home__activity-card">
          <div className="services-home__section-heading">
            <div>
              <span className="services-home__section-kicker">Account activity</span>
              <h2>Recent data and airtime orders</h2>
            </div>
            <Link to="/services/transactions" aria-label="View transaction history"><ArrowRight size={17} /></Link>
          </div>
          {accountLoading ? (
            <div className="services-home__activity-empty" role="status">Loading recent orders…</div>
          ) : accountError ? (
            <div className="services-home__activity-empty">
              <Clock3 size={19} />
              <span>Recent orders could not be loaded. Reconnect on Data or Airtime to try again.</span>
            </div>
          ) : balanceKobo === null ? (
            <div className="services-home__activity-empty">
              <Clock3 size={19} />
              <span>Connect your account from Data or Airtime to see recent purchases here.</span>
            </div>
          ) : orders.length ? (
            <div className="services-home__orders">
              {orders.slice(0, 4).map((order) => (
                <div className="services-home__order" key={order.reference}>
                  <span className="services-home__order-icon"><Smartphone size={17} /></span>
                  <span className="services-home__order-info">
                    <strong>{orderLabel(order)}</strong>
                    <small>{order.reference} · {new Date(order.createdAt).toLocaleDateString('en-NG')}</small>
                  </span>
                  <span className="services-home__order-total">{formatVtuMoney(order.total)}</span>
                  <span className={`services-home__order-status ${orderStatusClass(order.status)}`}>{order.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="services-home__activity-empty">
              <Clock3 size={19} />
              <span>No data or airtime orders are available for this connected account yet.</span>
            </div>
          )}
        </article>

        <aside className="services-home__provider-card">
          <span className="services-home__provider-icon"><BriefcaseBusiness size={21} /></span>
          <span className="services-home__section-kicker">Local professionals</span>
          <h2>Find trusted services nearby</h2>
          <p>Browse providers by category or request help from professionals in Oyo State.</p>
          <ButtonLink to="/provider/onboarding" variant="secondary" size="sm">Offer your services <ArrowRight size={15} /></ButtonLink>
        </aside>
      </section>

      <section className="services-home__section services-home__local" aria-labelledby="services-home-local-title">
        <div className="services-home__section-heading">
          <div>
            <span className="services-home__section-kicker">Oyo State marketplace</span>
            <h2 id="services-home-local-title">Browse professional categories</h2>
          </div>
          <Link to="/services/request">Request a service <ArrowRight size={15} /></Link>
        </div>
        {filteredCategories.length ? (
          <div className="services-home__category-grid">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                to={`/services/request?category=${category.slug}`}
                className="services-home__category-card"
              >
                <span className="services-home__category-icon"><Tag size={18} /></span>
                <span><strong>{category.name}</strong><small>{category.description}</small></span>
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon={<Search size={24} />} title="No matching categories" description="Try a different search term." />
        )}
      </section>

      <section className="services-home__help-note" aria-label="Help and support">
        <span><Lightbulb size={19} aria-hidden="true" /></span>
        <p>Only Data and Airtime currently use a connected purchase provider. Other purchase pages will show when a provider is configured.</p>
        <Link to="/community/help">Get help <ArrowRight size={15} /></Link>
      </section>
    </main>
  )
}
