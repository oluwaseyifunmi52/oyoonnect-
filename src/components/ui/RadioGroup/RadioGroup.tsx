import { forwardRef, InputHTMLAttributes, ChangeEvent } from 'react';
import styles from './RadioGroup.css';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  card?: boolean;
  className?: string;
}

export function Radio({ label, description, card = false, className = '', id, ...props }: RadioProps) {
  const radioId = id ?? `radio-${Math.random().toString(36).slice(2, 9)}`;

  if (card) {
    return (
      <label
        className={[
          styles.radio,
          styles['radio--card'],
          props.checked ? styles['radio--checked'] : '',
          props.disabled && styles['radio--disabled'],
          className,
        ].filter(Boolean).join(' ')}
        htmlFor={radioId}
      >
        <input
          type="radio"
          id={radioId}
          className={styles['radio__input']}
          {...props}
        />
        <span className={styles['radio__circle']} aria-hidden="true" />
        <div className={styles['radio__card-content']}>
          <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{label}</span>
          {description && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{description}</span>}
        </div>
      </label>
    );
  }

  return (
    <label className={[styles.radio, className].filter(Boolean).join(' ')} htmlFor={radioId}>
      <input type="radio" id={radioId} className={styles['radio__input']} {...props} />
      <span className={styles['radio__circle']} aria-hidden="true" />
      <span className={styles['radio__label']}>{label}</span>
    </label>
  );
}

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  label?: string;
  inline?: boolean;
  card?: boolean;
  className?: string;
  error?: boolean;
  required?: boolean;
}

export function RadioGroup({ name, value, onChange, options, label, inline = false, card = false, className = '', error, required }: RadioGroupProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <fieldset className={[styles['radio-group'], inline && styles['radio-group--inline'], error && styles['radio-group--error'], className].filter(Boolean).join(' ')} aria-invalid={error}>
      {label && <legend className={styles['radio-group__label']}>{label}{required && <span style={{ color: 'var(--color-error)', marginLeft: 'var(--space-1)' }}>*</span>}</legend>}
      <div role="radiogroup" aria-required={required} aria-invalid={error}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={handleChange}
            disabled={option.disabled}
            label={option.label}
            description={option.description}
            card={card}
            id={`${name}-${option.value}`}
            required={required}
          />
        ))}
      </div>
    </fieldset>
  );
}