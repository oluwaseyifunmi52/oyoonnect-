import { Construction, ArrowRight, Share2 } from 'lucide-react'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { EmptyState } from '../../components/ui/EmptyState'
import { ButtonLink } from '../../components/ui/Button'

function AffiliateDashboard() {
  return (
    <main className="page">
      <div className="container">
        <SectionHeading
          eyebrow="Share & Earn"
          title="Affiliate Program Coming Soon"
          subtitle="We're building a referral program where you can earn by sharing OyoConnect with others. Stay tuned!"
        />
        <EmptyState
          icon={<Construction size={48} />}
          title="Affiliate Program Coming Soon"
          description="Our affiliate program is currently under development. You'll be able to share your referral link, earn commissions on successful referrals, and withdraw your earnings securely."
          action={
            <ButtonLink to="/" variant="primary">
              <ArrowRight size={18} />
              Back to Business Directory
            </ButtonLink>
          }
        />
      </div>
    </main>
  )
}

export default AffiliateDashboard