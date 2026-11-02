import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, CreditCard, Eye, EyeOff, LoaderCircle, ShieldCheck, Smartphone, Wifi, X } from 'lucide-react'
import { formatVtuMoney, VTUNetwork, VTUOrder, VTUPlan, VTUPricing, vtuService } from '../services/vtuService'
import './VTUPurchase.css'
import './services/ServicesHome.css'

type Product = 'airtime' | 'data'
const TOKEN_KEY = 'oyoconnect_vtu_backend_token'
const REFRESH_KEY = 'oyoconnect_vtu_backend_refresh'

function getIdempotencyKey() {
  return `vtu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 15)}`
}

export default function VTUPurchase({ type }: { type: Product }) {
  const [searchParams] = useSearchParams()
  const [networks, setNetworks] = useState<VTUNetwork[]>([])
  const [plans, setPlans] = useState<VTUPlan[]>([])
  const [networkId, setNetworkId] = useState('')
  const [planId, setPlanId] = useState('')
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<'wallet' | 'paystack'>('wallet')
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [pricing, setPricing] = useState<VTUPricing>({ customerFeeKobo: 0 })
  const [history, setHistory] = useState<VTUOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const purchaseModalRef = useRef<HTMLElement | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const selectedPlan = useMemo(() => plans.find(plan => plan.id === planId), [plans, planId])
  const amountKobo = type === 'data' ? selectedPlan?.priceKobo || 0 : Number(amount || 0) * 100

  const refreshAccountData = useCallback(async (activeToken: string) => {
    try {
      const [wallet, orders] = await Promise.all([vtuService.wallet(activeToken), vtuService.history(activeToken)])
      setWalletBalance(wallet.balance)
      setHistory(orders)
      return true
    } catch (e) {
      setWalletBalance(null)
      setHistory([])
      if (e instanceof Error && /token|auth|unauthorized/i.test(e.message)) {
        sessionStorage.removeItem(TOKEN_KEY)
        sessionStorage.removeItem(REFRESH_KEY)
        setToken('')
      }
      setError(e instanceof Error ? e.message : 'Could not load account balance.')
      return false
    }
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true); setError('')
    vtuService.networks(type).then(items => { if (active) setNetworks(items) })
      .catch(e => { if (active) setError(e instanceof Error ? e.message : 'Could not load mobile networks.') })
      .finally(() => { if (active) setLoading(false) })
    setNetworkId(''); setPlans([]); setPlanId('')
    return () => { active = false }
  }, [type])

  useEffect(() => { vtuService.pricing().then(setPricing).catch(() => {}) }, [])

  useEffect(() => {
    if (!networkId || type !== 'data') { setPlans([]); setPlanId(''); return }
    let active = true
    vtuService.plans(networkId).then(items => { if (active) setPlans(items) })
      .catch(e => { if (active) setError(e instanceof Error ? e.message : 'Could not load data plans.') })
    return () => { active = false }
  }, [type, networkId])

  useEffect(() => { if (token) void refreshAccountData(token) }, [token, refreshAccountData])

  useEffect(() => {
    if (!confirmationOpen) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const modal = purchaseModalRef.current
    const focusable = modal?.querySelectorAll<HTMLElement>('button:not(:disabled)')
    focusable?.[0]?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setConfirmationOpen(false)
        return
      }
      if (event.key !== 'Tab' || !focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [confirmationOpen])

  useEffect(() => {
    if (!token || !history.some(order => ['pending', 'processing'].includes(order.status))) return
    const timer = window.setInterval(async () => {
      await Promise.all(history.filter(order => ['pending', 'processing'].includes(order.status)).map(order => vtuService.order(token, order.reference, true).catch(() => null)))
      await refreshAccountData(token)
    }, 15000)
    return () => window.clearInterval(timer)
  }, [token, history, refreshAccountData])

  useEffect(() => {
    const reference = searchParams.get('reference')
    if (!reference || !token) return
    let active = true
    setNotice('Verifying payment and recharge status…')
    vtuService.order(token, reference, true).then(order => {
      if (!active) return
      setNotice(order.status === 'success' ? `Payment and recharge complete (${order.reference}).` : `Payment check complete. Order status: ${order.status}. Reference ${order.reference}.`)
      void refreshAccountData(token)
    }).catch(e => { if (active) setError(e instanceof Error ? e.message : 'We could not verify the payment yet. Check transaction history shortly.') })
    return () => { active = false }
  }, [searchParams, token, refreshAccountData])

  const connectAccount = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setNotice(''); setBusy(true)
    try {
      const result = await vtuService.login(email.trim(), password)
      sessionStorage.setItem(TOKEN_KEY, result.accessToken)
      sessionStorage.setItem(REFRESH_KEY, result.refreshToken)
      setToken(result.accessToken); setPassword(''); setPasswordVisible(false)
      setNotice('Connected to the shared OyoConnect account for this browser tab.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Account sign-in failed.') }
    finally { setBusy(false) }
  }

  const purchase = (event: FormEvent) => {
    event.preventDefault(); setError(''); setNotice('')
    if (!token) { setError('Connect your OyoConnect account before you purchase.'); return }
    if (!/^0\d{10}$/.test(phone.replace(/[\s-]/g, ''))) { setError('Enter a valid 11-digit Nigerian phone number.'); return }
    if (type === 'airtime' && (!Number.isInteger(Number(amount)) || Number(amount) < 100 || Number(amount) > 100000)) { setError('Enter an airtime amount from ₦100 to ₦100,000.'); return }
    if (type === 'data' && !selectedPlan) { setError('Choose a data plan.'); return }
    setConfirmationOpen(true)
  }

  const confirmPurchase = async () => {
    setConfirmationOpen(false)
    setBusy(true)
    try {
      const order = await vtuService.purchase(token, { type, networkId, phoneNumber: phone.replace(/[\s-]/g, ''), paymentMethod: method, amountNaira: type === 'airtime' ? Number(amount) : undefined, planId: type === 'data' ? planId : undefined, idempotencyKey: getIdempotencyKey() })
      if (order.paymentUrl) {
        sessionStorage.setItem(TOKEN_KEY, token)
        window.location.assign(order.paymentUrl)
        return
      }
      setNotice(`${order.status === 'success' ? 'Purchase complete' : `Purchase ${order.status}`} · Reference ${order.reference}`)
      await refreshAccountData(token)
    } catch (e) { setError(e instanceof Error ? e.message : 'Purchase could not be completed.') }
    finally { setBusy(false) }
  }

  const disconnect = () => { sessionStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(REFRESH_KEY); setToken(''); setWalletBalance(null); setHistory([]); setNotice('Backend account disconnected from this tab.') }
  const selectedNetwork = networks.find(network => network.id === networkId)
  const label = type === 'airtime' ? 'Airtime' : 'Mobile data'
  const Icon = type === 'airtime' ? Smartphone : Wifi

  return (
    <main className="vtu-page services-purchase">
      <Link className="services-purchase__back" to="/services"><ArrowLeft size={16} /> Services home</Link>
      <header className="services-purchase__heading">
        <span className="services-purchase__heading-icon"><Icon size={23} /></span>
        <div>
          <span className="services-home__eyebrow">Connected service</span>
          <h1>Buy {label.toLowerCase()}</h1>
          <p>Choose a supported network and review the provider price before continuing.</p>
        </div>
        <span className="services-purchase__secure"><ShieldCheck size={16} /> Provider checkout</span>
      </header>

      {!token ? (
        <section className="services-purchase__account services-purchase__account--connect">
          <div>
            <h2>Connect your OyoConnect account</h2>
            <p>Purchases use the existing OyoConnect account and wallet. Your password is sent to the OyoConnect API and is not saved in the browser.</p>
          </div>
          <form onSubmit={connectAccount}>
            <label htmlFor="vtu-email">Email address</label>
            <input id="vtu-email" autoComplete="username" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <label htmlFor="vtu-password">Password</label>
            <div className="services-purchase__password-field">
              <input id="vtu-password" autoComplete="current-password" type={passwordVisible ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" aria-label={passwordVisible ? 'Hide password' : 'Show password'} onClick={() => setPasswordVisible(value => !value)}>
                {passwordVisible ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
              </button>
            </div>
            <button className="services-purchase__primary" disabled={busy}>{busy ? 'Connecting…' : 'Connect account'}</button>
          </form>
        </section>
      ) : (
        <section className="services-purchase__account">
          <div><span>Connected account wallet balance</span><strong>{walletBalance === null ? '—' : formatVtuMoney(walletBalance)}</strong></div>
          <button type="button" onClick={disconnect}>Disconnect this tab</button>
        </section>
      )}

      <form className="services-purchase__form" onSubmit={purchase}>
        <section className="services-purchase__card">
          <div className="services-purchase__card-heading">
            <div><span className="services-home__section-kicker">Purchase details</span><h2>{label}</h2></div>
            <span>Network and price data come from the connected provider.</span>
          </div>

          <div className="services-purchase__fields">
            <div className="services-purchase__field">
              <label htmlFor="vtu-network">Mobile network</label>
              <select id="vtu-network" value={networkId} onChange={e => { setNetworkId(e.target.value); setPlanId('') }} required>
                <option value="">{loading ? 'Loading networks…' : 'Select network'}</option>
                {networks.map(network => <option key={network.id} value={network.id}>{network.name}</option>)}
              </select>
            </div>
            <div className="services-purchase__field">
              <label htmlFor="vtu-phone">Phone number</label>
              <input id="vtu-phone" inputMode="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08012345678" maxLength={13} required />
              <small>Enter the 11-digit Nigerian mobile number to receive the {label.toLowerCase()}.</small>
            </div>

            {type === 'airtime' ? (
              <div className="services-purchase__field services-purchase__field--wide">
                <label htmlFor="vtu-amount">Airtime amount</label>
                <input id="vtu-amount" inputMode="numeric" type="number" min="100" max="100000" step="1" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount in naira" required />
                <div className="services-purchase__amount-shortcuts" aria-label="Quick amount selection">
                  {[100, 200, 500, 1000, 2000, 5000].map(value => (
                    <button type="button" key={value} onClick={() => setAmount(String(value))} aria-pressed={amount === String(value)}>
                      ₦{value.toLocaleString('en-NG')}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <fieldset className="services-purchase__plans services-purchase__field--wide">
                <legend>Choose a data plan</legend>
                {plans.length ? (
                  <div className="services-purchase__plan-grid">
                    {plans.map(plan => (
                      <button
                        type="button"
                        key={plan.id}
                        className={`services-purchase__plan${planId === plan.id ? ' is-selected' : ''}`}
                        aria-pressed={planId === plan.id}
                        onClick={() => setPlanId(plan.id)}
                      >
                        <span>{plan.dataAmount || plan.name}</span>
                        <small>{plan.validity}</small>
                        <strong>{formatVtuMoney(plan.priceKobo)}</strong>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="services-purchase__plans-empty">{networkId ? 'No plans are available for this network right now.' : 'Select a network to load available plans.'}</p>
                )}
              </fieldset>
            )}

            <div className="services-purchase__field services-purchase__field--wide">
              <label htmlFor="vtu-payment">Payment method</label>
              <select id="vtu-payment" value={method} onChange={e => setMethod(e.target.value as 'wallet' | 'paystack')}>
                <option value="wallet">OyoConnect wallet</option>
                <option value="paystack">Card / Paystack</option>
              </select>
            </div>
          </div>
          {error && <p className="services-purchase__message is-error" role="alert"><CircleAlert size={17} /> {error}</p>}
          {notice && <p className="services-purchase__message is-success" role="status"><CheckCircle2 size={17} /> {notice}</p>}
        </section>

        <aside className="services-purchase__summary">
          <div className="services-purchase__summary-heading"><span>Order summary</span><CreditCardIcon /></div>
          <div className="services-purchase__summary-product">
            <span>{selectedNetwork?.name || 'Select a network'}</span>
            <strong>{type === 'data' ? selectedPlan?.name || 'Choose a plan' : amount ? `₦${Number(amount).toLocaleString('en-NG')}` : 'Enter an amount'}</strong>
          </div>
          <div className="services-purchase__summary-line"><span>Service amount</span><strong>{amountKobo ? formatVtuMoney(amountKobo) : '—'}</strong></div>
          {amountKobo > 0 && pricing.customerFeeKobo > 0 && <div className="services-purchase__summary-line"><span>Service fee</span><strong>{formatVtuMoney(pricing.customerFeeKobo)}</strong></div>}
          <div className="services-purchase__summary-total"><span>Total charge</span><strong>{amountKobo ? formatVtuMoney(amountKobo + pricing.customerFeeKobo) : '—'}</strong></div>
          <button className="services-purchase__primary" disabled={busy || !token || loading}>
            {busy ? <><LoaderCircle className="vtu-spin" size={17} /> Processing…</> : <>Continue securely <ArrowRight size={17} /></>}
          </button>
          <p>Provider timeouts are checked before a retry. If an order is pending, review its status in the order history first.</p>
        </aside>
      </form>

      {confirmationOpen && (
        <div className="services-purchase__modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setConfirmationOpen(false) }}>
          <section ref={purchaseModalRef} className="services-purchase__modal" role="dialog" aria-modal="true" aria-labelledby="vtu-confirm-title">
            <button className="services-purchase__modal-close" type="button" aria-label="Close purchase review" onClick={() => setConfirmationOpen(false)}><X size={18} /></button>
            <span className="services-purchase__modal-icon"><ShieldCheck size={21} /></span>
            <span className="services-home__section-kicker">Review before payment</span>
            <h2 id="vtu-confirm-title">Confirm {label.toLowerCase()} purchase</h2>
            <p className="services-purchase__modal-copy">Check the beneficiary and order details before continuing to the existing payment flow.</p>
            <dl className="services-purchase__modal-details">
              <div><dt>Network</dt><dd>{selectedNetwork?.name || '—'}</dd></div>
              <div><dt>Phone number</dt><dd>{phone.replace(/[\s-]/g, '') || '—'}</dd></div>
              {type === 'data' && <div><dt>Plan</dt><dd>{selectedPlan?.name || '—'}{selectedPlan?.validity ? ` · ${selectedPlan.validity}` : ''}</dd></div>}
              <div><dt>Payment method</dt><dd>{method === 'wallet' ? 'OyoConnect wallet' : 'Card / Paystack'}</dd></div>
              <div className="is-total"><dt>Total payable</dt><dd>{amountKobo ? formatVtuMoney(amountKobo + pricing.customerFeeKobo) : '—'}</dd></div>
            </dl>
            <div className="services-purchase__modal-actions">
              <button type="button" className="services-purchase__modal-cancel" onClick={() => setConfirmationOpen(false)}>Back to edit</button>
              <button type="button" className="services-purchase__primary" disabled={busy} onClick={() => void confirmPurchase()}>
                {busy ? 'Processing…' : <>Confirm and continue <ArrowRight size={16} /></>}
              </button>
            </div>
          </section>
        </div>
      )}

      <section className="services-purchase__history">
        <div className="services-purchase__card-heading">
          <div><span className="services-home__section-kicker">Order history</span><h2>Recent data and airtime orders</h2></div>
          <span>Latest 50 orders</span>
        </div>
        {!token ? (
          <p className="services-purchase__history-empty">Connect your account to view your order history.</p>
        ) : history.length ? (
          <div className="services-purchase__history-list">
            {history.map(order => (
              <article className="services-purchase__history-row" key={order.reference}>
                <span className="services-purchase__history-icon"><Icon size={17} /></span>
                <div><strong>{order.type === 'airtime' ? 'Airtime' : order.planName || 'Data'} · {order.phoneNumber}</strong><small>{order.reference} · {new Date(order.createdAt).toLocaleString('en-NG')}</small></div>
                <strong>{formatVtuMoney(order.total)}</strong>
                <span className={`services-purchase__history-status vtu-status-${order.status}`}>{order.status}</span>
              </article>
            ))}
          </div>
        ) : (
          <p className="services-purchase__history-empty">No purchases are available for this connected account.</p>
        )}
      </section>
    </main>
  )
}

function CreditCardIcon() {
  return <CreditCard size={18} aria-hidden="true" />
}
