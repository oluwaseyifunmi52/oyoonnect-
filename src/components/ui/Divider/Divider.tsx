import styles from './Divider.css';

interface DividerProps {
  vertical?: boolean;
  dashed?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function Divider({ vertical = false, dashed = false, children, className = '' }: DividerProps) {
  if (children) {
    return (
      <div className={[styles['divider'], styles['divider--with-text'], className].filter(Boolean).join(' ')} role="separator">
        {children}
      </div>
    );
  }

  if (vertical) {
    return <div className={[styles.divider, styles['divider--vertical'], dashed && styles['divider--dashed'], className].filter(Boolean).join(' ')} role="separator" />;
  }

  return <hr className={[styles.divider, dashed && styles['divider--dashed'], className].filter(Boolean).join(' ')} role="separator" />;
}