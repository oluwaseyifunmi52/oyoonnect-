import { useRef, useState, type KeyboardEvent, type ForwardRefExoticComponent, type RefAttributes } from 'react'
import { Search, X } from 'lucide-react'
import './SearchInput.css'

interface SearchInputProps {
  value?: string
  placeholder?: string
  onChange: (value: string) => void
  onClear?: () => void
  onSearch?: (value: string) => void
  disabled?: boolean
  className?: string
  ariaLabel?: string
  autoFocus?: boolean
}

export const SearchInput = Object.assign(
  (function SearchInput({
    value = '',
    placeholder = 'Search...',
    onChange,
    onClear,
    onSearch,
    disabled = false,
    className = '',
    ariaLabel = 'Search',
    autoFocus = false,
  }: SearchInputProps) {
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(value)
      }
    }

    const clear = () => {
      onChange('')
      onClear?.()
      inputRef.current?.focus()
    }

    const hasValue = value.length > 0

    return (
      <div className={`search-input-wrapper ${isFocused ? 'search-input-wrapper--focused' : ''} ${className}`}>
        <Search size={20} className="search-input__icon" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          autoFocus={autoFocus}
          className="search-input__field"
          aria-label={ariaLabel}
        />
        {hasValue && !disabled && (
          <button
            type="button"
            className="search-input__clear"
            onClick={clear}
            aria-label="Clear search"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    )
  }) as ForwardRefExoticComponent<SearchInputProps & RefAttributes<HTMLDivElement>>,
  { displayName: 'SearchInput' }
)