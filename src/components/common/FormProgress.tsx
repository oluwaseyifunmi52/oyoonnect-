import { Check } from 'lucide-react'

interface FormProgressProps {
  steps: { label: string; href?: string }[]
  currentStep: number
  completedSteps?: number[]
  className?: string
}

export function FormProgress({
  steps,
  currentStep,
  completedSteps = [],
  className = '',
}: FormProgressProps) {
  return (
    <nav className={`form-progress ${className}`} aria-label="Form progress">
      <ol className="form-progress-list" role="list">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = completedSteps.includes(stepNumber)
          const isCurrent = stepNumber === currentStep
          const isFuture = stepNumber > currentStep
          const isLast = index === steps.length - 1

          return (
            <li key={step.label} className="form-progress-item">
              <div className="form-progress-step">
                <button
                  type="button"
                  className={`form-progress-button ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''}`}
                  onClick={() => step.href && window.location.assign(step.href)}
                  disabled={isFuture}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-disabled={isFuture}
                >
                  <span className="form-progress-icon" aria-hidden="true">
                    {isCompleted ? <Check size={16} /> : stepNumber}
                  </span>
                </button>
                <span className="form-progress-label">{step.label}</span>
              </div>
              {!isLast && (
                <div
                  className={`form-progress-line ${isCompleted ? 'completed' : ''}`}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}