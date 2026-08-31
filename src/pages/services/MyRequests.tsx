import { Inbox } from 'lucide-react'
import { EmptyState } from '../../components/ui/EmptyState'
import { ButtonLink } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'

export default function MyRequests() {
  return (
    <main className="page services-page">
      <header className="services-hero services-hero--compact">
        <h1 className="services-hero__title">My requests</h1>
        <p className="services-hero__subtitle">Track the service requests you've submitted.</p>
      </header>

      <Card>
        <CardBody>
          <EmptyState
            icon={<Inbox size={28} />}
            title="You have no requests yet"
            description="When you request a service, it will appear here so you can track responses."
            action={<ButtonLink to="/services/request" variant="primary" size="sm">Request a service</ButtonLink>}
          />
        </CardBody>
      </Card>
    </main>
  )
}
