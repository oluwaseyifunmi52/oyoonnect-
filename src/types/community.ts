export type HelpCategory = {
  value: string;
  label: string;
  icon: string;
};

export type CommunityUpdateStatus =
  | 'reported'
  | 'investigating'
  | 'ongoing'
  | 'resolved'
  | 'information';

export interface CommunityLocation {
  state: string;
  city?: string;
  town: string;
  lga: string;
  area?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface CommunityUpdate {
  id: string;
  title: string;
  description: string;
  category: HelpCategory;
  location: string;
  status: CommunityUpdateStatus;
  isImportant?: boolean;
  upvotes: number;
  followers: number;
  createdAt: string;
  updatedAt?: string;
}

export const COMMUNITY_CATEGORIES = [
  {
    value: 'road-traffic',
    label: 'Road & Traffic',
    icon: 'road'
  },
  {
    value: 'electricity',
    label: 'Electricity',
    icon: 'zap'
  },
  {
    value: 'water',
    label: 'Water',
    icon: 'droplets'
  },
  {
    value: 'security',
    label: 'Security',
    icon: 'shield'
  },
  {
    value: 'health',
    label: 'Health',
    icon: 'heart-pulse'
  },
  {
    value: 'transport',
    label: 'Transport',
    icon: 'bus'
  },
  {
    value: 'flooding-environment',
    label: 'Flooding & Environment',
    icon: 'cloud-rain'
  },
  {
    value: 'government-projects',
    label: 'Government & Community Projects',
    icon: 'landmark'
  },
  {
    value: 'events',
    label: 'Events',
    icon: 'calendar'
  },
  {
    value: 'general',
    label: 'General Updates',
    icon: 'megaphone'
  }
] as const;

export type CommunityCategoryValue = typeof COMMUNITY_CATEGORIES[number]['value'];

export function getCommunityCategoryValue(value: string): CommunityCategoryValue | undefined {
  return COMMUNITY_CATEGORIES.find((cat) => cat.value === value)?.value as CommunityCategoryValue | undefined;
}

export function getCommunityCategoryLabel(value: string): string | undefined {
  return COMMUNITY_CATEGORIES.find((cat) => cat.value === value)?.label;
}

export function getCommunityCategoryIcon(value: string): string | undefined {
  return COMMUNITY_CATEGORIES.find((cat) => cat.value === value)?.icon;
}

export type CommunityCategory = string;

export type ReportStatus =
  | 'urgent'
  | 'pending'
  | 'verified'
  | 'resolved'
  | 'dismissed';

export interface CommunityReport {
  id: string;
  title: string;
  description: string;
  excerpt?: string;
  category: string;
  location: CommunityLocation;
  status: ReportStatus;
  urgent: boolean;
  verified: boolean;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  authorName?: string;
  authorAvatar?: string;
  image?: string;
  images?: string[];
}

export interface CommunityComment {
  id: string;
  reportId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommunityReportStats {
  totalReports: number;
  reportsThisWeek: number;
  verifiedReports: number;
  resolvedReports: number;
}

export interface CommunityReportListResult {
  reports: CommunityReport[];
  total: number;
  hasMore: boolean;
}

export interface CommunityFilters {
  category?: string;
  location?: string;
  status?: string;
  verified?: boolean;
  sort?: string;
  limit?: number;
  page?: number;
}

export interface CommunityReportFormData {
  title: string;
  description: string;
  category: string;
  lga: string;
  town: string;
  area?: string;
  busStop?: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
  formattedAddress: string;
  images: File[];
}

export type RoadConditionStatus = 'good' | 'moderate' | 'bad' | 'blocked' | 'under_construction' | 'unknown';
export type FloodRiskStatus = 'none' | 'low' | 'moderate' | 'high' | 'currently_flooded' | 'unknown';
export type TrafficStatus = 'light' | 'moderate' | 'heavy' | 'severe' | 'unknown';
export type PowerStatus = 'available' | 'intermittent' | 'outage' | 'unknown';
export type TransportStatus = 'available' | 'limited' | 'difficult' | 'unavailable' | 'unknown';

export interface CommunityLocationStatus {
  locationId: string;
  lga: string;
  town: string;
  area?: string;
  roadCondition: RoadConditionStatus;
  floodRisk: FloodRiskStatus;
  traffic: TrafficStatus;
  power: PowerStatus;
  transport: TransportStatus;
  lastUpdated: string;
}

export const ROAD_CONDITION_LABELS: Record<RoadConditionStatus, string> = {
  good: 'Good',
  moderate: 'Moderate',
  bad: 'Bad',
  blocked: 'Blocked',
  under_construction: 'Under Construction',
  unknown: 'Unknown',
};

export const ROAD_CONDITION_COLORS: Record<RoadConditionStatus, string> = {
  good: '#22c55e',
  moderate: '#f59e0b',
  bad: '#ef4444',
  blocked: '#dc2626',
  under_construction: '#6366f1',
  unknown: '#9ca3af',
};

export const FLOOD_RISK_LABELS: Record<FloodRiskStatus, string> = {
  none: 'No Risk',
  low: 'Low Risk',
  moderate: 'Moderate Risk',
  high: 'High Risk',
  currently_flooded: 'Currently Flooded',
  unknown: 'Unknown',
};

export const FLOOD_RISK_COLORS: Record<FloodRiskStatus, string> = {
  none: '#22c55e',
  low: '#fbbf24',
  moderate: '#f59e0b',
  high: '#ea580c',
  currently_flooded: '#2563eb',
  unknown: '#9ca3af',
};

export const TRAFFIC_LABELS: Record<TrafficStatus, string> = {
  light: 'Light',
  moderate: 'Moderate',
  heavy: 'Heavy',
  severe: 'Severe',
  unknown: 'Unknown',
};

export const TRAFFIC_COLORS: Record<TrafficStatus, string> = {
  light: '#22c55e',
  moderate: '#f59e0b',
  heavy: '#ef4444',
  severe: '#dc2626',
  unknown: '#9ca3af',
};

export const POWER_LABELS: Record<PowerStatus, string> = {
  available: 'Available',
  intermittent: 'Intermittent',
  outage: 'Outage',
  unknown: 'Unknown',
};

export const POWER_COLORS: Record<PowerStatus, string> = {
  available: '#22c55e',
  intermittent: '#f59e0b',
  outage: '#ef4444',
  unknown: '#9ca3af',
};

export const TRANSPORT_LABELS: Record<TransportStatus, string> = {
  available: 'Available',
  limited: 'Limited',
  difficult: 'Difficult',
  unavailable: 'Unavailable',
  unknown: 'Unknown',
};

export const TRANSPORT_COLORS: Record<TransportStatus, string> = {
  available: '#22c55e',
  limited: '#f59e0b',
  difficult: '#ef4444',
  unavailable: '#dc2626',
  unknown: '#9ca3af',
};

export const COMMUNITY_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most-helpful', label: 'Most Helpful' },
  { value: 'trending', label: 'Trending' },
];