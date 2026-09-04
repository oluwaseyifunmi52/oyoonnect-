import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import styles from './Breadcrumb.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function Breadcrumb({ items, separator = <ChevronRight size={14} />, className = '', 'aria-label': ariaLabel = 'Breadcrumb' }: BreadcrumbProps) {
  return (
    <nav className={[styles.breadcrumb, className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      <ol className={styles['breadcrumb__list']}>
        {items.map((item, index) => (
          <li key={index} className={styles['breadcrumb__item']}>
            {index > 0 && <span className={styles['breadcrumb__separator']} aria-hidden="true">{separator}</span>}
            {item.current || !item.href ? (
              <span className={styles['breadcrumb__current']} aria-current={item.current ? 'page' : undefined}>
                {item.label}
              </span>
            ) : (
              <Link to={item.href} className={styles['breadcrumb__link']}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}