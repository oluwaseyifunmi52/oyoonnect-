import { useEffect, useState } from 'react'
import {
  BadgeCheck, BarChart2, Briefcase, Building2, FileText, LifeBuoy, Users,
  AlertTriangle, Clock, Shield, Server, Database, Globe, Lock, CheckCircle2,
  Wifi, Activity, TrendingUp, AlertCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { adminService, type AdminDashboardStats, type AdminPendingAction, type AdminSystemStatus } from '../../services/adminService'
import {
  DashboardHeader,
  StatCard,
  QuickActionCard,
  ActivityList,
  DashboardSkeleton,
} from '../../components/dashboard'
import type { ActivityItem } from '../../components/dashboard'
import { EmptyState } from '../../components/ui/EmptyState'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { formatDate } from '../../utils/date'

function buildActivityItems(pendingActions: AdminPendingAction[]): ActivityItem[] {
  return pendingActions.slice(0, 5).map((action) => ({
    id: action.id,
    icon: getActionIcon(action.type),
    title: action.title,
    description: action.description,
    timestamp: action.createdAt,
    to: action.actionUrl,
    iconColor: getActionColor(action.priority),
  }))
}

function getActionIcon(type: AdminPendingAction['type']): typeof BadgeCheck {
  switch (type) {
    case 'business_verification': return BadgeCheck
    case 'job_review': return Briefcase
    case 'community_report': return FileText
    case 'help_request': return LifeBuoy
    case 'payout': return Shield
    default: return BadgeCheck
  }
}

function getActionColor(priority: AdminPendingAction['priority']): string {
  switch (priority) {
    case 'high': return '#ef4444'
    case 'medium': return '#f59e0b'
    case 'low': return '#3b82f6'
    default: return '#64748b'
  }
}

function formatPriority(priority: AdminPendingAction['priority']): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

function AdminDashboard() {
  const { user, isAdmin, initializing } = useAuth()
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: null,
    totalBusinesses: null,
    pendingVerifications: null,
    verifiedBusinesses: null,
    activeJobs: null,
    pendingJobReviews: null,
    communityReports: null,
    pendingHelpRequests: null,
  })
  const [pendingActions, setPendingActions] = useState<AdminPendingAction[]>([])
  const [systemStatus, setSystemStatus] = useState<AdminSystemStatus>({
    authentication: 'offline',
    api: 'offline',
    maps: 'offline',
    backend: 'offline',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) return

    const loadData = async () => {
      setLoading(true)
      try {
        const [statsData, pendingData, statusData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getPendingActions(),
          adminService.getSystemStatus(),
        ])
        setStats(statsData)
        setPendingActions(pendingData)
        setSystemStatus(statusData)
      } catch {
        // Keep default null/empty values
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isAdmin])

  if (initializing) return <DashboardSkeleton cards={8} sections={3} />
  if (!isAdmin) return <div className="dash-panel">Access denied</div>

  return (
    <>
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Monitor OyoConnect platform operations."
      />

      <section className="dash-section" aria-label="Overview">
        <div className="dash-stats">
          <StatCard
            label="Total Users"
            value={stats.totalUsers ?? '—'}
            icon={Users}
            loading={loading}
            hint={stats.totalUsers === null ? 'Awaiting backend data' : undefined}
          />
          <StatCard
            label="Total Businesses"
            value={stats.totalBusinesses ?? '—'}
            icon={Building2}
            loading={loading}
            hint={stats.totalBusinesses === null ? 'Awaiting backend data' : undefined}
          />
          <StatCard
            label="Pending Verification"
            value={stats.pendingVerifications ?? '—'}
            icon={BadgeCheck}
            loading={loading}
            hint={stats.pendingVerifications === null ? 'Awaiting backend data' : undefined}
          />
          <StatCard
            label="Verified Businesses"
            value={stats.verifiedBusinesses ?? '—'}
            icon={BadgeCheck}
            loading={loading}
            hint={stats.verifiedBusinesses === null ? 'Awaiting backend data' : undefined}
          />
          <StatCard
            label="Active Jobs"
            value={stats.activeJobs ?? '—'}
            icon={Briefcase}
            loading={loading}
            hint={stats.activeJobs === null ? 'Awaiting backend data' : undefined}
          />
          <StatCard
            label="Pending Job Reviews"
            value={stats.pendingJobReviews ?? '—'}
            icon={FileText}
            loading={loading}
            hint={stats.pendingJobReviews === null ? 'Awaiting backend data' : undefined}
          />
          <StatCard
            label="Community Reports"
            value={stats.communityReports ?? '—'}
            icon={FileText}
            loading={loading}
            hint={stats.communityReports === null ? 'Awaiting backend data' : undefined}
          />
          <StatCard
            label="Pending Help Requests"
            value={stats.pendingHelpRequests ?? '—'}
            icon={LifeBuoy}
            loading={loading}
            hint={stats.pendingHelpRequests === null ? 'Awaiting backend data' : undefined}
          />
        </div>
      </section>

      <section className="dash-section" aria-label="Pending actions">
        <h2 className="dash-panel__title">Pending Actions</h2>
        <p className="dash-section__subtitle">Items requiring admin attention</p>
        {pendingActions.length === 0 ? (
          <Card variant="default" padding="md" className="dash-panel--empty">
            <EmptyState
              icon={<CheckCircle2 size={44} />}
              title="No pending actions"
              description="All items are up to date. No admin attention required at this time."
            />
          </Card>
        ) : (
          <div className="pending-actions-grid">
            {pendingActions.slice(0, 6).map((action) => {
              const ActionIcon = getActionIcon(action.type)
              return (
                <Card key={action.id} variant="default" padding="md" className="pending-action-card">
                  <div className="pending-action-card__header">
                    <span className="pending-action-card__icon" style={{ color: getActionColor(action.priority) }}>
                      <ActionIcon size={20} />
                    </span>
                    <Badge variant={action.priority === 'high' ? 'error' : action.priority === 'medium' ? 'warning' : 'info'} size="sm">
                      {formatPriority(action.priority)}
                    </Badge>
                  </div>
                  <h3 className="pending-action-card__title">{action.title}</h3>
                  <p className="pending-action-card__description">{action.description}</p>
                  <div className="pending-action-card__meta">
                    <span className="pending-action-card__time">{formatDate(action.createdAt)}</span>
                    <a href={action.actionUrl} className="pending-action-card__link">View details →</a>
                  </div>
                </Card>
              )
            })}
            {pendingActions.length > 6 && (
              <div className="dash-section__action">
                <a href="/admin/pending" className="dash-view-all">View all {pendingActions.length} pending actions →</a>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="dash-section" aria-label="System status">
        <h2 className="dash-panel__title">System Status</h2>
        <p className="dash-section__subtitle">Platform service health indicators</p>
        <div className="system-status-grid">
          <SystemStatusCard
            label="Authentication"
            status={systemStatus.authentication}
            icon={Lock}
          />
          <SystemStatusCard
            label="API Availability"
            status={systemStatus.api}
            icon={Server}
          />
          <SystemStatusCard
            label="Maps Integration"
            status={systemStatus.maps}
            icon={Globe}
          />
          <SystemStatusCard
            label="Backend"
            status={systemStatus.backend}
            icon={Database}
          />
        </div>
      </section>

      <section className="dash-section" aria-label="Recent activity">
        <h2 className="dash-panel__title">Recent Platform Activity</h2>
        <ActivityList
          items={buildActivityItems(pendingActions)}
          loading={loading}
          emptyIcon={<Activity size={44} />}
          emptyTitle="No activity yet"
          emptyDescription="Platform activity will appear here once there is data to display."
        />
      </section>
    </>
  )
}

function SystemStatusCard({ label, status, icon: Icon }: { label: string; status: AdminSystemStatus[keyof AdminSystemStatus]; icon: React.ComponentType<{ size?: number; className?: string }> }) {
  const statusConfig = {
    operational: { label: 'Operational', color: '#10b981', bg: '#ecfdf5', icon: CheckCircle2 },
    degraded: { label: 'Degraded', color: '#f59e0b', bg: '#fffbeb', icon: AlertTriangle },
    offline: { label: 'Offline', color: '#ef4444', bg: '#fef2f2', icon: AlertCircle },
  }

  const config = statusConfig[status] ?? statusConfig.offline

  return (
    <Card variant="default" padding="md" className="system-status-card">
      <div className="system-status-card__icon" style={{ background: config.bg, color: config.color }}>
        <Icon size={20} />
      </div>
      <div className="system-status-card__content">
        <span className="system-status-card__label">{label}</span>
        <div className="system-status-card__status">
          <config.icon size={14} style={{ color: config.color }} />
          <span style={{ color: config.color }}>{config.label}</span>
        </div>
      </div>
    </Card>
  )
}

export default AdminDashboard
