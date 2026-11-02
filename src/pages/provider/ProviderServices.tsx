import { BriefcaseBusiness, CircleHelp, Plus, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'

export default function ProviderServices() {
  return (
    <div className="provider-view provider-services">
      <header className="provider-view__page-header">
        <div>
          <span className="provider-panel__eyebrow">PROFESSIONAL WORKSPACE</span>
          <h1 className="provider-view__heading">My Services</h1>
          <p className="provider-view__subheading">Manage the services you offer to customers across Oyo State.</p>
        </div>
        <div className="provider-view__page-header-actions">
          <Button variant="primary" size="sm" disabled title="Service listing creation is not connected yet"><Plus className="provider-view__button-icon" /> Add Service</Button>
        </div>
      </header>

      <div className="provider-services-layout">
        <main className="provider-content-main">
          <Card className="provider-panel">
            <CardBody>
              <div className="provider-services-listing">
                <EmptyState
                  icon={<BriefcaseBusiness size={27} />}
                  title="No services listed yet"
                  description="Your service listings will appear here when provider service management is available. No service records are connected to this account yet."
                />
              </div>
            </CardBody>
          </Card>
        </main>

        <aside className="provider-content-aside" aria-label="Service listing guidance">
          <section className="provider-panel">
            <span className="provider-panel__eyebrow">GET STARTED</span>
            <h2 className="provider-panel__title">Make your services easy to find</h2>
            <div className="provider-tip">
              <span className="provider-tip__icon"><Sparkles /></span>
              <span>When service listings are enabled, add a clear title, accurate pricing and the areas you serve.</span>
            </div>
          </section>
          <section className="provider-panel">
            <span className="provider-panel__eyebrow">PROVIDER TOOLS</span>
            <nav className="provider-quick-actions" aria-label="Provider tools">
              <Link className="provider-quick-action" to="/provider/profile"><span className="provider-quick-action__icon"><ShieldCheck /></span><span className="provider-quick-action__label">Complete your profile</span></Link>
              <Link className="provider-quick-action" to="/provider/requests"><span className="provider-quick-action__icon"><CircleHelp /></span><span className="provider-quick-action__label">Service requests</span></Link>
            </nav>
          </section>
        </aside>
      </div>
    </div>
  )
}
