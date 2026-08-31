import { useState } from 'react'
import { Flag, Send, AlertCircle, CheckCircle } from 'lucide-react'
import { Modal } from '../common/Modal'
import { Button } from '../ui/Button'

type ReportReason = 'fraud' | 'misleading' | 'inappropriate' | 'duplicate' | 'other'

interface ReportButtonProps {
  requestId: string
  requestTitle: string
  onReport?: (requestId: string, reason: ReportReason, details: string) => Promise<void>
}

const REPORT_REASONS: { value: ReportReason; label: string; description: string }[] = [
  {
    value: 'fraud',
    label: 'Suspected Fraud/Scam',
    description: 'This request appears to be fraudulent or a scam attempt',
  },
  {
    value: 'misleading',
    label: 'Misleading Information',
    description: 'The request contains false or misleading claims',
  },
  {
    value: 'inappropriate',
    label: 'Inappropriate Content',
    description: 'The request contains inappropriate or offensive content',
  },
  {
    value: 'duplicate',
    label: 'Duplicate Request',
    description: 'This same request has been posted multiple times',
  },
  {
    value: 'other',
    label: 'Other Concern',
    description: 'Another reason not listed above',
  },
]

export function ReportButton({ requestId, requestTitle, onReport }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState<ReportReason | ''>('')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReason || !onReport) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await onReport(requestId, selectedReason, details)
      setSubmitStatus('success')
      setTimeout(() => {
        setIsOpen(false)
        setSelectedReason('')
        setDetails('')
        setSubmitStatus('idle')
      }, 2000)
    } catch {
      setSubmitStatus('error')
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (isSubmitting) return
    setIsOpen(false)
    setSelectedReason('')
    setDetails('')
  }

  if (submitStatus === 'success') {
    return (
      <div className="report-button__success" role="alert">
        <CheckCircle size={20} aria-hidden="true" />
        <span>Report submitted. Thank you for keeping OyoConnect safe.</span>
      </div>
    )
  }

  return (
    <div className="report-button">
      <button
        type="button"
        className="report-button__trigger"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-label="Report this request"
      >
        <Flag size={18} aria-hidden="true" />
        <span>Report</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Report Request"
        size="md"
        closeOnOverlayClick={!isSubmitting}
      >
        <p className="report-button__modal-subtitle">
          Reporting <strong>{requestTitle}</strong>. Your report is anonymous and helps keep the community safe.
        </p>

        <form onSubmit={handleSubmit} className="report-button__form">
          <fieldset className="report-button__fieldset">
            <legend className="report-button__legend">Reason for reporting</legend>
            <div className="report-button__reasons" role="radiogroup" aria-label="Report reasons">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason.value}
                  className={`report-button__reason ${selectedReason === reason.value ? 'report-button__reason--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="report-reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={() => setSelectedReason(reason.value)}
                    className="report-button__reason-input"
                    disabled={isSubmitting}
                  />
                  <div className="report-button__reason-content">
                    <span className="report-button__reason-label">{reason.label}</span>
                    <span className="report-button__reason-desc">{reason.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="report-button__field">
            <label htmlFor="report-details" className="report-button__field-label">
              Additional details (optional)
            </label>
            <textarea
              id="report-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide any additional information that will help our review team..."
              rows={4}
              className="report-button__textarea"
              maxLength={500}
              disabled={isSubmitting}
            />
            <span className="report-button__char-count">{details.length}/500</span>
          </div>

          <div className="modal-footer">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="submit"
              loading={isSubmitting}
              disabled={!selectedReason}
            >
              <Send size={16} aria-hidden="true" />
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>

          {submitStatus === 'error' && (
            <p className="report-button__error" role="alert">
              <AlertCircle size={16} aria-hidden="true" />
              Failed to submit report. Please try again.
            </p>
          )}
        </form>
      </Modal>
    </div>
  )
}
