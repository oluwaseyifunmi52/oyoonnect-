import { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'
import { loadGoogleMaps, getMapsError, getDirectionsUrl, getStaticMapUrl } from '../../services/mapsService'

interface BusinessLocationMapProps {
  latitude?: number | string
  longitude?: number | string
  address?: string
  businessName?: string
  height?: number
  apiKey?: string
  interactive?: boolean
  showDirectionsButton?: boolean
  className?: string
}

export function BusinessLocationMap({
  latitude,
  longitude,
  address,
  businessName,
  height = 300,
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  interactive = true,
  showDirectionsButton = true,
  className = '',
}: BusinessLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const [loading, setLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)
  const [staticMapUrl, setStaticMapUrl] = useState<string | null>(null)

  const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude
  const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude
  const hasValidCoords = lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)

  useEffect(() => {
    if (!hasValidCoords) {
      setLoading(false)
      return
    }

    const mapsError = getMapsError(apiKey)
    if (mapsError) {
      setMapError(mapsError)
      setLoading(false)
      return
    }

    const initMap = async () => {
      try {
        await loadGoogleMaps({ apiKey: apiKey! })
      } catch (err) {
        setMapError(err instanceof Error ? err.message : 'Failed to load Google Maps')
        setLoading(false)
        return
      }

      if (!mapRef.current) return

      try {
        const center = { lat: lat!, lng: lng! }
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 16,
          mapTypeControl: !interactive,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          draggable: interactive,
          scrollwheel: interactive,
          disableDoubleClickZoom: !interactive,
          mapTypeId: 'roadmap',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        })

        mapInstanceRef.current = map

        const marker = new google.maps.Marker({
          position: center,
          map,
          title: businessName || 'Business location',
          animation: google.maps.Animation.DROP,
        })

        markerRef.current = marker

        // Add info window if address provided
        if (address) {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 200px;">
                <strong>${businessName || 'Business Location'}</strong>
                <p style="margin: 4px 0 0; font-size: 13px; color: #666;">${address}</p>
              </div>
            `,
          })

          marker.addListener('click', () => {
            infoWindow.open(map, marker)
          })
        }

        setLoading(false)
      } catch (err) {
        setMapError(err instanceof Error ? err.message : 'Failed to initialize map')
        setLoading(false)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current)
      }
    }
  }, [apiKey, lat, lng, businessName, address, interactive, hasValidCoords])

  // Generate static map URL as fallback
  useEffect(() => {
    if (hasValidCoords && apiKey && !apiKey.includes('your_key_here')) {
      const url = getStaticMapUrl(lat!, lng!, {
        width: 400,
        height: 300,
        zoom: 16,
        apiKey,
      })
      setStaticMapUrl(url)
    }
  }, [apiKey, lat, lng, hasValidCoords])

  const handleGetDirections = () => {
    if (!hasValidCoords) return
    const url = getDirectionsUrl(lat!, lng!, businessName)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (!hasValidCoords) {
    return (
      <div className={`map-container ${className}`} style={{ height, position: 'relative' }}>
        <div className="map-no-coords" role="status">
          <MapPin size={32} aria-hidden="true" />
          <div className="map-no-coords__content">
            <h4>Location not available</h4>
            {address && <p className="map-no-coords__address">{address}</p>}
            <p className="map-no-coords__hint">
              Exact coordinates not set for this business.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (mapError && !interactive && staticMapUrl) {
    return (
      <div className={`map-container ${className}`} style={{ height, position: 'relative' }}>
        <img
          src={staticMapUrl}
          alt={`${businessName || 'Business'} location map`}
          className="static-map"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {showDirectionsButton && (
          <button
            type="button"
            className="map-directions-btn"
            onClick={handleGetDirections}
            aria-label={`Get directions to ${businessName || 'this business'}`}
          >
            <Navigation size={18} />
            Get Directions
          </button>
        )}
        <div className="map-fallback-notice">
          <p>Interactive map unavailable. <button onClick={handleGetDirections}>Open in Google Maps</button></p>
        </div>
      </div>
    )
  }

  return (
    <div className={`map-container ${className}`} style={{ height, position: 'relative' }}>
      <div
        ref={mapRef}
        className="google-map"
        style={{ width: '100%', height: '100%' }}
        aria-label={`${businessName || 'Business'} location map`}
        role={interactive ? 'application' : 'img'}
        aria-roledescription={interactive ? 'Interactive map' : 'Static map'}
      />

      {loading && (
        <div className="map-loading" role="status" aria-label="Loading map">
          <div className="map-loading__spinner" aria-hidden="true" />
          <p>Loading map...</p>
        </div>
      )}

      {mapError && interactive && (
        <div className="map-error" role="alert">
          <Navigation size={24} aria-hidden="true" />
          <div className="map-error__content">
            <h4>Unable to load interactive map</h4>
            <p>{mapError}</p>
            {apiKey && !apiKey.includes('your_key_here') && (
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => {
                  setMapError(null)
                  setLoading(true)
                  window.location.reload()
                }}
              >
                Reload Page
              </button>
            )}
          </div>
        </div>
      )}

      {showDirectionsButton && hasValidCoords && (
        <button
          type="button"
          className="map-directions-btn"
          onClick={handleGetDirections}
          aria-label={`Get directions to ${businessName || 'this business'}`}
          disabled={loading}
        >
          <Navigation size={18} />
          Get Directions
        </button>
      )}
    </div>
  )
}