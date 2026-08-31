import {
  GraduationCap,
  Home,
  HeartPulse,
  Briefcase,
  Wrench,
  Users,
  AlertTriangle,
  Shield,
  Heart,
  Flag,
  Search,
  ChevronDown,
  ArrowRight,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Clock,
  CheckCircle2,
  AlertCircle,
  HeartHandshake,
  FileText,
  MapPin,
  Check,
  X,
  Send,
  Share2,
  ExternalLink,
} from 'lucide-react'

export type HelpIconName =
  | 'graduation-cap'
  | 'home'
  | 'heart-pulse'
  | 'briefcase'
  | 'wrench'
  | 'users'
  | 'alert-triangle'
  | 'shield'
  | 'heart'
  | 'flag'
  | 'search'
  | 'chevron-down'
  | 'arrow-right'
  | 'loader2'
  | 'shield-check'
  | 'shield-alert'
  | 'shield-x'
  | 'clock'
  | 'check-circle2'
  | 'alert-circle'
  | 'heart-handshake'
  | 'file-text'
  | 'map-pin'
  | 'check'
  | 'x'
  | 'send'
  | 'share-2'
  | 'external-link'

export const helpIconMap: Record<HelpIconName, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  'graduation-cap': GraduationCap,
  'home': Home,
  'heart-pulse': HeartPulse,
  'briefcase': Briefcase,
  'wrench': Wrench,
  'users': Users,
  'alert-triangle': AlertTriangle,
  'shield': Shield,
  'heart': Heart,
  'flag': Flag,
  'search': Search,
  'chevron-down': ChevronDown,
  'arrow-right': ArrowRight,
  'loader2': Loader2,
  'shield-check': ShieldCheck,
  'shield-alert': ShieldAlert,
  'shield-x': ShieldX,
  'clock': Clock,
  'check-circle2': CheckCircle2,
  'alert-circle': AlertCircle,
  'heart-handshake': HeartHandshake,
  'file-text': FileText,
  'map-pin': MapPin,
  'check': Check,
  'x': X,
  'send': Send,
  'share-2': Share2,
  'external-link': ExternalLink,
}

export function getHelpIcon(iconName: string): React.ComponentType<React.SVGProps<SVGSVGElement>> {
  return helpIconMap[iconName as HelpIconName] || Shield
}

export function HelpIcon({ name, size = 24, className = '', ...props }: { name: string; size?: number; className?: string } & Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'size'>) {
  const IconComponent = getHelpIcon(name)
  return <IconComponent width={size} height={size} className={className} {...props} />
}
