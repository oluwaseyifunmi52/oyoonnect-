import { useState, useEffect } from 'react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ServicePageHeader, ServiceUnavailable, ServiceLoading } from '../components/bills'
import { ElectricityForm } from '../components/bills/ElectricityForm'

function Electricity() {
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
          title="Pay Electricity Bill"
          subtitle="Pay your electricity bill for IBEDC and other Nigerian Discos. Supports prepaid and postpaid meters."
        />
        <div className="container container--narrow">
          <ServiceLoading title="Loading electricity providers..." />
        </div>
      </main>
    )
  }

  if (unavailable) {
    return (
      <main className="page">
        <ServicePageHeader
          eyebrow="Bills & Digital Services"
          title="Pay Electricity Bill"
          subtitle="Pay your electricity bill for IBEDC and other Nigerian Discos. Supports prepaid and postpaid meters."
        />
        <div className="container container--narrow">
          <ServiceUnavailable
            title="Electricity Service Unavailable"
            description="Live electricity providers and bill payment will appear here once OyoConnect connects to a VTU service provider."
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
        title="Pay Electricity Bill"
        subtitle="Pay your electricity bill for IBEDC and other Nigerian Discos. Supports prepaid and postpaid meters."
      />
      <div className="container container--narrow">
        <ElectricityForm />
      </div>
    </main>
  )
}

export default Electricity