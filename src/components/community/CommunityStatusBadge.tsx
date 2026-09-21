import { Badge } from '@/components/ui/Badge'
import type { CommunityUpdateStatus } from '@/types/community'

const statusConfig: Record<CommunityUpdateStatus, { label: string; variant: 'error' | 'warning' | 'neutral' | 'success' | 'info'; icon: React.ReactNode }> = {
  reported: {
    label: 'Reported',
    variant: 'error',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Zm.988 8.903-2.846 1.155 1.182 3.027-2.018 1.55L13.61 15.088l-1.738 2.825 2.078 3.715 3.028-1.182-1.183 3.027 1.738-2.825L14.746 18.9l2.098-3.716-1.183-3.027Z" /></svg>,
  },
  investigating: {
    label: 'Under Investigation',
    variant: 'warning',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c1.103 0 2 .897 2 2s-.897 2-2 2-2 .897-2-2 .897-2 2-2m0-2C7.015 4 4 7.015 4 12s3.015 8 7 8 7-3.015 7-8-3.015-8-7-8m0 9.5c1.397 0 2.5-1.103 2.5-2.5s-1.103-2.5-2.5-2.5-2.5 1.103-2.5 2.5 1.103 2.5 2.5 2.5m7.5 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" /></svg>,
  },
  ongoing: {
    label: 'Ongoing',
    variant: 'neutral',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.57l-6.18 3.25L7 9.75l-5 4.87 1.18-6.88L2 14.81l5-4.87L12 3.25l6.9 1.65 3.09-6.26L12 2Z" /></svg>,
  },
  resolved: {
    label: 'Resolved',
    variant: 'success',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" /></svg>,
  },
  information: {
    label: 'Information',
    variant: 'info',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM12 9.17 6 17.83 5 18.33l7 1.5 7-1.5 1.95-6.83 7 1.5-7 1.5L12 9.17Z" /></svg>,
  },
}

export function CommunityStatusBadge({ status }: { status: CommunityUpdateStatus }) {
  const cfg = statusConfig[status]
  return (
    <Badge variant={cfg.variant} className="status-badge-sm">
      {cfg.icon}
      <span className="sr-only">{cfg.label}</span>
      {cfg.label}
    </Badge>
  )
}
