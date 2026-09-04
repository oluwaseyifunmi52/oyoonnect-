import { useEffect, useRef, type ReactNode, type KeyboardEvent, type ForwardRefExoticComponent, type RefAttributes } from 'react'
import { X } from 'lucide-react'
import './Modal.css'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export const Modal = Object.assign(
  (function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
  }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const previousActiveElement = useRef<HTMLElement | null>(null)

    useEffect(() => {
      if (isOpen) {
        previousActiveElement.current = document.activeElement as HTMLElement
        document.body.style.overflow = 'hidden'
        modalRef.current?.focus()

        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape' && closeOnEscape) {
            onClose()
          }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
          document.removeEventListener('keydown', handleKeyDown)
          document.body.style.overflow = ''
          previousActiveElement.current?.focus()
        }
      }
    }, [isOpen, onClose, closeOnEscape])

    if (!isOpen) return null

    const modalContent = (
      <div
        className="modal__backdrop"
        onClick={closeOnOverlayClick ? onClose : undefined}
        role="presentation"
      >
        <div
          ref={modalRef}
          className={`modal__content modal__content--${size}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
          tabIndex={-1}
        >
          {(title || showCloseButton) && (
            <div className="modal__header">
              {title && <h2 id="modal-title" className="modal__title">{title}</h2>}
              {description && <p id="modal-description" className="modal__description">{description}</p>}
              {showCloseButton && (
                <button
                  type="button"
                  className="modal__close"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              )}
            </div>
          )}
          <div className="modal__body">
            {children}
          </div>
        </div>
      </div>
    )

    return createPortal(modalContent, document.body)
  }) as ForwardRefExoticComponent<ModalProps & RefAttributes<HTMLDivElement>>,
  { displayName: 'Modal' }
)