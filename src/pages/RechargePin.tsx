import { useState, useEffect } from 'react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ServicePageHeader, ServiceUnavailable, ServiceLoading } from '../components/bills'
import { RechargePinForm } from '../components/bills/RechargePinForm'

function RechargePin() {
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
          title="Recharge PIN"
          subtitle="Buy recharge PINs for MTN, Airtel, Glo, and 9mobile. Various denominations available."
        />
        <div className="container container--narrow">
          <ServiceLoading title="Loading recharge PIN products..." />
        </div>
      </main>
    )
  }

  if (unavailable) {
    return (
      <main className="page">
        <ServicePageHeader
          eyebrow="Bills & Digital Services"
          title="Recharge PIN"
          subtitle="Buy recharge PINs for MTN, Airtel, Glo, and 9mobile. Various denominations available."
        />
        <div className="container container--narrow">
          <ServiceUnavailable
            title="Recharge PIN Service Unavailable"
            description="Live recharge PIN products and pricing will appear here once OyoConnect connects to a VTU service provider."
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
        title="Recharge PIN"
        subtitle="Buy recharge PINs for MTN, Airtel, Glo, and 9mobile. Various denominations available."
      />
      <div className="container container--narrow">
        <RechargePinForm />
      </div>
    </main>
  )
}

export default RechargePin