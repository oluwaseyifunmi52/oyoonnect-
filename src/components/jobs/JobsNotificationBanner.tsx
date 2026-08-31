import { Bell } from 'lucide-react'
import { Button } from '../ui/Button'

export function JobsNotificationBanner() {
  return (
    <div className="jobs-notification-banner">
      <div className="jobs-notification-banner__content container">
        <div className="jobs-notification-banner__left">
          <div
            className="jobs-notification-banner__icon"
            aria-hidden="true"
          >
            <Bell size={26} />
          </div>
          <div>
            <p className="jobs-notification-banner__title">Never Miss an Opportunity</p>
            <p className="jobs-notification-banner__desc">
              Get notified when new jobs that match your interests are posted.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="jobs-notification-banner__btn"
        >
          Enable Notifications
        </Button>
      </div>
    </div>
  )
}
