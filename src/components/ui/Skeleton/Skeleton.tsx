import { ReactNode, CSSProperties } from 'react';
import styles from './Skeleton.css';

type SkeletonVariant =
  | 'text'
  | 'heading'
  | 'button'
  | 'avatar'
  | 'card'
  | 'circle'
  | 'rounded';

type SkeletonSize = 'sm' | 'md' | 'lg' | 'xl';

interface SkeletonProps {
  variant?: SkeletonVariant;
  size?: SkeletonSize;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ variant = 'text', size = 'md', className = '', style }: SkeletonProps) {
  return (
    <div
      className={[styles.skeleton, variant !== 'text' && styles[`skeleton--${variant}`], size !== 'md' && styles[`skeleton--${size}`], className].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
      aria-label="Loading"
    />
  );
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div className={[styles['skeleton-card'], className].filter(Boolean).join(' ')} aria-hidden="true" aria-label="Loading card">
      <div className={styles['skeleton-card__media']}>
        <Skeleton variant="card" />
      </div>
      <div className={styles['skeleton-card__body']}>
        <Skeleton variant="heading" />
        <Skeleton variant="text" />
        <Skeleton variant="text" style={{ width: '80%' }} />
        <div className={styles['skeleton-card__actions']}>
          <Skeleton variant="button" style={{ width: '100px' }} />
          <Skeleton variant="button" style={{ width: '100px' }} />
        </div>
      </div>
    </div>
  );
}

interface SkeletonListProps {
  count?: number;
  className?: string;
}

export function SkeletonList({ count = 4, className = '' }: SkeletonListProps) {
  return (
    <div className={[styles['skeleton-list'], className].filter(Boolean).join(' ')} aria-hidden="true" aria-label="Loading list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles['skeleton-list__item']}>
          <Skeleton variant="avatar" size="md" className={styles['skeleton-list__item-media']} />
          <div className={styles['skeleton-list__item-content']}>
            <Skeleton variant="text" className={styles['skeleton-list__item-heading']} />
            <Skeleton variant="text" className={styles['skeleton-list__item-text']} />
            <Skeleton variant="text" className={styles['skeleton-list__item-text']} style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
  columns?: number;
  className?: string;
}

export function SkeletonGrid({ count = 6, className = '' }: SkeletonGridProps) {
  return (
    <div className={[styles['skeleton-grid'], className].filter(Boolean).join(' ')} aria-hidden="true" aria-label="Loading grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}