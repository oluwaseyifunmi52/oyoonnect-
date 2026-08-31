import { Briefcase, Plus } from 'lucide-react'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'

export default function ProviderServices() {
  return (
    <div className="provider-services">
      <header className="provider-services__header">
        <div>
          <h1 className="provider-page-title">My services</h1>
          <p className="provider-page-sub">List the services you provide so customers can find and book you.</p>
        </div>
        <Button variant="primary" size="sm"><Plus size={16} /> Add service</Button>
      </header>

      <Card>
        <CardBody>
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No services listed yet"
            description="Add your first service to start receiving requests from customers across Oyo State."
            action={<Button variant="secondary" size="sm"><Plus size={16} /> Add a service</Button>}
          />
        </CardBody>
      </Card>
    </div>
  )
}
