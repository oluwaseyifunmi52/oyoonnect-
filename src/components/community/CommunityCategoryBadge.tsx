import { Badge } from '@/components/ui/Badge'
import { getCommunityCategoryLabel } from '@/types/community'
import type { CommunityUpdate } from '@/types/community'
import { MapPin, Zap, Droplets, Shield, Heart, Bus, CloudRain, Landmark, Calendar, Megaphone } from 'lucide-react'

const categoryIconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  'road-traffic': MapPin,
  electricity: Zap,
  water: Droplets,
  security: Shield,
  health: Heart,
  transport: Bus,
  'flooding-environment': CloudRain,
  'government-projects': Landmark,
  events: Calendar,
  general: Megaphone
}

export function CommunityCategoryBadge({ categoryValue }: { categoryValue: string }) {
  const Icon = categoryIconMap[categoryValue] || MapPin
  const label = getCommunityCategoryLabel(categoryValue)

  return (
    <Badge variant="neutral" className="category-badge-sm">
      <Icon size={16} aria-hidden="true" />
      {label ? (
        <>
          <span className="sr-only">{label}</span>
          {label}
        </>
      ) : null}
    </Badge>
  )
}