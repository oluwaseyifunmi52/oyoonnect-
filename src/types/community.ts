export interface CommunityLocation {
  state: string
  lga: string
  town: string
  area?: string
  busStop?: string
  address: string
  latitude?: number
  longitude?: number
  placeId?: string
  formattedAddress?: string
}

export type CommunityCategory =
  | 'roads'
  | 'floods'
  | 'traffic'
  | 'power'
  | 'water'
  | 'waste'
  | 'construction'
  | 'security'
  | 'transport'
  | 'photos'

export type ReportStatus = 'pending' | 'verified' | 'resolved' | 'dismissed' | 'urgent'

export type RoadConditionStatus = 'good' | 'moderate' | 'bad' | 'blocked' | 'under_construction' | 'unknown'
export type FloodRiskStatus = 'none' | 'low' | 'moderate' | 'high' | 'currently_flooded' | 'unknown'
export type TrafficStatus = 'light' | 'moderate' | 'heavy' | 'severe' | 'unknown'
export type PowerStatus = 'available' | 'intermittent' | 'outage' | 'unknown'
export type TransportStatus = 'available' | 'limited' | 'difficult' | 'unavailable' | 'unknown'

export type VerificationStatus = 'unverified' | 'community_confirmed' | 'admin_verified' | 'expired'

export interface CommunityLocationStatus {
  locationId: string
  lga: string
  town: string
  area?: string
  roadCondition: RoadConditionStatus
  floodRisk: FloodRiskStatus
  traffic: TrafficStatus
  power: PowerStatus
  transport: TransportStatus
  lastUpdated: string
  lastVerified?: string
  verifiedBy?: string
  notes?: string
}

export interface CommunityReport {
  id: string
  title: string
  description: string
  excerpt: string
  category: CommunityCategory
  status: ReportStatus
  urgent: boolean
  authorId: string
  authorName: string
  authorAvatar?: string
  location: CommunityLocation
  image?: string
  images?: string[]
  verified: boolean
  verifiedBy?: string
  verifiedAt?: string
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface CommunityReportFormData {
  title: string
  description: string
  category: CommunityCategory
  lga: string
  town: string
  area?: string
  busStop?: string
  address: string
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
  images: File[]
}

export interface CommunityComment {
  id: string
  reportId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
}

export interface CommunityFilters {
  category?: CommunityCategory
  location?: string
  status?: ReportStatus
  sort?: 'newest' | 'oldest' | 'most-upvoted' | 'most-commented'
  verified?: boolean
}

export const COMMUNITY_SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most-upvoted', label: 'Most Upvoted' },
  { value: 'most-commented', label: 'Most Commented' },
]

export const ROAD_CONDITION_LABELS: Record<RoadConditionStatus, string> = {
  good: 'Good',
  moderate: 'Moderate',
  bad: 'Bad',
  blocked: 'Blocked',
  under_construction: 'Under Construction',
  unknown: 'Unknown',
}

export const ROAD_CONDITION_COLORS: Record<RoadConditionStatus, string> = {
  good: '#16a34a',
  moderate: '#f59e0b',
  bad: '#dc2626',
  blocked: '#7f1d1d',
  under_construction: '#2563eb',
  unknown: '#64748b',
}

export const FLOOD_RISK_LABELS: Record<FloodRiskStatus, string> = {
  none: 'No Known Flooding',
  low: 'Low Risk',
  moderate: 'Moderate Risk',
  high: 'High Risk',
  currently_flooded: 'Currently Flooded',
  unknown: 'Unknown',
}

export const FLOOD_RISK_COLORS: Record<FloodRiskStatus, string> = {
  none: '#16a34a',
  low: '#84cc16',
  moderate: '#f59e0b',
  high: '#f97316',
  currently_flooded: '#dc2626',
  unknown: '#64748b',
}

export const TRAFFIC_LABELS: Record<TrafficStatus, string> = {
  light: 'Light',
  moderate: 'Moderate',
  heavy: 'Heavy',
  severe: 'Severe',
  unknown: 'Unknown',
}

