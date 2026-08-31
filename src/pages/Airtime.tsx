import { useState, useEffect } from 'react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ServicePageHeader, ServiceUnavailable, ServiceLoading } from '../components/bills'
import { AirtimeForm } from '../components/bills/AirtimeForm'

function Airtime() {
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
      setUnavailable(true)
    }, 500)
  }, [])

  if (loading) {
    return (
      <main className="page">
        <ServicePageHeader
          eyebrow="Bills & Digital Services"
          title="Buy Airtime"
          subtitle="Recharge airtime instantly for MTN, Airtel, Glo, and 9mobile. Instant delivery to any phone number."
        />
        <div className="container container--narrow">
          <ServiceLoading title="Loading airtime service..." />
        </div>
      </main>
    )
  }

  if (unavailable) {
    return (
      <main className="page">
        <ServicePageHeader
          eyebrow="Bills & Digital Services"
          title="Buy Airtime"
          subtitle="Recharge airtime instantly for MTN, Airtel, Glo, and 9mobile. Instant delivery to any phone number."
        />
        <div className="container container--narrow">
          <ServiceUnavailable
            title="Airtime Service Unavailable"
            description="Live airtime service will appear here once OyoConnect connects to a VTU service provider."
            action={
              <p className="service-state__description" style={{ marginTop: '16px', fontSize: '13px', color: 'var(--subtle)' }}>
                This is a frontend demo. Backend integration with a VTU provider is required for live service.
              </p>
            }
          />
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <ServicePageHeader
        eyebrow="Bills & Digital Services"
        title="Buy Airtime"
        subtitle="Recharge airtime instantly for MTN, Airtel, Glo, and 9mobile. Instant delivery to any phone number."
      />
      <div className="container container--narrow">
        <AirtimeForm />
      </div>
    </main>
  )
}

export default Airtime