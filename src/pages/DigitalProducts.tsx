import { useState, useEffect } from 'react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ServicePageHeader, ServiceUnavailable, ServiceLoading } from '../components/bills'
import { DigitalProductsGrid } from '../components/bills/DigitalProductsGrid'
import { billsService } from '../services/billsService'
import type { DigitalProduct } from '../types/bills'

function DigitalProducts() {
  const [products, setProducts] = useState<DigitalProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await billsService.getDigitalProducts()
        setProducts(data)
        setUnavailable(data.length === 0)
      } catch {
        setProducts([])
        setUnavailable(true)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  if (loading) {
    return (
      <main className="page">
        <ServicePageHeader
          eyebrow="Bills & Digital Services"
          title="Premium Digital Products"
          subtitle="Access premium subscriptions for design, productivity, writing, and video tools."
        />
        <div className="container">
          <ServiceLoading title="Loading digital products..." />
        </div>
      </main>
    )
  }

  if (unavailable) {
    return (
      <main className="page">
        <ServicePageHeader
          eyebrow="Bills & Digital Services"
          title="Premium Digital Products"
          subtitle="Access premium subscriptions for design, productivity, writing, and video tools."
        />
        <div className="container">
          <ServiceUnavailable
            title="Digital Products Unavailable"
            description="Live digital products and pricing will appear here once OyoConnect connects to a service provider."
            action={
              <p className="service-state__description" style={{ marginTop: '16px', fontSize: '13px', color: 'var(--subtle)' }}>
                This is a frontend demo. Backend integration with a service provider is required for live service.
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
        title="Premium Digital Products"
        subtitle="Access premium subscriptions for design, productivity, writing, and video tools."
      />
      <div className="container">
        <SectionHeading
          eyebrow="Bills & Digital Services"
          title="Premium Digital Products"
          subtitle="Access premium subscriptions for design, productivity, writing, and video tools."
        />
        <DigitalProductsGrid products={products} />
      </div>
    </main>
  )
}

export default DigitalProducts