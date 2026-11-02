import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowRight,
  Lightbulb,
  ReceiptText,
  Wallet as WalletIcon,
  CircleHelp,
} from 'lucide-react'
import { walletService } from '@/services/walletService'
import { formatCurrency } from '@/utils/currency'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Wallet, VirtualAccount, WalletTransaction } from '@/types/bills'
import './Wallet.css'

function WalletPage() {
  const [loading, setLoading] = useState(true)
  const [wallet, setWallet] = useState<Wallet | { balance: number; currency: 'NGN' }>({ balance: 0, currency: 'NGN' })
  const [error, setError] = useState<string | null>(null)
  const [virtualAccount, setVirtualAccount] = useState<VirtualAccount | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [hasRealAccount, setHasRealAccount] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [walletData, account, txns] = await Promise.all([
          walletService.getWallet(),
          walletService.createVirtualAccount(),
          walletService.getTransactions({ limit: 5 }),
        ])
        setWallet(walletData ?? { balance: 0, currency: 'NGN' } as Wallet)
        setVirtualAccount(account ?? null)
        setTransactions(txns.transactions ?? [])
        setHasRealAccount(account?.accountStatus === 'active')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load wallet data')
        setWallet({ balance: 0, currency: 'NGN' } as Wallet)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const currentMonthTransactions = useMemo(() => {
    const now = new Date()
    return transactions.filter((transaction) => {
      const date = new Date(transaction.createdAt)
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
    })
  }, [transactions])
  const monthlyNet = currentMonthTransactions.reduce((sum, transaction) => sum + (transaction.type === 'credit' ? transaction.amount : -transaction.amount), 0)
  const ctaText = hasRealAccount ? 'Set up funding account' : 'Fund wallet'

  return (
    <main className="wallet-dashboard">
      <header className="wallet-dashboard-heading">
        <div>
          <span>YOUR MONEY</span>
          <h1>Wallet</h1>
          <p>Manage your balance and view recent activity.</p>
        </div>
        <Link to="/wallet/transactions">All transactions <span><ArrowRight size={15} /></span></Link>
      </header>

      <section className="wallet-dashboard-balance">
        <Card>
          <CardHeader>
            <div>Available balance</div>
          </CardHeader>
          <CardBody>
            <div className="wallet-dashboard-balance__top">
              <WalletIcon size={20} className="wallet-dashboard-mark" />
              <span className="wallet-dashboard-balance__label">Available balance</span>
              {hasRealAccount && <Badge variant="success" size="sm">Verified</Badge>}
            </div>
            <strong>{formatCurrency(wallet.balance)}</strong>
            <small>{wallet.currency || 'NGN'}</small>
          </CardBody>
        </Card>

        <div className="wallet-dashboard-balance__actions">
          <Link to="/wallet/fund" className="wallet-dashboard-fund-link">
            <Button variant="primary" size="sm">
              {ctaText}
            </Button>
          </Link>
          <button type="button" disabled title="No withdrawal screen is configured for this wallet yet">
            <ArrowUpFromLine size={16} /> Withdraw
          </button>
        </div>

        {virtualAccount?.accountStatus === 'active' && (
          <Card>
            <CardHeader>
              <div>Funding account ready</div>
            </CardHeader>
            <CardBody>
              <span>Use your existing account details to fund your wallet.</span>
            </CardBody>
          </Card>
        )}
      </section>

      <div className="wallet-dashboard-grid">
        <section className="wallet-dashboard-panel wallet-dashboard-services">
          <Card>
            <CardHeader>
              <div>OyoConnect services</div>
            </CardHeader>
            <CardBody>
              <p>Explore available services</p>
              <Link to="/services">
                <Lightbulb size={17} />
                <span><strong>Browse services</strong></span>
                <small>See services available on OyoConnect</small>
                <ArrowRight size={15} />
              </Link>
            </CardBody>
          </Card>
        </section>

        <section className="wallet-dashboard-panel wallet-dashboard-month">
          <Card>
            <CardHeader>
              <div>This month</div>
            </CardHeader>
            <CardBody>
              <div className="wallet-dashboard-month__stats">
                <div>
                  <strong>{currentMonthTransactions.length}</strong>
                  <span>Transactions</span>
                </div>
                <div>
                  <strong>{currentMonthTransactions.length ? formatCurrency(monthlyNet) : '—'}</strong>
                  <span>Net activity</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>
      </div>

      <div className="wallet-dashboard-content-grid">
        <section className="wallet-dashboard-panel wallet-dashboard-transactions">
          <Card>
            <CardHeader>
              <div>Recent transactions</div>
            </CardHeader>
            <CardBody>
              <Link to="/wallet/transactions">View all <span><ArrowRight size={14} /></span></Link>
              {transactions.length ? (
                <div className="wallet-dashboard-transaction-list">
                  {transactions.map((transaction) => (
                    <article
                      key={transaction.id}
                      className="wallet-dashboard-transaction"
                    >
                      <span
                        className={`wallet-dashboard-transaction__icon ${transaction.type === 'credit' ? 'is-credit' : ''}`}
                      >
                        {transaction.type === 'credit' ? <ArrowDownToLine size={16} /> : <ReceiptText size={16} />}
                      </span>
                      <span className="wallet-dashboard-transaction__info">
                        <strong>{transaction.description}</strong>
                        <small>
                          {new Date(transaction.createdAt).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                          · {transaction.status}
                        </small>
                      </span>
                      <strong className={transaction.type === 'credit' ? 'is-credit' : ''}>
                        {transaction.type === 'credit' ? '+' : '−'}{formatCurrency(transaction.amount)}
                      </strong>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="wallet-dashboard-empty">
                  <ReceiptText size={22} />
                  <strong>No transactions yet</strong>
                  <p>Your wallet activity will appear here.</p>
                </div>
              )}
            </CardBody>
          </Card>
        </section>

        <aside className="wallet-dashboard-side">
          <section className="wallet-dashboard-panel wallet-dashboard-quick">
            <Card>
              <CardHeader>
                <div>Quick top-up</div>
              </CardHeader>
              <CardBody>
                <p>Add money to your wallet using the existing funding flow.</p>
                <Link to="/wallet/fund">Fund wallet <span><ArrowRight size={14} /></span></Link>
              </CardBody>
            </Card>
          </section>

          <section className="wallet-dashboard-panel wallet-dashboard-help">
            <Card>
              <CardHeader>
                <div>Need help?</div>
              </CardHeader>
              <CardBody>
                <p>Visit Help & Support for wallet questions and account assistance.</p>
                <Link to="/community/help">Get support <span><ArrowRight size={14} /></span></Link>
              </CardBody>
            </Card>
          </section>
        </aside>
      </div>
    </main>
  )
}

export default WalletPage