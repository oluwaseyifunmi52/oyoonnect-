import { useState, useEffect } from 'react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ServicePageHeader, ServiceUnavailable, ServiceLoading } from '../components/bills'
import { SocialMediaGrid } from '../components/bills/SocialMediaGrid'
import { billsService } from '../services/billsService'
import type { SocialMediaPlatform } from '../types/bills'

function SocialMedia() {
  const [platforms, setPlatforms] = useState<SocialMediaPlatform[]>([])
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const data = await billsService.getSocialMediaPlatforms()
        setPlatforms(data)
        setUnavailable(data.length === 0)
      } catch {
        setPlatforms([])
        setUnavailable(true)
      } finally {
        setLoading(false)
      }
    }
    loadPlatforms()
  }, [])

  if (loading) {
    return (
      <main className="page">
        <ServicePageHeader
          eyebrow="Bills & Digital Services"
          title="Social Media Services"
          subtitle="Boost your social media presence with followers, likes, views, and engagement across platforms."
        />
        <div className="container">
          <ServiceLoading title="Loading social media services..." />
        </div>
      </main>
    )
  }

  if (unavailable) {
    return (
      <main className="page">
        <ServicePageHeader
          eyebrow="Bills & Digital Services"
          title="Social Media Services"
          subtitle="Boost your social media presence with followers, likes, views, and engagement across platforms."
        />
        <div className="container">
          <ServiceUnavailable
            title="Social Media Services Unavailable"
            description="Live social media services and pricing will appear here once OyoConnect connects to a service provider."
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
        title="Social Media Services"
        subtitle="Boost your social media presence with followers, likes, views, and engagement across platforms."
      />
      <div className="container">
        <SectionHeading
          eyebrow="Bills & Digital Services"
          title="Social Media Services"
          subtitle="Boost your social media presence with followers, likes, views, and engagement across platforms."
        />
        <SocialMediaGrid platforms={platforms} />
      </div>
    </main>
  )
}

export default SocialMedia