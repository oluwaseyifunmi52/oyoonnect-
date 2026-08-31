import { useState, useEffect } from 'react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ServicePageHeader, ServiceUnavailable, ServiceLoading } from '../components/bills'
import { DataForm } from '../components/bills/DataForm'

function Data() {
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    // In a real app, this would check if the VTU provider is connected
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
          title="Buy Data"
          subtitle="Purchase data bundles for MTN, Airtel, Glo, and 9mobile. Instant delivery to any phone number."
        />
        <div className="container container--narrow">
          <ServiceLoading title="Loading data plans..." />
        </div>
      </main>
    )
  }

  if (unavailable) {
    return (
      <main className="page">
        <ServicePageHeader
          eyebrow="Bills & Digital Services"
          title="Buy Data"
          subtitle="Purchase data bundles for MTN, Airtel, Glo, and 9mobile. Instant delivery to any phone number."
        />
        <div className="container container--narrow">
          <ServiceUnavailable
            title="Data Service Unavailable"
            description="Live data plans and pricing will appear here once OyoConnect connects to a VTU service provider."
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
        title="Buy Data"
        subtitle="Purchase data bundles for MTN, Airtel, Glo, and 9mobile. Instant delivery to any phone number."
      />
      <div className="container container--narrow">
        <DataForm />
      </div>
    </main>
  )
}

export default Data