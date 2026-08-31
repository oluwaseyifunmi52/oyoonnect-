import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Copy, Check, AlertCircle, Loader2, Wifi, Smartphone, Zap, Tv, GraduationCap, Key, Monitor, Gamepad2, Share2, CreditCard, Plus, ArrowRight, History, Settings, Bell, User, ChevronDown } from 'lucide-react'
import { useAuth } from '@context/AuthContext'
import { walletService } from '@services/walletService'
import { formatCurrency } from '@utils/currency'
import type { Wallet, WalletTransaction, Transaction } from '@/types/bills'

const services = [
  { id: 'data', label: 'Data', icon: Wifi, path: '/services/data', color: '#0066CC', description: 'Buy data bundles' },
  { id: 'airtime', label: 'Airtime', icon: Smartphone, path: '/services/airtime', color: '#009933', description: 'Recharge airtime' },
  { id: 'electricity', label: 'Electricity', icon: Zap, path: '/services/electricity', color: '#FF9900', description: 'Pay electricity bills' },
  { id: 'tv', label: 'TV', icon: Tv, path: '/services/tv', color: '#E60000', description: 'TV subscriptions' },
  { id: 'education', label: 'Education', icon: GraduationCap, path: '/services/education', color: '#663399', description: 'Exam pins & fees' },
  { id: 'recharge-pin', label: 'Recharge PIN', icon: Key, path: '/services/recharge-pin', color: '#FF6600', description: 'Buy recharge cards' },
  { id: 'social-media', label: 'Social Media', icon: Share2, path: '/services/social-media', color: '#E4405F', description: 'Social media services' },
  { id: 'digital-products', label: 'Digital Products', icon: Monitor, path: '/services/digital-products', color: '#0066CC', description: 'Premium apps & software' },
  { id: 'games', label: 'Games', icon: Gamepad2, path: '/services/games', color: '#663399', description: 'Game cards & credits' },
]

