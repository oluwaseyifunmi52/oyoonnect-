import { useState, useEffect } from 'react'
import { Wifi, Smartphone, CreditCard, ArrowRight, Info } from 'lucide-react'
import { formatCurrency, parseCurrency } from '../../utils/currency'
import { validatePhoneNumber, validateAmount, combineValidations, validateRequired } from '../../utils/validation'
import { NetworkSelector } from './NetworkSelector'
import { DataPlanCard } from './DataPlanCard'
import { FeeBreakdown } from './FeeBreakdown'
import { billsService } from '../../services/billsService'
import type { Network, DataPlan, Transaction } from '../../types/bills'

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000, 10000]
const PLATFORM_FEE = 50

interface DataFormProps {
  onSuccess?: (transaction: Transaction | undefined) => void
  onError?: (error: string) => void
  initialNetwork?: string
}

export function DataForm({
  onSuccess,
  onError,
  initialNetwork,
}: DataFormProps) {
  const [network, setNetwork] = useState<string>(initialNetwork || '')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [planType, setPlanType] = useState<'regular' | 'sme' | 'corporate' | 'gifting'>('regular')
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [submitting, setSubmitting] = useState(false)
  const [networks, setNetworks] = useState<Network[]>([])
  const [plans, setPlans] = useState<DataPlan[]>([])
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [showPlanInfo, setShowPlanInfo] = useState<string | null>(null)

  useEffect(() => {
    loadNetworks()
    loadWalletBalance()
  }, [])

  useEffect(() => {
    if (network) {
      loadPlans()
    } else {
      setPlans([])
      setSelectedPlan('')
    }
  }, [network, planType])

  const loadNetworks = async () => {
    try {
      const nets = await billsService.getNetworksForAirtime()
      setNetworks(nets.filter((n) => n.supportsData))
      if (!initialNetwork && nets.length > 0) {
        setNetwork(nets[0].id)
      }
    } catch {
      setNetworks([])
    }
  }

  const loadPlans = async () => {
    try {
      const dataPlans = await billsService.getDataPlans(network)
      setPlans(dataPlans.filter((p) => p.type === planType))
      setSelectedPlan('')
    } catch {
      setPlans([])
    }
  }

  const loadWalletBalance = async () => {
    try {
      // TODO: integrate with wallet service - for now return 0 to show unavailable state
      setWalletBalance(0)
    } catch {
      setWalletBalance(0)
    }
  }

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)
  const planAmount = selectedPlanData?.price ?? 0
  const remainingBalance = walletBalance - planAmount - PLATFORM_FEE

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    setErrors((prev) => ({ ...prev, plan: undefined }))
  }

  const validateForm = (): boolean => {
    const results = combineValidations(
      validatePhoneNumber(phoneNumber, network),
      validateRequired(network, 'network'),
      validateRequired(selectedPlan, 'plan')
    )
    setErrors(results.errors)
    return results.isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const selectedPlanObj = plans.find((p) => p.id === selectedPlan)
    if (!selectedPlanObj) return

    setSubmitting(true)
    try {
      const result = await billsService.purchaseData({
        networkId: network,
        phoneNumber: phoneNumber.replace(/\s/g, ''),
        planId: selectedPlanObj.id,
        planName: selectedPlanObj.name,
        amount: selectedPlanObj.price,
      })

      if (result.success) {
        setPhoneNumber('')
        setSelectedPlan('')
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

  const plansByType = plans.reduce((acc, plan) => {
    if (!acc[plan.type]) acc[plan.type] = []
    acc[plan.type].push(plan)
    return acc
  }, {} as Record<string, DataPlan[]>)

  const planTypeOrder = ['regular', 'sme', 'corporate', 'gifting']

  return (
    <form onSubmit={handleSubmit} className="data-form" noValidate>
      <div className="data-form__wallet-balance">
        <div className="data-form__balance-item">
          <span className="data-form__balance-label">Wallet Balance</span>
          <span className="data-form__balance-value">{walletBalance > 0 ? formatCurrency(walletBalance) : 'Connect wallet to view balance'}</span>
        </div>
        {selectedPlanData && (
          <div className="data-form__balance-item data-form__balance-item--remaining">
            <span className="data-form__balance-label">After Purchase</span>
            <span className="data-form__balance-value">
              {walletBalance > 0 ? formatCurrency(walletBalance - selectedPlanData.price - PLATFORM_FEE) : '—'}
            </span>
          </div>
        )}
      </div>

      <div className="form-grid">
        <NetworkSelector
          label="Network"
          networks={networks.filter((n) => n.supportsData)}
          value={network}
          onChange={(val) => {
            setNetwork(val)
            setPlanType('regular')
          }}
          required
          error={errors.network}
          placeholder="Select network"
        />

        <div className="form-field">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <Smartphone size={18} className="input-icon" aria-hidden="true" />
            <input
              id="phoneNumber"
              type="tel"
              className={`form-input ${errors.phoneNumber ? 'form-input--error' : ''}`}
              placeholder="08012345678"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9+]/g, '')
                setPhoneNumber(value)
                if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: undefined }))
              }}
              maxLength={14}
              aria-invalid={!!errors.phoneNumber}
              aria-describedby={errors.phoneNumber ? 'phone-error' : undefined}
            />
          </div>
          {errors.phoneNumber && <p className="form-error" role="alert">{errors.phoneNumber}</p>}
        </div>
      </div>

      <div className="data-form__plan-type-tabs">
        {planTypeOrder.map((type) => {
          const typePlans = plansByType[type] || []
          if (typePlans.length === 0) return null
          const typeLabels: Record<string, string> = {
            regular: 'Regular',
            sme: 'SME Share',
            corporate: 'Corporate',
            gifting: 'Gifting',
          }
          return (
            <button
              key={type}
              type="button"
              className={`data-form__plan-type-tab ${planType === type ? 'data-form__plan-type-tab--active' : ''}`}
              onClick={() => {
                setPlanType(type as 'regular' | 'sme' | 'corporate' | 'gifting')
                setSelectedPlan('')
              }}
            >
              {typeLabels[type]}
              <span className="data-form__plan-type-count">{typePlans.length}</span>
            </button>
          )
        })}
      </div>

      <div className="data-form__plans">
        {plans.length === 0 ? (
          <div className="data-form__no-plans">
            <Wifi size={32} aria-hidden="true" />
            <p>No data plans available for this network and type</p>
          </div>
        ) : (
          <div className="data-plan-grid">
            {plans.map((plan) => (
              <DataPlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlan === plan.id}
                onSelect={() => handlePlanSelect(plan.id)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedPlanData && (
        <div className="data-form__selected-plan-info">
          <div className="data-form__selected-plan-header">
            <div className="data-form__selected-plan-details">
              <h4>{selectedPlanData.name}</h4>
              <p>{selectedPlanData.dataAmount} • Valid for {selectedPlanData.validity}</p>
            </div>
            <div className="data-form__selected-plan-price">{formatCurrency(selectedPlanData.price)}</div>
          </div>
          {selectedPlanData.description && (
            <p className="data-form__selected-plan-description">{selectedPlanData.description}</p>
          )}
        </div>
      )}

      <FeeBreakdown
        servicePrice={planAmount}
        platformFee={PLATFORM_FEE}
      />

      <button
        type="submit"
        className="btn btn--primary btn--lg data-form__submit"
        disabled={submitting || !network || !selectedPlan || walletBalance === 0}
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
            Purchase Data
            <ArrowRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  )
}

export default DataForm