import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, X, Upload, FileText, AlertCircle, Shield, Loader2, Banknote, CheckCircle2, Clock } from 'lucide-react'
import { REQUEST_HELP_STEPS, type RequestHelpStepId, type RequestHelpFormData, HELP_CATEGORIES, type BankVerificationRequest, type BankVerificationStatus, type HelpCategoryType } from '../../types/help'
import { formatCurrency } from '../../utils/currency'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { FormField } from '../../components/ui/FormField'
import { Card } from '../../components/ui/Card'
import { ProgressBar, HelpIcon } from '../../components/help'
import { helpService } from '../../services/helpService'
import { notificationService } from '../../services/notificationService'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

export function RequestHelpPage() {
  const [currentStep, setCurrentStep] = useState<RequestHelpStepId>('category')
  const [formData, setFormData] = useState<RequestHelpFormData>({
    category: '',
    title: '',
    description: '',
    fullStory: '',
    targetAmount: 0,
    deadline: '',
    location: '',
    supportingInfo: '',
    documents: [],
    bankAccount: undefined
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RequestHelpFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [filePreviews, setFilePreviews] = useState<string[]>([])
  const [bankVerificationStatus, setBankVerificationStatus] = useState<BankVerificationStatus>('unverified')
  const [bankVerificationError, setBankVerificationError] = useState<string | null>(null)
  const [isVerifyingBank, setIsVerifyingBank] = useState(false)
  const [verifiedAccountName, setVerifiedAccountName] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const stepIndex = REQUEST_HELP_STEPS.findIndex(s => s.id === currentStep)
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === REQUEST_HELP_STEPS.length - 1

  const validateStep = useCallback((step: RequestHelpStepId, data: RequestHelpFormData): Partial<Record<keyof RequestHelpFormData, string>> => {
    const newErrors: Partial<Record<keyof RequestHelpFormData, string>> = {}

    switch (step) {
      case 'category':
        if (!data.category) newErrors.category = 'Please select a category'
        break
      case 'details':
        if (!data.title.trim()) newErrors.title = 'Request title is required'
        else if (data.title.length < 10) newErrors.title = 'Title must be at least 10 characters'
        if (!data.fullStory.trim()) newErrors.fullStory = 'Please explain your situation'
        else if (data.fullStory.length < 50) newErrors.fullStory = 'Please provide more details (at least 50 characters)'
        if (!data.targetAmount || data.targetAmount < 1000) newErrors.targetAmount = 'Minimum amount is ₦1,000'
        if (!data.deadline) newErrors.deadline = 'Deadline is required'
        else {
          const deadlineDate = new Date(data.deadline)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          if (deadlineDate <= today) newErrors.deadline = 'Deadline must be in the future'
          const maxDate = new Date()
          maxDate.setFullYear(maxDate.getFullYear() + 1)
          if (deadlineDate > maxDate) newErrors.deadline = 'Deadline cannot be more than 1 year away'
        }
        if (!data.location.trim()) newErrors.location = 'Location is required'
        break
      case 'bank':
        if (!data.bankAccount) {
          newErrors.bankAccount = 'Bank account details are required'
        } else {
          if (!data.bankAccount.accountNumber) newErrors.bankAccount = 'Account number is required'
          else if (!/^\d{10}$/.test(data.bankAccount.accountNumber)) newErrors.bankAccount = 'Account number must be 10 digits'
          if (!data.bankAccount.bankCode) newErrors.bankAccount = 'Bank is required'
          if (!data.bankAccount.accountName) newErrors.bankAccount = 'Account name is required'
        }
        break
      case 'evidence':
        if (data.documents.length > 0) {
          const invalidFiles = data.documents.filter(f =>
            f.size > MAX_FILE_SIZE || !ALLOWED_FILE_TYPES.includes(f.type)
          )
          if (invalidFiles.length > 0) {
            newErrors.documents = 'Some files are invalid. Max 5MB, PDF/JPG/PNG only.'
          }
        }
        break
      case 'review':
        break
    }

    return newErrors
  }, [])

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    setErrors({})
    if (!isLastStep) {
      setCurrentStep(REQUEST_HELP_STEPS[stepIndex + 1].id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(REQUEST_HELP_STEPS[stepIndex - 1].id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleVerifyBank = async () => {
    if (!formData.bankAccount) return

    setIsVerifyingBank(true)
    setBankVerificationError(null)

    try {
      const result = await helpService.verifyBankAccount(formData.bankAccount)
      if (result.success) {
        setBankVerificationStatus('verified')
        setVerifiedAccountName(result.accountName || null)
        setFormData(prev => ({
          ...prev,
          bankAccount: prev.bankAccount ? {
            ...prev.bankAccount,
            accountName: result.accountName || prev.bankAccount.accountName
          } : undefined
        }))
      } else {
        setBankVerificationStatus('failed')
        setBankVerificationError(result.error || 'Bank verification failed')
      }
    } catch {
      setBankVerificationStatus('failed')
      setBankVerificationError('Network error. Please try again.')
    } finally {
      setIsVerifyingBank(false)
    }
  }

  const handleInputChange = (field: keyof RequestHelpFormData, value: string | number | File[] | BankVerificationRequest) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(f =>
      f.size <= MAX_FILE_SIZE && ALLOWED_FILE_TYPES.includes(f.type)
    )

    if (validFiles.length !== files.length) {
      setErrors(prev => ({ ...prev, documents: 'Some files were rejected. Max 5MB, PDF/JPG/PNG only.' }))
    }

    const newFiles = [...formData.documents, ...validFiles].slice(0, 10)
    setFormData(prev => ({ ...prev, documents: newFiles }))

    validFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          setFilePreviews(prev => [...prev, ev.target?.result as string])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
    setFilePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let allErrors: Partial<Record<keyof RequestHelpFormData, string>> = {}
    REQUEST_HELP_STEPS.forEach(step => {
      const stepErrors = validateStep(step.id, formData)
      allErrors = { ...allErrors, ...stepErrors }
    })

    if (bankVerificationStatus !== 'verified') {
      allErrors.bankAccount = 'Bank account must be verified before submitting'
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      const firstErrorStep = REQUEST_HELP_STEPS.find(step =>
        Object.keys(validateStep(step.id, formData)).length > 0
      )
      if (firstErrorStep) {
        setCurrentStep(firstErrorStep.id)
      }
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const requestData = {
        requesterId: 'current-user',
        requesterName: 'Current User',
        requesterLocation: formData.location,
        category: formData.category as HelpCategoryType,
        title: formData.title,
        description: formData.description,
        fullStory: formData.fullStory,
        targetAmount: formData.targetAmount,
        deadline: formData.deadline,
        currency: 'NGN' as const,
        bankAccountId: 'bank-1',
        verificationDocuments: formData.documents.map(f => f.name),
      }

      const created = await helpService.createRequest(requestData)
      await helpService.submitForReview(created.id)

      notificationService.addNotification({
        category: 'account',
        title: 'Help Request Submitted',
        message: `Your request "${formData.title}" has been submitted for review. You'll be notified once it's approved.`,
        read: false,
        createdAt: new Date().toISOString(),
        href: `/help/requests/${created.id}`,
      })

      setSubmitStatus('success')
      setTimeout(() => {
        window.location.href = '/help/request/success'
      }, 2000)
    } catch {
      setSubmitStatus('error')
      setIsSubmitting(false)
    }
  }

  const formatCategoryName = (id: string) => {
    const cat = HELP_CATEGORIES.find(c => c.id === id)
    return cat?.name || id
  }

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') return <FileText size={20} aria-hidden="true" />
    return <FileText size={20} aria-hidden="true" />
  }

  return (
    <div className="request-help-page">
      <div className="container request-help-page__container">
        <nav className="form-progress" aria-label="Request help progress">
          <ol className="form-progress-list">
            {REQUEST_HELP_STEPS.map((step, index) => (
              <li key={step.id} className="form-progress-item">
                <div className="form-progress-step">
                  <button
                    type="button"
                    className={`form-progress-button ${index < stepIndex ? 'completed' : index === stepIndex ? 'current' : 'future'}`}
                    disabled={index > stepIndex}
                    aria-current={index === stepIndex ? 'step' : undefined}
                    aria-label={`${step.label}: ${step.description}`}
                  >
                    {index < stepIndex ? (
                      <Check size={16} aria-hidden="true" />
                    ) : (
                      <span className="form-progress-icon">{index + 1}</span>
                    )}
                  </button>
                  <span className="form-progress-label">{step.label}</span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {submitStatus === 'success' && (
          <Card variant="elevated" padding="lg" className="request-help-page__success" role="alert">
            <div className="request-help-page__success-icon">
              <Check size={48} aria-hidden="true" />
            </div>
            <h2>Request Submitted for Review</h2>
            <p>Thank you for sharing your story. Our team will review your request and get back to you within 24-48 hours.</p>
            <p className="request-help-page__success-note">
              <Shield size={18} aria-hidden="true" />
              <strong>Status: Pending Admin Review</strong> — Your request will not be visible to the community until approved.
            </p>
            <div className="request-help-page__success-actions">
              <Link to="/help" className="btn btn--primary btn--lg">
                Back to Help Home
              </Link>
              <Link to="/help/requests" className="btn btn--outline btn--lg">
                Browse Other Requests
              </Link>
            </div>
          </Card>
        )}

        {submitStatus !== 'success' && (
          <form onSubmit={handleSubmit} className="request-help-page__form" noValidate>
            {currentStep === 'category' && (
              <fieldset className="request-help-step" aria-labelledby="step-category-title">
                <legend id="step-category-title" className="request-help-step__legend">
                  <span className="request-help-step__number">Step 1 of 4</span>
                  Choose a Category
                </legend>
                <p className="request-help-step__description">
                  Select the category that best matches your situation. This helps supporters find your request.
                </p>

                <div className="request-help-step__categories" role="radiogroup" aria-label="Help categories">
                  {HELP_CATEGORIES.map((category) => (
                    <label
                      key={category.id}
                      className={`request-help-step__category-card ${formData.category === category.id ? 'request-help-step__category-card--selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={formData.category === category.id}
                        onChange={() => handleInputChange('category', category.id)}
                        className="request-help-step__category-input"
                        aria-label={category.name}
                      />
                       <div className="request-help-step__category-icon" style={{ backgroundColor: `${category.color}15`, color: category.color }}>
                        <HelpIcon name={category.icon} size={28} aria-hidden="true" />
                      </div>
                      <h4 className="request-help-step__category-name">{category.name}</h4>
                      <p className="request-help-step__category-desc">{category.description}</p>
                    </label>
                  ))}
                </div>

                {errors.category && (
                  <p className="request-help-step__error" role="alert">
                    <AlertCircle size={16} aria-hidden="true" />
                    {errors.category}
                  </p>
                )}

                <div className="request-help-step__actions">
                  <Button type="button" variant="ghost" onClick={handleBack} disabled={isFirstStep}>
                    <ChevronLeft size={18} aria-hidden="true" />
                    Back
                  </Button>
                  <Button type="button" variant="primary" onClick={handleNext}>
                    Continue <ChevronRight size={18} aria-hidden="true" />
                  </Button>
                </div>
              </fieldset>
            )}

            {currentStep === 'details' && (
              <fieldset className="request-help-step" aria-labelledby="step-details-title">
                <legend id="step-details-title" className="request-help-step__legend">
                  <span className="request-help-step__number">Step 2 of 4</span>
                  Tell Your Story
                </legend>
                <p className="request-help-step__description">
                  Be honest and specific. Supporters want to understand your situation clearly.
                </p>

                <FormField
                  label="Request Title"
                  htmlFor="title"
                  hint="A clear, specific title helps supporters understand your need at a glance"
                  error={errors.title}
                  required
                >
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Final Year Tuition - University of Ibadan"
                    required
                  />
                </FormField>

                <FormField
                  label="Explain Your Situation"
                  htmlFor="fullStory"
                  hint="Minimum 50 characters. This will be shown publicly if your request is approved."
                  error={errors.fullStory}
                  required
                >
                  <textarea
                    id="fullStory"
                    name="fullStory"
                    className={`input textarea ${errors.fullStory ? 'input--error' : ''}`}
                    value={formData.fullStory}
                    onChange={(e) => handleInputChange('fullStory', e.target.value)}
                    placeholder="Share your story in detail. What happened? Why do you need help? How will the funds be used? Be specific and honest."
                    rows={8}
                    required
                  />
                </FormField>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <FormField
                    label="Amount Required (₦)"
                    htmlFor="targetAmount"
                    hint="Minimum ₦1,000. Be realistic about what you need."
                    error={errors.targetAmount}
                    required
                  >
                    <Input
                      id="targetAmount"
                      name="targetAmount"
                      type="number"
                      inputMode="numeric"
                      min="1000"
                      step="1000"
                      value={formData.targetAmount || ''}
                      onChange={(e) => handleInputChange('targetAmount', parseInt(e.target.value) || 0)}
                      placeholder="e.g., 350000"
                      required
                    />
                  </FormField>

                  <FormField
                    label="Deadline"
                    htmlFor="deadline"
                    hint="When do you need the funds by? Max 1 year."
                    error={errors.deadline}
                    required
                  >
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      required
                    />
                  </FormField>
                </div>

                <FormField
                  label="Location"
                  htmlFor="location"
                  hint="Your city/town and state. This helps local supporters find you."
                  error={errors.location}
                  required
                >
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Ibadan, Oyo State (Area/LGA)"
                    required
                  />
                </FormField>

                <FormField
                  label="Optional Supporting Information"
                  htmlFor="supportingInfo"
                  hint="This is not shown publicly but helps our verification team"
                >
                  <Input
                    id="supportingInfo"
                    name="supportingInfo"
                    value={formData.supportingInfo}
                    onChange={(e) => handleInputChange('supportingInfo', e.target.value)}
                    placeholder="Any additional context: medical report reference, business registration number, etc."
                  />
                </FormField>

                <div className="request-help-step__actions">
                  <Button type="button" variant="secondary" onClick={handleBack}>
                    <ChevronLeft size={18} aria-hidden="true" />
                    Back
                  </Button>
                  <Button type="button" variant="primary" onClick={handleNext}>
                    Continue <ChevronRight size={18} aria-hidden="true" />
                  </Button>
                </div>
              </fieldset>
            )}

            {currentStep === 'bank' && (
              <fieldset className="request-help-step" aria-labelledby="step-bank-title">
                <legend id="step-bank-title" className="request-help-step__legend">
                  <span className="request-help-step__number">Step 3 of 5</span>
                  Bank Details for Payout
                </legend>
                <p className="request-help-step__description">
                  Provide your bank account details for receiving funds. This account will be verified before your request goes live.
                </p>

                <div className="request-help-step__bank-notice">
                  <Banknote size={20} aria-hidden="true" />
                  <div>
                    <strong>Verified payout account required.</strong> Your request cannot be published until your bank account is verified.
                    We use secure bank verification to confirm the account belongs to you.
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <FormField
                    label="Bank"
                    htmlFor="bankCode"
                    error={errors.bankAccount}
                    required
                  >
                    <Select
                      id="bankCode"
                      name="bankCode"
                      value={formData.bankAccount?.bankCode || ''}
                      onChange={(value) => handleInputChange('bankAccount', { ...formData.bankAccount, bankCode: value } as BankVerificationRequest)}
                      placeholder="Select your bank"
                      required
                      options={[
                        { value: '035', label: 'Wema Bank' },
                        { value: '044', label: 'Access Bank' },
                        { value: '058', label: 'GTBank' },
                        { value: '057', label: 'Zenith Bank' },
                        { value: '011', label: 'First Bank' },
                        { value: '070', label: 'Fidelity Bank' },
                        { value: '214', label: 'First City Monument Bank' },
                        { value: '033', label: 'United Bank for Africa' },
                        { value: '050', label: 'EcoBank' },
                        { value: '221', label: 'Stanbic IBTC Bank' },
                        { value: '063', label: 'Diamond Bank' },
                        { value: '068', label: 'Standard Chartered Bank' },
                        { value: '232', label: 'Sterling Bank' },
                        { value: '032', label: 'Union Bank' },
                        { value: '215', label: 'Unity Bank' },
                      ]}
                    />
                  </FormField>

                  <FormField
                    label="Account Number"
                    htmlFor="accountNumber"
                    hint="Your 10-digit NUBAN account number"
                    error={errors.bankAccount}
                    required
                  >
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      value={formData.bankAccount?.accountNumber || ''}
                      onChange={(e) => handleInputChange('bankAccount', { ...formData.bankAccount, accountNumber: e.target.value } as BankVerificationRequest)}
                      placeholder="10-digit account number"
                      required
                    />
                  </FormField>
                </div>

                <FormField
                  label="Account Name"
                  htmlFor="accountName"
                  hint="This must match the name on your bank account for verification"
                  error={errors.bankAccount}
                  required
                >
                  <Input
                    id="accountName"
                    name="accountName"
                    value={formData.bankAccount?.accountName || ''}
                    onChange={(e) => handleInputChange('bankAccount', { ...formData.bankAccount, accountName: e.target.value } as BankVerificationRequest)}
                    placeholder="As it appears on your bank account"
                    required
                  />
                </FormField>

                {bankVerificationStatus === 'verification_pending' && (
                  <div className="request-help-step__verification-status">
                    <Clock size={20} aria-hidden="true" />
                    <span>Verifying your account details...</span>
                  </div>
                )}

                {bankVerificationStatus === 'verified' && (
                  <div className="request-help-step__verification-status success">
                    <CheckCircle2 size={20} aria-hidden="true" />
                    <span>
                      <strong>Account verified:</strong> {verifiedAccountName || formData.bankAccount?.accountName}
                    </span>
                  </div>
                )}

                {bankVerificationStatus === 'failed' && (
                  <div className="request-help-step__verification-status error">
                    <AlertCircle size={20} aria-hidden="true" />
                    <span>{bankVerificationError || 'Verification failed. Please check your details and try again.'}</span>
                  </div>
                )}

                <div className="request-help-step__actions">
                  <Button type="button" variant="secondary" onClick={handleBack}>
                    <ChevronLeft size={18} aria-hidden="true" />
                    Back
                  </Button>
                  {bankVerificationStatus === 'verified' ? (
                    <Button type="button" variant="primary" onClick={handleNext}>
                      Continue <ChevronRight size={18} aria-hidden="true" />
                    </Button>
                  ) : (
                    <Button type="button" variant="primary" onClick={handleVerifyBank} disabled={isVerifyingBank || !formData.bankAccount?.accountNumber || !formData.bankAccount?.bankCode || !formData.bankAccount?.accountName}>
                      {isVerifyingBank ? (
                        <>
                          <Loader2 size={20} className="btn__spinner" aria-hidden="true" />
                          Verifying...
                        </>
                      ) : (
                        'Verify Account'
                      )}
                    </Button>
                  )}
                </div>
              </fieldset>
            )}

            {currentStep === 'evidence' && (
              <fieldset className="request-help-step" aria-labelledby="step-evidence-title">
                <legend id="step-evidence-title" className="request-help-step__legend">
                  <span className="request-help-step__number">Step 4 of 5</span>
                  Supporting Documents
                </legend>
                <p className="request-help-step__description">
                  Upload relevant documents to help verify your request. This builds trust with supporters.
                </p>

                <div className="request-help-step__upload-notice">
                  <AlertCircle size={20} aria-hidden="true" />
                  <div>
                    <strong>Only upload documents relevant to your request.</strong>
                    Avoid uploading unnecessary sensitive personal information (full bank statements, unredacted IDs, passwords, PINs, OTPs).
                    Our team only needs to verify the legitimacy of your need.
                  </div>
                </div>

                <FormField
                  label="Upload Documents"
                  htmlFor="documents"
                  hint="PDF, JPG, PNG up to 5MB each. Max 10 files."
                  error={errors.documents}
                >
                  <div className="request-help-step__dropzone">
                    <input
                      type="file"
                      id="documents"
                      name="documents"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="request-help-step__file-input"
                      aria-describedby="file-hint"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="documents" className="request-help-step__dropzone-label">
                      <Upload size={32} aria-hidden="true" />
                      <span>Click or drag files here</span>
                      <span id="file-hint" className="request-help-step__file-hint">
                        PDF, JPG, PNG up to 5MB each. Max 10 files.
                      </span>
                    </label>
                  </div>
                </FormField>

                {formData.documents.length > 0 && (
                  <div className="request-help-step__files" role="list" aria-label="Uploaded documents">
                    {formData.documents.map((file, index) => (
                      <div key={index} className="request-help-step__file-item" role="listitem">
                        <div className="request-help-step__file-icon">
                          {getFileIcon(file)}
                        </div>
                        <div className="request-help-step__file-info">
                          <span className="request-help-step__file-name">{file.name}</span>
                          <span className="request-help-step__file-size">{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                        <button
                          type="button"
                          className="request-help-step__file-remove"
                          onClick={() => removeDocument(index)}
                          aria-label={`Remove ${file.name}`}
                        >
                          <X size={18} aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="request-help-step__actions">
                  <Button type="button" variant="secondary" onClick={handleBack}>
                    <ChevronLeft size={18} aria-hidden="true" />
                    Back
                  </Button>
                  <Button type="button" variant="primary" onClick={handleNext}>
                    Continue <ChevronRight size={18} aria-hidden="true" />
                  </Button>
                </div>
              </fieldset>
            )}

            {currentStep === 'review' && (
              <fieldset className="request-help-step" aria-labelledby="step-review-title">
                <legend id="step-review-title" className="request-help-step__legend">
                  <span className="request-help-step__number">Step 5 of 5</span>
                  Review & Submit
                </legend>
                <p className="request-help-step__description">
                  Please review your request carefully before submitting. You can go back to edit any section.
                </p>

                <Card variant="default" padding="md" className="request-help-step__review">
                  <div className="request-help-step__review-section">
                    <h4 className="request-help-step__review-heading">Category</h4>
                    <Badge tone="brand">{formData.category ? formatCategoryName(formData.category) : 'Not selected'}</Badge>
                  </div>

                  <div className="request-help-step__review-section">
                    <h4 className="request-help-step__review-heading">Request Title</h4>
                    <p>{formData.title || 'Not provided'}</p>
                  </div>

                  <div className="request-help-step__review-section">
                    <h4 className="request-help-step__review-heading">Your Story</h4>
                    <p className="request-help-step__review-story">{formData.fullStory || 'Not provided'}</p>
                  </div>

                  <div className="request-help-step__review-section">
                    <h4 className="request-help-step__review-heading">Payout Bank Account</h4>
                    <p>{formData.bankAccount ? `${formData.bankAccount.accountName} • ${formData.bankAccount.accountNumber} • ${formData.bankAccount.bankCode}` : 'Not provided'}</p>
                    {formData.bankAccount && (
                      <Badge tone={bankVerificationStatus === 'verified' ? 'success' : 'neutral'}>
                        {bankVerificationStatus === 'verified' ? 'Verified' : 'Unverified'}
                      </Badge>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div className="request-help-step__review-section">
                      <h4 className="request-help-step__review-heading">Amount Required</h4>
                      <p className="request-help-step__review-amount">{formData.targetAmount ? formatCurrency(formData.targetAmount) : 'Not provided'}</p>
                    </div>

                    <div className="request-help-step__review-section">
                      <h4 className="request-help-step__review-heading">Deadline</h4>
                      <p>{formData.deadline ? new Date(formData.deadline).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not provided'}</p>
                    </div>

                    <div className="request-help-step__review-section">
                      <h4 className="request-help-step__review-heading">Location</h4>
                      <p>{formData.location || 'Not provided'}</p>
                    </div>

                    <div className="request-help-step__review-section">
                      <h4 className="request-help-step__review-heading">Documents</h4>
                      <p>{formData.documents.length > 0 ? `${formData.documents.length} file(s) attached` : 'No documents'}</p>
                    </div>
                  </div>
                </Card>

                <div className="request-help-step__important-notice">
                  <Shield size={20} aria-hidden="true" />
                  <div>
                    <strong>Important:</strong> After submission, your request will show as <strong>"Pending Admin Review"</strong>.
                    It will <strong>NOT</strong> be visible to the community or show as verified until our team approves it.
                    This typically takes 24-48 hours. You will receive a notification once reviewed.
                  </div>
                </div>

                <FormField
                  label=""
                  htmlFor="confirm"
                  className="request-help-step__confirm"
                >
                  <label className="request-help-step__confirm-label">
                    <input
                      type="checkbox"
                      id="confirm"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="request-help-step__confirm-input"
                    />
                    <span>
                      I confirm that the information provided is accurate and that I have
                      read the platform's support and verification guidelines.
                    </span>
                  </label>
                </FormField>

                <div className="request-help-step__actions">
                  <Button type="button" variant="secondary" onClick={handleBack}>
                    <ChevronLeft size={18} aria-hidden="true" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting || !confirmed}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="btn__spinner" aria-hidden="true" />
                        Submitting...
                      </>
                    ) : (
                      'Submit for Review'
                    )}
                  </Button>
                </div>

                {submitStatus === 'error' && (
                  <p className="request-help-step__error" role="alert">
                    <AlertCircle size={16} aria-hidden="true" />
                    Failed to submit request. Please try again.
                  </p>
                )}
              </fieldset>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export default RequestHelpPage