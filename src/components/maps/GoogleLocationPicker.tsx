import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin, Crosshair, AlertCircle, CheckCircle2, RefreshCw, Navigation as NavigationIcon, Map } from 'lucide-react'
import { loadGoogleMaps, getMapsError, reverseGeocode, getStaticMapUrl } from '../../services/mapsService'

interface GoogleLocationPickerProps {
  latitude?: number
  longitude?: number
  onLocationChange: (location: { lat: number; lng: number; address?: string; placeId?: string }) => void
  apiKey?: string
  height?: number
  defaultCenter?: { lat: number; lng: number }
  defaultZoom?: number
  disabled?: boolean
  className?: string
}

const DEFAULT_CENTER = { lat: 7.3775, lng: 3.9470 }
const DEFAULT_ZOOM = 12
const DEMO_MODE = import.meta.env.VITE_ENABLE_DEMO_SERVICES === 'true'

export function GoogleLocationPicker({
  latitude,
  longitude,
  onLocationChange,
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  height = 350,
  defaultCenter = DEFAULT_CENTER,
  defaultZoom = DEFAULT_ZOOM,
  disabled = false,
  className = '',
}: GoogleLocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>()
  const [placeId, setPlaceId] = useState<string | undefined>()
  const [showStaticMap, setShowStaticMap] = useState(false)
  const isMountedRef = useRef(true)

  const initMap = useCallback(async () => {
    if (!mapRef.current || mapInstanceRef.current) return

    const mapsError = getMapsError(apiKey)
    if (mapsError) {
      setMapError(mapsError)
      setLoading(false)
      if (DEMO_MODE) {
        setShowStaticMap(true)
      }
      return
    }

    try {
      await loadGoogleMaps({ apiKey: apiKey! })
    } catch (err) {
      setMapError(err instanceof Error ? err.message : 'Failed to load Google Maps')
      setLoading(false)
      if (DEMO_MODE) {
        setShowStaticMap(true)
      }
      return
    }

    if (!isMountedRef.current || !mapRef.current) return

    try {
      const center = latitude && longitude
        ? { lat: latitude, lng: longitude }
        : defaultCenter

      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom: latitude && longitude ? 16 : defaultZoom,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
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
        draggable: true,
        title: 'Drag to set exact location',
        animation: google.maps.Animation.DROP,
      })

      markerRef.current = marker

      marker.addListener('dragend', async () => {
        const pos = marker.getPosition()
        if (pos && isMountedRef.current) {
          const lat = pos.lat()
          const lng = pos.lng()
          let address: string | undefined
          let pid: string | undefined

          try {
            const geocoder = new google.maps.Geocoder()
            const result = await new Promise<google.maps.GeocoderResult | null>((resolve) => {
              geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  resolve(results[0])
                } else {
                  resolve(null)
                }
              })
            })
            if (result) {
              address = result.formatted_address
              pid = result.place_id
            }
          } catch (_) {
            // Geocoding failed, address remains undefined
          }

          setSelectedAddress(address)
          setPlaceId(pid)
          onLocationChange({ lat, lng, address, placeId: pid })
        }
      })

      map.addListener('click', async (e: google.maps.MapMouseEvent) => {
        if (e.latLng && isMountedRef.current) {
          const lat = e.latLng.lat()
          const lng = e.latLng.lng()

          marker.setPosition(e.latLng)
          map.panTo(e.latLng)

          let address: string | undefined
          let pid: string | undefined

          try {
            const geocoder = new google.maps.Geocoder()
            const result = await new Promise<google.maps.GeocoderResult | null>((resolve) => {
              geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  resolve(results[0])
                } else {
                  resolve(null)
                }
              })
            })
            if (result) {
              address = result.formatted_address
              pid = result.place_id
            }
          } catch (_) {
            // Geocoding failed, address remains undefined
          }

          setSelectedAddress(address)
          setPlaceId(pid)
          onLocationChange({ lat, lng, address, placeId: pid })
        }
      })

      if (latitude && longitude && !selectedAddress) {
        try {
          const address = await reverseGeocode(latitude, longitude)
          if (isMountedRef.current) {
            setSelectedAddress(address || undefined)
          }
        } catch (_) {
          // Reverse geocoding failed, address remains undefined
        }
      }

      setLoading(false)
    } catch (err) {
      setMapError(err instanceof Error ? err.message : 'Failed to initialize map')
      setLoading(false)
      if (DEMO_MODE) {
        setShowStaticMap(true)
      }
    }
  }, [apiKey, latitude, longitude, defaultCenter, defaultZoom, onLocationChange, selectedAddress])

  useEffect(() => {
    isMountedRef.current = true
    initMap()

    return () => {
      isMountedRef.current = false
    }
  }, [initMap])

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && latitude && longitude) {
      const newPos = { lat: latitude, lng: longitude }
      markerRef.current.setPosition(newPos)
      mapInstanceRef.current.panTo(newPos)
    }
  }, [latitude, longitude])

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        if (mapInstanceRef.current && markerRef.current) {
          const pos = { lat, lng }
          markerRef.current.setPosition(pos)
          mapInstanceRef.current.panTo(pos)
          mapInstanceRef.current.setZoom(16)
        }

        reverseGeocode(lat, lng).then((address) => {
          if (isMountedRef.current) {
            const addr = address ?? undefined
            setSelectedAddress(addr)
            onLocationChange({ lat, lng, address: addr, placeId: placeId })
          }
        })
      },
      (err) => {
        let message = 'Unable to get your location'
        if (err.code === err.PERMISSION_DENIED) {
          message = 'Location permission denied. Please enable location access in your browser settings.'
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          message = 'Location information is unavailable'
        } else if (err.code === err.TIMEOUT) {
          message = 'Location request timed out'
        }
        setError(message)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  const handleResetLocation = () => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setPosition(defaultCenter)
      mapInstanceRef.current.panTo(defaultCenter)
      mapInstanceRef.current.setZoom(defaultZoom)
      setSelectedAddress(undefined)
      setPlaceId(undefined)
      onLocationChange({ lat: defaultCenter.lat, lng: defaultCenter.lng })
    }
  }

  if (mapError && !showStaticMap) {
    return (
      <div className={`map-container ${className}`} style={{ height, position: 'relative' }}>
        <div className="map-error" role="alert">
          <AlertCircle size={24} aria-hidden="true" />
          <div className="map-error__content">
            <h4>Unable to load map</h4>
            <p>{mapError}</p>
            {apiKey && !apiKey.includes('your_key_here') && (
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => {
                  setMapError(null)
                  setLoading(true)
                  initMap()
                }}
              >
                <RefreshCw size={16} /> Retry
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (showStaticMap) {
    const staticMapUrl = latitude && longitude
      ? getStaticMapUrl(latitude, longitude, {
          zoom: 16,
          width: 600,
          height: 350,
          apiKey: apiKey!,
        })
      : getStaticMapUrl(defaultCenter.lat, defaultCenter.lng, {
          zoom: defaultZoom,
          width: 600,
          height: 350,
          apiKey: apiKey!,
        })

    return (
      <div className={`map-container ${className}`} style={{ height, position: 'relative' }}>
        <div className="map-static-fallback">
          {staticMapUrl ? (
            <img
              src={staticMapUrl}
              alt="Map preview - Google Maps API key required for interactive map"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className="map-static-placeholder" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
              <div className="map-static-content" style={{ textAlign: 'center', padding: '24px' }}>
                <Map size={48} aria-hidden="true" style={{ color: '#9ca3af', marginBottom: '16px' }} />
                <p style={{ color: '#6b7280', marginBottom: '8px' }}>Map preview unavailable</p>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>Add VITE_GOOGLE_MAPS_API_KEY to .env to enable map preview</p>
              </div>
            </div>
          )}
          <div className="map-static-overlay">
            <Map size={32} aria-hidden="true" />
            <p>Interactive map requires Google Maps API key</p>
            <p className="map-static-note">Add VITE_GOOGLE_MAPS_API_KEY to .env to enable interactive map</p>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => {
                setShowStaticMap(false)
                setMapError(null)
                setLoading(true)
                initMap()
              }}
            >
              <RefreshCw size={16} /> Try Interactive Map
            </button>
          </div>
        </div>
        {selectedAddress && !loading && !mapError && (
          <div className="map-selected-location" role="status" aria-live="polite">
            <div className="map-selected-location__header">
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>Selected Location</span>
            </div>
            <div className="map-selected-location__details">
              <p className="map-selected-location__address">{selectedAddress}</p>
              <p className="map-selected-location__coords">
                <MapPin size={12} aria-hidden="true" />
                Latitude: {latitude?.toFixed(6) ?? '—'}, Longitude: {longitude?.toFixed(6) ?? '—'}
              </p>
              {placeId && (
                <p className="map-selected-location__placeid">
                  Place ID: {placeId}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading && !showStaticMap) {
    return (
      <div className={`map-container ${className}`} style={{ height, position: 'relative' }}>
        <div className="map-loading" role="status" aria-label="Loading map">
          <div className="map-loading__spinner" aria-hidden="true" />
          <p>Loading map...</p>
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
        aria-label="Business location picker"
      />

      {!loading && !mapError && !disabled && !showStaticMap && (
        <div className="map-controls">
          <button
            type="button"
            className="map-control-btn"
            onClick={handleUseCurrentLocation}
            aria-label="Use my current location"
            title="Use my current location"
          >
            <Crosshair size={20} />
            <span className="map-control-tooltip">Use my location</span>
          </button>

          <button
            type="button"
            className="map-control-btn"
            onClick={handleResetLocation}
            aria-label="Reset to default location"
            title="Reset to default location"
          >
            <NavigationIcon size={20} />
            <span className="map-control-tooltip">Reset view</span>
          </button>
        </div>
      )}

      {selectedAddress && !loading && !mapError && (
        <div className="map-selected-location" role="status" aria-live="polite">
          <div className="map-selected-location__header">
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>Selected Location</span>
          </div>
          <div className="map-selected-location__details">
            <p className="map-selected-location__address">{selectedAddress}</p>
            <p className="map-selected-location__coords">
              <MapPin size={12} aria-hidden="true" />
              Latitude: {latitude?.toFixed(6) ?? '—'}, Longitude: {longitude?.toFixed(6) ?? '—'}
            </p>
            {placeId && (
              <p className="map-selected-location__placeid">
                Place ID: {placeId}
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="map-toast-error" role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          <span>{error}</span>
          <button
            type="button"
            className="map-toast-close"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}