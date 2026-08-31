import { Inbox } from 'lucide-react'
import { EmptyState } from '../../components/ui/EmptyState'
import { Card, CardBody } from '../../components/ui/Card'

export default function ProviderRequests() {
  return (
    <div className="provider-requests">
      <h1 className="provider-page-title">Requests</h1>
      <p className="provider-page-sub">Customer requests that match your skills will appear here.</p>

      <Card>
        <CardBody>
          <EmptyState
            icon={<Inbox size={28} />}
            title="No requests yet"
            description="Once customers request a service you offer, you'll be able to respond and manage them here."
          />
        </CardBody>
      </Card>
    </div>
  )
}
