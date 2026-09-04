import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  children: ReactNode
  required?: boolean
  className?: string
}

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  children,
  required = false,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`field ${className}`}>
      <label className="field__label" htmlFor={htmlFor}>
        {label}
        {required && <span className="required" aria-hidden="true">*</span>}
      </label>
      {children}
      {error ? (
        <p className="field__error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint">{hint}</p>
      ) : null}
    </div>
  )
}