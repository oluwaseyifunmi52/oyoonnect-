import type { HTMLAttributes, ForwardRefExoticComponent, RefAttributes, ReactNode } from 'react'
import './ProfileCard.css'

interface ProfileCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  children: ReactNode
}

export const ProfileCard = Object.assign(
  (function ProfileCard({ title, description, children, className = '', ...props }: ProfileCardProps) {
    return (
      <div className={`profile-card ${className}`} {...props}>
        <div className="profile-card__header">
          <h2 className="profile-card__title">{title}</h2>
          {description ? <p className="profile-card__description">{description}</p> : null}
        </div>
        <div className="profile-card__body">{children}</div>
      </div>
    )
  }) as ForwardRefExoticComponent<ProfileCardProps & RefAttributes<HTMLDivElement>>,
  { displayName: 'ProfileCard' }
)
