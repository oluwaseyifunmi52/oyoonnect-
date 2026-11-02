import type { ButtonHTMLAttributes, ForwardRefExoticComponent, RefAttributes } from 'react'

export type FilterChipVariant = 'primary' | 'outline' | 'ghost'

interface FilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  variant?: FilterChipVariant
  selected?: boolean
  onChange?: (selected: boolean) => void
  count?: number
  children: React.ReactNode
}

export const FilterChip = Object.assign(
  (function FilterChip({
    variant = 'outline',
    selected = false,
    onChange,
    count,
    children,
    className = '',
    onClick,
    ...props
  }: FilterChipProps) {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextSelected = !selected
      onChange?.(nextSelected)
      onClick?.(event)
    }

    const baseClasses = 'filter-chip'
    const variantClasses = `filter-chip--${variant}`
    const selectedClass = selected ? 'filter-chip--selected' : ''

    return (
      <button
        type="button"
        className={`${baseClasses} ${variantClasses} ${selectedClass} ${className}`}
        aria-pressed={selected}
        onClick={handleClick}
        {...props}
      >
        <span className="filter-chip__label">{children}</span>
        {count !== undefined && count > 0 && (
          <span className="filter-chip__count">{count}</span>
        )}
      </button>
    )
  }) as ForwardRefExoticComponent<FilterChipProps & RefAttributes<HTMLButtonElement>>,
  { displayName: 'FilterChip' }
)

export default FilterChip