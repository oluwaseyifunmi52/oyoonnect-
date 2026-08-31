import type {
  CommunityLocationStatus,
  RoadConditionStatus,
  FloodRiskStatus,
  TrafficStatus,
  PowerStatus,
  TransportStatus,
} from '../types/community'
import {
  ROAD_CONDITION_LABELS,
  ROAD_CONDITION_COLORS,
  FLOOD_RISK_LABELS,
  FLOOD_RISK_COLORS,
  TRAFFIC_LABELS,
  TRAFFIC_COLORS,
  POWER_LABELS,
  POWER_COLORS,
  TRANSPORT_LABELS,
  TRANSPORT_COLORS,
} from '../types/community'

const STORAGE_KEY = 'community_location_status'

interface StatusOption {
  value: string
  label: string
  color: string
}

const demoLocationStatuses: CommunityLocationStatus[] = []


function getStored(): CommunityLocationStatus[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : demoLocationStatuses
  } catch {
    return demoLocationStatuses
  }
}

function save(statuses: CommunityLocationStatus[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses))
  } catch {}
}

export const communityLocationStatusService = {
  getRoadConditionOptions(): StatusOption[] {
    return [
      { value: 'good', label: ROAD_CONDITION_LABELS.good, color: ROAD_CONDITION_COLORS.good },
      { value: 'moderate', label: ROAD_CONDITION_LABELS.moderate, color: ROAD_CONDITION_COLORS.moderate },
      { value: 'bad', label: ROAD_CONDITION_LABELS.bad, color: ROAD_CONDITION_COLORS.bad },
      { value: 'blocked', label: ROAD_CONDITION_LABELS.blocked, color: ROAD_CONDITION_COLORS.blocked },
      { value: 'under_construction', label: ROAD_CONDITION_LABELS.under_construction, color: ROAD_CONDITION_COLORS.under_construction },
      { value: 'unknown', label: ROAD_CONDITION_LABELS.unknown, color: ROAD_CONDITION_COLORS.unknown },
    ]
  },

  getFloodRiskOptions(): StatusOption[] {
    return [
      { value: 'none', label: FLOOD_RISK_LABELS.none, color: FLOOD_RISK_COLORS.none },
      { value: 'low', label: FLOOD_RISK_LABELS.low, color: FLOOD_RISK_COLORS.low },
      { value: 'moderate', label: FLOOD_RISK_LABELS.moderate, color: FLOOD_RISK_COLORS.moderate },
      { value: 'high', label: FLOOD_RISK_LABELS.high, color: FLOOD_RISK_COLORS.high },
      { value: 'currently_flooded', label: FLOOD_RISK_LABELS.currently_flooded, color: FLOOD_RISK_COLORS.currently_flooded },
      { value: 'unknown', label: FLOOD_RISK_LABELS.unknown, color: FLOOD_RISK_COLORS.unknown },
    ]
  },

  getTrafficOptions(): StatusOption[] {
    return [
      { value: 'light', label: TRAFFIC_LABELS.light, color: TRAFFIC_COLORS.light },
      { value: 'moderate', label: TRAFFIC_LABELS.moderate, color: TRAFFIC_COLORS.moderate },
      { value: 'heavy', label: TRAFFIC_LABELS.heavy, color: TRAFFIC_COLORS.heavy },
      { value: 'severe', label: TRAFFIC_LABELS.severe, color: TRAFFIC_COLORS.severe },
      { value: 'unknown', label: TRAFFIC_LABELS.unknown, color: TRAFFIC_COLORS.unknown },
    ]
  },

  getPowerOptions(): StatusOption[] {
    return [
      { value: 'available', label: POWER_LABELS.available, color: POWER_COLORS.available },
      { value: 'intermittent', label: POWER_LABELS.intermittent, color: POWER_COLORS.intermittent },
      { value: 'outage', label: POWER_LABELS.outage, color: POWER_COLORS.outage },
      { value: 'unknown', label: POWER_LABELS.unknown, color: POWER_COLORS.unknown },
    ]
  },

  getTransportOptions(): StatusOption[] {
    return [
      { value: 'available', label: TRANSPORT_LABELS.available, color: TRANSPORT_COLORS.available },
      { value: 'limited', label: TRANSPORT_LABELS.limited, color: TRANSPORT_COLORS.limited },
      { value: 'difficult', label: TRANSPORT_LABELS.difficult, color: TRANSPORT_COLORS.difficult },
      { value: 'unavailable', label: TRANSPORT_LABELS.unavailable, color: TRANSPORT_COLORS.unavailable },
      { value: 'unknown', label: TRANSPORT_LABELS.unknown, color: TRANSPORT_COLORS.unknown },
    ]
  },

  async getByLocation(lga: string, town: string, area?: string): Promise<CommunityLocationStatus | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const locationId = `${lga.toLowerCase().replace(/\s+/g, '-')}-${town.toLowerCase().replace(/\s+/g, '-')}`
        const statuses = getStored()
        const status = statuses.find(
          (s) => s.locationId === locationId || s.lga === lga || s.town === town,
        )
        resolve(status ?? null)
      }, 100)
    })
  },

  async update(locationId: string, data: Partial<CommunityLocationStatus>): Promise<CommunityLocationStatus | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const statuses = getStored()
        const idx = statuses.findIndex((s) => s.locationId === locationId)
        if (idx !== -1) {
          statuses[idx] = { ...statuses[idx], ...data, lastUpdated: new Date().toISOString() }
          save(statuses)
          resolve(statuses[idx])
        } else {
          resolve(null)
        }
      }, 200)
    })
  },

  async createOrUpdate(data: Partial<CommunityLocationStatus>): Promise<CommunityLocationStatus> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const statuses = getStored()
        const locationId = `${data.lga?.toLowerCase().replace(/\s+/g, '-')}-${data.town?.toLowerCase().replace(/\s+/g, '-')}`
        const idx = statuses.findIndex((s) => s.locationId === locationId)

        if (idx !== -1) {
          statuses[idx] = { ...statuses[idx], ...data, locationId, lastUpdated: new Date().toISOString() }
          save(statuses)
          resolve(statuses[idx])
        } else {
          const newStatus: CommunityLocationStatus = {
            locationId,
            lga: data.lga || '',
            town: data.town || '',
            area: data.area,
            roadCondition: data.roadCondition || 'unknown',
            floodRisk: data.floodRisk || 'unknown',
            traffic: data.traffic || 'unknown',
            power: data.power || 'unknown',
            transport: data.transport || 'unknown',
            lastUpdated: new Date().toISOString(),
            ...data,
          }
          statuses.push(newStatus)
          save(statuses)
          resolve(newStatus)
        }
      }, 200)
    })
  },
}

export { demoLocationStatuses }