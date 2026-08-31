import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Clock, Copy, Check, AlertCircle, HelpCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { walletService } from '../../services/walletService'
import { formatCurrency } from '../../utils/currency'
import type { Wallet } from '../../types/bills'

const services = [
  { id: 'data', label: 'Data', icon: '📱', path: '/services/data', color: '#0066CC' },
  { id: 'tv', label: 'TV', icon: '📺', path: '/services/tv', color: '#E60000' },
  { id: 'airtime', label: 'Airtime', icon: '📞', path: '/services/airtime', color: '#009933' },
  { id: 'electricity', label: 'Electricity', icon: '⚡', path: '/services/electricity', color: '#FF9900' },
  { id: 'education', label: 'Education', icon: '🎓', path: '/services/education', color: '#663399' },
  { id: 'recharge-pin', label: 'Recharge PIN', icon: '🔑', path: '/services/recharge-pin', color: '#FF6600' },
  { id: 'social-media', label: 'Social Media Market', icon: '📱', path: '/services/social-media', color: '#E4405F' },
  { id: 'digital-products', label: 'Premium Apps', icon: '💻', path: '/services/digital-products', color: '#0066CC' },
  { id: 'games', label: 'Games', icon: '🎮', path: '/services/games', color: '#663399' },
  { id: 'affiliate', label: 'Share & Earn', icon: '💰', path: '/affiliate', color: '#009933', isNew: true },
]

