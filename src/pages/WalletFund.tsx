import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Copy, Check, AlertCircle, Loader2, Banknote, Shield, Eye, EyeOff, Info, AlertCircle as AlertCircleIcon } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Button, ButtonLink } from '../components/ui/Button'
import { walletService } from '../services/walletService'
import { formatCurrency } from '../utils/currency'
import type { VirtualAccount } from '../types/bills'

function WalletFund() {
  const [walletBalance, setWalletBalance] = useState(0)
  const [virtualAccount, setVirtualAccount] = useState<VirtualAccount | null>(null)
  const [loading, setLoading] = useState(true)
  const [creatingAccount, setCreatingAccount] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAccountVisible, setIsAccountVisible] = useState(false)

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [wallet, account] = await Promise.all([
        walletService.getWallet(),
        walletService.createVirtualAccount(),
      ])
      if (wallet) setWalletBalance(wallet.balance)
      setVirtualAccount(account)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallet data')
      setWalletBalance(0)
      setVirtualAccount(null)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAccount = async () => {
    setCreatingAccount(true)
    setError(null)
    try {
      const account = await walletService.createVirtualAccount()
      setVirtualAccount(account)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create funding account')
    } finally {
      setCreatingAccount(false)
    }
  }

  const handleCopyAccountNumber = async () => {
    if (!virtualAccount?.accountNumber) return
    try {
      await navigator.clipboard.writeText(virtualAccount.accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = virtualAccount.accountNumber
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAccountNumber = (accountNumber: string) => {
    return accountNumber.replace(/(\d{4})(\d{4})(\d{2})/, '$1 $2 $3')
  }

  const getStatusLabel = (status: VirtualAccount['accountStatus']) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'pending':
        return 'Setting Up'
      case 'unavailable':
        return 'Unavailable'
      default:
        return 'Unknown'
    }
  }

  const getStatusClass = (status: VirtualAccount['accountStatus']) => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'pending':
        return 'status-pending'
      case 'unavailable':
        return 'status-unavailable'
      default:
        return ''
    }
  }

  const hasRealAccount = virtualAccount?.accountStatus === 'active' && virtualAccount?.accountNumber

  if (loading) {
    return (
      <main className="wallet-fund-page">
        <div className="container container--narrow">
          <div className="page-skeleton">
            <div className="skeleton skeleton--text skeleton--wide" style={{ maxWidth: '300px', margin: '0 auto 16px' }} />
            <div className="skeleton skeleton--text skeleton--mid" style={{ maxWidth: '200px', margin: '0 auto 16px' }} />
            <div className="skeleton skeleton--media" style={{ aspectRatio: '16/9', borderRadius: '16px', marginBottom: '24px' }} />
            <div className="skeleton skeleton--text skeleton--mid" style={{ marginBottom: '16px' }} />
            <div className="skeleton skeleton--media" style={{ aspectRatio: '16/9', borderRadius: '16px' }} />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="wallet-fund-page">
      <div className="container container--narrow">
        <Link to="/wallet" className="back-link">
          <ArrowLeft size={16} /> Back to Wallet
        </Link>

        <SectionHeading
          eyebrow="Wallet"
          title="Fund Wallet"
          subtitle="Add money securely to your OyoConnect wallet using your dedicated funding account."
        />

        {/* Current Wallet Balance */}
        <section className="wallet-balance-card" aria-labelledby="wallet-balance-label">
          <span id="wallet-balance-label" className="wallet-balance__label">Current Wallet Balance</span>
          <p className="wallet-balance__amount">{formatCurrency(walletBalance)}</p>
        </section>

        {/* Virtual Account Section - Professional Empty State */}
        <section className="virtual-account-section" aria-labelledby="funding-account-label">
          <h2 id="funding-account-label" className="virtual-account__title">
            <Banknote size={20} aria-hidden="true" />
            Your Funding Account
          </h2>

          {error && (
            <div className="virtual-account__error" role="alert">
              <AlertCircleIcon size={18} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className={`virtual-account-card ${virtualAccount?.accountStatus === 'active' ? 'active' : ''}`}>
            {hasRealAccount ? (
              <>
                <div className="virtual-account__bank">
                  <span className="virtual-account__field-label">Bank</span>
                  <span className="virtual-account__field-value">{virtualAccount.bankName}</span>
                </div>

                <div className="virtual-account__account-number">
                  <span className="virtual-account__field-label">Account Number</span>
                  <div className="virtual-account__number-row">
                    <span className="virtual-account__number">
                      {isAccountVisible ? virtualAccount.accountNumber : 'xxxxxxxxxx'}
                    </span>
                    <button
                      type="button"
                      className="virtual-account__copy-btn"
                      onClick={handleCopyAccountNumber}
                      disabled={copied || !virtualAccount?.accountNumber}
                      aria-label={copied ? 'Copied to clipboard' : 'Copy account number'}
                    >
                      {copied ? (
                        <>
                          <Check size={16} aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="virtual-account__account-name">
                  <span className="virtual-account__field-label">Account Name</span>
                  <span className="virtual-account__field-value">{virtualAccount.accountName}</span>
                </div>

                <div className="virtual-account__status">
                  <span className="virtual-account__field-label">Status</span>
                  <span className={`virtual-account__status-badge ${getStatusClass(virtualAccount.accountStatus)}`}>
                    <span className="status-dot" aria-hidden="true" />
                    {getStatusLabel(virtualAccount.accountStatus)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="virtual-account__unavailable">
                  <div className="virtual-account__icon">
                    <Banknote size={32} aria-hidden="true" />
                  </div>
                  <h3 className="virtual-account__unavailable-title">Virtual Account Setup Required</h3>
                  <p className="virtual-account__unavailable-description">
                    Your personal funding account will appear here once payment integration is activated.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleCreateAccount}
                    disabled={creatingAccount}
                    className="virtual-account__setup-btn"
                  >
                    {creatingAccount ? (
                      <>
                        <Loader2 size={18} className="btn-spinner" aria-hidden="true" />
                        Setting Up...
                      </>
                    ) : (
                      <>
                        <Shield size={18} aria-hidden="true" />
                        Set Up Funding Account
                      </>
                    )}
                  </Button>
                  <p className="virtual-account__note">
                    This feature requires backend integration with a payment provider.
                  </p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Wallet Funding Info - Professional Neutral State */}
        <section className="wallet-funding-info-section" aria-labelledby="funding-info-label">
          <h2 id="funding-info-label" className="wallet-funding-info-section__title">
            <Shield size={20} aria-hidden="true" />
            Wallet Funding Account
          </h2>
          <div className="wallet-funding-info-card">
            <div className="wallet-funding-info-card__icon">
              <Shield size={24} aria-hidden="true" />
            </div>
            <div className="wallet-funding-info-card__content">
              <h3 className="wallet-funding-info-card__title">Wallet Funding Account</h3>
              <p className="wallet-funding-info-card__description">
                A dedicated funding account will appear here once wallet verification and payment provider integration are available.
              </p>
            </div>
            <div className="wallet-funding-info-card__note">
              If a provider is configured, the frontend will dynamically display:
            </div>
            <div className="wallet-funding-info-preview">
              <div className="wallet-funding-info-preview__field">
                <span className="wallet-funding-info-preview__label">Provider Name</span>
                <span className="wallet-funding-info-preview__value">[Provider Name]</span>
              </div>
              <div className="wallet-funding-info-preview__field">
                <span className="wallet-funding-info-preview__label">Account Name</span>
                <span className="wallet-funding-info-preview__value">[Account Name]</span>
              </div>
              <div className="wallet-funding-info-preview__field">
                <span className="wallet-funding-info-preview__label">Account Number</span>
                <span className="wallet-funding-info-preview__value">[Account Number]</span>
              </div>
              <div className="wallet-funding-info-preview__field">
                <span className="wallet-funding-info-preview__label">Bank / Provider</span>
                <span className="wallet-funding-info-preview__value">[Bank / Provider]</span>
              </div>
            </div>
            <p className="wallet-funding-info-section__note">
              The frontend must receive this information from a real backend API.
            </p>
          </div>
        </section>

        {/* Identity Verification Placeholder */}
        <section className="wallet-verification-section" aria-labelledby="verification-label">
          <h2 id="verification-label" className="wallet-verification-section__title">Identity Verification</h2>
          <div className="wallet-verification-card">
            <div className="wallet-verification-card__icon">
              <Shield size={24} aria-hidden="true" />
            </div>
            <div className="wallet-verification-card__content">
              <h3 className="wallet-verification-card__title">Identity Verification</h3>
              <p className="wallet-verification-card__description">
                Identity verification will be required before certain financial features can be activated.
              </p>
              <p className="wallet-verification-card__description wallet-verification-card__description--muted">
                Secure verification will be available when OyoConnect's backend and approved payment provider integration are ready.
              </p>
            </div>
            <button type="button" className="btn btn--outline wallet-verification-card__btn" disabled>
              Verification Not Available Yet
            </button>
          </div>
        </section>

        {/* Funding Instructions */}
        <div className="funding-instructions">
          <h3 className="funding-instructions__title">How It Works</h3>
          <ol className="funding-instructions__steps">
            <li>
              <span className="funding-instructions__step-number">1</span>
              <div>
                <strong>Get your assigned funding account</strong>
                <p>Click "Set Up Funding Account" to create your dedicated virtual account.</p>
              </div>
            </li>
            <li>
              <span className="funding-instructions__step-number">2</span>
              <div>
                <strong>Copy your account number</strong>
                <p>Use the copy button to copy your unique account number.</p>
              </div>
            </li>
            <li>
              <span className="funding-instructions__step-number">3</span>
              <div>
                <strong>Transfer from your banking app</strong>
                <p>Send money to this account from any Nigerian bank or fintech app.</p>
              </div>
            </li>
            <li>
              <span className="funding-instructions__step-number">4</span>
              <div>
                <strong>Wait for confirmation</strong>
                <p>Your wallet balance updates automatically once the payment provider confirms the transfer.</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Security Note */}
        <div className="security-note">
          <Shield size={18} aria-hidden="true" />
          <div>
            <strong>Secure by Design</strong>
            <p>We never confirm payments from the frontend. Your balance only updates after our backend verifies the transaction with the payment provider.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default WalletFund