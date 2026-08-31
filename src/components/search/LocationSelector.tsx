import type { ChangeEvent } from 'react'
import { MapPin } from 'lucide-react'
import { locations } from '../../data/locations'



interface LocationSelectorProps {
  value: string
  onChange: (value: string) => void
  id: string
  className?: string
  ariaLabel?: string
  placeholder?: string
}

export function LocationSelector({
  value,
  onChange,
  id,
  className = '',
  ariaLabel = 'Location',
  placeholder = 'All locations',
}: LocationSelectorProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value)
  }

  return (
    <span className={`location-select ${className}`}>
      <MapPin
        size={18}
        className="location-select__icon"
        aria-hidden="true"
      />

      <select
        id={id}
        name={id}
        className="location-select__control"
        value={value}
        onChange={handleChange}
        aria-label={ariaLabel}
      >
        <option value="">{placeholder}</option>

        {locations.map((location) => (
          <option key={location.id} value={location.name}>
            {location.name}
          </option>
        ))}
      </select>
    </span>
  )
}
