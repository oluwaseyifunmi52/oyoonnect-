import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CircleHelp, Construction, Smartphone, Wifi } from 'lucide-react'
import './ServicesHome.css'

interface ServiceUnavailablePageProps {
  feature: string
  description: string
}

export default function ServiceUnavailablePage({ feature, description }: ServiceUnavailablePageProps) {
  return (
    <main className="service-unavailable">
      <section className="service-unavailable__card" aria-labelledby="service-unavailable-title">
        <span className="service-unavailable__icon"><Construction size={26} aria-hidden="true" /></span>
        <span className="service-unavailable__eyebrow">OyoConnect Services</span>
        <h1 id="service-unavailable-title">{feature}</h1>
        <p>{description}</p>

        <div className="service-unavailable__status" role="status">
          <CircleHelp size={19} aria-hidden="true" />
          <div>
            <strong>This purchase service is not connected yet</strong>
            <span>There is no live provider available for this flow, so you cannot place an order here. No sample products, prices, or payment confirmations are shown.</span>
          </div>
        </div>

        <div className="service-unavailable__actions">
          <Link to="/services"><ArrowLeft size={16} /> Back to Services</Link>
          <Link to="/services/data"><Wifi size={16} /> Buy data</Link>
          <Link to="/services/airtime"><Smartphone size={16} /> Buy airtime</Link>
          <Link to="/community/help">Get support <ArrowRight size={16} /></Link>
        </div>
      </section>
    </main>
  )
}
