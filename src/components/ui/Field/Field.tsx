import { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ChangeEvent, forwardRef } from 'react';
import styles from './Field.css';

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, hint, error, children, className = '' }: FieldProps) {
  return (
    <div className={[styles.field, error && styles['field--error'], className].filter(Boolean).join(' ')}>
      <label className={styles['field__label']} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error ? (
        <p className={styles['field__error']} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className={styles['field__hint']}>{hint}</p>
      ) : null}
    </div>
  );
}

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  inputSize?: InputSize;
  id?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label = '', id, className = '', hint, error, leadingIcon, trailingIcon, inputSize = 'md', ...props }, ref) => {
    const inputId = id ?? props.name ?? label;
    const hasLeading = !!leadingIcon;
    const hasTrailing = !!trailingIcon;

    return (
      <Field label={label} htmlFor={inputId} hint={hint} error={error}>
        {hasLeading || hasTrailing ? (
          <div className={styles['field__wrapper']}>
            {hasLeading && (
              <span className={`${styles['field__icon']} ${styles['field__icon--leading']}`} aria-hidden="true">
                {leadingIcon}
              </span>
            )}
            <input
              ref={ref}
              id={inputId}
              className={[
                styles['field__input'],
                styles[`field__input--${inputSize}`],
                hasLeading && styles['field__input--with-leading'],
                hasTrailing && styles['field__input--with-trailing'],
                className,
              ]
                .filter(Boolean)
                .join(' ')}
              {...props}
            />
            {hasTrailing && (
              <span className={`${styles['field__icon']} ${styles['field__icon--trailing']}`} aria-hidden="true">
                {trailingIcon}
              </span>
            )}
          </div>
        ) : (
          <input
            ref={ref}
            id={inputId}
            className={[styles['field__input'], styles[`field__input--${inputSize}`], className].filter(Boolean).join(' ')}
            {...props}
          />
        )}
      </Field>
    );
  }
);

Input.displayName = 'Input';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type SelectSize = 'sm' | 'md' | 'lg';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange'> {
  label?: string;
  hint?: string;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
  leadingIcon?: ReactNode;
  selectSize?: SelectSize;
  onChange?: (value: string) => void;
  id?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, className = '', options = [], placeholder = 'Select an option', leadingIcon, selectSize = 'md', onChange, error, hint, children, ...props }, ref) => {
    const selectId = id ?? props.name ?? label ?? 'select';
    const hasLeading = !!leadingIcon;
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      if (onChange) onChange(value);
    };

    return (
      <Field label={label ?? ''} htmlFor={selectId} hint={hint} error={error}>
        {hasLeading ? (
          <div className={styles['field__wrapper']}>
            <span className={`${styles['field__icon']} ${styles['field__icon--leading']}`} aria-hidden="true">
              {leadingIcon}
            </span>
            <select
              ref={ref}
              id={selectId}
              className={[
                styles['field__select'],
                styles[`field__select--${selectSize}`],
                styles['field__input--with-leading'],
                className,
              ]
                .filter(Boolean)
                .join(' ')}
              onChange={handleChange}
              {...props}
            >
              {placeholder && <option value="">{placeholder}</option>}
              {options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
              {children}
            </select>
          </div>
        ) : (
          <select
            ref={ref}
            id={selectId}
            className={[styles['field__select'], styles[`field__select--${selectSize}`], className].filter(Boolean).join(' ')}
            onChange={handleChange}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
            {children}
          </select>
        )}
      </Field>
    );
  }
);

Select.displayName = 'Select';

type TextareaSize = 'sm' | 'md' | 'lg';

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'cols' | 'rows'> {
  label: string;
  hint?: string;
  error?: string;
  textareaSize?: TextareaSize;
  id?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, className = '', hint, error, textareaSize = 'md', ...props }, ref) => {
    const textareaId = id ?? props.name ?? label;

    return (
      <Field label={label} htmlFor={textareaId} hint={hint} error={error}>
        <textarea
          ref={ref}
          id={textareaId}
          className={[styles['field__textarea'], styles[`field__textarea--${textareaSize}`], className].filter(Boolean).join(' ')}
          {...props}
        />
      </Field>
    );
  }
);

Textarea.displayName = 'Textarea';