import { Link } from 'react-router-dom'
import { ArrowRight, Users, Heart, Eye, Share2, MessageSquare, Star } from 'lucide-react'
import { formatCurrency } from '../../utils/currency'
import type { SocialMediaPlatform, SocialMediaService } from '../../types/bills'
import type { LucideIcon } from 'lucide-react'

interface SocialMediaGridProps {
  platforms: SocialMediaPlatform[]
}

const serviceIcons: Record<string, LucideIcon> = {
  followers: Users,
  likes: Heart,
  views: Eye,
  shares: Share2,
  comments: MessageSquare,
  subscribers: Users,
  watchtime: Star,
  retweets: Share2,
  members: Users,
  reactions: Heart,
  'post-likes': Heart,
  'post-shares': Share2,
  'post-views': Eye,
  'video-views': Eye,
  replies: MessageSquare,
}

export function SocialMediaGrid({ platforms }: SocialMediaGridProps) {
  if (platforms.length === 0) {
    return (
      <div className="empty-state">
        <Users size={48} aria-hidden="true" />
        <h3>No platforms available</h3>
        <p>Check back later for social media services.</p>
      </div>
    )
  }

  return (
    <div className="social-media-grid">
      {platforms.map((platform) => (
        <div key={platform.id} className="social-platform-card">
          <div className="social-platform-card__header" style={{ borderColor: platform.color }}>
            <div className="social-platform-card__icon" style={{ backgroundColor: platform.color + '20' }}>
              <i className="social-platform-card__icon-svg" data-lucide={platform.icon} style={{ color: platform.color }} aria-hidden="true" />
            </div>
            <h3 className="social-platform-card__name">{platform.name}</h3>
          </div>
          <div className="social-platform-card__services">
            {platform.services.map((service) => {
              const ServiceIcon = serviceIcons[service.id.replace(`${platform.id}-`, '')] || Heart
              return (
                <Link key={service.id} to={`/services/social-media/${platform.id}/${service.id}`} className="social-service-card">
                  <div className="social-service-card__icon" style={{ backgroundColor: platform.color + '15' }}>
                    <ServiceIcon size={18} style={{ color: platform.color }} aria-hidden="true" />
                  </div>
                  <div className="social-service-card__content">
                    <h4 className="social-service-card__name">{service.name}</h4>
                    <p className="social-service-card__description">{service.description}</p>
                    <div className="social-service-card__pricing">
                      <span className="social-service-card__price">{formatCurrency(service.price)}</span>
                      <span className="social-service-card__unit">{service.unit}</span>
                    </div>
                    {service.disclaimer && (
                      <p className="social-service-card__disclaimer">{service.disclaimer}</p>
                    )}
                  </div>
                  <ArrowRight size={16} className="social-service-card__arrow" style={{ color: platform.color }} aria-hidden="true" />
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SocialMediaGrid