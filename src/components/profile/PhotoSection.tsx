import { useRef, useCallback } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'
import { Camera, X } from 'lucide-react'
import { Avatar } from './Avatar'
import './PhotoSection.css'

interface PhotoSectionProps {
  src?: string | null
  initials?: string
  onAvatarChange: (_e: ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
  disabled?: boolean
}

export function PhotoSection({
  src,
  initials = 'U',
  onAvatarChange,
  onRemove,
  disabled = false,
}: PhotoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleContainerClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled])

  const handleRemoveClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      onRemove()
    },
    [onRemove],
  )

  return (
    <div className="photo-section">
      <div className="photo-section__avatar">
        <Avatar src={src ?? undefined} initials={initials} size="md" variant={src ? 'image' : 'gradient'} />
      </div>

      <div className="photo-section__actions">
        <label
          htmlFor="avatar-upload"
          className={`photo-section__btn photo-section__btn--primary ${disabled ? 'photo-section__btn--disabled' : ''}`}
        >
          <Camera size={16} aria-hidden="true" />
          Change photo
        </label>

        {src ? (
          <button
            type="button"
            className="photo-section__btn photo-section__btn--secondary"
            onClick={handleRemoveClick}
            disabled={disabled}
          >
            <X size={14} aria-hidden="true" />
            Remove
          </button>
        ) : null}
      </div>

      <input
        id="avatar-upload"
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onAvatarChange}
        disabled={disabled}
        className="photo-section__input"
        onClick={handleContainerClick}
      />

      <p className="photo-section__hint">Recommended: a square image, at least 200×200px.</p>
    </div>
  )
}
