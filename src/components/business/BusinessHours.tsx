import { Clock, Sun, Moon } from 'lucide-react'
import type { OpeningHour } from '../../types/business'

interface BusinessHoursProps {
  hours: OpeningHour[]
  className?: string
}

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function getDayStatus(hours: string): { isOpen: boolean; label: string } {
  const now = new Date()

  // This is a simplified check - in production you'd parse the hours properly
  if (hours.toLowerCase().includes('closed') || hours.toLowerCase().includes('by appointment')) {
    return { isOpen: false, label: 'Closed' }
  }

  // Mock logic - assume open during business hours
  const currentHour = now.getHours()
  return {
    isOpen: currentHour >= 8 && currentHour < 22,
    label: currentHour >= 8 && currentHour < 22 ? 'Open now' : 'Closed',
  }
}

export function BusinessHours({ hours, className = '' }: BusinessHoursProps) {
  // Sort hours by day order
  const sortedHours = [...hours].sort((a, b) => {
    const aIndex = dayOrder.findIndex((d) => a.days.includes(d))
    const bIndex = dayOrder.findIndex((d) => b.days.includes(d))
    return aIndex - bIndex
  })

  return (
    <div className={`business-hours ${className}`}>
      <dl className="business-hours-list">
        {sortedHours.map((entry) => {
          const status = getDayStatus(entry.hours)
          return (
            <div key={entry.days} className="business-hours-item">
              <dt className="business-hours-day">{entry.days}</dt>
              <dd className="business-hours-time">
                <span className={status.isOpen ? 'open' : ''}>
                  {status.isOpen ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}
                  {entry.hours}
                </span>
                <span className={`business-hours-status ${status.isOpen ? 'open' : 'closed'}`}>
                  {status.label}
                </span>
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}

export function BusinessHoursCompact({ hours }: { hours: OpeningHour[] }) {
  const now = new Date()
  const currentDay = dayOrder[now.getDay()]
  const todayEntry = hours.find((h) => h.days.includes(currentDay))
  const status = todayEntry ? getDayStatus(todayEntry.hours) : { isOpen: false, label: 'Closed' }

  return (
    <div className="business-hours-compact">
      <Clock size={14} aria-hidden="true" />
      <span className={status.isOpen ? 'open' : 'closed'}>
        {status.isOpen ? 'Open now' : 'Closed'} · {todayEntry?.hours || 'No hours'}
      </span>
    </div>
  )
}