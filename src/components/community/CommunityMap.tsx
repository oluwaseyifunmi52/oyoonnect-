import { Map, AlertCircle, List, Map as MapIcon } from 'lucide-react'
import type { CommunityReport } from '../../types/community'

interface CommunityMapProps {
  reports: CommunityReport[]
  height?: number
  apiKey?: string
}

export function CommunityMap({ reports, height = 400, apiKey }: CommunityMapProps) {
  const reportsWithCoords = reports.filter((r) => r.location.latitude && r.location.longitude)

  if (reportsWithCoords.length === 0) {
    return (
      <div className="map-placeholder" style={{ height }} aria-label="No reports with locations available">
        <Map size={48} className="map-placeholder__icon" aria-hidden="true" />
        <p className="map-placeholder__text">No location data available for reports.</p>
      </div>
    )
  }

  const mapUrl = buildMapUrl(reportsWithCoords, apiKey)

  return (
    <div className="map-container" style={{ height, position: 'relative' }}>
      <img
        src={mapUrl}
        alt="Map showing community reports"
        className="map-container__image"
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
        }}
      />
      <div className="map-legend">
        <MapIcon size={16} aria-hidden="true" />
        <span>{reportsWithCoords.length} report{reportsWithCoords.length === 1 ? '' : 's'} marked</span>
      </div>
    </div>
  )
}

function buildMapUrl(reports: CommunityReport[], apiKey?: string): string {
  const centerLat = reports.reduce((sum, r) => sum + (r.location.latitude || 0), 0) / reports.length
  const centerLng = reports.reduce((sum, r) => sum + (r.location.longitude || 0), 0) / reports.length

  const params = new URLSearchParams({
    center: `${centerLat},${centerLng}`,
    zoom: '12',
    size: '600x400',
    scale: '2',
    maptype: 'roadmap',
    key: apiKey || '',
  })

  reports.forEach((r) => {
    const lat = r.location.latitude
    const lng = r.location.longitude
    if (lat && lng) {
      params.append('markers', `${lat},${lng}`)
    }
  })

  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`
}
