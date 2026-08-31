import { useState, useEffect } from 'react'
import { ServicePageHeader, ServiceUnavailable, ServiceLoading } from '../components/bills'
import { TVForm } from '../components/bills/TVForm'

function TV() {
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
          title="TV Subscriptions"
          subtitle="Subscribe to DSTV, GOtv, and Startimes. Verify your smart card and choose your package."
        />
        <div className="container container--narrow">
          <ServiceLoading title="Loading TV providers..." />
        </div>
      </main>
    )
  }

  if (unavailable) {
    return (
      <main className="page">
        <ServicePageHeader
          eyebrow="Bills & Digital Services"
          title="TV Subscriptions"
          subtitle="Subscribe to DSTV, GOtv, and Startimes. Verify your smart card and choose your package."
        />
        <div className="container container--narrow">
          <ServiceUnavailable
            title="TV Subscription Service Unavailable"
            description="Live TV providers and packages will appear here once OyoConnect connects to a VTU service provider."
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
        title="TV Subscriptions"
        subtitle="Subscribe to DSTV, GOtv, and Startimes. Verify your smart card and choose your package."
      />
      <div className="container container--narrow">
        <TVForm />
      </div>
    </main>
  )
}

export default TV