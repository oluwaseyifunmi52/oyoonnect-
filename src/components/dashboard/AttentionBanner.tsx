import type { ReactNode } from 'react'
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react'

export type AttentionType = 'warning' | 'info' | 'success' | 'error'

export interface AttentionItem {
  id: string
  type: AttentionType
  title: string
  description?: string
  action?: ReactNode
  dismissible?: boolean
}

interface AttentionBannerProps {
  items: AttentionItem[]
  onDismiss?: (id: string) => void
  maxVisible?: number
}

const ICON_MAP: Record<AttentionType, ReactNode> = {
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
  success: <CheckCircle size={16} />,
  error: <AlertTriangle size={16} />,
}

export function AttentionBanner({ items, onDismiss, maxVisible = 3 }: AttentionBannerProps) {
  if (items.length === 0) return null

  const visible = items.slice(0, maxVisible)

  return (
    <div className="attention-banner" role="status" aria-label="Important notices">
      {visible.map((item) => (
        <div key={item.id} className={`attention-banner__item attention-banner__item--${item.type}`}>
          <span className="attention-banner__icon" aria-hidden="true">
            {ICON_MAP[item.type]}
          </span>
          <div className="attention-banner__content">
            <span className="attention-banner__title">{item.title}</span>
            {item.description ? <span className="attention-banner__desc">{item.description}</span> : null}
            {item.action ? <span className="attention-banner__action">{item.action}</span> : null}
          </div>
          {item.dismissible && onDismiss ? (
            <button
              type="button"
              className="attention-banner__dismiss"
              onClick={() => onDismiss(item.id)}
              aria-label="Dismiss notice"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  )
}