export function ServicesDashboard() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [walletLoading, setWalletLoading] = useState(true)
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [walletError, setWalletError] = useState<string | null>(null)
  const [showBalance, setShowBalance] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoading) return

    if (isAuthenticated) {
      loadWallet()
      loadTransactions()
    } else {
      setWalletLoading(false)
      setWallet(null)
      setWalletError(null)
    }
  }, [isAuthenticated, authLoading])

  const loadWallet = async () => {
    setWalletLoading(true)
    setWalletError(null)
    try {
      const walletData = await walletService.getWallet()
      setWallet(walletData)
    } catch (err) {
      console.error('Failed to load wallet:', err)
      setWallet(null)
      setWalletError(err instanceof Error ? err.message : 'Couldn\'t load your wallet — try refreshing')
    } finally {
      setWalletLoading(false)
    }
  }

  const loadTransactions = async () => {
    setTransactionsLoading(true)
    try {
      const response = await walletService.getTransactions()
      setTransactions(response.transactions.slice(0, 10))
    } catch (err) {
      console.error('Failed to load transactions:', err)
      setTransactions([])
    } finally {
      setTransactionsLoading(false)
    }
  }

  const handleServiceClick = (path: string) => {
    navigate(path)
  }

  const handleFundWallet = () => {
    navigate('/services/wallet/fund')
  }

  const formatAccountNumber = (accountNumber: string) => {
    return accountNumber.replace(/(\d{4})(\d{4})(\d{2})/, '$1 $2 $3')
  }

  const handleCopyAccount = async (accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = accountNumber
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatBalance = (balance: number) => {
    return formatCurrency(balance)
  }

  const getStatusBadge = (status: Transaction['status']) => {
    const styles: Record<string, string> = {
      success: 'status--success',
      failed: 'status--failed',
      pending: 'status--pending',
    }
    return styles[status] || ''
  }

  if (authLoading) {
    return (
      <section className="services-dashboard" aria-labelledby="services-dashboard-title">
        <div className="container">
          <div className="services-dashboard__skeleton">
            <div className="services-dashboard__skeleton-header">
              <div className="skeleton skeleton--text" style={{ width: '180px', height: '20px' }} />
              <div className="skeleton skeleton--text" style={{ width: '100px', height: '20px' }} />
            </div>
            <div className="skeleton skeleton--text skeleton--mid" style={{ marginTop: '16px' }} />
            <div className="skeleton skeleton--text" style={{ marginTop: '16px', width: '200px' }} />
            <div className="services-dashboard__skeleton-grid" style={{ marginTop: '24px' }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="skeleton skeleton--media" style={{ aspectRatio: '1', borderRadius: '12px' }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="services-dashboard" aria-labelledby="services-dashboard-title">
      <div className="container">
        <header className="services-dashboard__header">
          <div className="services-dashboard__welcome">
            <h1 id="services-dashboard-title" className="services-dashboard__title">Services Dashboard</h1>
            <p className="services-dashboard__subtitle">Welcome back, {user?.name || 'User'}</p>
          </div>
          <div className="services-dashboard__header-actions">
            <button
              className="icon-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell size={20} />
            </button>
            <div className="services-dashboard__user-menu">
              <button
                className="user-menu__trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
                aria-expanded={showUserMenu}
              >
                <div className="user-menu__avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" aria-hidden="true" />
                  ) : (
                    <User size={20} aria-hidden="true" />
                  )}
                </div>
                <ChevronDown size={16} />
              </button>
              {showUserMenu && (
                <div className="user-menu__dropdown" role="menu">
                  <Link to="/services/profile" className="user-menu__item" role="menuitem">
                    <User size={18} /> Profile
                  </Link>
                  <Link to="/services/wallet" className="user-menu__item" role="menuitem">
                    <CreditCard size={18} /> Wallet
                  </Link>
                  <Link to="/services/transactions" className="user-menu__item" role="menuitem">
                    <History size={18} /> Transactions
                  </Link>
                  <Link to="/services/settings" className="user-menu__item" role="menuitem">
                    <Settings size={18} /> Settings
                  </Link>
                  <hr />
                  <button className="user-menu__item user-menu__item--logout" role="menuitem" onClick={() => { logout(); navigate('/'); }}>
                    <ArrowRight size={18} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="services-dashboard__grid">
          <aside className="services-dashboard__sidebar">
            <section className="wallet-card" aria-labelledby="wallet-title">
              <header className="wallet-card__header">
                <h2 id="wallet-title" className="wallet-card__title">Wallet Balance</h2>
                <button
                  className="wallet-card__eye-toggle"
                  onClick={() => setShowBalance(!showBalance)}
                  aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                  aria-pressed={showBalance}
                >
                  {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </header>

              {walletLoading && (
                <div className="wallet-card__loading">
                  <div className="skeleton skeleton--text skeleton--wide" style={{ width: '120px', height: '32px' }} />
                </div>
              )}

              {!walletLoading && walletError && (
                <div className="wallet-card__error" role="alert">
                  <AlertCircle size={24} className="wallet-card__error-icon" aria-hidden="true" />
                  <p>{walletError}</p>
                  <button className="btn btn--primary btn--sm" onClick={loadWallet} disabled={walletLoading}>
                    <Loader2 size={16} className={walletLoading ? 'spin' : ''} aria-hidden="true" />
                    {walletLoading ? 'Retrying...' : 'Try again'}
                  </button>
                </div>
              )}

              {!walletLoading && !walletError && !wallet && (
                <div className="wallet-card__empty">
                  <p>You don't have a wallet yet.</p>
                  <button className="btn btn--primary btn--lg" onClick={handleFundWallet}>
                    <Plus size={18} /> Set Up Wallet
                  </button>
                </div>
              )}

              {!walletLoading && !walletError && wallet && (
                <>
                  <div className="wallet-card__balance">
                    <span className="wallet-card__balance-value">
                      {showBalance ? formatBalance(wallet.balance ?? 0) : '₦****'}
                    </span>
                    <span className="wallet-card__balance-label">Available Balance</span>
                  </div>

                  <div className="wallet-card__actions">
                    <Link to="/services/wallet/fund" className="btn btn--primary">
                      <Plus size={18} /> Fund Wallet
                    </Link>
                    <Link to="/services/transactions" className="btn btn--outline">
                      <History size={18} /> History
                    </Link>
                  </div>

                  <div className="wallet-card__funding-info">
                    <div className="wallet-card__provider">
                      <div className="wallet-card__provider-logo" style={{ background: wallet.virtualAccount?.provider === 'Wema Bank' ? '#0066CC' : '#16a34a' }} />
                      <span>{wallet.virtualAccount?.provider ?? 'Wema Bank'}</span>
                    </div>
                    <div className="wallet-card__account">
                      <span className="wallet-card__account-number">
                        {wallet.virtualAccount?.accountNumber ? formatAccountNumber(wallet.virtualAccount.accountNumber) : 'Account number will appear after wallet setup'}
                      </span>
                      {wallet.virtualAccount?.accountNumber && (
                        <button
                          className="wallet-card__copy-btn"
                          onClick={() => handleCopyAccount(wallet.virtualAccount!.accountNumber)}
                          aria-label={copied ? 'Copied' : 'Copy account number'}
                        >
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      )}
                      <p className="wallet-card__funding-note">
                        <AlertCircle size={14} aria-hidden="true" />
                        Transfer to fund wallet. ₦50 charge applies.
                      </p>
                    </div>
                    <p className="wallet-card__funding-note">
                      <AlertCircle size={14} aria-hidden="true" />
                      Transfer to fund wallet. ₦50 charge applies.
                    </p>
                  </div>
                </>
              )}
            </section>

            <section className="quick-actions" aria-labelledby="quick-actions-title">
              <h3 id="quick-actions-title" className="quick-actions__title">Quick Actions</h3>
              <div className="quick-actions__grid">
                <Link to="/services/wallet/fund" className="quick-action-btn">
                  <Plus size={20} /> Fund Wallet
                </Link>
                <Link to="/services/data" className="quick-action-btn">
                  <Wifi size={20} /> Buy Data
                </Link>
                <Link to="/services/airtime" className="quick-action-btn">
                  <Smartphone size={20} /> Buy Airtime
                </Link>
                <Link to="/services/transactions" className="quick-action-btn">
                  <History size={20} /> Transaction History
                </Link>
              </div>
            </section>
          </aside>

          <main className="services-dashboard__main">
            <section className="services-grid-section" aria-labelledby="services-grid-title">
              <div className="services-grid-section__header">
                <h2 id="services-grid-title" className="services-grid-section__title">Available Services</h2>
                <Link to="/services" className="services-grid-section__view-all">
                  View All <ArrowRight size={16} />
                </Link>
              </div>

              <div className="services-dashboard__grid" role="list">
                {services.map((service) => (
                  <button
                    key={service.id}
                    role="listitem"
                    className="service-card"
                    onClick={() => handleServiceClick(service.path)}
                    style={{ '--service-color': service.color } as React.CSSProperties}
                    aria-label={`Go to ${service.label} - ${service.description}`}
                  >
                    <div className="service-card__icon" style={{ backgroundColor: service.color + '20' }}>
                      <service.icon size={24} style={{ color: service.color }} aria-hidden="true" />
                    </div>
                    <div className="service-card__content">
                      <h3 className="service-card__label">{service.label}</h3>
                      <p className="service-card__description">{service.description}</p>
                    </div>
                    <ArrowRight size={18} className="service-card__arrow" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>

            <section className="recent-transactions" aria-labelledby="recent-transactions-title">
              <div className="section-header">
                <h2 id="recent-transactions-title" className="section-title">Recent Transactions</h2>
                <Link to="/services/transactions" className="section-view-all">
                  View All <ArrowRight size={16} />
                </Link>
              </div>

              {transactionsLoading ? (
                <div className="transactions__loading">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton skeleton--text skeleton--wide" style={{ height: '60px' }} />
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="transactions__empty">
                  <History size={32} className="transactions__empty-icon" aria-hidden="true" />
                  <h3>No transactions yet</h3>
                  <p>Your transaction history will appear here once you start using services.</p>
                  <Link to="/services/data" className="btn btn--primary">
                    <ArrowRight size={16} /> Make Your First Transaction
                  </Link>
                </div>
              ) : (
                <div className="transactions__list">
                  {transactions.map((txn) => {
                    const walletTxn = txn as WalletTransaction
                    const isCredit = walletTxn.type === 'credit'
                    const displayType = isCredit ? 'Funding' : 'Purchase'
                    const displayColor = isCredit ? '#16a34a' : '#0066CC'
                    const Icon = isCredit ? CreditCard : Wifi
                    return (
                      <div key={txn.id} className="transaction-item">
                        <div className="transaction-item__icon" style={{ backgroundColor: displayColor + '20' }}>
                          <Icon size={18} style={{ color: displayColor }} aria-hidden="true" />
                        </div>
                        <div className="transaction-item__details">
                          <div className="transaction-item__header">
                            <span className="transaction-item__type">{walletTxn.description || displayType}</span>
                            <span className={`transaction-item__status ${getWalletStatusBadge(walletTxn.status)}`}>
                              {walletTxn.status.charAt(0).toUpperCase() + walletTxn.status.slice(1)}
                            </span>
                          </div>
                          <div className="transaction-item__meta">
                            <span className="transaction-item__reference">{txn.reference}</span>
                            <span className="transaction-item__date">{new Date(txn.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="transaction-item__amount" style={{ color: walletTxn.status === 'completed' ? '#16a34a' : walletTxn.status === 'failed' ? '#dc2626' : '#f59e0b' }}>
                          {isCredit ? '+' : ''}{formatCurrency(walletTxn.amount)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </section>
  )
}

function getWalletStatusBadge(status: WalletTransaction['status']): string {
  switch (status) {
    case 'completed': return 'status--success'
    case 'failed': return 'status--failed'
    case 'pending': return 'status--pending'
    default: return ''
  }
}

export default ServicesDashboard