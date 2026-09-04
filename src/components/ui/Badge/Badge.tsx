import { ReactNode } from 'react';
import styles from './Badge.css';

export type BadgeTone = 'brand' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  tone?: BadgeTone;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', size = 'md', dot = false, className = '', children }: BadgeProps) {
  return (
    <span
      className={[
        styles.badge,
        styles[`badge--${tone}`],
        styles[`badge--${size}`],
        dot && styles['badge--dot'],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}