import { forwardRef, InputHTMLAttributes } from 'react';
import { Check, Minus } from 'lucide-react';
import styles from './Checkbox.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  indeterminate?: boolean;
  error?: boolean;
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate, error, className = '', id, ...props }, ref) => {
    const checkboxId = id ?? `checkbox-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <label className={[styles.checkbox, error && styles['checkbox--error'], className].filter(Boolean).join(' ')} htmlFor={checkboxId}>
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={styles['checkbox__input']}
          aria-checked={indeterminate ? 'mixed' : props.checked}
          {...props}
        />
        <span className={styles['checkbox__box']} aria-hidden="true">
          {indeterminate ? <Minus size={10} /> : <Check size={10} />}
        </span>
        {label && <span className={styles['checkbox__label']}>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';