import { forwardRef, InputHTMLAttributes } from 'react';
import styles from './Switch.css';

export type SwitchSize = 'sm' | 'md' | 'lg';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  switchSize?: SwitchSize;
  className?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, switchSize = 'md', className = '', id, ...props }, ref) => {
    const switchId = id ?? `switch-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <label className={[styles.switch, styles[`switch--${switchSize}`], className].filter(Boolean).join(' ')} htmlFor={switchId}>
        <input
          ref={ref}
          type="checkbox"
          id={switchId}
          className={styles['switch__input']}
          role="switch"
          {...props}
        />
        <span className={styles['switch__track']} aria-hidden="true">
          <span className={styles['switch__thumb']} />
        </span>
        {label && <span className={styles['switch__label']}>{label}</span>}
      </label>
    );
  }
);

Switch.displayName = 'Switch';