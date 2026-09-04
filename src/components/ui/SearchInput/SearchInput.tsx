import { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchInput.css';

export type SearchInputSize = 'sm' | 'md' | 'lg';

interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  disabled?: boolean;
  size?: SearchInputSize;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export function SearchInput({
  value = '',
  placeholder = 'Search...',
  onChange,
  onClear,
  onSearch,
  disabled = false,
  size = 'md',
  className = '',
  'aria-label': ariaLabel = 'Search',
  'aria-describedby': ariaDescribedBy,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div
      className={[
        styles['search-input'],
        styles[`search-input--${size}`],
        isFocused && styles['search-input--focused'],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Search
        className={styles['search-input__icon']}
        size={size === 'sm' ? 16 : size === 'lg' ? 22 : 20}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className={styles['search-input__field']}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      />
      {hasValue && !disabled && (
        <button
          type="button"
          className={styles['search-input__clear']}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}