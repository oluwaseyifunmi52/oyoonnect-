import { CircleHelp, Inbox, MessageCircle, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/ui/EmptyState'
import { Card, CardBody } from '../../components/ui/Card'

export default function ProviderRequests() {
  return (
    <div className="provider-view provider-requests">
      <header className="provider-view__page-header">
        <div>
          <span className="provider-panel__eyebrow">PROFESSIONAL WORKSPACE</span>
          <h1 className="provider-view__heading">Service Requests</h1>
          <p className="provider-view__subheading">Keep track of customer enquiries and the work you have agreed to do.</p>
        </div>
      </header>

      <div className="provider-requests-layout">
        <main className="provider-content-main">
          <Card className="provider-panel">
            <CardBody>
              <div className="provider-requests-listing">
                <EmptyState
                  icon={<Inbox size={28} />}
                  title="No service requests yet"
                  description="Customer requests will appear here once provider request management is connected. There are no request records available for this account."
                />
              </div>
            </CardBody>
          </Card>
        </main>

        <aside className="provider-content-aside" aria-label="Request information">
          <section className="provider-panel">
            <span className="provider-panel__eyebrow">REQUEST SUMMARY</span>
            <h2 className="provider-panel__title">Your requests</h2>
            <div className="provider-request-count"><span className="provider-request-count__icon"><Inbox /></span><span><strong>—</strong><small>Request totals unavailable</small></span></div>
            <p className="provider-request-note">This workspace does not have a live service request data source yet.</p>
          </section>
          <section className="provider-panel">
            <span className="provider-panel__eyebrow">NEED HELP?</span>
            <div className="provider-help-card">
              <span className="provider-help-card__icon"><MessageCircle /></span>
              <p>When requests are connected, you can review customer details and respond from this page.</p>
              <Link className="provider-panel__link" to="/help">Visit Help &amp; Support <ShieldCheck /></Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
