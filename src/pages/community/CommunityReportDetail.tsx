import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { ButtonLink } from '../../components/ui/Button'
import { BackButton } from '../../components/ui/BackButton'
import { EmptyState } from '../../components/ui/EmptyState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { CommunityReportDetails } from '../../components/community/CommunityReportDetails'
import { communityReportsService, communityCommentsService } from '../../services/communityReportsService'
import { useAuth } from '../../context/AuthContext'
import type { CommunityReport, CommunityComment } from '../../types/community'

export function CommunityReportDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [report, setReport] = useState<CommunityReport | null>(null)
  const [comments, setComments] = useState<CommunityComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const loadReport = async () => {
      setLoading(true)
      setError(null)
      try {
        const [reportData, commentsData] = await Promise.all([
          communityReportsService.getById(id),
          communityCommentsService.getByReport(id),
        ])

        if (reportData) {
          setReport(reportData)
          setComments(commentsData)
        } else {
          setError('Report not found')
        }
      } catch (err) {
        setError('Failed to load report. Please try again.')
        setReport(null)
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [id])

  const handleUpvote = async () => {
    if (!report || !report.id) return
    try {
      await communityReportsService.upvote(report.id)
      setReport((prev) => (prev ? { ...prev, upvotes: prev.upvotes + 1 } : prev))
    } catch {
      // Silently handle
    }
  }

  const handleDownvote = async () => {
    if (!report || !report.id) return
    try {
      await communityReportsService.downvote(report.id)
      setReport((prev) => (prev ? { ...prev, downvotes: prev.downvotes + 1 } : prev))
    } catch {
      // Silently handle
    }
  }

  const handleAddComment = async (content: string) => {
    if (!report || !report.id || !user) return

    try {
      const newComment = await communityCommentsService.create(report.id, user.id, content)
      setComments((prev) => [...prev, newComment])
    } catch {
      // Silently handle - could add a toast
    }
  }

  if (loading) {
    return (
      <main className="page community-report-detail">
        <div className="container">
          <BackButton fallback="/community" variant="ghost" size="sm" className="page-back-link" showLabel={false} />
          <div className="skeleton-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (error || !report) {
    return (
      <main className="page community-report-detail container">
        <BackButton fallback="/community" variant="ghost" size="sm" className="page-back-link" showLabel={false} />
        <EmptyState
          icon={<MapPin size={48} />}
          title={error || 'Report not found'}
          description={
            error
              ? 'There was an error loading this report. Please try again.'
              : 'The requested community report could not be found.'
          }
          action={
            <ButtonLink to="/community" variant="primary">
              Back to Community
            </ButtonLink>
          }
        />
      </main>
    )
  }

  return (
    <main className="page community-report-detail">
      <div className="container">
        <BackButton fallback="/community" variant="ghost" size="sm" className="page-back-link" showLabel={false} />

        <CommunityReportDetails
          report={report}
          comments={comments}
          currentUserId={user?.id}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
          onSubmitComment={handleAddComment}
        />
      </div>
    </main>
  )
}

export default CommunityReportDetail
