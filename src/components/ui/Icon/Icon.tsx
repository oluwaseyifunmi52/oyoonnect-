import { ReactElement, SVGProps, isValidElement, cloneElement } from 'react';
import styles from './Icon.css';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'size'> {
  children: ReactElement;
  size?: IconSize;
  className?: string;
}

export function Icon({ children, size = 'md', className = '', ...props }: IconProps) {
  const dimension = SIZE_MAP[size];

  return (
    <span className={[styles.icon, className].filter(Boolean).join(' ')} style={{ width: dimension, height: dimension }} aria-hidden="true">
      {isValidElement(children) ? cloneElement(children as ReactElement<SVGProps<SVGSVGElement>>, { width: dimension, height: dimension }) : children}
    </span>
  );
}

/* Helper for lucide-react icons */
export function LucideIcon({ icon: IconComponent, size = 'md', className = '', ...props }: { icon: React.ComponentType<SVGProps<SVGSVGElement>>; size?: IconSize; className?: string } & Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'size'>) {
  const dimension = SIZE_MAP[size];
  return <IconComponent width={dimension} height={dimension} className={className} {...props} />;
}