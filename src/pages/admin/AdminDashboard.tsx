import { BadgeCheck, BarChart2, Briefcase, Building2, FileText, LifeBuoy, Users, Settings, Search } from 'lucide-react'
import { ButtonLink } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { DashboardLayout, DashboardHeader, QuickActionCard, StatCard, DashboardSkeleton } from '../../components/dashboard'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'

interface AdminStats {
  totalBusinesses: number
  pendingVerification: number
  activeJobs: number
  communityReports: number
  totalUsers: number
  helpRequests: number
}

function AdminDashboard() {
  const { isAdmin, initializing } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) return
    const loadStats = async () => {
      try {
        // In a real app, these would come from actual API calls
        // For now, we show empty states until backend is connected
        setStats(null)
      } catch {
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [isAdmin])

  if (initializing) return <DashboardSkeleton cards={4} sections={2} />
  if (!isAdmin) return <div className="dash-panel">Access denied</div>

  return (
    <DashboardLayout navItems={ADMIN_NAV} workspaceLabel="Admin">
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Monitor OyoConnect platform operations. Backend data connection required."
      />

      <section className="dash-section" aria-label="Overview">
        <div className="dash-stats">
          <StatCard label="Total Businesses" value={null} icon={Building2} hint="Connect backend to load data" />
          <StatCard label="Pending Verification" value={null} icon={BadgeCheck} hint="Connect backend to load data" />
          <StatCard label="Active Jobs" value={null} icon={Briefcase} hint="Connect backend to load data" />
          <StatCard label="Community Reports" value={null} icon={FileText} hint="Connect backend to load data" />
        </div>
      </section>

      <section className="dash-section" aria-label="Quick actions">
        <div className="quick-action-grid">
          <QuickActionCard to="/admin/businesses" icon={Building2} title="Businesses" description="Manage and verify business listings." cta="Manage Businesses" />
          <QuickActionCard to="/admin/verification" icon={BadgeCheck} title="Verification" description="Review pending verifications." cta="Review Verifications" />
          <QuickActionCard to="/admin/jobs" icon={Briefcase} title="Jobs" description="Manage job postings." cta="Manage Jobs" />
          <QuickActionCard to="/admin/help" icon={LifeBuoy} title="Help Requests" description="View and manage help requests." cta="View Help Requests" />
          <QuickActionCard to="/admin/users" icon={Users} title="Users" description="Manage platform users." cta="Manage Users" />
          <QuickActionCard to="/admin/community" icon={FileText} title="Community Reports" description="Review community reports." cta="View Reports" />
        </div>
      </section>

      <section className="dash-panel" aria-labelledby="platform-data-title">
        <h2 id="platform-data-title" className="dash-panel__title">Platform Data</h2>
        <EmptyState
          icon={<BarChart2 size={44} />}
          title="No data available yet"
          description="Connect the backend to load real OyoConnect platform data and analytics."
        />
      </section>
    </DashboardLayout>
  )
}

const ADMIN_NAV: { to: string; label: string; icon: typeof Building2; end?: boolean }[] = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: BarChart2, end: true },
  { to: '/admin/businesses', label: 'Businesses', icon: Building2 },
  { to: '/admin/verification', label: 'Verification', icon: BadgeCheck },
  { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/community', label: 'Community', icon: FileText },
  { to: '/admin/help', label: 'Help Requests', icon: LifeBuoy },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default AdminDashboard