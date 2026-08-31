interface MapsError {
  missingApiKey: string
  invalidApiKey: string
  loadFailed: string
  generic: string
}

export const MAPS_ERRORS: MapsError = {
  missingApiKey: 'Google Maps API key is required. Please configure your environment.',
  invalidApiKey: 'Invalid Google Maps API key. Please check your configuration.',
  loadFailed: 'Failed to load Google Maps. Check your internet connection and API key.',
  generic: 'An error occurred with the maps service.',
}

let _mapsLoaded = false

export function getMapsError(apiKey?: string | null): string | null {
  if (!apiKey) {
    return MAPS_ERRORS.missingApiKey
  }
  if (apiKey.includes('your_key_here') || apiKey.length < 10) {
    return MAPS_ERRORS.invalidApiKey
  }
  return null
}

export async function loadGoogleMaps(options: { apiKey: string }): Promise<void> {
  if (_mapsLoaded) return

  if (!options.apiKey) {
    throw new Error(MAPS_ERRORS.missingApiKey)
  }

  return new Promise((resolve, reject) => {
    if ((window as any).google?.maps) {
      _mapsLoaded = true
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${options.apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => {
      _mapsLoaded = true
      resolve()
    }
    script.onerror = () => {
      reject(new Error(MAPS_ERRORS.loadFailed))
    }
    document.head.appendChild(script)
  })
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  try {
    if (!(window as any).google?.maps?.Geocoder) {
      return mockReverseGeocode(latitude, longitude)
    }

    const geocoder = new (window as any).google.maps.Geocoder()
    const response = await geocoder.geocode({ location: { lat: latitude, lng: longitude } })

    if (response.results && response.results.length > 0) {
      return response.results[0].formatted_address
    }
    return null
  } catch {
    return mockReverseGeocode(latitude, longitude)
  }
}

export interface StaticMapOptions {
  zoom?: number
  width?: number
  height?: number
  apiKey?: string
  markers?: Array<{ lat: number; lng: number; label?: string }>
}

export function getStaticMapUrl(latitude: number, longitude: number, options: StaticMapOptions): string {
  const apiKey = options.apiKey || ''
  const zoom = options.zoom ?? 15
  const width = options.width ?? 600
  const height = options.height ?? 350

  const params = new URLSearchParams({
    center: `${latitude},${longitude}`,
    zoom: String(zoom),
    size: `${width}x${height}`,
    scale: '2',
    maptype: 'roadmap',
    key: apiKey,
  })

  if (options.markers && options.markers.length > 0) {
    options.markers.forEach((marker) => {
      const markerStr = `${marker.lat},${marker.lng}`
      if (marker.label) {
        params.append('markers', `label:${marker.label}|${markerStr}`)
      } else {
        params.append('markers', markerStr)
      }
    })
  } else {
    params.append('markers', `${latitude},${longitude}`)
  }

  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`
}

export function getDirectionsUrl(latitude: number, longitude: number, businessName?: string): string {
  const label = businessName ? encodeURIComponent(`${businessName}`) : ''
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}${businessName ? `&destination_place_id=${label}` : ''}`
}

const mockLocations: Record<string, string> = {
  '7.4333,3.9000': 'Bodija, Ibadan, Oyo State, Nigeria',
  '7.3833,3.8833': 'Ring Road, Ibadan, Oyo State, Nigeria',
  '7.4167,3.9333': 'Sango, Ibadan, Oyo State, Nigeria',
  '7.4333,3.8833': 'Agodi, Ibadan, Oyo State, Nigeria',
}

function mockReverseGeocode(latitude: number, longitude: number): string | null {
  const key = `${latitude},${longitude}`
  return mockLocations[key] || `${latitude}, ${longitude}`
}

export { mockLocations }