export function ServicesDashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [walletLoading, setWalletLoading] = useState(true)
  const [walletError, setWalletError] = useState<string | null>(null)
  const [showBalance, setShowBalance] = useState(false)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoading) return

    if (isAuthenticated) {
      loadWallet()
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

  const handleServiceClick = (path: string) => {
    if (isAuthenticated) {
      navigate(path)
    } else {
      navigate('/register', { state: { from: path } })
    }
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

  // Show auth loading state
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

  // Locked/preview state for non-authenticated users
  if (!isAuthenticated) {
    return (
      <section className="services-dashboard services-dashboard--locked" aria-labelledby="services-locked-title">
        <div className="container">
          <div className="services-dashboard__locked-overlay">
            <div className="services-dashboard__locked-content">
              <div className="services-dashboard__locked-icon-wrapper">
                <HelpCircle size={48} className="services-dashboard__locked-icon" aria-hidden="true" />
              </div>
              <h2 id="services-locked-title" className="services-dashboard__locked-title">Unlock Bill Payments & More</h2>
              <p className="services-dashboard__locked-description">
                Create a free account to access wallet, bill payments, airtime, data, electricity, TV subscriptions,
                education pins, recharge PINs, digital products, games, social media services, and share & earn rewards.
              </p>
              <div className="services-dashboard__locked-actions">
                <Link to="/signup" className="btn btn--primary btn--lg">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn--outline btn--lg">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="services-dashboard__preview" aria-hidden="true">
              <div className="services-dashboard__preview-header">
                <div className="services-dashboard__preview-balance">
                  <span className="services-dashboard__preview-balance-label">Wallet Balance</span>
                  <span className="services-dashboard__preview-balance-value">₦****</span>
                  <button className="services-dashboard__preview-eye" aria-label="Toggle balance visibility">
                    <EyeOff size={16} />
                  </button>
                </div>
                <a href="/wallet/transactions" className="services-dashboard__preview-history">
                  <Clock size={16} /> History
                </a>
              </div>
              <div className="services-dashboard__preview-funding">
                <div className="services-dashboard__preview-provider">
                  <div className="services-dashboard__preview-provider-logo" style={{ background: '#0066CC' }} />
                  <span>palmpay</span>
                </div>
                <div className="services-dashboard__preview-account">
                  <span>Account: xxxx xxxx xx</span>
                  <button className="services-dashboard__preview-copy" aria-label="Copy account number">
                    <Copy size={14} />
                  </button>
                </div>
                <p className="services-dashboard__preview-note">Transfer to fund wallet. ₦50 charge applies.</p>
              </div>
              <div className="services-dashboard__preview-grid">
                {services.map((service) => (
                  <div key={service.id} className="services-dashboard__preview-item">
                    <div className="services-dashboard__preview-icon" style={{ backgroundColor: service.color + '20' }}>
                      <span style={{ color: service.color, fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{service.icon}</span>
                      {service.isNew && <span className="services-dashboard__preview-badge">NEW</span>}
                    </div>
                    <span>{service.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Wallet loading skeleton
  if (walletLoading) {
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

  // Error state - wallet failed to load
  if (walletError) {
    return (
      <section className="services-dashboard" aria-labelledby="services-dashboard-title">
        <div className="container">
          <div className="services-dashboard__error" role="alert">
            <AlertCircle size={48} className="services-dashboard__error-icon" aria-hidden="true" />
            <h2 className="services-dashboard__error-title">Couldn't load your wallet</h2>
            <p className="services-dashboard__error-message">{walletError}</p>
            <button
              className="btn btn--primary"
              onClick={loadWallet}
              disabled={walletLoading}
            >
              <Loader2 size={18} className={walletLoading ? 'spin' : ''} aria-hidden="true" />
              {walletLoading ? 'Retrying...' : 'Try again'}
            </button>
          </div>
          <div className="services-dashboard__preview" aria-hidden="true">
            <div className="services-dashboard__preview-grid">
              {services.map((service) => (
                <div key={service.id} className="services-dashboard__preview-item">
                  <div className="services-dashboard__preview-icon" style={{ backgroundColor: service.color + '20' }}>
                    <span style={{ color: service.color, fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{service.icon}</span>
                    {service.isNew && <span className="services-dashboard__preview-badge">NEW</span>}
                  </div>
                  <span>{service.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Wallet is null but no error - could be new user without wallet
  if (!wallet) {
    return (
      <section className="services-dashboard" aria-labelledby="services-dashboard-title">
        <div className="container">
          <div className="services-dashboard__empty-wallet">
            <AlertCircle size={48} className="services-dashboard__empty-icon" aria-hidden="true" />
            <h2 className="services-dashboard__empty-title">Set up your wallet</h2>
            <p className="services-dashboard__empty-message">
              You don't have a wallet yet. Fund your wallet to start making payments and accessing all services.
            </p>
            <Link to="/wallet/fund" className="btn btn--primary btn--lg">
              Fund Wallet
            </Link>
          </div>
          <div className="services-dashboard__grid" role="list">
            {services.map((service) => (
              <button
                key={service.id}
                role="listitem"
                className="services-dashboard__service-btn"
                onClick={() => handleServiceClick(service.path)}
                style={{ '--service-color': service.color } as React.CSSProperties}
                aria-label={`Go to ${service.label}`}
              >
                <div className="services-dashboard__service-icon">
                  <span>{service.icon}</span>
                  {service.isNew && <span className="services-dashboard__new-badge">NEW</span>}
                </div>
                <span className="services-dashboard__service-label">{service.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Authenticated state - show real dashboard
  return (
    <section className="services-dashboard" aria-labelledby="services-dashboard-title">
      <div className="container">
        <div className="services-dashboard__header">
          <div className="services-dashboard__balance-section">
            <div className="services-dashboard__balance">
              <span className="services-dashboard__balance-label">Wallet Balance</span>
              <div className="services-dashboard__balance-value-wrapper">
                <span className="services-dashboard__balance-value">
                  {showBalance ? formatBalance(wallet?.balance ?? 0) : '₦****'}
                </span>
                <button
                  className="services-dashboard__eye-toggle"
                  onClick={() => setShowBalance(!showBalance)}
                  aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                  aria-pressed={showBalance}
                >
                  {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Link to="/wallet/transactions" className="services-dashboard__history-link">
              <Clock size={16} /> History
            </Link>
          </div>

          <div className="services-dashboard__funding-info">
            <div className="services-dashboard__provider">
              <div className="services-dashboard__provider-logo" style={{ background: wallet?.virtualAccount?.provider === 'Wema Bank' ? '#0066CC' : '#16a34a' }} />
              <span>{wallet?.virtualAccount?.provider ?? 'Palmpay'}</span>
            </div>
            <div className="services-dashboard__account">
              <span className="services-dashboard__account-number">{wallet?.virtualAccount?.accountNumber ? formatAccountNumber(wallet.virtualAccount.accountNumber) : '1234 5678 90'}</span>
              <button
                className="services-dashboard__copy-btn"
                onClick={() => handleCopyAccount(wallet?.virtualAccount?.accountNumber ?? 'xxxxxxxxxx')}
                aria-label={copied ? 'Copied' : 'Copy account number'}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <p className="services-dashboard__funding-note">
              <AlertCircle size={14} aria-hidden="true" />
              Transfer to fund wallet. ₦50 charge applies.
            </p>
          </div>
        </div>

        <h2 id="services-dashboard-title" className="services-dashboard__grid-title">Available Services</h2>
        <div className="services-dashboard__grid" role="list">
          {services.map((service) => (
            <button
              key={service.id}
              role="listitem"
              className="services-dashboard__service-btn"
              onClick={() => handleServiceClick(service.path)}
              style={{ '--service-color': service.color } as React.CSSProperties}
              aria-label={`Go to ${service.label}`}
            >
              <div className="services-dashboard__service-icon">
                <span>{service.icon}</span>
                {service.isNew && <span className="services-dashboard__new-badge">NEW</span>}
              </div>
              <span className="services-dashboard__service-label">{service.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesDashboard