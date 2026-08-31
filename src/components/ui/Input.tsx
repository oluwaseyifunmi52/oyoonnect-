import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode, ChangeEvent, TextareaHTMLAttributes } from 'react'

interface FieldProps {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  children: ReactNode
}

function Field({ label, htmlFor, hint, error, children }: FieldProps) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error ? <p className="field__hint">{hint}</p> : null}
      {error ? <p className="field__error">{error}</p> : null}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  icon?: ReactNode
  rightIcon?: ReactNode
}

export function Input({ label = '', id, className = '', hint, error, icon, rightIcon, ...props }: InputProps) {
  const inputId = id ?? props.name ?? label
  const hasIcon = !!icon
  const hasRight = !!rightIcon

  return (
    <Field label={label} htmlFor={inputId} hint={hint} error={error}>
      {hasIcon || hasRight ? (
        <div className="input-wrapper">
          {hasIcon ? <span className="input-icon" aria-hidden="true">{icon}</span> : null}
          <input id={inputId} className={`input ${className}`} {...props} />
          {hasRight ? <span className="input-icon input-icon--right" aria-hidden="true">{rightIcon}</span> : null}
        </div>
      ) : (
        <input id={inputId} className={`input ${className}`} {...props} />
      )}
    </Field>
  )
}

export interface SelectOption {
  value: string
  label: string
}

type SelectHTMLProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'onChange'>

interface SelectProps extends SelectHTMLProps {
  label?: string
  options?: SelectOption[]
  placeholder?: string
  icon?: ReactNode
  children?: ReactNode
  onChange?: (value: string) => void
  error?: string
}

export function Select({
  label,
  id,
  className = '',
  options = [],
  placeholder = 'Select an option',
  icon,
  children,
  onChange,
  error,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name ?? label ?? 'select'
  const hasIcon = !!icon
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    if (onChange) onChange(value)
  }
  return (
    <Field label={label ?? ''} htmlFor={selectId} error={error}>
      {hasIcon ? (
        <div className="input-wrapper">
          <span className="input-icon" aria-hidden="true">{icon}</span>
          <select id={selectId} className={`input input--select ${className}`} onChange={handleChange} {...props}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            {children}
          </select>
        </div>
      ) : (
        <select id={selectId} className={`input input--select ${className}`} onChange={handleChange} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
      )}
    </Field>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
  error?: string
}

export function Textarea({ label, id, className = '', hint, error, ...props }: TextareaProps) {
  const textareaId = id ?? props.name ?? label
  return (
    <Field label={label} htmlFor={textareaId} hint={hint} error={error}>
      <textarea id={textareaId} className={`input textarea ${className}`} {...props} />
    </Field>
  )
}