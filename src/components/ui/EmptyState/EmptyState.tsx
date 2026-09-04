import { ReactNode } from 'react';
import { Button, ButtonLink } from '../Button/Button';
import styles from './EmptyState.css';

export type EmptyStateTone = 'default' | 'brand' | 'success' | 'warning' | 'error';

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

interface EmptyStateProps {
  icon?: ReactNode;
  tone?: EmptyStateTone;
  title: string;
  description?: string;
  actions?: EmptyStateAction[];
  className?: string;
}

export function EmptyState({
  icon,
  tone = 'default',
  title,
  description,
  actions = [],
  className = '',
}: EmptyStateProps) {
  const iconToneMap: Record<EmptyStateTone, string> = {
    default: '',
    brand: styles['empty-state__icon--brand'],
    success: styles['empty-state__icon--success'],
    warning: styles['empty-state__icon--warning'],
    error: styles['empty-state__icon--error'],
  };

  return (
    <div className={[styles['empty-state'], className].filter(Boolean).join(' ')} role="status" aria-live="polite">
      <div className={[styles['empty-state__icon'], iconToneMap[tone]].filter(Boolean).join(' ')} aria-hidden="true">
        {icon}
      </div>
      <h3 className={styles['empty-state__title']}>{title}</h3>
      {description && <p className={styles['empty-state__description']}>{description}</p>}
      {actions.length > 0 && (
        <div className={styles['empty-state__actions']}>
          {actions.map((action, index) => (
            action.href ? (
              <ButtonLink
                key={index}
                to={action.href}
                variant={action.variant || 'primary'}
                size="md"
              >
                {action.label}
              </ButtonLink>
            ) : (
              <Button
                key={index}
                variant={action.variant || 'primary'}
                size="md"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )
          ))}
        </div>
      )}
    </div>
  );
}