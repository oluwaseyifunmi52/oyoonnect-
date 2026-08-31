import { useState, useEffect } from 'react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ServicePageHeader, ServiceUnavailable, ServiceLoading } from '../components/bills'
import { GamesGrid } from '../components/bills/GamesGrid'
import { billsService } from '../services/billsService'
import type { GameProduct } from '../types/bills'

function Games() {
  const [products, setProducts] = useState<GameProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await billsService.getGameProducts()
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
          title="Game Vouchers & Credits"
          subtitle="Purchase game vouchers for Google Play, Apple, Steam, PlayStation, Xbox, and mobile games."
        />
        <div className="container">
          <ServiceLoading title="Loading game products..." />
        </div>
      </main>
    )
  }

  if (unavailable) {
    return (
      <main className="page">
        <ServicePageHeader
          eyebrow="Bills & Digital Services"
          title="Game Vouchers & Credits"
          subtitle="Purchase game vouchers for Google Play, Apple, Steam, PlayStation, Xbox, and mobile games."
        />
        <div className="container">
          <ServiceUnavailable
            title="Game Products Unavailable"
            description="Live game vouchers and credits will appear here once OyoConnect connects to a service provider."
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
        title="Game Vouchers & Credits"
        subtitle="Purchase game vouchers for Google Play, Apple, Steam, PlayStation, Xbox, and mobile games."
      />
      <div className="container">
        <SectionHeading
          eyebrow="Bills & Digital Services"
          title="Game Vouchers & Credits"
          subtitle="Purchase game vouchers for Google Play, Apple, Steam, PlayStation, Xbox, and mobile games."
        />
        <GamesGrid products={products} />
      </div>
    </main>
  )
}

export default Games