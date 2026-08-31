import { Radio, Check } from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import type { DataPlan } from '../../types/bills'

interface DataPlanCardProps {
  plan: DataPlan
  selected: boolean
  onSelect: () => void
  disabled?: boolean
  showType?: boolean
}

export function DataPlanCard({
  plan,
  selected,
  onSelect,
  disabled = false,
  showType = true,
}: DataPlanCardProps) {
  const typeLabels: Record<DataPlan['type'], string> = {
    regular: 'Regular',
    sme: 'SME Share',
    corporate: 'Corporate',
    gifting: 'Gifting',
  }

  const typeColors: Record<DataPlan['type'], string> = {
    regular: '#0066CC',
    sme: '#009933',
    corporate: '#663399',
    gifting: '#FF6600',
  }

  return (
    <button
      type="button"
      className={`data-plan-card ${selected ? 'data-plan-card--selected' : ''} ${disabled ? 'data-plan-card--disabled' : ''}`}
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
    >
      {showType && (
        <span
          className="data-plan-card__type-badge"
          style={{ backgroundColor: typeColors[plan.type] }}
        >
          {typeLabels[plan.type]}
        </span>
      )}
      <div className="data-plan-card__header">
        <span className="data-plan-card__data-amount">{plan.dataAmount}</span>
      </div>
      <div className="data-plan-card__body">
        <div className="data-plan-card__validity">
          <Radio size={14} />
          <span>Valid for {plan.validity}</span>
        </div>
        {plan.description && <p className="data-plan-card__description">{plan.description}</p>}
      </div>
      <div className="data-plan-card__footer">
        <span className="data-plan-card__price">{formatCurrency(plan.price)}</span>
        {selected && <Check size={20} className="data-plan-card__check" />}
      </div>
    </button>
  )
}