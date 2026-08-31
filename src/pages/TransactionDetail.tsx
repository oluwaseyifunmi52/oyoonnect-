import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Copy, CheckCircle2, AlertCircle, Clock, CreditCard, Shield, Download, Share2, Copy as CopyIcon, SearchX } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { EmptyState } from '../components/ui/EmptyState'
import { Button, ButtonLink } from '../components/ui/Button'
import { transactionService } from '../services/transactionService'
import { formatCurrency } from '../utils/currency'
import type { Transaction } from '../types/bills'

function TransactionDetail() {
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  // Extract transaction ID from URL
  const path = window.location.pathname
  const transactionId = path.split('/').pop()

  useEffect(() => {
    if (!transactionId) return

    const loadTransaction = async () => {
      try {
        setLoading(true)
        const txn = await transactionService.getTransactionById(transactionId)
        if (txn) {
          setTransaction(txn)
        } else {
          setError('Transaction not found')
        }
      } catch {
        setError('Failed to load transaction')
      } finally {
        setLoading(false)
      }
    }
    loadTransaction()
  }, [transactionId])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(text)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  const downloadReceipt = async () => {
    if (!transaction) return
    const receipt = `
OyoConnect Transaction Receipt
==============================

Transaction ID: ${transaction.id}
Reference: ${transaction.reference}
Status: ${transaction.status.toUpperCase()}
Date: ${new Date(transaction.createdAt).toLocaleString()}
Service: ${transaction.service}
Provider: ${transaction.provider}
Amount: ${transaction.currency} ${transaction.amount.toLocaleString()}
Fee: ${transaction.currency} ${transaction.fee.toLocaleString()}
Total: ${transaction.currency} ${transaction.total.toLocaleString()}

Customer Details:
${Object.entries(transaction.customerDetails).map(([k, v]) => `  ${k}: ${v}`).join('\n')}

Wallet Balance Before: ${transaction.currency} ${transaction.walletBalanceBefore.toLocaleString()}
Wallet Balance After: ${transaction.currency} ${transaction.walletBalanceAfter.toLocaleString()}

Generated on ${new Date().toLocaleString()}
    `.trim()

    const blob = new Blob([receipt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${transaction.reference}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareReceipt = async () => {
    if (!transaction) return
    const text = `
OyoConnect Transaction Receipt
Transaction ID: ${transaction.id}
Reference: ${transaction.reference}
Status: ${transaction.status.toUpperCase()}
Amount: ${transaction.currency} ${transaction.total.toLocaleString()}
Date: ${new Date(transaction.createdAt).toLocaleString()}
    `.trim()

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'OyoConnect Transaction Receipt',
          text,
        })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text)
      alert('Receipt copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="page-skeleton">
            <div className="skeleton skeleton--text skeleton--wide" style={{ maxWidth: '400px', margin: '0 auto 16px' }} />
            <div className="skeleton skeleton--media" style={{ width: '100%', aspectRatio: '16/9', borderRadius: '16px', marginBottom: '24px' }} />
            <div className="skeleton skeleton--text" style={{ width: '60%', marginBottom: '12px' }} />
            <div className="skeleton skeleton--text" style={{ width: '40%', marginBottom: '24px' }} />
          </div>
        </div>
      </main>
    )
  }

  if (!transaction) {
    return (
      <main className="page container">
        <EmptyState
          icon={<SearchX size={36} />}
          title="Transaction not found"
          description="The transaction you're looking for doesn't exist or has been removed."
          action={
            <ButtonLink to="/wallet/transactions" variant="primary">
              Back to Transactions
            </ButtonLink>
          }
        />
      </main>
    )
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'success': return 'status-badge--success'
      case 'pending': return 'status-badge--pending'
      case 'processing': return 'status-badge--pending'
      case 'failed': return 'status-badge--error'
      case 'refunded': return 'status-badge--neutral'
      default: return 'status-badge--neutral'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Successful'
      case 'pending': return 'Pending'
      case 'processing': return 'Processing'
      case 'failed': return 'Failed'
      case 'refunded': return 'Refunded'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <main className="page">
      <div className="container">
        <Link to="/wallet/transactions" className="back-link">
          <ArrowLeft size={16} /> Back to Transactions
        </Link>

        <SectionHeading
          eyebrow="Transaction Details"
          title="Transaction Details"
          subtitle={`Reference: ${transaction.reference}`}
        />

        <div className="transaction-detail">
          <div className="transaction-header">
            <div className="transaction-status">
              <span className={`status-badge ${getStatusBadgeClass(transaction.status)}`}>
                <CheckCircle2 size={14} />
                {getStatusLabel(transaction.status)}
              </span>
            </div>
            <div className="transaction-meta">
              <span className="txn-id">ID: {transaction.id}</span>
              <span className="txn-reference">Ref: {transaction.reference}</span>
            </div>
          </div>

          <div className="transaction-grid">
            <div className="transaction-section">
              <h3>Transaction Details</h3>
              <dl className="detail-list">
                <dt>Service</dt>
                <dd>{transaction.service}</dd>
                <dt>Provider</dt>
                <dd>{transaction.provider}</dd>
                <dt>Type</dt>
                <dd>{transaction.type}</dd>
                <dt>Status</dt>
                <dd><span className={`status-badge ${getStatusBadgeClass(transaction.status)}`}>{transaction.status}</span></dd>
                <dt>Reference</dt>
                <dd>
                  <div className="copyable-field">
                    <code>{transaction.reference}</code>
                    <button
                      type="button"
                      className="copy-btn"
                      onClick={() => copyToClipboard(transaction.reference)}
                      aria-label="Copy reference"
                    >
                      {copied === transaction.reference ? <CheckCircle2 size={16} /> : <CopyIcon size={16} />}
                    </button>
                  </div>
                </dd>
                <dt>Date & Time</dt>
                <dd>
                  <div>{formatDate(transaction.createdAt)}</div>
                  <div className="txn-time">{formatTime(transaction.createdAt)}</div>
                </dd>
                <dt>Completed At</dt>
                <dd>{transaction.completedAt ? `${formatDate(transaction.completedAt)} ${formatTime(transaction.completedAt)}` : '—'}</dd>
              </dl>
            </div>

            <div className="transaction-section">
              <h3>Amount Details</h3>
              <dl className="detail-list">
                <dt>Amount</dt>
                <dd>{transaction.currency} {transaction.amount.toLocaleString()}</dd>
                <dt>Fee</dt>
                <dd>{transaction.currency} {transaction.fee.toLocaleString()}</dd>
                <dt className="detail-total">Total</dt>
                <dd className="detail-total">{transaction.currency} {transaction.total.toLocaleString()}</dd>
              </dl>
            </div>

            <div className="transaction-section">
              <h3>Customer Details</h3>
              <dl className="detail-list">
                {Object.entries(transaction.customerDetails).map(([key, value]) => (
                  <>
                    <dt key={key}>{key}</dt>
                    <dd>{value}</dd>
                  </>
                ))}
              </dl>
            </div>

            <div className="transaction-section">
              <h3>Wallet Balance</h3>
              <dl className="detail-list">
                <dt>Before Transaction</dt>
                <dd>₦{transaction.walletBalanceBefore.toLocaleString()}</dd>
                <dt>After Transaction</dt>
                <dd>₦{transaction.walletBalanceAfter.toLocaleString()}</dd>
              </dl>
            </div>
          </div>

          <div className="transaction-actions">
            <ButtonLink to="/wallet/transactions" variant="outline">
              <ArrowLeft size={16} /> Back to Transactions
            </ButtonLink>
            <ButtonLink
              to={`/services/transactions/${transaction.id}`}
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                downloadReceipt()
              }}
            >
              <Download size={18} /> Download Receipt
            </ButtonLink>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                shareReceipt()
              }}
            >
              <Share2 size={18} /> Share
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default TransactionDetail