import { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import type { Network } from '../../types/bills'

interface NetworkSelectorProps {
  networks: Network[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  label?: string
  required?: boolean
  error?: string
  showLogo?: boolean
}

export function NetworkSelector({
  networks,
  value,
  onChange,
  placeholder = 'Select network',
  disabled = false,
  label,
  required = false,
  error,
  showLogo = true,
}: NetworkSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listboxId = useId()

  const selectedNetwork = networks.find((n) => n.id === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false)
          triggerRef.current?.focus()
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (networkId: string) => {
    onChange(networkId)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div className={`network-selector ${error ? 'network-selector--error' : ''}`} ref={dropdownRef}>
      {label && <label className="network-selector__label" htmlFor={listboxId}>{label} {required && <span className="required">*</span>}</label>}
      <button
        ref={triggerRef}
        type="button"
        id={listboxId}
        className={`network-selector__trigger ${value ? 'network-selector__trigger--selected' : ''} ${disabled ? 'network-selector__trigger--disabled' : ''} ${isOpen ? 'network-selector__trigger--open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${listboxId}-listbox`}
      >
        {showLogo && selectedNetwork && (
          <span className="network-selector__logo" style={{ backgroundColor: selectedNetwork.color }}>
            {selectedNetwork.name.charAt(0)}
          </span>
        )}
        <span className="network-selector__value">
          {selectedNetwork ? selectedNetwork.name : placeholder}
        </span>
        <ChevronDown size={16} className={`network-selector__chevron ${isOpen ? 'network-selector__chevron--open' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <ul
          id={`${listboxId}-listbox`}
          className="network-selector__dropdown"
          role="listbox"
          aria-label="Select network"
          aria-activedescendant={value ? `${listboxId}-option-${value}` : undefined}
        >
          {networks.map((network) => (
            <li
              key={network.id}
              id={`${listboxId}-option-${network.id}`}
              className={`network-selector__option ${value === network.id ? 'network-selector__option--selected' : ''}`}
              role="option"
              aria-selected={value === network.id}
              onClick={() => handleSelect(network.id)}
            >
              {showLogo && (
                <span className="network-selector__logo" style={{ backgroundColor: network.color }}>
                  {network.name.charAt(0)}
                </span>
              )}
              <span className="network-selector__option-name">{network.name}</span>
              {value === network.id && <Check size={16} className="network-selector__check" />}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="network-selector__error">{error}</p>}
    </div>
  )
}