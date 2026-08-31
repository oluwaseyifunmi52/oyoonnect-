import { useState, type KeyboardEvent } from 'react'
import { Search, X } from 'lucide-react'

interface SearchInputProps {
  value?: string
  placeholder?: string
  onChange: (value: string) => void
  onClear?: () => void
  onSearch?: (value: string) => void
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

export function SearchInput({
  value = '',
  placeholder = 'Search...',
  onChange,
  onClear,
  onSearch,
  disabled = false,
  className = '',
  ariaLabel = 'Search',
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value)
    }
  }

  const clear = () => {
    onChange('')
    onClear?.()
  }

  const hasValue = value.length > 0

  return (
    <div className={`search-input-wrapper ${isFocused ? 'search-input-wrapper--focused' : ''} ${className}`}>
      <Search size={18} className="search-input__icon" aria-hidden="true" />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className="search-input__field"
        aria-label={ariaLabel}
      />
      {hasValue && (
        <button
          type="button"
          className="search-input__clear"
          onClick={clear}
          aria-label="Clear search"
          disabled={disabled}
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
