import { Link } from 'react-router-dom'
import { Construction, ArrowRight, Wallet as WalletIcon } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { EmptyState } from '../components/ui/EmptyState'
import { ButtonLink } from '../components/ui/Button'

function Wallet() {
  return (
    <main className="wallet-page">
      <div className="container">
        <SectionHeading
          eyebrow="Digital Wallet"
          title="Wallet Coming Soon"
          subtitle="We're building a secure digital wallet for seamless payments and transactions. Stay tuned for updates!"
        />
        <EmptyState
          icon={<Construction size={48} />}
          title="Wallet Coming Soon"
          description="Our digital wallet feature is currently under development. We're working on secure wallet funding, virtual accounts, transaction history, and seamless integration with our bill payment services."
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

export default Wallet