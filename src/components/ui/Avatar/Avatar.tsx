import { ReactNode } from 'react';
import { User } from 'lucide-react';
import styles from './Avatar.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ src, alt, name, size = 'md', status, className = '' }: AvatarProps) {
  const initials = name ? getInitials(name) : '?';
  const hasImage = !!src;

  return (
    <span className={[styles.avatar, styles[`avatar--${size}`], className].filter(Boolean).join(' ')} style={{ position: 'relative' }}>
      {hasImage ? (
        <img
          className={styles['avatar__image']}
          src={src}
          alt={alt || name || 'Avatar'}
          aria-hidden="true"
        />
      ) : (
        <span className={styles['avatar__fallback']} aria-hidden="true">
          <User size={size === 'xs' ? 10 : size === 'sm' ? 14 : size === 'md' ? 16 : size === 'lg' ? 20 : size === 'xl' ? 24 : 28} />
        </span>
      )}
      {status && (
        <span
          className={[
            styles['avatar__status'],
            styles[`avatar__status--${status}`],
          ].join(' ')}
          aria-label={status}
        />
      )}
    </span>
  );
}