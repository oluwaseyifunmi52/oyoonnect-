import { DashboardLayout } from '../../components/layout/DashboardLayout'
import '../../styles/job-seeker-dashboard.css'

export default function JobSeekerLayout() {
  return <DashboardLayout navigationMode="jobseeker" showWorkspaceSwitcher workspaceKey="customer" />
}
