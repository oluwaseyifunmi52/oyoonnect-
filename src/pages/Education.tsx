import { useState, useEffect } from 'react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ServicePageHeader, ServiceUnavailable, ServiceLoading } from '../components/bills'
import { EducationForm } from '../components/bills/EducationForm'

function Education() {
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
          title="Education Products"
          subtitle="Purchase WAEC, NECO, NABTEB, JAMB registration pins and result checker cards."
        />
        <div className="container container--narrow">
          <ServiceLoading title="Loading education products..." />
        </div>
      </main>
    )
  }

  if (unavailable) {
    return (
      <main className="page">
        <ServicePageHeader
          eyebrow="Bills & Digital Services"
          title="Education Products"
          subtitle="Purchase WAEC, NECO, NABTEB, JAMB registration pins and result checker cards."
        />
        <div className="container container--narrow">
          <ServiceUnavailable
            title="Education Service Unavailable"
            description="Live education products and pricing will appear here once OyoConnect connects to a VTU service provider."
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
        title="Education Products"
        subtitle="Purchase WAEC, NECO, NABTEB, JAMB registration pins and result checker cards."
      />
      <div className="container container--narrow">
        <EducationForm />
      </div>
    </main>
  )
}

export default Education