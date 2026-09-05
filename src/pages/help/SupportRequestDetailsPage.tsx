import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import {
  Clock,
  MapPin,
  Shield,
  AlertCircle,
  CheckCircle,
  Share2,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import type { SupportRequest } from '../../types/help'
import {
  VerificationBadge,
  ProgressBar,
  SupportAmountSelector,
  ReportButton,
  LoadingState,
  ErrorState,
  StatusBadge,
  HelpIcon,
} from '../../components/help'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/common/Modal'
import { helpService } from '../../services/helpService'
import { notificationService } from '../../services/notificationService'
import { PLATFORM_FEE_PERCENTAGE, PAYMENT_GATEWAY_FEE_PERCENTAGE } from '../../types/help'
import { Card } from '../../components/ui/Card'

const SUGGESTED_AMOUNTS = [1000, 2000, 5000, 10000]

export function SupportRequestDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const [request, setRequest] = useState<SupportRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number>(0)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [supportStatus, setSupportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (id) {
      loadRequest()
    }
  }, [id])

  const loadRequest = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await helpService.getRequestById(id!)
      if (data) {
        setRequest(data)
        if (searchParams.get('support') === 'true') {
          setShowSupportModal(true)
        }
      } else {
        setError('Support request not found')
      }
    } catch {
      setError('Failed to load request details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSupportClick = () => {
    setShowSupportModal(true)
  }

  const handleAmountChange = (amount: number) => {
    setSelectedAmount(amount)
  }

  const handleSupportSubmit = async () => {
    if (!selectedAmount || !request) return

    setSupportStatus('processing')
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setRequest((prev) =>
        prev
          ? {
              ...prev,
              amountRaised: prev.amountRaised + selectedAmount,
              supportersCount: prev.supportersCount + 1,
            }
          : null,
      )

      notificationService.addNotification({
        category: 'account',
        title: 'New Support Received',
        message: `Someone supported your request "${request.title}" with ${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(selectedAmount)}!`,
        read: false,
        createdAt: new Date().toISOString(),
        href: `/help/requests/${request.id}`,
      })

      setSupportStatus('success')
      setShowSupportModal(false)
      setSelectedAmount(0)
      setTimeout(() => setSupportStatus('idle'), 3000)
    } catch {
      setSupportStatus('error')
      setTimeout(() => setSupportStatus('idle'), 3000)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const daysLeft = request
    ? Math.max(0, Math.ceil((new Date(request.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  const percentage =
    request && request.targetAmount > 0
      ? Math.min(Math.round((request.amountRaised / request.targetAmount) * 100), 100)
      : 0

  if (isLoading) {
    return <LoadingState variant="page" />
  }

  if (error || !request) {
    return (
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <ErrorState
          title={error || 'Request not found'}
          message="The support request you're looking for doesn't exist or has been removed."
          actionLabel="Browse Requests"
          actionHref="/help/requests"
        />
      </div>
    )
  }

  const isExpired = new Date(request.deadline) < new Date()
  const isCompleted = request.status === 'funded_and_paid_out'
  const canSupport = request.status === 'active' && !isExpired && !isCompleted

  return (
    <div className="support-details-page">
      <div className="container">
        <nav className="support-details__breadcrumb" aria-label="Breadcrumb">
          <Link to="/help" className="support-details__breadcrumb-link">
            Help
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/help/requests" className="support-details__breadcrumb-link">
            Requests
          </Link>
          <span aria-hidden="true">/</span>
          <span className="support-details__breadcrumb-current" aria-current="page">
            {request.title}
          </span>
        </nav>

        <div className="support-details__grid">
          <main className="support-details__main">
            <header className="support-details__header">
              <div className="support-details__requester">
                <img
                  src={request.requesterAvatar || ''}
                  alt=""
                  className="support-details__avatar"
                  loading="lazy"
                />
                <div className="support-details__requester-info">
                  <h1 className="support-details__title">{request.title}</h1>
                  <div className="support-details__meta">
                    <span className="support-details__requester-name">By {request.requesterName}</span>
                    <span className="support-details__location">
                      <MapPin size={14} aria-hidden="true" />
                      {request.requesterLocation}
                    </span>
                    <span className="support-details__category">
                      <HelpIcon name={getCategoryIcon(request.category)} size={16} aria-hidden="true" />
                      {request.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="support-details__badges">
                <VerificationBadge status={request.verificationStatus} size="md" />
                <StatusBadge status={request.status} />
              </div>
            </header>

            <section className="support-details__progress" aria-labelledby="progress-heading">
              <h2 id="progress-heading" className="support-details__section-title">Funding Progress</h2>

              <Card variant="default" padding="md">
                <ProgressBar
                  value={request.amountRaised}
                  max={request.targetAmount}
                  showPercentage
                  showLabels
                  size="lg"
                />
              </Card>

              <div className="support-details__progress-stats">
                <Card variant="default" padding="md" className="support-details__stat">
                  <span className="support-details__stat-value">{formatCurrency(request.amountRaised)}</span>
                  <span className="support-details__stat-label">Raised</span>
                </Card>
                <Card variant="default" padding="md" className="support-details__stat">
                  <span className="support-details__stat-value">{formatCurrency(request.targetAmount)}</span>
                  <span className="support-details__stat-label">Target</span>
                </Card>
                <Card variant="default" padding="md" className="support-details__stat">
                  <span className="support-details__stat-value">{percentage}%</span>
                  <span className="support-details__stat-label">Funded</span>
                </Card>
                <Card variant="default" padding="md" className="support-details__stat">
                  <span className="support-details__stat-value">{request.supportersCount}</span>
                  <span className="support-details__stat-label">Supporters</span>
                </Card>
              </div>
            </section>

            <section className="support-details__story" aria-labelledby="story-heading">
              <h2 id="story-heading" className="support-details__section-title">The Story</h2>
              <Card variant="default" padding="md" className="support-details__story-content">
                <p>{request.fullStory}</p>
              </Card>
            </section>

            {request.updates && request.updates.length > 0 && (
              <section className="support-details__updates" aria-labelledby="updates-heading">
                <h2 id="updates-heading" className="support-details__section-title">Updates</h2>
                <div className="support-details__updates-list">
                  {request.updates.map((update) => (
                    <Card key={update.id} variant="default" padding="md" className="support-details__update">
                      <div className="support-details__update-header">
                        <img
                          src={update.authorAvatar || ''}
                          alt=""
                          className="support-details__update-avatar"
                        />
                        <div>
                          <span className="support-details__update-author">{update.authorName}</span>
                          <time className="support-details__update-time" dateTime={update.createdAt}>
                            {formatDate(update.createdAt)}
                          </time>
                        </div>
                      </div>
                      <p className="support-details__update-content">{update.content}</p>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {request.verificationDocuments && request.verificationDocuments.length > 0 && (
              <section className="support-details__verification" aria-labelledby="verification-heading">
                <h2 id="verification-heading" className="support-details__section-title">
                  Verification Documents
                </h2>
                <p className="support-details__verification-note">
                  These documents were reviewed by our team during the verification process.
                </p>
                <ul className="support-details__documents">
                  {request.verificationDocuments.map((doc, index) => (
                    <li key={index} className="support-details__document">
                      <FileText size={18} aria-hidden="true" />
                      <span>{doc}</span>
                      <Badge variant="success">Verified</Badge>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="support-details__safety" aria-labelledby="safety-heading">
              <h2 id="safety-heading" className="support-details__section-title">Safety & Verification</h2>
              <div className="support-details__safety-grid">
                <Card variant="default" padding="md" className="support-details__safety-item">
                  <Shield size={24} aria-hidden="true" />
                  <h3>Reviewed Before Publication</h3>
                  <p>This request was reviewed by our team before going live. Documents and details were verified.</p>
                </Card>
                <Card variant="default" padding="md" className="support-details__safety-item">
                  <AlertCircle size={24} aria-hidden="true" />
                  <h3>Verification ≠ Guarantee</h3>
                  <p>
                    Verification confirms documents were reviewed, but does not guarantee every claim is 100%
                    accurate.
                  </p>
                </Card>
                <Card variant="default" padding="md" className="support-details__safety-item">
                  <CheckCircle size={24} aria-hidden="true" />
                  <h3>Report Concerns</h3>
                  <p>See something suspicious? Use the report button. We investigate every report promptly.</p>
                </Card>
                <Card variant="default" padding="md" className="support-details__safety-item">
                  <ExternalLink size={24} aria-hidden="true" />
                  <h3>Never Share Sensitive Info</h3>
                  <p>
                    OyoConnect will never ask for passwords, PINs, OTPs, or card security information.
                  </p>
                </Card>
              </div>
              <ReportButton requestId={request.id} requestTitle={request.title} />
            </section>
          </main>

          <aside className="support-details__sidebar" aria-labelledby="support-heading">
            <Card variant="elevated" padding="lg" className="support-details__support-panel">
              <h2 id="support-heading" className="support-details__panel-title">
                Support This Request
              </h2>

              <div className="support-details__progress-mini">
                <ProgressBar value={request.amountRaised} max={request.targetAmount} showPercentage size="sm" />
                <p className="support-details__progress-mini-text">
                  {formatCurrency(request.amountRaised)} of {formatCurrency(request.targetAmount)} •{' '}
                  {percentage}% funded
                </p>
              </div>

              {canSupport ? (
                <>
                  <SupportAmountSelector
                    suggestedAmounts={SUGGESTED_AMOUNTS}
                    selectedAmount={selectedAmount}
                    onAmountChange={handleAmountChange}
                    showFeeBreakdown
                    platformFeePercentage={PLATFORM_FEE_PERCENTAGE}
                    gatewayFeePercentage={PAYMENT_GATEWAY_FEE_PERCENTAGE}
                  />

                  <div className="support-details__deadline">
                    <Clock size={16} aria-hidden="true" />
                    <span>
                      {daysLeft === 0
                        ? 'Deadline today'
                        : daysLeft === 1
                        ? '1 day left'
                        : `${daysLeft} days left`}
                    </span>
                  </div>

                  <Button
                    className="support-details__support-btn"
                    size="lg"
                    variant="primary"
                    onClick={handleSupportClick}
                    loading={supportStatus === 'processing'}
                    disabled={supportStatus === 'processing'}
                  >
                    {supportStatus === 'processing' ? 'Processing...' : 'Support Now'}
                  </Button>

                  <p className="support-details__support-note">
                    Your support amount is transferred to the requester's verified bank account upon successful
                    processing. Platform and payment processing fees apply as shown.
                  </p>
                </>
              ) : (
                <div className="support-details__support-disabled">
                  {isExpired ? (
                    <>
                      <AlertCircle size={32} aria-hidden="true" />
                      <p>This request's deadline has passed.</p>
                    </>
                  ) : isCompleted ? (
                    <>
                      <CheckCircle size={32} aria-hidden="true" />
                      <p>This request has been completed.</p>
                    </>
                  ) : (
                    <>
                      <Clock size={32} aria-hidden="true" />
                      <p>This request is not currently accepting support.</p>
                    </>
                  )}
                </div>
              )}

              <div className="support-details__share">
                <button
                  type="button"
                  className="support-details__share-btn"
                  onClick={() => navigator.share?.({ title: request.title, url: window.location.href })}
                >
                  <Share2 size={18} aria-hidden="true" />
                  Share
                </button>
              </div>
            </Card>

            <Card variant="default" padding="md" className="support-details__info-panel">
              <h3 className="support-details__info-title">Request Details</h3>
              <dl className="support-details__info-list">
                <div className="support-details__info-row">
                  <dt>Created</dt>
                  <dd>{formatDate(request.createdAt)}</dd>
                </div>
                <div className="support-details__info-row">
                  <dt>Deadline</dt>
                  <dd>{formatDate(request.deadline)}</dd>
                </div>
                <div className="support-details__info-row">
                  <dt>Category</dt>
                  <dd>
                    <HelpIcon name={getCategoryIcon(request.category)} size={16} aria-hidden="true" />
                    {request.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </dd>
                </div>
                <div className="support-details__info-row">
                  <dt>Verification</dt>
                  <dd>
                    <VerificationBadge status={request.verificationStatus} size="sm" showLabel />
                  </dd>
                </div>
                <div className="support-details__info-row">
                  <dt>Status</dt>
                  <dd>
                    <StatusBadge status={request.status} />
                  </dd>
                </div>
              </dl>
            </Card>
          </aside>
        </div>
      </div>

      <Modal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        title="Confirm Your Support"
        size="md"
      >
        <p className="support-modal__intro">
          You're about to support <strong>{request.requesterName}</strong>'s request:{' '}
          <strong>{request.title}</strong>
        </p>

        <SupportAmountSelector
          suggestedAmounts={SUGGESTED_AMOUNTS}
          selectedAmount={selectedAmount}
          onAmountChange={handleAmountChange}
          showFeeBreakdown
          platformFeePercentage={PLATFORM_FEE_PERCENTAGE}
          gatewayFeePercentage={PAYMENT_GATEWAY_FEE_PERCENTAGE}
        />

        <div className="modal-footer">
          <Button variant="outline" onClick={() => setShowSupportModal(false)} disabled={supportStatus === 'processing'}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSupportSubmit}
            loading={supportStatus === 'processing'}
            disabled={!selectedAmount}
          >
            {supportStatus === 'processing' ? 'Processing...' : `Support with ${formatCurrency(selectedAmount || 0)}`}
          </Button>
        </div>

        {supportStatus === 'success' && (
          <div className="support-modal__success" role="alert">
            <CheckCircle size={24} aria-hidden="true" />
            <p>Thank you! Your support has been processed.</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

function getCategoryIcon(categoryId: string): string {
  const icons: Record<string, string> = {
    'school-fees': 'graduation-cap',
    'emergency-rent': 'home',
    'medical-emergency': 'heart-pulse',
    'small-business': 'briefcase',
    'tools-equipment': 'wrench',
    'family-emergency': 'users',
    'other-emergency': 'alert-triangle',
  }
  return icons[categoryId] || 'alert-triangle'
}

export default SupportRequestDetailsPage