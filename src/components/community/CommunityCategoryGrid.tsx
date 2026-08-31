import { communityCategories } from '../../data/communityCategories'
import { CommunityCategoryCard } from './CommunityCategoryCard'
import { communityReportsService } from '../../services/communityReportsService'
import type { CommunityCategory } from '../../types/community'
import { useEffect, useState } from 'react'

interface CategoryGridProps {
  showReportCounts?: boolean
}

export function CommunityCategoryGrid({ showReportCounts = true }: CategoryGridProps) {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(showReportCounts)

  useEffect(() => {
    if (!showReportCounts) return

    const loadCounts = async () => {
      setLoading(true)
      try {
        const result: Record<string, number> = {}
        await Promise.all(
          communityCategories.map(async (cat) => {
            try {
              const reports = await communityReportsService.search({ category: cat.slug as CommunityCategory })
              result[cat.slug] = reports.length
            } catch {
              result[cat.slug] = 0
            }
          }),
        )
        setCounts(result)
      } catch {
        setCounts({})
      } finally {
        setLoading(false)
      }
    }
    loadCounts()
  }, [showReportCounts])

  return (
    <div
      className="community-categories"
      role="list"
      aria-label="Community report categories"
    >
      {communityCategories.map((category) => (
        <CommunityCategoryCard
          key={category.slug}
          category={category}
          reportCount={loading ? undefined : counts[category.slug]}
        />
      ))}
    </div>
  )
}
