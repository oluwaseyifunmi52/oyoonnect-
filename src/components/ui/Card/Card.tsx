import { ReactNode } from 'react';
import styles from './Card.css';

export type CardVariant = 'default' | 'elevated' | 'interactive';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  children: ReactNode;
  as?: 'div' | 'article' | 'section';
}

export function Card({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  as: Component = 'div',
}: CardProps) {
  return (
    <Component
      className={[
        styles.card,
        styles[`card--${variant}`],
        styles[`card--p-${padding}`],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Component>
  );
}

interface CardHeaderProps {
  className?: string;
  children: ReactNode;
}

export function CardHeader({ className = '', children }: CardHeaderProps) {
  return <div className={[styles['card__header'], className].filter(Boolean).join(' ')}>{children}</div>;
}

interface CardBodyProps {
  className?: string;
  children: ReactNode;
}

export function CardBody({ className = '', children }: CardBodyProps) {
  return <div className={[styles['card__body'], className].filter(Boolean).join(' ')}>{children}</div>;
}

interface CardFooterProps {
  className?: string;
  children: ReactNode;
}

export function CardFooter({ className = '', children }: CardFooterProps) {
  return <div className={[styles['card__footer'], className].filter(Boolean).join(' ')}>{children}</div>;
}

interface CardMediaProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export function CardMedia({ className = '', ...props }: CardMediaProps) {
  return <img className={[styles['card__media'], className].filter(Boolean).join(' ')} {...props} />;
}