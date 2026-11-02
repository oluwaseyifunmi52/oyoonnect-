import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, CircleAlert, RefreshCw, Search, Smartphone, WalletCards } from 'lucide-react'
import { formatVtuMoney, vtuService, type VTUOrder } from '../../services/vtuService'
import './ServicesHome.css'

function statusClass(status: VTUOrder['status']) {
  if (status === 'success') return 'is-success'
  if (status === 'failed' || status === 'refunded') return 'is-error'
  return 'is-pending'
}

export default function ServicesTransactions() {
  const [orders, setOrders] = useState<VTUOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError(false)
    const token = sessionStorage.getItem('oyoconnect_vtu_backend_token')
    setConnected(Boolean(token))
    if (!token) {
      setOrders([])
      setLoading(false)
      return
    }
    try {
      setOrders(await vtuService.history(token))
    } catch {
      setOrders([])
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadOrders() }, [loadOrders])

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesQuery = !normalizedQuery || [
        order.reference,
        order.phoneNumber,
        order.planName || '',
        order.type,
        order.networkId,
      ].some(value => value.toLowerCase().includes(normalizedQuery))
      const matchesStatus = !status || order.status === status
      const createdAt = new Date(order.createdAt).getTime()
      const start = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null
      const end = dateTo ? new Date(`${dateTo}T23:59:59.999`).getTime() : null
      return matchesQuery && matchesStatus && (!start || createdAt >= start) && (!end || createdAt <= end)
    })
  }, [dateFrom, dateTo, orders, query, status])

  const clearFilters = () => {
    setQuery('')
    setStatus('')
    setDateFrom('')
    setDateTo('')
  }

  return (
    <main className="services-history">
      <Link className="services-history__back" to="/services"><ArrowLeft size={16} /> Services home</Link>
      <header className="services-history__header">
        <div>
          <span className="services-home__eyebrow">Account activity</span>
          <h1>Data and airtime orders</h1>
          <p>Review provider orders and their latest reported status.</p>
        </div>
        <div className="services-history__header-actions">
          <Link to="/services/wallet"><WalletCards size={16} /> Wallet</Link>
          <button type="button" onClick={() => void loadOrders()} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'is-spinning' : ''} /> Refresh
          </button>
        </div>
      </header>

      <section className="services-history__filters" aria-label="Filter orders">
        <label className="services-history__search">
          <Search size={17} aria-hidden="true" />
          <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search phone number, plan, or reference" aria-label="Search orders" />
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={event => setStatus(event.target.value)} aria-label="Filter by status">
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </label>
        <label>
          <span>From</span>
          <span className="services-history__date"><CalendarDays size={15} aria-hidden="true" /><input type="date" value={dateFrom} onChange={event => setDateFrom(event.target.value)} aria-label="Start date" /></span>
        </label>
        <label>
          <span>To</span>
          <span className="services-history__date"><CalendarDays size={15} aria-hidden="true" /><input type="date" value={dateTo} onChange={event => setDateTo(event.target.value)} aria-label="End date" /></span>
        </label>
        <button className="services-history__clear" type="button" onClick={clearFilters}>Clear filters</button>
      </section>

      <section className="services-history__results" aria-live="polite">
        <div className="services-history__results-heading">
          <h2>Recent orders</h2>
          {!loading && <span>{filteredOrders.length} shown · up to 50 from provider history</span>}
        </div>
        {loading ? (
          <div className="services-history__empty" role="status">Loading provider orders…</div>
        ) : error ? (
          <div className="services-history__empty services-history__empty--error" role="alert">
            <CircleAlert size={20} /> We couldn’t load order history. Try refreshing, or reconnect your account from Data or Airtime.
          </div>
        ) : !connected ? (
          <div className="services-history__empty">
            <Smartphone size={22} />
            <strong>Connect your account to see order history</strong>
            <span>Connect from Data or Airtime. Your orders are returned by the existing provider history endpoint.</span>
            <div><Link to="/services/data">Open data</Link><Link to="/services/airtime">Open airtime</Link></div>
          </div>
        ) : filteredOrders.length ? (
          <div className="services-history__list">
            {filteredOrders.map(order => (
              <article className="services-history__row" key={order.reference}>
                <span className="services-history__order-icon"><Smartphone size={17} /></span>
                <div className="services-history__order-name">
                  <strong>{order.type === 'airtime' ? 'Airtime' : order.planName || 'Data bundle'} · {order.phoneNumber}</strong>
                  <small>{order.reference} · {new Date(order.createdAt).toLocaleString('en-NG')}</small>
                </div>
                <strong className="services-history__amount">{formatVtuMoney(order.total)}</strong>
                <span className={`services-history__status ${statusClass(order.status)}`}>{order.status}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="services-history__empty">
            <Smartphone size={22} />
            <strong>{orders.length ? 'No orders match these filters' : 'No orders found'}</strong>
            <span>{orders.length ? 'Clear or adjust the filters to see more results.' : 'Provider-confirmed data and airtime orders will appear here.'}</span>
          </div>
        )}
      </section>
    </main>
  )
}
