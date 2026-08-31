import { Search } from 'lucide-react'

interface CommunitySearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function CommunitySearch({ value, onChange, placeholder = 'Search community reports...' }: CommunitySearchProps) {
  return (
    <div className="search-wrapper">
      <Search size={18} className="search-wrapper__icon" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        aria-label="Search community reports"
      />
    </div>
  )
}
