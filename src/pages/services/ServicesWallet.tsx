import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CalendarDays, CircleAlert, RefreshCw, Search, Smartphone, WalletCards } from 'lucide-react'
import { formatVtuMoney, vtuService, type VTUOrder } from '../../services/vtuService'
import './ServicesWallet.css'

function orderStatusClass(status: VTUOrder['status']) {
  if (status === 'success') return 'is-success'
  if (status === 'failed' || status === 'refunded') return 'is-error'
  return 'is-pending'
}

export default function ServicesWallet() {
  const [balance, setBalance] = useState<number | null>(null)
  const [orders, setOrders] = useState<VTUOrder[]>([])
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [expandedReference, setExpandedReference] = useState<string | null>(null)

  const loadWallet = useCallback(async () => {
    setLoading(true)
    setError(false)
    const token = sessionStorage.getItem('oyoconnect_vtu_backend_token')
    setConnected(Boolean(token))
    if (!token) {
      setBalance(null)
      setOrders([])
      setLoading(false)
      return
    }

    try {
      const [wallet, history] = await Promise.all([vtuService.wallet(token), vtuService.history(token)])
      setBalance(wallet.balance)
      setOrders(history)
    } catch {
      setBalance(null)
      setOrders([])
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadWallet() }, [loadWallet])

  const filteredOrders = useMemo(() => {
    const searchTerm = query.trim().toLowerCase()
    return orders.filter(order => {
      const matchesSearch = !searchTerm || [order.reference, order.phoneNumber, order.planName || '', order.networkId, order.paymentMethod]
        .some(value => value.toLowerCase().includes(searchTerm))
      const matchesType = !type || order.type === type
      const matchesStatus = !status || order.status === status
      const timestamp = new Date(order.createdAt).getTime()
      const start = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null
      const end = dateTo ? new Date(`${dateTo}T23:59:59.999`).getTime() : null
      return matchesSearch && matchesType && matchesStatus && (!start || timestamp >= start) && (!end || timestamp <= end)
    })
  }, [dateFrom, dateTo, orders, query, status, type])

  const clearFilters = () => {
    setQuery('')
    setStatus('')
    setType('')
    setDateFrom('')
    setDateTo('')
  }

  return (
    <main className="services-wallet">
      <Link className="services-wallet__back" to="/services"><ArrowLeft size={16} /> Services home</Link>
      <header className="services-wallet__heading">
        <div>
          <span className="services-home__eyebrow">Account</span>
          <h1>Wallet</h1>
          <p>See the balance and service orders returned by your connected OyoConnect account.</p>
        </div>
        <button type="button" onClick={() => void loadWallet()} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'is-spinning' : ''} /> Refresh
        </button>
      </header>

      <section className="services-wallet__balance-card" aria-label="Wallet balance">
        <div className="services-wallet__balance-icon"><WalletCards size={21} /></div>
        <div className="services-wallet__balance-copy">
          <span>Available balance</span>
          {loading ? <strong className="services-wallet__balance-skeleton" aria-label="Loading balance" /> : <strong>{balance === null ? '—' : formatVtuMoney(balance)}</strong>}
          <small>{connected ? 'Balance from the connected wallet service' : 'Connect from Data or Airtime to load a live balance'}</small>
        </div>
        <div className="services-wallet__balance-actions">
          <Link to="/services/data">Buy data <ArrowRight size={15} /></Link>
          <Link to="/services/airtime">Buy airtime <ArrowRight size={15} /></Link>
        </div>
      </section>

      {!connected && !loading && (
        <section className="services-wallet__notice">
          <CircleAlert size={18} />
          <p>Connect your account on Data or Airtime to view your provider balance and orders here. The separate development wallet and its local demo values are not shown in Services.</p>
        </section>
      )}

      {error && (
        <section className="services-wallet__notice is-error" role="alert">
          <CircleAlert size={18} />
          <p>We couldn’t load wallet data from the existing service. Try refreshing or reconnect from Data or Airtime.</p>
        </section>
      )}

      <section className="services-wallet__history" aria-labelledby="services-wallet-history-title">
        <header className="services-wallet__history-heading">
          <div>
            <span className="services-home__section-kicker">Provider history</span>
            <h2 id="services-wallet-history-title">Recent data and airtime orders</h2>
            <p>Order records reported by the connected service. Receipts are shown only when supplied by that provider.</p>
          </div>
          <Link to="/services/transactions">Full order history <ArrowRight size={15} /></Link>
        </header>

        <div className="services-wallet__filters" aria-label="Filter service orders">
          <label className="services-wallet__search">
            <Search size={17} aria-hidden="true" />
            <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search phone, plan, network, or reference" aria-label="Search service orders" />
          </label>
          <label><span>Service</span><select value={type} onChange={event => setType(event.target.value)} aria-label="Filter by service"><option value="">All services</option><option value="data">Data</option><option value="airtime">Airtime</option></select></label>
          <label><span>Status</span><select value={status} onChange={event => setStatus(event.target.value)} aria-label="Filter by status"><option value="">All statuses</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="success">Successful</option><option value="failed">Failed</option><option value="refunded">Refunded</option></select></label>
          <label><span>From</span><span className="services-wallet__date"><CalendarDays size={15} aria-hidden="true" /><input type="date" value={dateFrom} onChange={event => setDateFrom(event.target.value)} aria-label="Start date" /></span></label>
          <label><span>To</span><span className="services-wallet__date"><CalendarDays size={15} aria-hidden="true" /><input type="date" value={dateTo} onChange={event => setDateTo(event.target.value)} aria-label="End date" /></span></label>
          <button className="services-wallet__clear" type="button" onClick={clearFilters}>Clear filters</button>
        </div>

        {loading ? (
          <div className="services-wallet__empty" role="status">Loading provider wallet activity…</div>
        ) : error ? null : !connected ? (
          <div className="services-wallet__empty">
            <Smartphone size={22} />
            <strong>Connect an account to view orders</strong>
            <span>Existing provider-confirmed data and airtime orders will appear here.</span>
          </div>
        ) : filteredOrders.length ? (
          <div className="services-wallet__orders">
            {filteredOrders.map(order => (
              <article className="services-wallet__order" key={order.reference}>
                <span className="services-wallet__order-icon"><Smartphone size={17} /></span>
                <div className="services-wallet__order-main">
                  <strong>{order.type === 'airtime' ? 'Airtime' : order.planName || 'Data bundle'} · {order.phoneNumber}</strong>
                  <small>{order.reference} · {new Date(order.createdAt).toLocaleString('en-NG')}</small>
                </div>
                <strong className="services-wallet__order-total">{formatVtuMoney(order.total)}</strong>
                <span className={`services-wallet__status ${orderStatusClass(order.status)}`}>{order.status}</span>
                <button className="services-wallet__details-button" type="button" aria-expanded={expandedReference === order.reference} onClick={() => setExpandedReference(value => value === order.reference ? null : order.reference)}>
                  {expandedReference === order.reference ? 'Hide details' : 'Details'}
                </button>
                {expandedReference === order.reference && (
                  <dl className="services-wallet__order-details">
                    <div><dt>Payment method</dt><dd>{order.paymentMethod === 'paystack' ? 'Card / Paystack' : 'OyoConnect wallet'}</dd></div>
                    <div><dt>Payment status</dt><dd>{order.paymentStatus}</dd></div>
                    {order.dataAmount && <div><dt>Data amount</dt><dd>{order.dataAmount}</dd></div>}
                    {order.validity && <div><dt>Validity</dt><dd>{order.validity}</dd></div>}
                    {order.failureReason && <div><dt>Provider response</dt><dd>{order.failureReason}</dd></div>}
                    {order.completedAt && <div><dt>Completed</dt><dd>{new Date(order.completedAt).toLocaleString('en-NG')}</dd></div>}
                  </dl>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="services-wallet__empty">
            <Smartphone size={22} />
            <strong>{orders.length ? 'No orders match these filters' : 'No provider orders found'}</strong>
            <span>{orders.length ? 'Adjust or clear your filters to see more activity.' : 'Completed and pending data or airtime orders will appear when returned by the provider.'}</span>
          </div>
        )}
      </section>
    </main>
  )
}