export const TRAFFIC_COLORS: Record<TrafficStatus, string> = {
  light: '#16a34a',
  moderate: '#f59e0b',
  heavy: '#f97316',
  severe: '#dc2626',
  unknown: '#64748b',
}

export const POWER_LABELS: Record<PowerStatus, string> = {
  available: 'Residents Reported Power Available',
  intermittent: 'Residents Reported Intermittent Power',
  outage: 'Residents Reported Power Outage',
  unknown: 'No Recent Information',
}

export const POWER_COLORS: Record<PowerStatus, string> = {
  available: '#16a34a',
  intermittent: '#f59e0b',
  outage: '#dc2626',
  unknown: '#64748b',
}

export const TRANSPORT_LABELS: Record<TransportStatus, string> = {
  available: 'Available',
  limited: 'Limited',
  difficult: 'Difficult',
  unavailable: 'Unavailable',
  unknown: 'Unknown',
}

export const TRANSPORT_COLORS: Record<TransportStatus, string> = {
  available: '#16a34a',
  limited: '#f59e0b',
  difficult: '#f97316',
  unavailable: '#dc2626',
  unknown: '#64748b',
}

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  unverified: 'Community Report',
  community_confirmed: 'Community Confirmed',
  admin_verified: 'Verified by OyoConnect',
  expired: 'Outdated',
}

export const VERIFICATION_COLORS: Record<VerificationStatus, string> = {
  unverified: '#f59e0b',
  community_confirmed: '#2563eb',
  admin_verified: '#16a34a',
  expired: '#64748b',
}

export function getCategoryLabel(category: CommunityCategory): string {
  const labels: Record<CommunityCategory, string> = {
    roads: 'Road Conditions',
    floods: 'Flood Reports',
    traffic: 'Traffic Updates',
    power: 'Power Reports',
    water: 'Water Availability',
    waste: 'Waste Reports',
    construction: 'Construction Updates',
    security: 'Security Alerts',
    transport: 'Transport Updates',
    photos: 'Community Photos',
  }
  return labels[category] || category
}

export function getStatusLabel(status: ReportStatus): string {
  const labels: Record<ReportStatus, string> = {
   pending: 'Pending Verification',
  verified: 'Verified',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
  urgent: 'Urgent',
  }
  return labels[status] || status
}

export function getRoadConditionLabel(status: RoadConditionStatus): string {
  return ROAD_CONDITION_LABELS[status] || status
}

export function getFloodRiskLabel(status: FloodRiskStatus): string {
  return FLOOD_RISK_LABELS[status] || status
}

export function getTrafficLabel(status: TrafficStatus): string {
  return TRAFFIC_LABELS[status] || status
}

export function getPowerLabel(status: PowerStatus): string {
  return POWER_LABELS[status] || status
}

export function getTransportLabel(status: TransportStatus): string {
  return TRANSPORT_LABELS[status] || status
}

export function getVerificationLabel(status: VerificationStatus): string {
  return VERIFICATION_LABELS[status] || status
}

export function getRoadConditionColor(status: RoadConditionStatus): string {
  return ROAD_CONDITION_COLORS[status] || ROAD_CONDITION_COLORS.unknown
}

export function getFloodRiskColor(status: FloodRiskStatus): string {
  return FLOOD_RISK_COLORS[status] || FLOOD_RISK_COLORS.unknown
}

export function getTrafficColor(status: TrafficStatus): string {
  return TRAFFIC_COLORS[status] || TRAFFIC_COLORS.unknown
}

export function getPowerColor(status: PowerStatus): string {
  return POWER_COLORS[status] || POWER_COLORS.unknown
}

export function getTransportColor(status: TransportStatus): string {
  return TRANSPORT_COLORS[status] || TRANSPORT_COLORS.unknown
}

export function getVerificationColor(status: VerificationStatus): string {
  return VERIFICATION_COLORS[status] || VERIFICATION_COLORS.unverified
}

export interface CommunityReportStats {
  totalReports: number
  reportsThisWeek: number
  verifiedReports: number
  resolvedReports: number
}

export interface CommunityReportListResult {
  reports: CommunityReport[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}