import { useEffect, useState } from 'react'
import { CommunityHero } from '../../components/community/CommunityHero'
import { CommunityStats } from '../../components/community/CommunityStats'
import { CommunityCategoryGrid } from '../../components/community/CommunityCategoryGrid'
import { CommunityReportList } from '../../components/community/CommunityReportList'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { communityReportsService } from '../../services/communityReportsService'
import type { CommunityReportStats } from '../../types/community'

export function CommunityHome() {
  const [stats, setStats] = useState<CommunityReportStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await communityReportsService.getStats()
        setStats(data)
      } catch {
        setStats(null)
      } finally {
        setStatsLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <main className="page community-home">
      <div className="container">
        <CommunityHero
          onReportClick={() => {}}
          onBrowseClick={() => {}}
        />

        <CommunityStats stats={stats} loading={statsLoading} />

        <SectionHeading
          eyebrow="Report Categories"
          title="What&#39;s Happening Near You"
          subtitle="Select a category to view recent community reports"
        />

        <CommunityCategoryGrid showReportCounts={true} />

        <SectionHeading
          eyebrow="Recent Activity"
          title="Latest Community Reports"
          subtitle="Recent updates from communities across Oyo State"
        />

        <CommunityReportList limit={6} />
      </div>
    </main>
  )
}

export default CommunityHome
