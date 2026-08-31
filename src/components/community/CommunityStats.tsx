import { MapPin, Clock, Shield, CheckCircle } from 'lucide-react'
import type { CommunityReportStats } from '../../types/community'
import { StatsCard } from './StatsCard'

interface CommunityStatsProps {
  stats: CommunityReportStats | null
  loading: boolean
}

export function CommunityStats({ stats, loading }: CommunityStatsProps) {
  if (loading) {
    return (
      <div className="community-stats" role="status" aria-label="Loading statistics">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="stat-card stat-card--loading">
            <div className="skeleton skeleton--avatar" />
            <div className="skeleton skeleton--text skeleton--wide" />
            <div className="skeleton skeleton--text skeleton--mid" />
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="community-stats">
        <StatsCard icon={<MapPin size={24} />} value="—" label="Total Reports" />
        <StatsCard icon={<Clock size={24} />} value="—" label="This Week" />
        <StatsCard icon={<Shield size={24} />} value="—" label="Verified Reports" />
        <StatsCard icon={<CheckCircle size={24} />} value="—" label="Resolved Reports" />
      </div>
    )
  }

  return (
    <div className="community-stats">
      <StatsCard icon={<MapPin size={24} />} value={stats.totalReports.toLocaleString()} label="Total Reports" />
      <StatsCard icon={<Clock size={24} />} value={stats.reportsThisWeek.toLocaleString()} label="This Week" />
      <StatsCard icon={<Shield size={24} />} value={stats.verifiedReports.toLocaleString()} label="Verified Reports" />
      <StatsCard icon={<CheckCircle size={24} />} value={stats.resolvedReports.toLocaleString()} label="Resolved Reports" />
    </div>
  )
}
