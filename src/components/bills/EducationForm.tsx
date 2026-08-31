import { useState, useEffect } from 'react'
import { GraduationCap, CreditCard, ArrowRight, User, Mail, Shield, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import { validatePhoneNumber, validateEmail, validateAmount, combineValidations, validateRequired } from '../../utils/validation'
import { NetworkSelector } from './NetworkSelector'
import { FeeBreakdown } from './FeeBreakdown'
import { billsService } from '../../services/billsService'
import type { EducationProduct, Transaction } from '../../types/bills'

interface EducationFormProps {
  onSuccess?: (transaction: Transaction | undefined) => void
  onError?: (error: string) => void
}

const EXAM_TYPES = [
  { value: 'waec', label: 'WAEC', icon: GraduationCap },
  { value: 'neco', label: 'NECO', icon: GraduationCap },
  { value: 'nabteb', label: 'NABTEB', icon: GraduationCap },
  { value: 'jamb', label: 'JAMB', icon: GraduationCap },
  { value: 'other', label: 'Other', icon: Shield },
]

const PLATFORM_FEE = 50

export function EducationForm({ onSuccess, onError }: EducationFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [candidateName, setCandidateName] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [submitting, setSubmitting] = useState(false)
  const [products, setProducts] = useState<EducationProduct[]>([])
  const [walletBalance, setWalletBalance] = useState<number>(0)

  useEffect(() => {
    loadProducts()
    loadWalletBalance()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await billsService.getEducationProducts()
      setProducts(data)
    } catch {
      setProducts([])
    }
  }

  const loadWalletBalance = async () => {
    try {
      setWalletBalance(0)
    } catch {
      setWalletBalance(0)
    }
  }

  const selectedProductData = products.find((p) => p.id === selectedProduct)

  const handleCandidateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCandidateName(e.target.value)
    if (errors.candidateName) setErrors((prev) => ({ ...prev, candidateName: undefined }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9+]/g, '')
    setPhoneNumber(value)
    if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: undefined }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
  }

  const validateForm = (): boolean => {
    const results = combineValidations(
      validateRequired(selectedProduct, 'product'),
      validateRequired(candidateName, 'candidateName'),
      validatePhoneNumber(phoneNumber),
      validateEmail(email),
    )
    setErrors(results.errors)
    return results.isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    setSubmitting(true)
    try {
      const result = await billsService.purchaseEducation({
        productId: product.id,
        examType: product.type,
        candidateName: candidateName.trim(),
        phoneNumber: phoneNumber.replace(/\s/g, ''),
        email: email.trim() || undefined,
        amount: product.price,
      })

      if (result.success) {
        setCandidateName('')
        setPhoneNumber('')
        setEmail('')
        setSelectedProduct('')
        onSuccess?.(result.transaction)
      } else {
        onError?.(result.message || 'Transaction failed')
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Transaction failed')
    } finally {
      setSubmitting(false)
    }
  }

  const productsByType = products.reduce((acc, product) => {
    if (!acc[product.type]) acc[product.type] = []
    acc[product.type].push(product)
    return acc
  }, {} as Record<string, EducationProduct[]>)

  return (
    <form onSubmit={handleSubmit} className="education-form" noValidate>
      <div className="education-form__wallet-balance">
        <div className="education-form__balance-item">
          <span className="education-form__balance-label">Wallet Balance</span>
          <span className="education-form__balance-value">{walletBalance > 0 ? formatCurrency(walletBalance) : 'Connect wallet to view balance'}</span>
        </div>
        {selectedProductData && (
          <div className="education-form__balance-item education-form__balance-item--remaining">
            <span className="education-form__balance-label">After Purchase</span>
            <span className="education-form__balance-value">{walletBalance > 0 ? formatCurrency(walletBalance - selectedProductData.price - PLATFORM_FEE) : '—'}</span>
          </div>
        )}
      </div>

      <div className="education-form__exam-types">
        <p className="education-form__section-label">Select Exam Type</p>
        <div className="education-form__exam-type-tabs">
          {EXAM_TYPES.map((type) => {
            const typeProducts = productsByType[type.value] || []
            if (typeProducts.length === 0) return null
            const Icon = type.icon
            return (
              <button
                key={type.value}
                type="button"
                className={`education-form__exam-type-tab ${selectedProductData?.type === type.value ? 'education-form__exam-type-tab--active' : ''}`}
                onClick={() => {
                  setSelectedProduct(typeProducts[0].id)
                }}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{type.label}</span>
                <span className="education-form__exam-type-count">{typeProducts.length}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="education-form__products">
        {selectedProductData ? (
          <div className="education-form__selected-product">
            <div className="education-form__selected-product-header">
              <div className="education-form__selected-product-details">
                <h4>{selectedProductData.name}</h4>
                <p>{selectedProductData.provider}</p>
              </div>
              <div className="education-form__selected-product-price">{formatCurrency(selectedProductData.price)}</div>
            </div>
            {selectedProductData.description && (
              <p className="education-form__selected-product-description">{selectedProductData.description}</p>
            )}
          </div>
        ) : (
          <div className="education-form__no-selection">
            <GraduationCap size={32} aria-hidden="true" />
            <p>Select an exam type to view available products</p>
          </div>
        )}
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="candidateName" className="form-label">
            Candidate Name <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <User size={18} className="input-icon" aria-hidden="true" />
            <input
              id="candidateName"
              type="text"
              className={`form-input ${errors.candidateName ? 'form-input--error' : ''}`}
              placeholder="Full name as on ID"
              value={candidateName}
              onChange={handleCandidateNameChange}
              aria-invalid={!!errors.candidateName}
              aria-describedby={errors.candidateName ? 'candidate-name-error' : undefined}
            />
          </div>
          {errors.candidateName && <p id="candidate-name-error" className="form-error" role="alert">{errors.candidateName}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <User size={18} className="input-icon" aria-hidden="true" />
            <input
              id="phoneNumber"
              type="tel"
              className={`form-input ${errors.phoneNumber ? 'form-input--error' : ''}`}
              placeholder="08012345678"
              value={phoneNumber}
              onChange={handlePhoneChange}
              maxLength={14}
              aria-invalid={!!errors.phoneNumber}
              aria-describedby={errors.phoneNumber ? 'phone-error' : undefined}
            />
          </div>
          {errors.phoneNumber && <p id="phone-error" className="form-error" role="alert">{errors.phoneNumber}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="email" className="form-label">
            Email Address <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" aria-hidden="true" />
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              placeholder="email@example.com"
              value={email}
              onChange={handleEmailChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </div>
          {errors.email && <p id="email-error" className="form-error" role="alert">{errors.email}</p>}
        </div>
      </div>

      <div className="education-form__notice">
        <AlertTriangle size={18} aria-hidden="true" />
        <div>
          <strong>Important:</strong> This is a demo transaction. No real examination PIN will be generated.
          Demo PINs are clearly marked as <strong>DEMO PIN — NOT VALID FOR EXAMINATION</strong>.
        </div>
      </div>

      <FeeBreakdown
        servicePrice={selectedProductData?.price ?? 0}
        platformFee={PLATFORM_FEE}
      />

      <button
        type="submit"
        className="btn btn--primary btn--lg education-form__submit"
        disabled={submitting || !selectedProduct}
      >
        {submitting ? (
          <>
            <span className="btn-spinner" aria-hidden="true"></span>
            Processing...
          </>
        ) : walletBalance === 0 ? (
          'Connect wallet to continue'
        ) : (
          <>
            Purchase Exam Product
            <ArrowRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  )
}

export default EducationForm